import { o as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as Heart } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CNnJTbzA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getLikes = createServerFn({ method: "GET" }).handler(createSsrRpc("2467f38eae6b25d81eeeaef58fa53cc18210923920c4339f2ffd59d1198be09e"));
var changeLike = createServerFn({ method: "POST" }).validator((input) => {
	return { delta: input.delta === -1 ? -1 : 1 };
}).handler(createSsrRpc("fecae70ac315a7e9b789a4e2e02b3a376bf93e83015813d6f7079c0195f8d2cd"));
var LOGS = [
	{
		id: "census",
		band: "Survey",
		title: "Dark-sky census, sector 14",
		year: "2026",
		body: "A twelve-night map of sky brightness along the coastal fog line. Seeing held under 0.7 arcseconds for nine of the nights."
	},
	{
		id: "pulsar",
		band: "Timing",
		title: "Vela pulsar, folded light",
		year: "2024",
		body: "Millisecond timing against the station maser clock. The residual plot is public; the raw voltages stay with the instrument team."
	},
	{
		id: "bridge",
		band: "Imaging",
		title: "Magellanic bridge, deep field",
		year: "2022",
		body: "Four filters, one fixed pointing. The bridge stars resolve as a thin river once the moon is below the ridge."
	},
	{
		id: "continuum",
		band: "Radio",
		title: "Centaurus A continuum",
		year: "2019",
		body: "The first shared night with the valley array. Dust lanes cut the jet where optical plates go quiet."
	}
];
function VelaSite() {
	const skyRef = (0, import_react.useRef)(null);
	const railRef = (0, import_react.useRef)(null);
	const cursorRef = (0, import_react.useRef)(null);
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [band, setBand] = (0, import_react.useState)("All");
	const [open, setOpen] = (0, import_react.useState)("census");
	const [sent, setSent] = (0, import_react.useState)(false);
	const [clock, setClock] = (0, import_react.useState)("--:--:--");
	const [hot, setHot] = (0, import_react.useState)(false);
	const logs = (0, import_react.useMemo)(() => band === "All" ? LOGS : LOGS.filter((item) => item.band === band), [band]);
	(0, import_react.useEffect)(() => {
		const tick = () => {
			setClock((/* @__PURE__ */ new Date()).toISOString().slice(11, 19) + " UTC");
		};
		tick();
		const id = window.setInterval(tick, 1e3);
		return () => window.clearInterval(id);
	}, []);
	(0, import_react.useEffect)(() => {
		const onScroll = () => {
			setScrolled(window.scrollY > 12);
			const stage = railRef.current;
			if (!stage) return;
			const rect = stage.getBoundingClientRect();
			const total = stage.offsetHeight - window.innerHeight;
			const passed = Math.min(Math.max(-rect.top, 0), total);
			Math.max(stage.scrollWidth, 1);
			const track = stage.querySelector(".rail");
			if (!track || total <= 0) return;
			const distance = track.scrollWidth - window.innerWidth + 80;
			track.style.setProperty("--shift", String(-passed / total * distance));
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const canvas = skyRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const stars = Array.from({ length: 160 }, () => ({
			x: Math.random(),
			y: Math.random(),
			r: Math.random() * 1.4 + .2,
			p: Math.random() * Math.PI * 2
		}));
		let frame = 0;
		let raf = 0;
		const pointer = {
			x: .5,
			y: .4
		};
		const onMove = (event) => {
			pointer.x = event.clientX / window.innerWidth;
			pointer.y = event.clientY / window.innerHeight;
		};
		window.addEventListener("pointermove", onMove);
		const draw = (time) => {
			const { width, height } = canvas.getBoundingClientRect();
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
				canvas.width = Math.floor(width * dpr);
				canvas.height = Math.floor(height * dpr);
			}
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, width, height);
			const driftX = (pointer.x - .5) * 18;
			const driftY = (pointer.y - .5) * 12;
			for (const star of stars) {
				const tw = reduce ? .8 : .45 + Math.sin(time / 700 + star.p) * .45;
				ctx.globalAlpha = tw;
				ctx.fillStyle = "#e8e4d8";
				ctx.beginPath();
				ctx.arc(star.x * width + driftX, star.y * height + driftY, star.r, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.globalAlpha = 1;
			if (!reduce) raf = requestAnimationFrame(draw);
			frame += 1;
		};
		raf = requestAnimationFrame(draw);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("pointermove", onMove);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const node = cursorRef.current;
		if (!node || !window.matchMedia("(pointer: fine)").matches) return;
		let x = 0;
		let y = 0;
		let cx = 0;
		let cy = 0;
		let raf = 0;
		const move = (event) => {
			x = event.clientX;
			y = event.clientY;
			const target = event.target;
			setHot(Boolean(target?.closest("a, button, .card")));
		};
		const loop = () => {
			cx += (x - cx) * .22;
			cy += (y - cy) * .22;
			node.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
			raf = requestAnimationFrame(loop);
		};
		window.addEventListener("pointermove", move);
		raf = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("pointermove", move);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "site has-cursor",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: cursorRef,
				className: hot ? "cursor hot" : "cursor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: scrolled ? "nav scrolled" : "nav",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "mark",
						href: "#top",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mark-ring" }), "Vela"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "nav-links",
						"aria-label": "Primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#programs",
								children: "Programs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#archive",
								children: "Archive"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#visit",
								children: "Visit"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "btn btn-copper",
						href: "#visit",
						children: "Request a night"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "top",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "hero",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
							ref: skyRef,
							className: "sky",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hero-copy stagger",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "kicker",
									children: "Atacama · 24°37′ S"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "display",
									children: ["Night, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "held still." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "lede",
									children: "A private observatory above the fog line. Resident astronomers, visiting instrument teams, and a dome that tracks without a sound."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hero-actions",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											className: "btn btn-copper",
											href: "#programs",
											children: "See the programs"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											className: "btn btn-ghost",
											href: "#archive",
											children: "Open the archive"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LikeButton, {})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hud",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Station clock" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: clock })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Seeing" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "0.62″" })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Wind" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "3.1 m/s" })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Moon" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Below ridge" })] })
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "marquee-wrap",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "marquee",
							children: Array.from({ length: 2 }).map((_, copy) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Carina · Vela · Crux · Centaurus · Magellanic bridge · Dark lane 14 · Puppis · Carina · Vela · Crux · Centaurus · Magellanic bridge · Dark lane 14 · Puppis ·" }, copy))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "section",
						id: "programs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "section-head",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "kicker",
									children: "Programs"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Time on the mountain, not a tour." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "quiet",
									children: "Three ways a night is granted. Scroll keeps the plates moving as one instrument, not a carousel widget."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rail-stage",
							ref: railRef,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rail-sticky",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rail",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
											className: "card",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "01 · Resident" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "A season, one pointing." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Long programs that need the same field every clear night. You keep the cadence. We keep the clock." })
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Twelve to forty nights." })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
											className: "card",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "02 · Instrument" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Bring the glass." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Visiting cameras and spectrographs bolt to the Nasmyth port. The dome slave follows your pointing file." })
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Shared engineering night included." })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
											className: "card",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "03 · Public dome" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "One hour, no lecture." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Eight guests, the 0.6-meter, and whatever is highest and clean. Silence is part of the booking." })
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Fridays, moon below twenty degrees." })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
											className: "card",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "04 · Archive desk" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Plates, already reduced." }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Calibrated frames from closed programs. Request a cutout instead of a new night when the sky already answered." })
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Delivered as FITS, next morning." })]
										})
									]
								})
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "section dome-grid",
						id: "dome",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dome, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "kicker",
								children: "The dome"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "It follows your hand." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "quiet",
								children: "Move across this panel. Azimuth and elevation are written from the pointer, the same way the real slave loop reads a mount. On a phone, drag inside the circle."
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "section",
						id: "archive",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "section-head",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "kicker",
									children: "Archive"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Closed nights, still readable." })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "filters",
								role: "tablist",
								"aria-label": "Filter archive",
								children: [
									"All",
									"Survey",
									"Timing",
									"Imaging",
									"Radio"
								].map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: band === name ? "chip on" : "chip",
									onClick: () => setBand(name),
									role: "tab",
									"aria-selected": band === name,
									children: name
								}, name))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "log",
								children: logs.map((item) => {
									const isOpen = open === item.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: isOpen ? "open" : void 0,
										onClick: () => setOpen(isOpen ? null : item.id),
										"aria-expanded": isOpen,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
												item.year,
												" · ",
												item.title
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.band }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "detail",
												children: item.body
											})
										]
									}, item.id);
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "section visit",
						id: "visit",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "kicker",
								children: "Visit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Ask for a clear night." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "quiet",
								children: "This desk confirms interest only. A human writes back with the next moon window. Nothing is stored on a server."
							})
						] }), sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "note",
							children: "Request held on this page. In a real booking it would go to the night director."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "sheet",
							onSubmit: (event) => {
								event.preventDefault();
								setSent(true);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									name: "name",
									required: true,
									autoComplete: "name"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									name: "email",
									type: "email",
									required: true,
									autoComplete: "email"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Night type", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									name: "type",
									defaultValue: "Public dome",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Public dome" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Resident season" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Instrument time" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Archive cutout" })
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Note", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									name: "note",
									placeholder: "Target, dates, or the instrument you are bringing."
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-copper",
									type: "submit",
									children: "Hold this request"
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "footer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Vela Observatory · Valle del Quietud" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dome closed at civil dawn" })]
			})
		]
	});
}
function LikeButton() {
	const [count, setCount] = (0, import_react.useState)(0);
	const [liked, setLiked] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setLiked(window.localStorage.getItem("vela-liked") === "1");
		getLikes().then((row) => setCount(row.count)).catch(() => setCount(0));
	}, []);
	const toggle = async () => {
		if (busy) return;
		const next = !liked;
		setBusy(true);
		setLiked(next);
		setCount((value) => Math.max(0, value + (next ? 1 : -1)));
		try {
			const row = await changeLike({ data: { delta: next ? 1 : -1 } });
			setCount(row.count);
			window.localStorage.setItem("vela-liked", next ? "1" : "0");
		} catch {
			setLiked(!next);
			setCount((value) => Math.max(0, value + (next ? -1 : 1)));
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: liked ? "like on" : "like",
		onClick: toggle,
		"aria-pressed": liked,
		disabled: busy,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { fill: liked ? "currentColor" : "none" }),
			liked ? "Liked" : "Like",
			" · ",
			count
		]
	});
}
function Dome() {
	const ref = (0, import_react.useRef)(null);
	const [az, setAz] = (0, import_react.useState)(128);
	const [el, setEl] = (0, import_react.useState)(46);
	const read = (clientX, clientY) => {
		const node = ref.current;
		if (!node) return;
		const rect = node.getBoundingClientRect();
		const x = (clientX - rect.left) / rect.width - .5;
		const y = (clientY - rect.top) / rect.height - .5;
		setAz(Math.round((x + .5) * 360));
		setEl(Math.round(Math.max(8, 80 - Math.hypot(x, y) * 120)));
	};
	const starX = 50 + Math.cos(az * Math.PI / 180) * (40 - el / 4);
	const starY = 50 + Math.sin(az * Math.PI / 180) * (40 - el / 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "dome",
		ref,
		onPointerMove: (event) => read(event.clientX, event.clientY),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 100 100",
			"aria-label": `Dome pointing azimuth ${az} degrees, elevation ${el} degrees`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "50",
					cy: "50",
					r: "46",
					fill: "none",
					stroke: "#2a2c36",
					strokeWidth: "0.4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "50",
					cy: "50",
					r: "30",
					fill: "none",
					stroke: "#2a2c36",
					strokeWidth: "0.3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "50",
					cy: "50",
					r: "14",
					fill: "none",
					stroke: "#2a2c36",
					strokeWidth: "0.3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "50",
					y1: "4",
					x2: "50",
					y2: "96",
					stroke: "#2a2c36",
					strokeWidth: "0.3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "4",
					y1: "50",
					x2: "96",
					y2: "50",
					stroke: "#2a2c36",
					strokeWidth: "0.3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: starX,
					cy: starY,
					r: "1.6",
					fill: "#d4783a"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
					x: "50",
					y: "92",
					textAnchor: "middle",
					fill: "#8d8a80",
					fontSize: "4",
					fontFamily: "Outfit, sans-serif",
					children: [
						"AZ ",
						az,
						"° · EL ",
						el,
						"°"
					]
				})
			]
		})
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VelaSite, {});
}
//#endregion
export { Home as component };
