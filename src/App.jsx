import { useState, useEffect, useRef } from 'react'

/* ── DATA ── */
const SERVICES = [
  {
    num: '01', phase: 'Erste Phase', name: 'Machbarkeitsstudie',
    desc: 'Bevor ein Projekt startet, analysieren wir die baulichen, rechtlichen und wirtschaftlichen Möglichkeiten Ihres Grundstücks — so wissen Sie früh, was realisierbar ist.',
    tags: ['Standortanalyse', 'Rechtliche Prüfung', 'Wirtschaftlichkeit'],
  },
  {
    num: '02', phase: 'Zweite Phase', name: 'Projektanalyse & Konzept',
    desc: 'Auf Basis der Machbarkeitsstudie entwickeln wir ein klares Konzept: Raumprogramm, Volumen und gestalterische Haltung als Grundlage für alle weiteren Schritte.',
    tags: ['Raumprogramm', 'Konzeptentwicklung', 'Kostenschätzung'],
  },
  {
    num: '03', phase: 'Dritte Phase', name: 'Baueingabe',
    desc: 'Wir erstellen sämtliche Unterlagen für das Baugesuch und begleiten Sie durch das Bewilligungsverfahren — bis zur rechtsgültigen Baubewilligung.',
    tags: ['Baugesuch', 'Behördenkontakt', 'Baubewilligung'],
  },
  {
    num: '04', phase: 'Vierte Phase', name: 'Ausführungspläne',
    desc: 'Präzise, masshaltige Ausführungspläne für reibungslose Bauprozesse. Ob Neubau, Umbau oder Sanierung — unsere Pläne schaffen Klarheit für alle Beteiligten.',
    tags: ['Neubau', 'Umbau', 'Sanierung', 'Detailplanung'],
  },
]

const PROJECTS = [
  { idx: '001', year: '2024–25', place: 'Neuenegg', type: 'Ausführungsplanung', sub: 'Überbauung', active: true },
  { idx: '002', year: '2024',    place: 'Buus',     type: 'Baueingabe',         sub: 'Sanierung MFH' },
  { idx: '003', year: '2024',    place: 'Altwis',   type: 'Baueingabe',         sub: 'Umgebungsgestaltung · Hanglage' },
  { idx: '004', year: '2023',    place: 'Root',     type: 'Baueingabe',         sub: 'Planung Wintergarten EFH' },
  { idx: '005', year: '2023',    place: 'Doettigen', type: 'Machbarkeitsstudie', sub: 'Standortanalyse' },
  { idx: '006', year: '2023',    place: 'Eglisau',  type: 'Machbarkeitsstudie', sub: 'Standortanalyse' },
]

const STUDIES = [
  { n: '01', place: 'Doettigen' },
  { n: '02', place: 'Wohlen' },
  { n: '03', place: 'Wil AG' },
  { n: '04', place: 'Ehrendingen' },
  { n: '05', place: 'Eglisau' },
]

const MARQUEE_ITEMS = [
  'Architektur', 'Planung', 'Beratung', 'Schweizweit',
  'Machbarkeitsstudie', 'Baueingabe', 'Ausführungsplanung',
  'Neubau', 'Sanierung', 'nnarchitektur',
]

/* ── useInView — React state, no DOM manipulation ── */
function useInView(delay = 0) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay)
          io.disconnect()
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])
  return [ref, visible]
}

