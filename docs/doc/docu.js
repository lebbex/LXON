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
		["Outline", "outline"],
		["Goals", "goals"],
		["Backstory", "backstory"],
		["Supported Types", "types"]
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
				"/fullstring"
			],
			String: [
				"/string"
			],
			Char: [
				"/char"
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

	init: function (path) {
		const canvas = document.getElementById('noise-canvas');
		const body = document.body;
		const content = document.getElementById('content');

		docu.lenis = new Lenis({
			lerp: 0.1,
			wheelMultiplier: 0.75,
			touchMultiplier: 1.0,
			syncTouch: true,
			touchInertiaExponent: 10000,
		});

		fog.init([-0.05, -0.06, -0.05], [0.25, 0.32, 0.42], docu.lenis, 0.015, 1);



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


		// Create home button
		const home = document.createElement("a");
		home.href = "/";
		home.classList.add("site-icon");
		home.classList.add("site-home");

		const homeImage = document.createElement("img");
		homeImage.alt = "Home";
		homeImage.src = "/ressources/home.png";

		home.append(homeImage);
		body.append(home);


		// Create content header
		const title = document.createElement("div");
		title.classList.add("title");
		title.textContent = path[path.length - 1];

		content.prepend(title);


		// Create the nav
		const nav = document.createElement('div');
		nav.id = "nav";
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
			touchInertiaExponent: 10000,
		});

		function raf(time) {
			lenisNav.raf(time);
			requestAnimationFrame(raf);
		}
		requestAnimationFrame(raf);

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				content.classList.add('loaded');
				nav.classList.remove('hidden');
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



		// -------------------- Wrap content with div --------------------

		function wrapH1Sections(container, { moveIdToDiv = true } = {}) {
			const h1s = Array.from(container.children).filter(el => el.tagName === 'H1' || el.tagName === 'H2');

			for (let i = 0; i < h1s.length - 1; i++) {
				const currentH1 = h1s[i];
				const nextH1 = h1s[i + 1];

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

			return container;
		}

		wrapH1Sections(document.getElementById('content'));



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
					console.log(key);
					if (key.includes("#")) {
						const split = key.split("#");
						obj = obj[split[0].trim()]
						if (Array.isArray(obj)) href = obj[0] + "/#" + split[1].trim();
						else href = obj._ + "/#" + split[1].trim();
					}
					else {
						obj = obj[key.trim()];
						i++;
						if (Array.isArray(obj)) href = obj[0];
						else if (i >= linkTemp.length) href = obj._;
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
		const keys = Object.keys(object);
		for (const key of keys) {
			if (key === "_") continue;
			const value = object[key];
			if (!docu.matchesQuery(value, query, q) && !docu.matches(key, q)) continue;
			let item = document.createElement('a');
			item.textContent = key.replaceAll("_", " ");
			item.className = 'nav' + index.toString();
			if (path[index - 1] === key) item.classList.add("selected");
			if (path[path.length - 1] === key) item.classList.add("open");
			if (Array.isArray(value)) {
				item.href = "/doc" + value[0];
				navInner.appendChild(item);
				if (path[path.length - 1] !== key && query === "") continue;
				for (let i = 1; i < value.length; i++) {
					if (!docu.matches(value[i][0], q)) continue;
					let sub = document.createElement('a');
					sub.textContent = value[i][0].replaceAll("_", " ");
					sub.className = 'nav' + (index + 1).toString();
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
					if (document.getElementById(value[i][1])) {
						docu.observer.observe(document.getElementById(value[i][1]));
					}
				}
			}
			// Go deeper
			else {
				item.href = "/doc" + value._;
				navInner.appendChild(item);
				if (path[0] !== key && query === "" && index === 1) continue;
				if (path.length > 1 && query === "" && index === 2) { if (path[1] !== key) continue; }
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
