// Every array indicates the sections of the page.
// These arrays have nested arrays, the first item
// reprensenting the section title, and the second,
// the header's id (for href and IntersectionObserver)
// Pages with children cannot have sections,
// it would be impossible to represent those sections
// as well as child pages all in once in the UI.

window.docnav = {
	Overview: [
		"",
		["Analogy", "analogy"],
		["Supported Features", "features"],
		["Supported Containers", "containers"],
		["Supported Keys", "keys"],
		["Supported Values", "values"],
		["Backstory", "backstory"]
	],
	Containers: {
		_: "/containers",
		Object: [
			"/object",
			["Definition", "def"],
			["Syntax", "syntax"]
		],
		Array: [
			"/array",
			["title", "id"]
		],
		Map: [
			"/map",
			["title", "id"]
		],
		Doodad: [
			"/doodad",
			["title", "id"]
		],
	},
	Keys: {
		_: "/keys",
		Text: {
			_: "/keys/text",
			String: [
				"/keys/string",
				["title", "id"]
			],
			Char: [
				"/keys/char",
				["title", "id"]
			],
		},
		Boolean: [
			"/keys/bool"
		],
		Number: [
			"/keys/number",
			["Regular Number", "regular"],
			["Decimal Number", "decimal"],
			["Scientific Notation", "sci"],
			["Static Number", "static"]
		],
		Date: [
			"/keys/date",
			["Year / Unix", "year-unix"],
			["Week", "week"],
			["Month", "month"],
			["Time", "time"]
		],
		Keybind: [
			"/keys/keybind"
		],
		Color: {
			_: "/keys/color",
			SRGB_Color: [
				"/keys/srgb"
			],
			Linear_Color: [
				"/keys/linear",
				["8 Bit", "8bit"],
				["16 Bit", "16bit"]
			]
		},
		Enum: [
			"/keys/enum"
		]
	},
	Values: {
		_: "/values",
		Text: {
			_: "/text",
			Full_String: [
				"/fullstring",
				["Syntax", "syntax"],
				["Usage", "usage"]
			],
			String: [
				"/string",
				["Syntax", "syntax"],
				["Usage", "usage"]
			],
			Char: [
				"/char",
				["Syntax", "syntax"],
				["Usage", "usage"]
			],
		},
		Boolean: [
			"/bool"
		],
		Number: [
			"/number",
			["Regular Number", "regular"],
			["Decimal Number", "decimal"],
			["Scientific Notation", "sci"],
			["Static Number", "static"]
		],
		Date: [
			"/date",
			["Year / Unix", "year-unix"],
			["Week", "week"],
			["Month", "month"],
			["Time", "time"]
		],
		Keybind: [
			"/keybind"
		],
		Color: {
			_: "/color",
			SRGB_Color: [
				"/srgb"
			],
			Linear_Color: [
				"/linear",
				["8 Bit", "8bit"],
				["16 Bit", "16bit"]
			]
		},
		Enum: [
			"/enum"
		],
		Binary: [
			"/binary"
		],
		Special: [
			"/special"
		]
	},
	Other: {
		_: "/other",
		Comments: [
			"/comments",
			["Justification", "why"],
			["Syntax", "syntax"],
			["Usage", "usage"]
		],
		Escape_Sequences: [
			"/escape",
			["Justification", "why"],
			["Syntax", "syntax"],
			["Usage", "usage"]
		]
	}
}

