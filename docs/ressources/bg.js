window.bg = {
    init: function (color) {
        document.documentElement.style.background = `rgb(${color[0] * 100}, ${color[1] * 100}, ${color[2] * 100})`;
        window.scrollTo(0, 0);
        if (history.scrollRestoration) {
            history.scrollRestoration = 'manual';
        }

        const canvas = document.getElementById('noise-canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) {
            console.warn('WebGL unavailable — background falls back to flat color.');
            return;
        }

        // ---- tweakables -----------------------------------------------------
        const NOISE_SCALE = 2;
        const TIME_SPEED = 0.08;
        const PARALLAX_FACTOR = -0.5;
        const GRAIN_AMOUNT = 0.02;
        const GRAIN_SIZE = 1.0;
        const FALL_SPEED = -1;
        // Lenis's own smoothing amount (0-1). Lower = more glide/lag, higher =
        // snappier. 0.1 is Lenis's own default and feels good; this replaces the
        // old hand-rolled SCROLL_SMOOTHNESS lerp entirely - don't stack both or
        // you'll double up the lag.
        const LENIS_LERP = 0.1;
        const COLOR_DARK = [0.0, 0.0, 0.0];
        const COLOR_LIGHT = color;
        // -----------------------------------------------------------------------

        // Lenis smooth-scrolls the real window. No wrapper div, no transform,
        // no manual body-height hack - it just takes over native scroll.
        const lenis = new Lenis({
            lerp: LENIS_LERP,
            wheelMultiplier: 0.5,
            touchMultiplier: 1.0,
            syncTouch: true,
            touchInertiaExponent: 10000,
        });

        const navBox = document.getElementById('nav-box');
        lenis.on('scroll', (e) => {
            if (e.direction === 1 && lenis.scroll > window.innerHeight / 4) {
                navBox.classList.add('nav-hidden');   // scrolling down
            } else if (e.direction === -1) {
                navBox.classList.remove('nav-hidden'); // scrolling up
            }
        });

        const vertexSrc = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

        const fragmentSrc = `
    precision highp float;

    uniform float u_time;
    uniform float u_scrollY;
	uniform float u_grainScrollY;
    uniform float u_scale;
    uniform vec3  u_colorDark;
    uniform vec3  u_colorLight;
    uniform float u_grainAmount;
    uniform float u_grainSize;

    vec3 hash3(vec3 p) {
      p = vec3(
        dot(p, vec3(127.1, 311.7, 74.7)),
        dot(p, vec3(269.5, 183.3, 246.1)),
        dot(p, vec3(113.5, 271.9, 124.6))
      );
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }

    float perlin3(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0); 

      float n000 = dot(hash3(i + vec3(0.0,0.0,0.0)), f - vec3(0.0,0.0,0.0));
      float n100 = dot(hash3(i + vec3(1.0,0.0,0.0)), f - vec3(1.0,0.0,0.0));
      float n010 = dot(hash3(i + vec3(0.0,1.0,0.0)), f - vec3(0.0,1.0,0.0));
      float n110 = dot(hash3(i + vec3(1.0,1.0,0.0)), f - vec3(1.0,1.0,0.0));
      float n001 = dot(hash3(i + vec3(0.0,0.0,1.0)), f - vec3(0.0,0.0,1.0));
      float n101 = dot(hash3(i + vec3(1.0,0.0,1.0)), f - vec3(1.0,0.0,1.0));
      float n011 = dot(hash3(i + vec3(0.0,1.0,1.0)), f - vec3(0.0,1.0,1.0));
      float n111 = dot(hash3(i + vec3(1.0,1.0,1.0)), f - vec3(1.0,1.0,1.0));

      float nx00 = mix(n000, n100, u.x);
      float nx10 = mix(n010, n110, u.x);
      float nx01 = mix(n001, n101, u.x);
      float nx11 = mix(n011, n111, u.x);

      float nxy0 = mix(nx00, nx10, u.y);
      float nxy1 = mix(nx01, nx11, u.y);

      return mix(nxy0, nxy1, u.z);
    }

    float fbm(vec3 p) {
      float value = 0.0;
      float amp = 0.5;
      for (int i = 0; i < 5; i++) {
        value += amp * perlin3(p);
        p *= 2.0;
        amp *= 0.5;
      }
      return value;
    }

    float random(vec2 p) {
      vec3 p3  = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    void main() {
      	vec2 fragCoord = gl_FragCoord.xy;
      	float sampledY = fragCoord.y + u_scrollY;

      	vec3 p = vec3(fragCoord.x * u_scale, sampledY * u_scale, u_time);
      	float n = fbm(p) * 0.5 + 0.5;

      	vec3 color = mix(u_colorDark, u_colorLight, clamp(n, 0.0, 1.0));

      	vec2 grainCoord = floor(vec2(fragCoord.x, fragCoord.y + u_grainScrollY) / u_grainSize);
		float pixelNoise = random(grainCoord);
		color -= pixelNoise * u_grainAmount;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

        function compile(type, src) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        document.addEventListener('dragstart', (e) => e.preventDefault());

        const vShader = compile(gl.VERTEX_SHADER, vertexSrc);
        const fShader = compile(gl.FRAGMENT_SHADER, fragmentSrc);

        const program = gl.createProgram();
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            return;
        }
        gl.useProgram(program);

        const positions = new Float32Array([
            -1, -1,
            3, -1,
            -1, 3
        ]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        const loc = {
            time: gl.getUniformLocation(program, 'u_time'),
            scrollY: gl.getUniformLocation(program, 'u_scrollY'),
            grainScrollY: gl.getUniformLocation(program, 'u_grainScrollY'),
            scale: gl.getUniformLocation(program, 'u_scale'),
            colorDark: gl.getUniformLocation(program, 'u_colorDark'),
            colorLight: gl.getUniformLocation(program, 'u_colorLight'),
            grainAmount: gl.getUniformLocation(program, 'u_grainAmount'),
            grainSize: gl.getUniformLocation(program, 'u_grainSize'),
        };

        gl.uniform3f(loc.colorDark, COLOR_DARK[0], COLOR_DARK[1], COLOR_DARK[2]);
        gl.uniform3f(loc.colorLight, COLOR_LIGHT[0], COLOR_LIGHT[1], COLOR_LIGHT[2]);
        gl.uniform1f(loc.grainAmount, GRAIN_AMOUNT);
        gl.uniform1f(loc.grainSize, GRAIN_SIZE);

        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let winWidth = 0;
        let winHeight = 0;

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            gl.viewport(0, 0, canvas.width, canvas.height);

            const diagonal = Math.hypot(window.innerWidth, window.innerHeight);
            winWidth = window.innerWidth;
            winHeight = window.innerHeight;
            gl.uniform1f(loc.scale, NOISE_SCALE / Math.max(winWidth, winHeight));
        }

        window.addEventListener('resize', resize);
        resize();


        const scrollContainer = document.getElementById('scroll-container');

        // wait two frames so the browser commits the initial hidden state
        // before we flip the class — otherwise the transition can get skipped
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                scrollContainer.classList.add('loaded');
                navBox.classList.remove('nav-hidden');
            });
        });

        const startTime = performance.now();

        let noiseScroll = 0;

        let lastTime = 0;

        function render(now) {
            const deltaTime = (now - lastTime) / 1000;
            lastTime = now;
            lenis.raf(now);

            const elapsed = (now - startTime) / 1000;


            // layered on top of it here.
            const scrollY = lenis.scroll;
            gl.uniform1f(loc.time, elapsed * TIME_SPEED);
            noiseScroll += deltaTime * FALL_SPEED * Math.sqrt(winWidth);
            gl.uniform1f(loc.scrollY, scrollY * dpr * PARALLAX_FACTOR + noiseScroll);
            console.log(winWidth);
            gl.uniform1f(loc.grainScrollY, scrollY * dpr * PARALLAX_FACTOR);

            gl.drawArrays(gl.TRIANGLES, 0, 3);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }
}