function Rv({ children, delay = 0, as: Tag = 'div', className = '', ...rest }) {
  const [ref, visible] = useInView(delay)
  return (
    <Tag ref={ref} className={`rv ${visible ? 'rv-v' : 'rv-h'} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
}

/* ── STATNUM — count-up animation ── */
function StatNum({ val }) {
  const ref = useRef(null)
  const num = parseInt(val, 10)
  const [display, setDisplay] = useState(isNaN(num) ? val : '00')
  useEffect(() => {
    if (isNaN(num)) return
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect()
      const dur = 1100, t0 = performance.now()
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1)
        setDisplay(String(Math.round(p * num)).padStart(2, '0'))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [num])
  return <span ref={ref} className="stat-n">{display}</span>
}

/* ── useActiveSection ── */
function useActiveSection(ids) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { threshold: 0.2, rootMargin: '-10% 0px -60% 0px' }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])
  return active
}
function SvcItem({ item, open, onToggle }) {
  return (
    <div className={`svc-item${open ? ' open' : ''}`}>
      <button className="svc-btn" onClick={onToggle} aria-expanded={open}>
        <div className="svc-meta">
          <span className="svc-num">{item.num}</span>
          <span className="svc-phase">{item.phase}</span>
        </div>
        <span className="svc-name">{item.name}</span>
        <span className="svc-icon" aria-hidden="true">+</span>
      </button>
      <div className="svc-body" aria-hidden={!open}>
        <div className="svc-inner">
          <div className="svc-content">
            <p className="svc-desc">{item.desc}</p>
            <div className="svc-tags">
              {item.tags.map(t => <span key={t} className="svc-tag">{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── CONTACT FORM ── */
function ContactForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(e.target)).toString(),
      })
      if (res.ok) setSent(true)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="f-ok">
        Vielen Dank —<br />
        wir melden uns<br />
        innerhalb von 2 Werktagen.
      </div>
    )
  }

  return (
    <form name="kontakt" method="POST" data-netlify="true" onSubmit={handleSubmit}>
      <input type="hidden" name="form-name" value="kontakt" />
      <div className="fg">
        <label className="fl" htmlFor="f-name">Name</label>
        <input className="fi" id="f-name" name="name" type="text" autoComplete="name" required />
      </div>
      <div className="fg">
        <label className="fl" htmlFor="f-email">E-Mail</label>
        <input className="fi" id="f-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="fg">
        <label className="fl" htmlFor="f-proj">Projektart</label>
        <select className="fi" id="f-proj" name="projekt">
          <option value="">Bitte wählen…</option>
          <option value="machbarkeit">Machbarkeitsstudie</option>
          <option value="konzept">Projektanalyse &amp; Konzept</option>
          <option value="baueingabe">Baueingabe</option>
          <option value="ausfuehrung">Ausführungsplanung</option>
          <option value="sonstiges">Sonstiges</option>
        </select>
      </div>
      <div className="fg">
        <label className="fl" htmlFor="f-msg">Nachricht</label>
        <textarea className="fi" id="f-msg" name="nachricht" rows="4" />
      </div>
      <button type="submit" className="f-btn" disabled={loading}>
        {loading ? 'Wird gesendet…' : 'Anfrage senden →'}
      </button>
    </form>
  )
}

/* ── INTRO SCREEN ── */
function Intro({ onDone, className = '' }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className={`intro ${className}`.trim()}>
      <div className="intro-center">
        <div className="intro-logo">NN<em>.</em></div>
        <p className="intro-sub">Architektur · Planung · Beratung</p>
        <div className="intro-bar-wrap">
          <div className="intro-bar" />
        </div>
      </div>
      <div className="intro-foot">
        <span>Bösch 80b · 6331 Hünenberg</span>
        <span>nnarchitektur.ch</span>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   APP
══════════════════════════════════════════════ */
export default function App() {
  const [openSvc, setOpenSvc] = useState(null)
  const [introDone, setIntroDone] = useState(false)
  const [introOut, setIntroOut] = useState(false)
  const active = useActiveSection(['leistungen', 'referenzen', 'standorte', 'kontakt'])

  function handleIntroDone() {
    setIntroOut(true)
    setTimeout(() => setIntroDone(true), 950)
  }

  return (
    <>
      {!introDone && (
        <Intro onDone={handleIntroDone} className={introOut ? 'intro-out' : ''} />
      )}
      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-brand">
          <a href="#" className="nav-logo">NN<em>.</em></a>
          <span className="nav-brand-sub">Architektur</span>
        </div>
        <ul className="nav-links">
          <li><a href="#leistungen" className={active === 'leistungen' ? 'active' : ''}><span className="nav-link-num">01</span>Leistungen</a></li>
          <li><a href="#referenzen" className={active === 'referenzen' ? 'active' : ''}><span className="nav-link-num">02</span>Referenzen</a></li>
          <li><a href="#standorte" className={active === 'standorte' ? 'active' : ''}><span className="nav-link-num">03</span>Standorte</a></li>
        </ul>
        <a href="#kontakt" className="nav-cta">Kontakt &rarr;</a>
      </nav>

      {/* ── HERO — SPLIT SCREEN ── */}
      <section id="hero">
        {/* Left — identity panel */}
        <div className="hero-l">
          <div className="hl-top">
            <span className="hl-logo">NN<em>.</em></span>
          </div>
          <div className="hl-mid">
            <span>Architektur</span>
            <span>Planung</span>
            <span>Beratung</span>
          </div>
          <div className="hl-bot">
            <p>Bösch 80b</p>
            <p>6331 Hünenberg</p>
            <p>Schweiz</p>
          </div>
        </div>

        {/* Right — headline panel */}
        <div className="hero-r">
          <p className="hr-eyebrow">— Schweizweit tätig seit 2020</p>
          <h1 className="hr-title">
            Von der<br />
            ersten<br />
            Idee bis<br />
            zur Aus&shy;führung.
          </h1>
          <div className="hr-foot">
            <p className="hr-desc">
              nnarchitektur begleitet Ihr Projekt von der ersten
              Machbarkeitsprüfung bis zur baulichen Umsetzung —
              strukturiert, präzise und persönlich.
            </p>
            <a href="#kontakt" className="hr-cta">Projekt anfragen →</a>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="stats-bar">
        {[
          ['04', 'Leistungen'],
          ['06', 'Projekte'],
          ['05', 'Studien'],
          ['CH', 'Schweizweit'],
        ].map(([n, l]) => (
          <div key={l} className="stat">
            <StatNum val={n} />
            <span className="stat-l">{l}</span>
          </div>
        ))}
      </div>

      {/* ── MARQUEE ── */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">{item}&nbsp;&nbsp;/&nbsp;&nbsp;</span>
          ))}
        </div>
      </div>

      {/* ── LEISTUNGEN — editorial large rows ── */}
      <section id="leistungen">
        <div className="s-pad" style={{ paddingBottom: 0 }}>
          <Rv><span className="s-eyebrow">Leistungen</span></Rv>
          <Rv delay={80}>
            <h2 className="s-head">
              Von der Analyse<br />
              zur <span className="acc">Ausführung</span>
            </h2>
          </Rv>
        </div>
        <div style={{ padding: '0 var(--g) clamp(4rem,9vw,9rem)' }}>
          <div className="svc-list">
            {SERVICES.map((svc, i) => (
              <SvcItem
                key={svc.num}
                item={svc}
                open={openSvc === i}
                onToggle={() => setOpenSvc(p => p === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── REFERENZEN — light section, huge place names ── */}
      <section id="referenzen">
        <div className="s-pad" style={{ paddingBottom: 0 }}>
          <Rv><span className="s-eyebrow s-eyebrow-l">Referenzen</span></Rv>
          <Rv delay={80}>
            <h2 className="s-head s-head-l">
              Ausgewählte<br />Projekte
            </h2>
          </Rv>
        </div>
        <div style={{ padding: '0 var(--g) clamp(4rem,9vw,9rem)' }}>
          <div className="proj-list">
            {PROJECTS.map((p, i) => (
              <Rv key={p.idx} delay={i * 55}>
                <div className="proj-item">
                  <div className="pi-top">
                    <span className="pi-idx">{p.idx}</span>
                    <span className="pi-year">{p.year}</span>
                    <span className="pi-type">{p.type}</span>
                    {p.active && <span className="pi-badge">Aktuell</span>}
                  </div>
                  <span className="pi-place">{p.place}</span>
                  <div className="pi-sub">{p.sub}</div>
                </div>
              </Rv>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATEMENT — full chartreuse bleed ── */}
      <section className="stmt-section">
        <Rv>
          <p className="stmt-big">
            Jedes Projekt<br />
            ist einmalig —<br />
            wir begleiten es<br />
            mit Präzision.
          </p>
        </Rv>
        <Rv delay={140}>
          <div className="stmt-src">
            <span>nnarchitektur</span>
            <span>Bösch 80b · 6331 Hünenberg</span>
          </div>
        </Rv>
      </section>

      {/* ── STANDORTE — dark, image card grid ── */}
      <section id="standorte">
        <div className="s-pad" style={{ paddingBottom: '2rem' }}>
          <Rv><span className="s-eyebrow">Machbarkeitsstudien</span></Rv>
          <Rv delay={80}>
            <h2 className="s-head">
              Standort&shy;analysen<br />
              <span className="acc">schweizweit</span>
            </h2>
          </Rv>
        </div>
        <div className="studies-grid">
          {STUDIES.map((s, i) => (
            <Rv key={s.place} delay={i * 90} className="study-card">
              <span className="sc-ghost">{s.n}</span>
              <div className="study-card-body">
                <span className="sc-n">{s.n}</span>
                <span className="sc-place">{s.place}</span>
                <span className="sc-label">Standortanalyse</span>
              </div>
            </Rv>
          ))}
        </div>
      </section>

      {/* ── KONTAKT — email as display + form ── */}
      <section id="kontakt">
        <div className="kt-top">
          <Rv>
            <a href="mailto:nnarchitektur@gmail.com" className="kt-email">
              nnarchitektur@gmail.com
            </a>
          </Rv>
        </div>
        <div className="kt-body">
          <div className="kt-info">
            <Rv><span className="s-eyebrow">Kontakt</span></Rv>
            <Rv delay={60}>
              <h2 className="kt-title">
                Ihr Projekt<br />
                beginnt hier.
              </h2>
            </Rv>
            <Rv delay={110}>
              <div className="ki">
                <span className="ki-l">Adresse</span>
                <span className="ki-v">Bösch 80b · 6331 Hünenberg</span>
              </div>
            </Rv>
            <Rv delay={145}>
              <div className="ki">
                <span className="ki-l">E-Mail</span>
                <span className="ki-v">
                  <a href="mailto:nnarchitektur@gmail.com">nnarchitektur@gmail.com</a>
                </span>
              </div>
            </Rv>
            <Rv delay={180}>
              <div className="ki">
                <span className="ki-l">Erreichbarkeit</span>
                <span className="ki-v">Mo – Fr, 8:00 – 17:30 Uhr</span>
              </div>
            </Rv>
          </div>
          <Rv delay={120}>
            <ContactForm />
          </Rv>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <span className="ft-logo">NN<em>.</em></span>
        <span className="ft-copy">
          Bösch 80b · 6331 Hünenberg · © 2026 nnarchitektur
        </span>
      </footer>
    </>
  )
}