window.docu = {
	// -------------------- INITIATION FUNCTION --------------------

	applyObservers: true,

	subNavs: {},

	observer: null,

	lenis: null,

	isScrollingToHash: false,

	visibleEntries: new Set(),

	failedLinkConversions: [],

	init: function (path) {
		const canvas = document.getElementById('noise-canvas');
		const body = document.body;
		const content = document.getElementById('content');

		const contentWrapper = document.createElement('div');
		contentWrapper.id = 'content-wrapper';

		content.parentNode.insertBefore(contentWrapper, content);
		contentWrapper.appendChild(content);

		docu.lenis = new Lenis({
			wrapper: contentWrapper,
			content: content,
			lerp: 0.1,
			wheelMultiplier: 0.75,
			touchMultiplier: 1.0,
			syncTouch: true,
			syncTouchLerp: 1,
			touchInertiaExponent: 1,
		});

		(function setupCustomTouchMomentum(lenis, target = window) {
			let touching = false;
			let velocity = 0;
			let lastY = 0;
			let lastTime = 0;
			let rafId = null;
			let trackerRafId = null; // <-- Tracks the active finger's state
			let virtualScroll = 0;

			const friction = 0.97;
			const stopThreshold = 0.005;
			const velocitySamples = [];
			const maxSamples = 5; // Kept slightly smaller for snappy response

			// A flag to check if touchmove updated our position in the current frame
			let movedThisFrame = false;

			// This loop runs continuously while the finger is holding down
			function trackFingerVelocity() {
				if (!touching) return;

				// If a frame passed and touchmove didn't fire, the finger is stationary
				if (!movedThisFrame) {
					velocitySamples.push(0); // Decay momentum dynamically
					if (velocitySamples.length > maxSamples) velocitySamples.shift();
				}

				movedThisFrame = false; // Reset for the next frame tick
				trackerRafId = requestAnimationFrame(trackFingerVelocity);
			}

			function onTouchStart(e) {
				if (e.target.closest('[data-lenis-prevent]')) return;
				touching = true;
				movedThisFrame = true;

				cancelAnimationFrame(rafId);
				cancelAnimationFrame(trackerRafId);

				velocity = 0;
				velocitySamples.length = 0;
				lastY = e.touches[0].clientY;
				lastTime = performance.now();

				// Start the stationary finger monitoring loop
				trackerRafId = requestAnimationFrame(trackFingerVelocity);
			}

			function onTouchMove(e) {
				if (!touching) return;
				const now = performance.now();
				const y = e.touches[0].clientY;
				const dt = Math.max(now - lastTime, 1);
				const v = (lastY - y) / dt;

				movedThisFrame = true; // Mark that we had real movement this frame
				velocitySamples.push(v);
				if (velocitySamples.length > maxSamples) velocitySamples.shift();

				lastY = y;
				lastTime = now;
			}

			function onTouchEnd() {
				if (!touching) return;
				touching = false;

				cancelAnimationFrame(trackerRafId); // Stop tracking the finger

				// Calculate average. If you held still, the array is full of 0s!
				velocity = velocitySamples.length
					? velocitySamples.reduce((a, b) => a + b, 0) / velocitySamples.length
					: 0;

				cancelAnimationFrame(rafId);
				lenis.scrollTo(lenis.animatedScroll, { immediate: true });

				virtualScroll = lenis.animatedScroll;
				lastFrameTime = 0;
				rafId = requestAnimationFrame(glide);
			}

			let lastFrameTime = 0;

			function glide(now = performance.now()) {
				const dt = lastFrameTime ? now - lastFrameTime : 16;
				lastFrameTime = now;

				if (Math.abs(velocity) < stopThreshold) {
					lastFrameTime = 0;
					return;
				}

				const limit = lenis.limit;
				const next = virtualScroll + velocity * dt;

				if (next <= 0 || next >= limit) {
					virtualScroll = Math.max(0, Math.min(limit, next));
					lenis.scrollTo(virtualScroll, { immediate: true });
					lastFrameTime = 0;
					return;
				}

				virtualScroll = next;
				lenis.scrollTo(virtualScroll, { immediate: true });

				velocity *= Math.pow(friction, dt / 16);
				rafId = requestAnimationFrame(glide);
			}

			target.addEventListener('touchstart', onTouchStart, { passive: true });
			target.addEventListener('touchmove', onTouchMove, { passive: true });
			target.addEventListener('touchend', onTouchEnd, { passive: true });
			target.addEventListener('touchcancel', onTouchEnd, { passive: true });
		})(docu.lenis, contentWrapper);



		fog.init([-0.05, -0.06, -0.05], [0.25, 0.32, 0.42], docu.lenis, 0.015, 1, 0.11, -1.2);



		// Scroll observer for selecting the right ones

		docu.observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) docu.visibleEntries.add(entry.target.id);
				else docu.visibleEntries.delete(entry.target.id);
			})
			if (!docu.isScrollingToHash) docu.renderSubNavs();
		}, { threshold: 0.0001 })

		if (path[0] === "Overview") document.title = "LXON Documentation";
		else document.title = "LXON Documentation | " + path[path.length - 1];



		// Scroll to hash

		let initialHash = location.hash ? location.hash.slice(1) : null;
		if (initialHash) {
			history.scrollRestoration = 'manual';
			window.scrollTo(0, 0);
		}

		function scrollToHash(id, updateHistory = true) {
			const el = document.getElementById(id);
			if (!el || !docu.lenis) return;
			if (updateHistory) history.pushState(null, '', '#' + id);
			docu.lenis.scrollTo(el, {
				onComplete: () => {
					docu.isScrollingToHash = false;
				}
			});
		}

		const interruptScroll = () => {
			docu.isScrollingToHash = false;
			docu.renderSubNavs();
		};

		window.addEventListener('wheel', interruptScroll, { passive: true });
		window.addEventListener('touchstart', interruptScroll, { passive: true });
		window.addEventListener('mousedown', interruptScroll, { passive: true });
		window.addEventListener('keydown', (e) => {
			// Arrow keys or spacebar also interrupt scrolling
			if (['ArrowUp', 'ArrowDown', ' ', 'PageUp', 'PageDown'].includes(e.key)) {
				interruptScroll();
			}
		}, { passive: true });

		document.addEventListener('click', (e) => {
			const link = e.target.closest('a');
			if (!link || !link.hash) return;

			const url = new URL(link.href, location.href);
			if (url.pathname !== location.pathname) return; // different page, let it navigate normally

			e.preventDefault();
			scrollToHash(url.hash.slice(1));
		});

		window.addEventListener('popstate', () => {
			if (location.hash) {
				docu.scrollToHash(location.hash.slice(1), false);
			}
		});


		// Create home button, tab button and mini nav
		const miniNav = document.createElement("div");
		miniNav.classList.add("site-mini-nav")

		const home = document.createElement("a");
		home.href = "/";
		home.classList.add("site-icon");
		home.classList.add("site-home");
		const homeImage = document.createElement("img");
		homeImage.alt = "Home";
		homeImage.src = "/ressources/home.png";
		home.append(homeImage);

		const tabButton = document.createElement("button");
		tabButton.classList.add("site-tab");
		const tabImage = document.createElement("img");
		tabImage.alt = "Tab";
		tabImage.src = "/ressources/ham.png";
		tabButton.append(tabImage);

		function tabButtonClick() {
			nav.classList.toggle("hidden");
			tabBackground.classList.toggle("show");
		}
		tabButton.addEventListener('click', tabButtonClick);

		const tabBackground = document.createElement("button");
		tabBackground.classList.add("tab-background");
		tabBackground.addEventListener('click', tabButtonClick);

		body.append(home);
		body.append(tabButton);
		body.append(miniNav);
		body.append(tabBackground);


		const depthColors = ["#ffff99", "#ff99ff", "#99ffff", "#ffff99", "#ff99ff", "#99ffff"]

		// Create titles
		const title = document.createElement("div");
		title.classList.add("title");
		title.textContent = path[path.length - 1];
		title.style.color = depthColors[path.length - 1];

		let i = 0;
		let obj = docnav;
		path.forEach(item => {
			obj = obj[path[i]];
			const t = document.createElement("a");
			t.classList.add("title-mini");
			if (i < path.length - 1) {
				if (Array.isArray(obj)) t.href = "/doc" + obj[0];
				else t.href = "/doc" + obj._;
			}
			t.style.color = depthColors[i];
			t.textContent = path[i];
			miniNav.append(t);
			i++;
			if (i < path.length) {
				const s = document.createElement("a");
				s.classList.add("title-mini-slash");
				s.textContent = "/";
				miniNav.append(s);
			}
		});
		content.prepend(title);


		// Create the nav
		const nav = document.createElement('div');
		nav.id = "nav";
		nav.classList.add("hidden");
		body.appendChild(nav);


		// Create the searchbar
		const searchInput = document.createElement('input');
		searchInput.id = 'search';
		searchInput.type = "text";
		searchInput.name = "search";
		searchInput.placeholder = "Search...";
		searchInput.autocomplete = "off";

		searchInput.addEventListener('focus', (event) => {
			event.target.select();
		});
		searchInput.addEventListener('input', () => {
			const query = event.target.value;
			docu.search(path, query);
		});

		nav.appendChild(searchInput);


		// Create the nav scroll
		const navScroll = document.createElement('nav');
		navScroll.id = 'nav-scroll';
		navScroll.setAttribute('data-lenis-prevent', '');
		nav.appendChild(navScroll);
		const navInner = document.createElement('div');
		navInner.id = 'nav-inner';
		navScroll.appendChild(navInner);



		// Lenis needs wrapper/content to already exist, hence the reorder
		const lenisNav = new Lenis({
			wrapper: navScroll,
			content: navInner,
			lerp: 0.1,
			wheelMultiplier: 0.5,
			touchMultiplier: 1.0,
			syncTouch: true,
			touchInertiaExponent: 1,
		});

		function raf(time) {
			lenisNav.raf(time);
			requestAnimationFrame(raf);
		}
		requestAnimationFrame(raf);

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				content.classList.add('loaded');
				docu.search(path, "");
				docu.applyObservers = false;
			});
		});

		window.addEventListener('pageshow', (event) => {
			docu.lenis.scrollTo(0, { immediate: true });

			requestAnimationFrame(() => {
				docu.search(path, "");
				docu.applyObservers = false;

				if (initialHash) {
					scrollToHash(initialHash, false);
				}
			});
		});



		// -------------------- Wrap content with divs --------------------

		function wrapH1Sections(container, path, { moveIdToDiv = true } = {}) {
			let inner = [];
			switch (path.length) {
				case 1:
					inner = docnav[path[0].replaceAll(" ", "_")];
					break;
				case 2:
					inner = docnav[path[0].replaceAll(" ", "_")][path[1].replaceAll(" ", "_")];
					break;
				case 3:
					inner = docnav[path[0].replaceAll(" ", "_")][path[1].replaceAll(" ", "_")][path[2].replaceAll(" ", "_")];
					break;
				case 4:
					inner = docnav[path[0].replaceAll(" ", "_")][path[1].replaceAll(" ", "_")][path[2].replaceAll(" ", "_")][path[3].replaceAll(" ", "_")];
					break;
			}

			let targets = new Set();

			try {
				inner.forEach(item => {
					if (Array.isArray(item)) {
						targets.add(item[1]);
					}
				})
			}
			catch {
				return;
			}

			const h1s = Array.from(container.children).filter(el => (el.tagName === 'H1' || el.tagName === 'H2') && targets.has(el.id));

			console.log(h1s);

			for (let i = 0; i < h1s.length; i++) {
				const currentH1 = h1s[i];
				const nextH1 = h1s[i + 1];

				if (i < h1s.length - 1) {
					const wrapper = document.createElement('div');
					if (nextH1) {
						wrapper.id = "div-" + currentH1.id;
						docu.observer.observe(wrapper);
					}

					const toMove = [];
					let node = currentH1.nextSibling;
					while (node && node !== nextH1) {
						toMove.push(node);
						node = node.nextSibling;
					}

					container.insertBefore(wrapper, nextH1);
					toMove.forEach(n => wrapper.appendChild(n));
				}

				const hWrapper = document.createElement("div");
				hWrapper.className = "h-wrapper";
				content.insertBefore(hWrapper, currentH1);
				hWrapper.appendChild(currentH1);
				hWrapper.id = currentH1.id;
    			currentH1.removeAttribute('id');

				docu.observer.observe(currentH1);
			}

			return container;
		}

		wrapH1Sections(document.getElementById('content'), path);



		// -------------------- Convert all !! into links --------------------

		let root = document.body;

		const pattern = /!!([^!]*)!([^!]*)!/g;

		const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
			acceptNode(node) {
				const parentTag = node.parentNode.nodeName;
				if (['SCRIPT', 'STYLE', 'TEXTAREA', 'A'].includes(parentTag)) {
					return NodeFilter.FILTER_REJECT;
				}
				pattern.lastIndex = 0;
				return pattern.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
			}
		});

		const textNodes = [];
		let n;
		while ((n = walker.nextNode())) textNodes.push(n);

		textNodes.forEach(textNode => {
			const text = textNode.nodeValue;
			const frag = document.createDocumentFragment();
			let lastIndex = 0, match;

			pattern.lastIndex = 0;
			while ((match = pattern.exec(text))) {
				const [full, link, label] = match;
				if (match.index > lastIndex) {
					frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
				}
				const a = document.createElement('a');
				let href = "";
				let obj = docnav;
				let i = 0;
				const linkTemp = link.split("/");
				linkTemp.forEach(key => {
					try {
						if (key.includes("#")) {
							const split = key.split("#");
							obj = obj[split[0].trim().replaceAll(" ", "_")]
							if (Array.isArray(obj)) href = obj[0] + "/#" + split[1].trim();
							else href = obj._ + "/#" + split[1].trim();
						}
						else {
							obj = obj[key.trim().replaceAll(" ", "_")];
							i++;
							if (Array.isArray(obj)) href = obj[0];
							else if (i >= linkTemp.length) href = obj._;
						}
					}
					catch {
						console.log("Unable to convert '" + link + "' to link.\nFailed at key: '" + key.trim() + "'");
						docu.failedLinkConversions.push("Failed to create link for '!!" + link + "!' - Failed at: '" + key.trim() + "'")
					}
				})
				a.href = "/doc" + href;
				a.textContent = label.trim();
				frag.appendChild(a);
				lastIndex = match.index + full.length;
			}
			if (lastIndex < text.length) {
				frag.appendChild(document.createTextNode(text.slice(lastIndex)));
			}
			textNode.parentNode.replaceChild(frag, textNode);
			if (docu.failedLinkConversions.length > 0) {
				content.style.opacity = 0.3;
				nav.style.opacity = 0.3;
				const errorWrapper = document.createElement("div");
				errorWrapper.className = "error-wrapper";
				docu.failedLinkConversions.forEach(error => {
					const errorMessage = document.createElement("div")
					errorMessage.textContent = error;
					errorMessage.className = "error-message";
					errorWrapper.append(errorMessage);
				})
				body.append(errorWrapper);
				throw Error("FAILED TO CONVERT DOUBLE EXCLAMATION POINTS TO LINKS");
			}
		});



		// -------------------- Convert all dfn to symbol buttons --------------------

		document.querySelectorAll('dfn').forEach(dfn => {
			const button = document.createElement('button');
			button.className = 'symbol';
			dfn.replaceWith(button);

			let useAnd = false;

			let text = dfn.textContent.split(" ");
			let len = text.length;
			if (text[0] === "") len = 0;
			else if (len === 1) {
				text = dfn.textContent.split("a");
				len = text.length;
				useAnd = true;
			}

			let divs = [];

			switch (len) {
				case 0:
					const div0 = document.createElement('div');
					div0.className = 'symbol-text';
					div0.innerHTML = "self-def.";
					divs.push(div0);
					break;
				case 1:
					const div = document.createElement('div');
					div.className = 'symbol';
					div.innerHTML = text;
					divs.push(div);
					break;
				case 2:
					const div1 = document.createElement('div');
					div1.className = 'symbol';
					div1.innerHTML = text[0];
					divs.push(div1);
					const div2 = document.createElement('div');
					div2.className = 'symbol-text';
					div2.innerHTML = useAnd ? "and" : "or";
					divs.push(div2);
					const div3 = document.createElement('div');
					div3.className = 'symbol';
					div3.innerHTML = text[1];
					divs.push(div3);
					break;
			}

			divs.forEach(div => { button.appendChild(div); });

			if (len !== 0) {
				const tooltip = document.createElement('div');
				tooltip.className = 'copy-tooltip';
				tooltip.textContent = 'Copied to Clipboard';
				button.appendChild(tooltip);

				let hideTimeout;

				button.addEventListener('click', () => {
					navigator.clipboard.writeText(text[0]).then(() => {
						document.querySelectorAll('.copy-tooltip').forEach(t => { t.classList.remove('visible'); });
						tooltip.classList.add('visible');

						clearTimeout(hideTimeout); // reset cooldown if retriggered
						hideTimeout = setTimeout(() => {
							tooltip.classList.remove('visible');
						}, 1600);
					});
				});
			}
		});
	},

	search: function (path, query) {
		const nav = document.getElementById("nav");
		const navInner = document.getElementById("nav-inner");
		const q = query.toLowerCase().split(" ");
		navInner.innerHTML = null;

		// Nav content
		docu.writeItem(1, path, query, q, docnav, navInner)
		docu.renderSubNavs();
	},


	writeItem: function (index, path, query, q, object, navInner) {
		function getPathKey(key) {
			const val = path[key];
			if (typeof val === "string") return path[key].replaceAll(" ", "_");
			else return undefined;
		}
		const keys = Object.keys(object);
		for (const key of keys) {
			if (key === "_") continue;
			const value = object[key];
			if (!docu.matchesQuery(value, query, q) && !docu.matches(key, q)) continue;
			let item = document.createElement('a');
			item.textContent = key.replaceAll("_", " ");
			item.className = 'nav' + index.toString();
			if (getPathKey(index - 1) === key) item.classList.add("selected");
			if (getPathKey(path.length - 1) === key) item.classList.add("open");
			if (Array.isArray(value)) {
				item.href = "/doc" + value[0];
				navInner.appendChild(item);
				if (getPathKey(path.length - 1) !== key && query === "") continue;
				for (let i = 1; i < value.length; i++) {
					if (!docu.matches(value[i][0], q)) continue;
					let sub = document.createElement('a');
					sub.textContent = value[i][0].replaceAll("_", " ");
					sub.className = 'nav-sub';
					sub.classList.add("depth" + index.toString())
					sub.href = "/doc" + value[0] + "/#" + value[i][1];
					sub.onclick = event => {
						const subs = docu.subNavs;
						const keys = Object.keys(subs);
						keys.forEach(key => {
							subs[key].classList.remove("inter");
						})
						event.currentTarget.classList.add("inter");
						docu.isScrollingToHash = true;
					}
					sub.id = "sub-nav-" + value[i][1];
					navInner.appendChild(sub);
					docu.subNavs[value[i][1]] = sub;
				}
			}
			// Go deeper
			else {
				item.href = "/doc" + value._;
				navInner.appendChild(item);
				if (getPathKey(0) !== key && query === "" && index === 1) continue;
				if (path.length > 1 && query === "" && index === 2) { if (getPathKey(1) !== key) continue; }
				docu.writeItem(index + 1, path, query, q, value, navInner);
			}
		}
	},


	matchesQuery: function (object, query, q) {
		if (Array.isArray(object)) {
			for (const item of object) {
				if (!Array.isArray(item)) continue;
				if (docu.matches(item[0], q)) return true;
			}
			return false;
		}
		else {
			const keys = Object.keys(object);
			for (const key of keys) {
				if (key === "_") continue;
				if (docu.matches(key, q)) return true;
				const value = object[key];
				if (typeof value === "object" && value !== null) {
					if (docu.matchesQuery(value, query, q)) return true;
				}
			}
			return false;
		}
	},


	matches: function (text, q) {
		const lowText = text.toLowerCase().replaceAll("/", "");
		const splitText = lowText.split(/[ _]+/);
		for (const queryElement of q) {
			if (queryElement.length < 3) {
				for (const t of splitText) {
					if (t.startsWith(q)) return true;
				}
				return false;
			}
			if (lowText.includes(queryElement)) return true;
		}
		return false;
	},


	renderSubNavs: function () {
		const keys = Object.keys(docu.subNavs);
		if (keys.length < 1) return;
		keys.forEach(key => {
			docu.subNavs[key].classList.remove("inter");
		})
		let wasSet = false;
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (docu.visibleEntries.has(key)) {
				docu.subNavs[key].classList.add("inter");
				i = 10000;
				wasSet = true;
			}
		}
		if (!wasSet) {
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				if (docu.visibleEntries.has("div-" + key)) {
					docu.subNavs[key].classList.add("inter");
					i = 10000;
					wasSet = true;
				}
			}
		}
		if (!wasSet) {
			docu.subNavs[keys[keys.length - 1]].classList.add("inter");
		}
	}
}
