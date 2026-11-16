import { useEffect, useMemo, useRef, useState } from "react";
import { Heart } from "lucide-react";
import { changeLike, getLikes } from "@/lib/likes";

const LOGS = [
  {
    id: "census",
    band: "Survey",
    title: "Dark-sky census, sector 14",
    year: "2026",
    body: "A twelve-night map of sky brightness along the coastal fog line. Seeing held under 0.7 arcseconds for nine of the nights.",
  },
  {
    id: "pulsar",
    band: "Timing",
    title: "Vela pulsar, folded light",
    year: "2024",
    body: "Millisecond timing against the station maser clock. The residual plot is public; the raw voltages stay with the instrument team.",
  },
  {
    id: "bridge",
    band: "Imaging",
    title: "Magellanic bridge, deep field",
    year: "2022",
    body: "Four filters, one fixed pointing. The bridge stars resolve as a thin river once the moon is below the ridge.",
  },
  {
    id: "continuum",
    band: "Radio",
    title: "Centaurus A continuum",
    year: "2019",
    body: "The first shared night with the valley array. Dust lanes cut the jet where optical plates go quiet.",
  },
] as const;

type Band = "All" | (typeof LOGS)[number]["band"];

export function VelaSite() {
  const skyRef = useRef<HTMLCanvasElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [band, setBand] = useState<Band>("All");
  const [open, setOpen] = useState<string | null>("census");
  const [sent, setSent] = useState(false);
  const [clock, setClock] = useState("--:--:--");
  const [hot, setHot] = useState(false);

  const logs = useMemo(
    () => (band === "All" ? LOGS : LOGS.filter((item) => item.band === band)),
    [band],
  );

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toISOString().slice(11, 19) + " UTC");
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const stage = railRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const total = stage.offsetHeight - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), total);
      const maxShift = Math.max(stage.scrollWidth, 1);
      const track = stage.querySelector<HTMLElement>(".rail");
      if (!track || total <= 0) return;
      const distance = track.scrollWidth - window.innerWidth + 80;
      track.style.setProperty("--shift", String((-passed / total) * distance));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = skyRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.2,
      p: Math.random() * Math.PI * 2,
    }));
    let frame = 0;
    let raf = 0;
    const pointer = { x: 0.5, y: 0.4 };
    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth;
      pointer.y = event.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove);

    const draw = (time: number) => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const driftX = (pointer.x - 0.5) * 18;
      const driftY = (pointer.y - 0.5) * 12;
      for (const star of stars) {
        const tw = reduce ? 0.8 : 0.45 + Math.sin(time / 700 + star.p) * 0.45;
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
      void frame;
    };
  }, []);

  useEffect(() => {
    const node = cursorRef.current;
    if (!node || !window.matchMedia("(pointer: fine)").matches) return;
    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      const target = event.target as HTMLElement | null;
      setHot(Boolean(target?.closest("a, button, .card")));
    };
    const loop = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
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

  return (
    <div className="site has-cursor">
      <div ref={cursorRef} className={hot ? "cursor hot" : "cursor"} />
      <header className={scrolled ? "nav scrolled" : "nav"}>
        <a className="mark" href="#top">
          <span className="mark-ring" />
          Vela
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#programs">Programs</a>
          <a href="#archive">Archive</a>
          <a href="#visit">Visit</a>
        </nav>
        <a className="btn btn-copper" href="#visit">
          Request a night
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <canvas ref={skyRef} className="sky" aria-hidden="true" />
          <div className="hero-copy stagger">
            <p className="kicker">Atacama · 24°37′ S</p>
            <h1 className="display">
              Night, <em>held still.</em>
            </h1>
            <p className="lede">
              A private observatory above the fog line. Resident astronomers, visiting instrument teams, and a dome that tracks without a sound.
            </p>
            <div className="hero-actions">
              <a className="btn btn-copper" href="#programs">See the programs</a>
              <a className="btn btn-ghost" href="#archive">Open the archive</a>
              <LikeButton />
            </div>
            <div className="hud">
              <article>
                <span>Station clock</span>
                <strong>{clock}</strong>
              </article>
              <article>
                <span>Seeing</span>
                <strong>0.62″</strong>
              </article>
              <article>
                <span>Wind</span>
                <strong>3.1 m/s</strong>
              </article>
              <article>
                <span>Moon</span>
                <strong>Below ridge</strong>
              </article>
            </div>
          </div>
        </section>

        <div className="marquee-wrap" aria-hidden="true">
          <div className="marquee">
            {Array.from({ length: 2 }).map((_, copy) => (
              <span key={copy}>
                Carina · Vela · Crux · Centaurus · Magellanic bridge · Dark lane 14 · Puppis · Carina · Vela · Crux · Centaurus · Magellanic bridge · Dark lane 14 · Puppis ·
              </span>
            ))}
          </div>
        </div>

        <section className="section" id="programs">
          <div className="section-head">
            <p className="kicker">Programs</p>
            <h2>Time on the mountain, not a tour.</h2>
            <p className="quiet">Three ways a night is granted. Scroll keeps the plates moving as one instrument, not a carousel widget.</p>
          </div>
          <div className="rail-stage" ref={railRef}>
            <div className="rail-sticky">
              <div className="rail">
                <article className="card">
                  <div>
                    <small>01 · Resident</small>
                    <h3>A season, one pointing.</h3>
                    <p>Long programs that need the same field every clear night. You keep the cadence. We keep the clock.</p>
                  </div>
                  <p>Twelve to forty nights.</p>
                </article>
                <article className="card">
                  <div>
                    <small>02 · Instrument</small>
                    <h3>Bring the glass.</h3>
                    <p>Visiting cameras and spectrographs bolt to the Nasmyth port. The dome slave follows your pointing file.</p>
                  </div>
                  <p>Shared engineering night included.</p>
                </article>
                <article className="card">
                  <div>
                    <small>03 · Public dome</small>
                    <h3>One hour, no lecture.</h3>
                    <p>Eight guests, the 0.6-meter, and whatever is highest and clean. Silence is part of the booking.</p>
                  </div>
                  <p>Fridays, moon below twenty degrees.</p>
                </article>
                <article className="card">
                  <div>
                    <small>04 · Archive desk</small>
                    <h3>Plates, already reduced.</h3>
                    <p>Calibrated frames from closed programs. Request a cutout instead of a new night when the sky already answered.</p>
                  </div>
                  <p>Delivered as FITS, next morning.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="section dome-grid" id="dome">
          <Dome />
          <div>
            <p className="kicker">The dome</p>
            <h2>It follows your hand.</h2>
            <p className="quiet">
              Move across this panel. Azimuth and elevation are written from the pointer, the same way the real slave loop reads a mount. On a phone, drag inside the circle.
            </p>
          </div>
        </section>

        <section className="section" id="archive">
          <div className="section-head">
            <p className="kicker">Archive</p>
            <h2>Closed nights, still readable.</h2>
          </div>
          <div className="filters" role="tablist" aria-label="Filter archive">
            {(["All", "Survey", "Timing", "Imaging", "Radio"] as const).map((name) => (
              <button
                key={name}
                className={band === name ? "chip on" : "chip"}
                onClick={() => setBand(name)}
                role="tab"
                aria-selected={band === name}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="log">
            {logs.map((item) => {
              const isOpen = open === item.id;
              return (
                <button
                  key={item.id}
                  className={isOpen ? "open" : undefined}
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                >
                  <strong>
                    {item.year} · {item.title}
                  </strong>
                  <span>{item.band}</span>
                  <span className="detail">{item.body}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="section visit" id="visit">
          <div>
            <p className="kicker">Visit</p>
            <h2>Ask for a clear night.</h2>
            <p className="quiet">This desk confirms interest only. A human writes back with the next moon window. Nothing is stored on a server.</p>
          </div>
          {sent ? (
            <p className="note">Request held on this page. In a real booking it would go to the night director.</p>
          ) : (
            <form
              className="sheet"
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
            >
              <label>
                Name
                <input name="name" required autoComplete="name" />
              </label>
              <label>
                Email
                <input name="email" type="email" required autoComplete="email" />
              </label>
              <label>
                Night type
                <select name="type" defaultValue="Public dome">
                  <option>Public dome</option>
                  <option>Resident season</option>
                  <option>Instrument time</option>
                  <option>Archive cutout</option>
                </select>
              </label>
              <label>
                Note
                <textarea name="note" placeholder="Target, dates, or the instrument you are bringing." />
              </label>
              <button className="btn btn-copper" type="submit">
                Hold this request
              </button>
            </form>
          )}
        </section>
      </main>
      <footer className="footer">
        <span>Vela Observatory · Valle del Quietud</span>
        <span>Dome closed at civil dawn</span>
      </footer>
    </div>
  );
}

function LikeButton() {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLiked(window.localStorage.getItem("vela-liked") === "1");
    getLikes()
      .then((row) => setCount(row.count))
      .catch(() => setCount(0));
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

  return (
    <button
      type="button"
      className={liked ? "like on" : "like"}
      onClick={toggle}
      aria-pressed={liked}
      disabled={busy}
    >
      <Heart fill={liked ? "currentColor" : "none"} />
      {liked ? "Liked" : "Like"} · {count}
    </button>
  );
}

function Dome() {
  const ref = useRef<HTMLDivElement>(null);
  const [az, setAz] = useState(128);
  const [el, setEl] = useState(46);

  const read = (clientX: number, clientY: number) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    setAz(Math.round((x + 0.5) * 360));
    setEl(Math.round(Math.max(8, 80 - Math.hypot(x, y) * 120)));
  };

  const starX = 50 + Math.cos((az * Math.PI) / 180) * (40 - el / 4);
  const starY = 50 + Math.sin((az * Math.PI) / 180) * (40 - el / 4);

  return (
    <div
      className="dome"
      ref={ref}
      onPointerMove={(event) => read(event.clientX, event.clientY)}
    >
      <svg viewBox="0 0 100 100" aria-label={`Dome pointing azimuth ${az} degrees, elevation ${el} degrees`}>
        <circle cx="50" cy="50" r="46" fill="none" stroke="#2a2c36" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#2a2c36" strokeWidth="0.3" />
        <circle cx="50" cy="50" r="14" fill="none" stroke="#2a2c36" strokeWidth="0.3" />
        <line x1="50" y1="4" x2="50" y2="96" stroke="#2a2c36" strokeWidth="0.3" />
        <line x1="4" y1="50" x2="96" y2="50" stroke="#2a2c36" strokeWidth="0.3" />
        <circle cx={starX} cy={starY} r="1.6" fill="#d4783a" />
        <text x="50" y="92" textAnchor="middle" fill="#8d8a80" fontSize="4" fontFamily="Outfit, sans-serif">
          AZ {az}° · EL {el}°
        </text>
      </svg>
    </div>
  );
}
