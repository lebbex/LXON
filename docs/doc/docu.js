
window.docu = {

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
		});

		function docuRaf(time) {
			docu.lenis.raf(time);
			requestAnimationFrame(docuRaf);
		}
		requestAnimationFrame(docuRaf);


		fog.init([-0.05, -0.06, -0.05], [0.25, 0.32, 0.42], docu.lenis, contentWrapper, 0.015, 1, 0.11, -1.2);



		// Scroll observer for selecting the right ones

		docu.observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) docu.visibleEntries.add(entry.target.id);
				else docu.visibleEntries.delete(entry.target.id);
			})
			if (!docu.isScrollingToHash) docu.renderSubNavs();
		}, { threshold: 0.0001 })

		if (path[0] === "Overview") document.title = "LXON Documentation";
		else {
			let obj = navTree;
			for (let i = 0; i < path.length; i++) {
				obj = obj[path[i].replaceAll(" ", "_")];
			}
			let append = "THIS IS A BUG";
			if (Array.isArray(obj)) append = obj[1];
			else append = obj.__;
			if (path.length > 1) document.title = "LXON // " + append;
			else document.title = "LXON Documentation // " + append;
		}



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
		}
		tabButton.addEventListener('click', tabButtonClick);

		body.append(home);
		body.append(tabButton);
		body.append(miniNav);

		contentWrapper.addEventListener('click', () => {
            if (!nav.classList.contains("hidden")) {
                tabButtonClick();
            }
        });

        contentWrapper.addEventListener('touchmove', () => {
            if (!nav.classList.contains("hidden")) {
                tabButtonClick();
            }
        }, { passive: true });


		const depthColors = ["#ffff99", "#ff99ff", "#99ffff", "#ffff99", "#ff99ff", "#99ffff"]

		// Create titles
		const title = document.createElement("div");
		title.classList.add("title");
		title.textContent = path[path.length - 1];
		title.style.color = depthColors[path.length - 1];

		let i = 0;
		let obj = navTree;
		const miniNavTitle = document.createElement("div");
		miniNavTitle.classList.add("nav-title");
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
			miniNavTitle.append(t);
			i++;
			if (i < path.length) {
				const s = document.createElement("a");
				s.classList.add("title-mini-slash");
				s.textContent = "/";
				miniNavTitle.append(s);
			}
		});
		miniNav.append(miniNavTitle);
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

		// Blur the searchbar on any page interaction that isn't targeting it directly
		function blurSearchOnInteraction(e) {
			if (e.target === searchInput) return;
			if (document.activeElement === searchInput) searchInput.blur();
		}

		document.addEventListener('pointerdown', blurSearchOnInteraction, { passive: true, capture: true });
		document.addEventListener('touchstart', blurSearchOnInteraction, { passive: true, capture: true });


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
			syncTouch: false,
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
					inner = navTree[path[0].replaceAll(" ", "_")];
					break;
				case 2:
					inner = navTree[path[0].replaceAll(" ", "_")][path[1].replaceAll(" ", "_")];
					break;
				case 3:
					inner = navTree[path[0].replaceAll(" ", "_")][path[1].replaceAll(" ", "_")][path[2].replaceAll(" ", "_")];
					break;
				case 4:
					inner = navTree[path[0].replaceAll(" ", "_")][path[1].replaceAll(" ", "_")][path[2].replaceAll(" ", "_")][path[3].replaceAll(" ", "_")];
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
				currentH1.id = "h-" + hWrapper.id;

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
				let i = 0;
				const finalLink = linkReg.get(link);
				if (Array.isArray(finalLink)) {
					docu.failedLinkConversions.push("Failed to create link for '!!" + link + "!' - Failed at key: '" + finalLink[0] + "'")
					a.href = "/doc";
				}
				else a.href = "/doc" + finalLink;
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
				tooltip.textContent = 'Copied to clipboard.';
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
		docu.writeItem(1, path, query, q, navTree, navInner)
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
			if (key === "__") continue;
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
				for (let i = 2; i < value.length; i++) {
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
			if (docu.visibleEntries.has("h-" + key)) {
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
