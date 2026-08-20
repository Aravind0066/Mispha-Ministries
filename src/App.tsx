import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { apiFetch } from './api'

// Ministry images
import img157    from './image_157_.png'
import img159    from './image_159_.png'
import img161    from './image_161_.png'
import img162    from './image_162_.png'
import img162b   from './image_162_.png'
import img166    from './image_166_.png'
import imgPalmSunday          from './assets/training-session.jpg'
import imgYoungPastors        from './assets/hero-ministry.jpg'
import imgJohnBenniPreaching  from './image_166_.png'
import imgHeroMinistry from './assets/hero-ministry.jpg'
import imgTrainingSession from './assets/training-session.jpg'
import imgSchool from './assets/school.jpg'
import imgCollege from './assets/college.jpg'
import imgDairyFarm from './assets/dairy-farm.jpg'
import imgPaddyFarm from './assets/paddy-farm.jpg'
import imgFruitFarm from './assets/fruit-farm.jpg'
import imgPalmOutreach from './assets/Palm tree Outreach.png'
import imgYoungPastorsMeetup from './assets/Young pastor meetup.png'
import imgBibleCollege from './assets/Bible College.png'

const E = [0.16, 1, 0.3, 1] as const

function Reveal({ children, delay = 0, y = 40, className = '', style }: {
  children: ReactNode; delay?: number; y?: number; className?: string; style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-70px' })
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, ease: E, delay }}
    >{children}</motion.div>
  )
}

const childV = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

function Stagger({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: delay } } }}
    >{children}</motion.div>
  )
}


// ─── SECTION HEAD ─────────────────────────────────────────────────────────────

function SectionHead({ label, title, subtitle, light = false, center = false }: {
  label: string; title: ReactNode; subtitle?: string; light?: boolean; center?: boolean
}) {
  return (
    <Reveal>
      <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 72 }}>
        <span className="label" style={{ color: light ? 'rgba(200,168,130,0.85)' : 'var(--brass)', marginBottom: 16, display: 'inline-block' }}>{label}</span>
        <div style={{ width: 28, height: 1, background: light ? 'rgba(200,168,130,0.6)' : 'var(--brick)', margin: center ? '0 auto 20px' : '0 0 20px' }} />
        <h2 style={{
          fontFamily: "'Fraunces', serif", fontWeight: 700,
          fontSize: 'clamp(28px,4vw,54px)',
          letterSpacing: '-0.01em',
          color: light ? '#F4F0E8' : 'var(--ink)',
          lineHeight: 1.12, maxWidth: 780,
          margin: center ? '0 auto' : '0',
        }}>{title}</h2>
        {subtitle && (
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 20,
            color: light ? 'rgba(244,240,232,0.55)' : 'var(--muted)',
            lineHeight: 1.85, marginTop: 22, maxWidth: 540,
            margin: center ? '22px auto 0' : '22px 0 0',
          }}>{subtitle}</p>
        )}
      </div>
    </Reveal>
  )
}

// ─── LOADER ───────────────────────────────────────────────────────────────────

function Loader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const ts = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 2400),
      setTimeout(() => onDone(), 3000),
    ]
    return () => ts.forEach(clearTimeout)
  }, [onDone])

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.55, ease: E }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: '#FFFFFF',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, scale: phase >= 1 ? 1 : 0.88 }}
            transition={{ duration: 0.65, ease: E }}
            style={{ marginBottom: 32, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img src={img157} alt="Mispha Ministries"
              style={{ width: 160, height: 'auto', display: 'block', position: 'relative' }} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 16 }}
            transition={{ duration: 0.5, ease: E }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontFamily: "'Fraunces', serif", fontWeight: 700,
              fontSize: 20, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink)',
            }}>Mispha Ministries</div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 14,
              letterSpacing: '0.28em', textTransform: 'uppercase',
              color: 'var(--brick)', marginTop: 10, opacity: 0.75,
            }}>Church · Mission · Training</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

const NAV = [
  { label: 'Our Ministry',     id: 'calling' },
  { label: 'Training',         id: 'training' },
  { label: 'Leadership',       id: 'leadership' },
  { label: 'Annual Covenant',  id: 'covenant' },
  { label: 'Gallery',          id: 'gallery' },
  { label: 'Donations',        id: 'give' },
  { label: 'Contact',          id: 'contact' },
]

function Navbar({ loaded }: { loaded: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }} animate={loaded ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: E, delay: 0.15 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? '12px clamp(20px, 4vw, 64px)' : '20px clamp(20px, 4vw, 64px)',
        background: scrolled ? 'rgba(244,240,232,0.97)' : 'rgba(244,240,232,0.90)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(200,195,184,0.7)' : 'rgba(200,195,184,0.3)'}`,
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        {/* Logo left */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, shrink: 0 }}>
          <img src={img157} alt="Mispha logo" style={{ width: 44, height: 44, objectFit: 'contain', display: 'block' }} />
          <div style={{
            fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 18,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--ink)', lineHeight: 1, whiteSpace: 'nowrap',
          }}>Mispha Ministries</div>
        </button>

        {/* Desktop nav links center-expanded */}
        <div className="hide-mobile" style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'nowrap' }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => go(n.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px',
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 600,
                letterSpacing: '0.02em', color: 'var(--charcoal)', transition: 'color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--brick)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--charcoal)')}
            >{n.label}</button>
          ))}
        </div>

        {/* CTA & Phone right */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 24, shrink: 0 }}>
          <a href="tel:+919884970978"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--ink)', letterSpacing: '0.04em', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            +91 98849 70978
          </a>
          <button onClick={() => go('contact')} className="btn btn-brass btn-arrow" style={{ padding: '11px 24px', fontSize: 14 }}>
            Request Prayer <span className="btn-arr">→</span>
          </button>
        </div>

        {/* Hamburger */}
        <button className="hide-tablet" onClick={() => setMenuOpen(true)} aria-label="Open menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{ display: 'block', width: 24, height: 2, background: 'var(--ink)', borderRadius: 1 }} />
          ))}
        </button>
      </div>

      {/* Full-screen glassy mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: E }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(244, 240, 232, 0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              display: 'flex', flexDirection: 'column', padding: '28px 32px 44px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={img157} alt="Mispha logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
                <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 18, letterSpacing: '0.12em', color: 'var(--ink)', textTransform: 'uppercase' }}>Mispha Ministries</span>
              </div>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu"
                style={{ background: 'none', border: 'none', color: 'var(--ink)', fontSize: 32, cursor: 'pointer', lineHeight: 1, padding: 4 }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {[...NAV, { label: 'Request Prayer', id: 'contact' }].map((n, i) => (
                <button key={`${n.id}-${i}`} onClick={() => go(n.id)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    background: 'none', border: 'none', borderBottom: '1px solid var(--border)',
                    cursor: 'pointer', padding: '18px 0',
                    fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 22,
                    color: i === NAV.length ? 'var(--brick)' : 'var(--ink)',
                  }}
                >{n.label}</button>
              ))}
            </div>
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <a href="tel:+919884970978"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 17, fontWeight: 600, color: 'var(--ink)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                +91 98849 70978
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

const CATCH = [
  'Prayer is the key for vision',
  'Vision is the key for heaven',
  'Heaven is the key for prayer',
]

function Hero() {
  const [catchIdx, setCatchIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setCatchIdx(c => (c + 1) % CATCH.length), 3400)
    return () => clearInterval(t)
  }, [])

  return (
    <section id="home" style={{
      minHeight: '100vh', display: 'grid', gridTemplateColumns: '52% 48%',
      background: 'var(--ivory)', overflow: 'hidden', position: 'relative',
    }}>
      {/* Left: editorial text */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'clamp(100px,12vh,150px) clamp(24px,4vw,48px) 80px clamp(28px,6vw,90px)',
      }}>
        {/* vertical rule between columns */}
        <div style={{ position: 'absolute', right: 0, top: '10%', bottom: '10%', width: 1, background: 'rgba(181,101,74,0.15)' }} />

        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: E, delay: 0.5 }}
          className="label" style={{ color: 'var(--brick)', marginBottom: 36 }}>
          Church · Mission · Training
        </motion.span>

        {/* Main headline */}
        <div style={{ marginBottom: 28, paddingTop: 4 }}>
          {['Building churches.', 'Equipping leaders.'].map((line, i) => (
            <div key={i} style={{ overflow: 'hidden', paddingBottom: 6 }}>
              <motion.h1 initial={{ y: '110%' }} animate={{ y: 0 }}
                transition={{ duration: 0.78, ease: E, delay: 0.65 + i * 0.1 }}
                style={{
                  fontFamily: "'Fraunces', serif", fontWeight: 800,
                  fontSize: 'clamp(36px, 4.5vw, 74px)',
                  color: 'var(--ink)', lineHeight: 1.15, marginBottom: 2,
                  letterSpacing: '-0.015em',
                }}>{line}</motion.h1>
            </div>
          ))}
          <div style={{ overflow: 'hidden', paddingBottom: 4 }}>
            <motion.p initial={{ y: '110%' }} animate={{ y: 0 }}
              transition={{ duration: 0.78, ease: E, delay: 0.86 }}
              style={{
                fontFamily: "'Fraunces', serif", fontWeight: 400, fontStyle: 'italic',
                fontSize: 'clamp(20px, 2.2vw, 30px)',
                color: 'var(--brick)', lineHeight: 1.4, marginTop: 8,
              }}>Sending the Gospel forward.</motion.p>
          </div>
        </div>

        {/* Divider */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: E, delay: 1.05 }}
          style={{ width: 36, height: 1, background: 'var(--brick)', marginBottom: 26, transformOrigin: 'left' }} />

        {/* Description */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.15, ease: E }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(16px,1.4vw,18px)', fontWeight: 400,
            color: 'var(--muted)', lineHeight: 1.9, maxWidth: 400, marginBottom: 38,
          }}>
          Mispha Ministries plants churches, prepares pastors, sends missionaries and develops Christian leaders who strengthen families and communities.
        </motion.p>

        {/* Rotating prayer statement */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          style={{ marginBottom: 46 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {CATCH.map((_, i) => (
              <motion.button key={i} onClick={() => setCatchIdx(i)}
                animate={{ width: i === catchIdx ? 24 : 6, opacity: i === catchIdx ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}
                style={{ height: 2, background: 'var(--brick)', border: 'none', cursor: 'pointer', padding: 0, borderRadius: 1 }}
              />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={catchIdx}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.42, ease: E }}
              style={{ position: 'relative', paddingLeft: 18 }}>
              <div style={{ position: 'absolute', left: 0, top: 4, bottom: 4, width: 2, background: 'var(--brick)', borderRadius: 1 }} />
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic',
                fontSize: 'clamp(16px,1.5vw,19px)', fontWeight: 500,
                color: 'var(--burgundy)', lineHeight: 1.55,
              }}>{CATCH[catchIdx]}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 1.55, ease: E }}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn btn-brass btn-arrow" onClick={() => document.getElementById('calling')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore Our Mission <span className="btn-arr">→</span>
          </button>
          <button className="btn btn-outline btn-outline-dark" onClick={() => document.getElementById('give')?.scrollIntoView({ behavior: 'smooth' })}>
            Partner With Mispha
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}
          style={{ marginTop: 40 }}>
          <a href="tel:+919884970978"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: 'var(--muted)', letterSpacing: '0.08em', textDecoration: 'none' }}>
            +91 98849 70978
          </a>
        </motion.div>
      </div>

      {/* Right: Candles — warm amber glow, seamlessly devotional */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: E, delay: 0.2 }}
        style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', background: '#180E06' }}>
        <img
          src={imgHeroMinistry}
          alt="Rows of lit candles glowing in warm amber light — devotional atmosphere"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', display: 'block', opacity: 0.92 }}
        />
        {/* Subtle peach-to-dark vignette left edge — merges with left panel */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(244,224,200,0.18) 0%, transparent 28%)' }} />
        {/* Bottom fade for caption legibility */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(24,14,6,0.78) 0%, rgba(24,14,6,0.12) 42%, transparent 68%)' }} />
        {/* Very slight warm terracotta cast — ties into the theme without masking the glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 40%, rgba(181,101,74,0.08) 0%, transparent 70%)', mixBlendMode: 'screen' }} />

        {/* Scripture caption */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.9 }}
          style={{ position: 'absolute', bottom: 44, left: 38, right: 38, zIndex: 2 }}>
          <div style={{ width: 22, height: 1, background: 'rgba(200,168,130,0.55)', marginBottom: 14 }} />
          <p style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: 'clamp(15px,1.3vw,17.5px)', color: 'rgba(244,232,210,0.86)', lineHeight: 1.7, margin: '0 0 10px' }}>
            "The effective, fervent prayer of a righteous man avails much."
          </p>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(200,168,130,0.55)' }}>
            James 5:16
          </span>
        </motion.div>

        {/* Watermark logo */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9, duration: 0.8 }}
          style={{ position: 'absolute', top: 32, right: 30, zIndex: 2 }}>
          <img src={img157} alt="" aria-hidden="true" style={{ width: 32, height: 'auto', opacity: 0.28, filter: 'brightness(6) saturate(0.4)' }} />
        </motion.div>
      </motion.div>

      <style>{`@media(max-width:768px){#home{grid-template-columns:1fr!important}#home>div:last-child{min-height:55vw!important;min-height:55dvh!important}}`}</style>
    </section>
  )
}

// ─── MOVING BAND ──────────────────────────────────────────────────────────────

function MovingBand() {
  const text = 'Prayer is the key for vision · Vision is the key for heaven · Heaven is the key for prayer · '
  const full = text.repeat(6)
  return (
    <div style={{
      background: 'var(--caramel)', overflow: 'hidden', padding: '16px 0',
      borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
    }}>
      <div className="ticker-inner">
        {[0, 1].map(k => (
          <span key={k} style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 15, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'rgba(143,73,56,0.65)', paddingRight: '6em',
          }}>{full}</span>
        ))}
      </div>
    </div>
  )
}

// ─── PRAYER STATEMENT ─────────────────────────────────────────────────────────

function PrayerStatement() {
  return (
    <section style={{ padding: 'clamp(80px,10vw,140px) clamp(24px,6vw,96px)', background: '#171918', position: 'relative', overflow: 'hidden' }}>
      {/* architectural hairline */}
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(181,101,74,0.08)', transform: 'translateX(-50%)' }} />
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <span className="label" style={{ color: 'rgba(200,168,130,0.6)', marginBottom: 56, display: 'block', textAlign: 'center' }}>The heart of Mispha</span>
        </Reveal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { keyword: 'PRAYER', rest: ' is the key for vision.' },
            { keyword: 'VISION', rest: ' is the key for heaven.' },
            { keyword: 'HEAVEN', rest: ' is the key for prayer.' },
          ].map((line, i) => (
            <Reveal key={i} delay={i * 0.14} y={24}>
              <div style={{
                borderTop: `1px solid rgba(200,195,184,0.1)`,
                padding: 'clamp(24px,3vw,40px) 0',
                display: 'flex', alignItems: 'baseline', gap: 'clamp(14px,2vw,28px)',
                flexWrap: 'wrap',
              }}>
                <span style={{
                  fontFamily: "'Fraunces', serif", fontWeight: 800,
                  fontSize: 'clamp(42px,7vw,96px)',
                  color: 'var(--brick)', lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}>{line.keyword}</span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic',
                  fontSize: 'clamp(16px,2.2vw,28px)',
                  color: 'rgba(244,240,232,0.55)', lineHeight: 1.3,
                }}>{line.rest}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(200,195,184,0.1)' }} />
      </div>
    </section>
  )
}

// ─── OUR CALLING ─────────────────────────────────────────────────────────────

const CALLINGS = [
  { n: '01', title: 'Planting Churches', desc: 'Building worshipping and serving Christian communities in unreached places.', img: imgPalmSunday },
  { n: '02', title: 'Sending Missionaries', desc: 'Preparing and sending people to share the Gospel in the harvest fields.', img: img161 },
  { n: '03', title: 'Preparing Pastors Through Bible College', desc: 'Structured biblical, pastoral and practical formation for servant-leaders.', img: imgYoungPastors },
  { n: '04', title: "Training Pastors' Wives", desc: "Equipping women to strengthen families and build supportive church networks.", img: img159 },
  { n: '05', title: "Equipping Pastors' Children", desc: 'Supporting the next generation growing within ministry families.', img: imgPalmSunday },
  { n: '06', title: 'Advanced Training for Pastors', desc: 'Helping serving pastors expand their biblical, leadership and ministry knowledge.', img: img162b },
]

function OurCalling() {
  const [active, setActive] = useState(0)
  const c = CALLINGS[active]
  return (
    <section id="calling" style={{ padding: 'clamp(80px,10vw,160px) clamp(24px,6vw,96px)', background: 'var(--parchment)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, transparent, var(--border), transparent)', opacity: 0.4 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHead
          label="Our Calling"
          title={<>Six commitments at the<br /><em style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontWeight: 400, color: 'var(--burgundy)' }}>heart of the mission</em></>}
          subtitle="Every dimension of the ministry serves one purpose: establishing Christ's Kingdom through people who are called, prepared and sent."
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,80px)', alignItems: 'start' }} className="calling-grid">

          {/* Left — commitment list with active card highlighting */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {CALLINGS.map((cal, i) => (
              <button key={i} onClick={() => setActive(i)}
                style={{
                  width: '100%', textAlign: 'left', cursor: 'pointer',
                  padding: '18px 22px',
                  background: active === i ? '#fff' : 'transparent',
                  border: `1px solid ${active === i ? 'var(--brick)' : 'transparent'}`,
                  borderRadius: 12,
                  boxShadow: active === i ? '0 4px 24px rgba(181,101,74,0.13), 0 1px 6px rgba(32,35,34,0.07)' : 'none',
                  transition: 'background 0.25s, border-color 0.25s, box-shadow 0.3s',
                  display: 'grid', gridTemplateColumns: '48px 1fr', gap: 18, alignItems: 'start',
                  outline: 'none',
                }}>
                {/* Left accent bar for active */}
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontSize: 21, fontWeight: 500,
                  color: active === i ? 'var(--brick)' : 'var(--sage)',
                  transition: 'color 0.25s', lineHeight: 1.1,
                }}>{cal.n}</span>
                <div>
                  <div style={{
                    fontFamily: "'Fraunces', serif", fontWeight: 700,
                    fontSize: 'clamp(16px,1.5vw,18px)',
                    color: active === i ? 'var(--ink)' : 'var(--muted)',
                    transition: 'color 0.25s', lineHeight: 1.3, marginBottom: active === i ? 8 : 0,
                  }}>{cal.title}</div>
                  <AnimatePresence>
                    {active === i && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.32, ease: E }}
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17.5, color: 'var(--muted)', lineHeight: 1.75, overflow: 'hidden', margin: 0 }}
                      >{cal.desc}</motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            ))}
            <div style={{ marginTop: 24, paddingLeft: 22 }}>
              <button className="btn btn-primary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Enquire About Training
              </button>
            </div>
          </div>

          {/* Right — fixed church mural */}
          <Reveal>
            <div style={{ position: 'sticky', top: '120px' }}>
              <div style={{ position: 'relative', paddingBottom: '133%', borderRadius: 16, overflow: 'hidden' /* 3/4 aspect ratio */ }}>
                <img
                  src={imgTrainingSession}
                  alt="Sacred Heart of Jesus Christ — devotional painting"
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'center top',
                    display: 'block',
                  }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,8,4,0.62) 0%, transparent 55%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '22px 26px' }}>
                  <div style={{ width: 22, height: 1, background: 'rgba(200,168,130,0.55)', marginBottom: 12 }} />
                  <p style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: 17.5, color: 'rgba(244,240,232,0.82)', lineHeight: 1.7, margin: '0 0 8px' }}>
                    "I will build my church, and the gates of hell shall not prevail against it."
                  </p>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(200,168,130,0.55)' }}>Matthew 16:18</span>
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
      <style>{`@media(max-width:768px){.calling-grid{grid-template-columns:1fr!important}.calling-grid>div:last-child{display:none!important}}`}</style>
    </section>
  )
}

// ─── STRENGTHENING THE CHURCH ─────────────────────────────────────────────────

const PRIORITIES = [
  {
    title: 'Sustainable Church Fundraising',
    detail: 'Building self-sustaining funding models so local churches can grow without dependency on outside organisations.',
    extra: (
      <div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.75 }}>
          A funding-ready church can give, receive and steward well. Key markers include a regular giving culture, transparent accountability and at least two independent income streams.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px' }}>
          {['Regular giving culture established', 'Two or more income streams', 'Transparent reporting in place', 'External partnership agreements'].map(item => (
            <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: 'var(--ink)' }}>
              <span style={{ width: 16, height: 16, border: '1px solid var(--brick)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <span style={{ width: 6, height: 6, background: 'var(--brick)', borderRadius: 1, display: 'block' }} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
    action: 'Request a fundraising consultation', actionId: 'contact',
  },
  {
    title: 'Discipling New Believers',
    detail: 'Structured discipleship pathways that move new believers into mature, serving members of the local church community.',
    extra: (
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 14 }}>
          {['Welcome', 'Foundations', 'Mentoring', 'Serving'].map((stage, i) => (
            <div key={stage} style={{ textAlign: 'center', padding: '12px 6px', background: 'var(--teal-bg)', border: '1px solid var(--border)' }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{stage}</div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: 'var(--muted)', lineHeight: 1.75 }}>Each stage has defined learning objectives, community milestones and a mentor relationship.</p>
      </div>
    ),
    action: 'Discuss a discipleship pathway', actionId: 'contact',
  },
  {
    title: 'Short-Term and Long-Term Church Planning',
    detail: 'Equipping church leaders with strategic tools for both immediate ministry decisions and multi-year community vision.',
    extra: (
      <div style={{ marginBottom: 16 }}>
        {[['90-Day Focus', 'Immediate priorities, key roles and first-quarter milestones.'], ['1-Year Strategy', 'Annual objectives, budget framework and community growth targets.'], ['5-Year Vision', 'Long-term mission trajectory, infrastructure and leadership pipeline.']].map(([label, desc]) => (
          <div key={label} style={{ padding: '10px 14px', borderLeft: '2px solid var(--brick)', marginBottom: 8, background: 'var(--teal-bg)' }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 16, color: 'var(--brick)', marginBottom: 3 }}>{label}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</div>
          </div>
        ))}
      </div>
    ),
    action: 'Start a planning conversation', actionId: 'contact',
  },
  {
    title: 'Building Ministry Partnerships',
    detail: 'Connecting churches, organisations and individuals around shared mission for greater Kingdom impact.',
    extra: (
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 14 }}>
          {[['Church', 'Join a network of planting churches'], ['Organisation', 'Collaborate on training or mission'], ['Donor', 'Direct giving with ministry accountability'], ['Volunteer', 'Skills, time and presence on the ground']].map(([type, desc]) => (
            <div key={type} style={{ padding: '12px 14px', border: '1px solid var(--border)', background: 'var(--ivory)' }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 16, color: 'var(--ink)', marginBottom: 3 }}>{type}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    action: 'Enquire about partnerships', actionId: 'give',
  },
  {
    title: 'Strengthening Families',
    detail: 'Practical ministry to families through pastoral care, biblical teaching and community support networks.',
    extra: (
      <div style={{ marginBottom: 16 }}>
        {[['Marriage support', 'Premarital and couples enrichment'], ['Parenting', 'Biblical parenting and family devotion'], ['Youth', 'Faith formation for teenagers in the home'], ['Family care', 'Pastoral support for families in crisis']].map(([prog, desc]) => (
          <div key={prog} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 8 }}>
            <span style={{ width: 6, height: 6, background: 'var(--brick)', borderRadius: '50%', marginTop: 6, flexShrink: 0 }} />
            <div>
              <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>{prog} </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--muted)' }}>— {desc}</span>
            </div>
          </div>
        ))}
      </div>
    ),
    action: 'Request family support', actionId: 'contact',
  },
  {
    title: 'Church Counselling and Care',
    detail: 'A dedicated care framework helping individuals and families receive compassionate, confidential pastoral support.',
    extra: (
      <div style={{ padding: '14px 16px', background: 'var(--teal-bg)', border: '1px solid var(--border)', marginBottom: 16 }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--muted)', lineHeight: 1.75, fontStyle: 'italic', margin: 0 }}>
          All care enquiries are handled with complete confidentiality. No personal information is shared publicly. This service is pastoral in nature — for immediate crisis support, please contact your local emergency services.
        </p>
      </div>
    ),
    action: 'Request confidential care', actionId: 'contact',
  },
]

function StrengtheningChurch() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="training" style={{ padding: 'clamp(80px,10vw,160px) clamp(24px,6vw,96px)', background: '#F4F0E8' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,96px)', alignItems: 'start' }} className="training-grid">
          <Reveal>
            <div style={{ position: 'sticky', top: '120px' }}>
              <span className="label" style={{ marginBottom: 16, display: 'block' }}>Six Strategic Priorities</span>
              <div style={{ width: 28, height: 1, background: 'var(--brick)', marginBottom: 20 }} />
              <h2 style={{
                fontFamily: "'Fraunces', serif", fontWeight: 800,
                fontSize: 'clamp(32px,4vw,52px)', color: 'var(--ink)', lineHeight: 1.08, marginBottom: 24,
                letterSpacing: '-0.02em',
              }}>Strengthening<br />the Local<br /><em style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontWeight: 400, color: 'var(--burgundy)' }}>Church</em></h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: 'var(--muted)', lineHeight: 1.85 }}>
                Six areas of ministry focus that help local churches grow in health, depth and long-term fruitfulness.
              </p>
            </div>
          </Reveal>
          <div>
            {PRIORITIES.map((p, i) => (
              <Reveal key={i} delay={i * 0.05} y={20}>
                <div style={{ borderBottom: '1px solid var(--border)' }}>
                  <button onClick={() => setOpen(open === i ? null : i)}
                    style={{
                      width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                      padding: '22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20,
                    }}>
                    <span style={{
                      fontFamily: "'Fraunces', serif", fontWeight: 700,
                      fontSize: 'clamp(16px,1.6vw,19px)',
                      color: open === i ? 'var(--brick)' : 'var(--ink)', transition: 'color 0.25s',
                    }}>{p.title}</span>
                    <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.25 }}
                      style={{ display: 'block', flexShrink: 0, color: open === i ? 'var(--brick)' : 'var(--muted)' }}>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                        <line x1="10" y1="3" x2="10" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </motion.span>
                  </button>
                  <div className={`acc-body${open === i ? ' open' : ''}`}>
                    <div style={{ padding: '4px 0 24px' }}>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 14 }}>{p.detail}</p>
                      {p.extra}
                      <button className="btn btn-primary" style={{ fontSize: 13, padding: '11px 24px' }}
                        onClick={() => document.getElementById(p.actionId)?.scrollIntoView({ behavior: 'smooth' })}>
                        {p.action}
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.training-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}

// ─── LEADERSHIP NETWORK ───────────────────────────────────────────────────────

const LEADERSHIP_TRACKS = [
  {
    id: 'women', n: '01', label: "Women's Leadership",
    tagline: 'Equipping women to serve as leaders in family, church and community life.',
    detail: 'This track provides structured training for women in ministry contexts — covering pastoral care, children\'s work, community development and leadership within the local church.',
    fields: [
      { placeholder: 'Full name', type: 'text', required: true },
      { placeholder: 'Phone number', type: 'tel', required: true },
      { placeholder: 'Church or organisation', type: 'text', required: false },
    ],
  },
  {
    id: 'men', n: '02', label: "Men's Leadership",
    tagline: 'Developing men who lead faithfully in the home, the church and the community.',
    detail: 'Focused on character formation, biblical eldership and servant leadership — this track prepares men to shoulder responsibility with integrity across every area of life.',
    fields: [
      { placeholder: 'Full name', type: 'text', required: true },
      { placeholder: 'Phone number', type: 'tel', required: true },
      { placeholder: 'Ministry role', type: 'text', required: false },
    ],
  },
  {
    id: 'young', n: '03', label: 'Young Leaders',
    tagline: 'Raising a generation of bold, faith-filled young leaders for the Kingdom.',
    detail: 'Designed for emerging leaders between 18–35, this track builds confidence, calling and competency — equipping the next generation to carry the mission forward.',
    fields: [
      { placeholder: 'Full name', type: 'text', required: true },
      { placeholder: 'Age', type: 'number', required: true },
      { placeholder: 'Phone number', type: 'tel', required: true },
      { placeholder: 'Church or school', type: 'text', required: false },
    ],
  },
  {
    id: 'pastoral', n: '04', label: 'Pastoral Team Development',
    tagline: 'Strengthening pastoral teams through strategic planning and biblical leadership formation.',
    detail: 'A practical programme for church leadership teams — addressing team dynamics, vision alignment, theological grounding and sustainable ministry practices.',
    fields: [
      { placeholder: 'Lead pastor name', type: 'text', required: true },
      { placeholder: 'Church name', type: 'text', required: true },
      { placeholder: 'Team size', type: 'number', required: false },
      { placeholder: 'Phone number', type: 'tel', required: true },
    ],
  },
]

function LeadershipNetwork() {
  const [activeTrack, setActiveTrack] = useState<string>('')
  const [enquirySent, setEnquirySent] = useState(false)
  const track = LEADERSHIP_TRACKS.find(t => t.id === activeTrack) ?? null

  return (
    <section id="leadership" style={{ padding: 'clamp(80px,10vw,160px) clamp(24px,6vw,96px)', background: '#F4F0E8', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header — left-aligned, NGO programme style */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,80px)', alignItems: 'end', marginBottom: 'clamp(40px,6vw,72px)' }} className="leadership-header">
          <div>
            <span className="label" style={{ color: 'var(--brick)', marginBottom: 14, display: 'block' }}>Leadership Network</span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 'clamp(28px,4vw,52px)', color: 'var(--ink)', lineHeight: 1.08, letterSpacing: '-0.02em', margin: 0 }}>
              Leading Every<br /><em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--burgundy)' }}>Generation</em>
            </h2>
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(16px,1.3vw,18px)', color: 'var(--muted)', lineHeight: 1.8, margin: 0 }}>
            Four structured programmes developing leaders across every expression of ministry — grounded in Scripture, shaped by calling, and built for the long-term.
          </p>
        </div>

        {/* Programme listing — full-width rows */}
        <div style={{ borderTop: '1px solid var(--border)', marginBottom: 'clamp(40px,6vw,64px)' }}>
          {LEADERSHIP_TRACKS.map((t) => {
            const active = activeTrack === t.id
            return (
              <div key={t.id}>
                <button
                  onClick={() => setActiveTrack(active ? '' : t.id)}
                  aria-expanded={active}
                  style={{
                    width: '100%', textAlign: 'left', cursor: 'pointer', outline: 'none',
                    padding: 'clamp(20px,2.5vw,28px) clamp(20px,2.5vw,32px)',
                    background: active ? '#fff' : 'transparent',
                    border: 'none',
                    borderLeft: `3px solid ${active ? 'var(--brick)' : 'transparent'}`,
                    borderBottom: active ? 'none' : '1px solid var(--border)',
                    borderRadius: active ? '12px 12px 0 0' : 12,
                    boxShadow: active ? '0 4px 32px rgba(32,35,34,0.07), 0 1px 8px rgba(181,101,74,0.08)' : 'none',
                    transition: 'background 0.25s, border-left-color 0.25s, box-shadow 0.3s',
                    display: 'grid',
                    gridTemplateColumns: '72px 1fr auto',
                    alignItems: 'center', gap: 'clamp(16px,2vw,32px)',
                  }}>
                  {/* Number */}
                  <span style={{
                    fontFamily: "'Fraunces', serif", fontWeight: 300,
                    fontSize: 'clamp(28px,3.5vw,42px)',
                    color: active ? 'var(--brick)' : 'rgba(32,35,34,0.18)',
                    lineHeight: 1, letterSpacing: '-0.02em',
                    transition: 'color 0.25s',
                  }}>{t.n}</span>
                  {/* Title + tagline */}
                  <div>
                    <div style={{
                      fontFamily: "'Fraunces', serif", fontWeight: 700,
                      fontSize: 'clamp(16px,1.8vw,21px)',
                      color: active ? 'var(--ink)' : 'var(--ink)',
                      lineHeight: 1.2, marginBottom: 5,
                    }}>{t.label}</div>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(14.5px,1.1vw,16px)',
                      color: 'var(--muted)', lineHeight: 1.6,
                    }}>{t.tagline}</div>
                  </div>
                  {/* Chevron */}
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                    style={{ flexShrink: 0, transition: 'transform 0.3s', transform: active ? 'rotate(180deg)' : 'none' }}>
                    <path d="M4 6.5l5 5 5-5" stroke={active ? 'var(--brick)' : 'rgba(32,35,34,0.3)'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Expanded detail */}
                <AnimatePresence>
                  {active && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.38, ease: E }}
                      style={{ overflow: 'hidden', background: '#fff', borderLeft: '3px solid var(--brick)', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)', borderRadius: '0 0 12px 12px' }}>
                      <div style={{ padding: 'clamp(16px,2vw,24px) clamp(20px,2.5vw,32px) clamp(20px,2vw,28px)', paddingLeft: 'calc(72px + clamp(16px,2vw,32px) + clamp(20px,2.5vw,32px))' }}>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16.5, color: 'var(--muted)', lineHeight: 1.85, margin: '0 0 18px', maxWidth: 620 }}>{t.detail}</p>
                        <button className="btn btn-outline btn-outline-dark btn-arrow" style={{ fontSize: 12.5 }}
                          onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}>
                          Apply for this programme <span className="btn-arr">→</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Enquiry form — anchored by id for scroll-to */}
        <Reveal>
          <div id="enquiry-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,64px)', alignItems: 'start', padding: 'clamp(28px,4vw,48px)', background: 'white', border: '1px solid var(--border)', borderRadius: 16 }} className="enquiry-grid">
            <div>
              <span className="label" style={{ color: 'var(--brick)', marginBottom: 12, display: 'block' }}>Programme Enquiry</span>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 'clamp(20px,2.2vw,28px)', color: 'var(--ink)', marginBottom: 12, lineHeight: 1.2 }}>
                Begin your leadership journey
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: 'var(--muted)', marginBottom: 0, lineHeight: 1.75 }}>
                {track ? track.tagline : 'Select a programme track above, then complete this form. The Mispha team will be in touch to discuss the next steps.'}
              </p>
            </div>
            <div>
              {enquirySent ? (
                <div style={{ padding: '24px', background: 'var(--teal-bg)', border: '1px solid rgba(154,160,143,0.3)' }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 18, color: 'var(--teal-dark)', marginBottom: 6 }}>Enquiry received</div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'var(--muted)', margin: 0 }}>The ministry will be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={async e => { 
                  e.preventDefault(); 
                  const fd = new FormData(e.currentTarget as HTMLFormElement);
                  await apiFetch('/api/forms/leadership', {
                    method: 'POST',
                    body: JSON.stringify({
                      name: fd.get('name'),
                      phone: fd.get('phone'),
                      church: fd.get('church'),
                      track: activeTrack,
                      notes: fd.get('notes'),
                    })
                  });
                  setEnquirySent(true); 
                }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ position: 'relative' }}>
                    <select value={activeTrack} onChange={e => setActiveTrack(e.target.value)} required aria-label="Leadership track"
                      style={{
                        width: '100%', appearance: 'none', WebkitAppearance: 'none',
                        padding: '13px 40px 13px 14px', background: 'white',
                        border: '1px solid var(--border)', color: activeTrack ? 'var(--ink)' : 'var(--muted)',
                        fontFamily: "'DM Sans', sans-serif", fontSize: 16, cursor: 'pointer',
                        outline: 'none', borderRadius: 12,
                      }}>
                      <option value="" disabled>Select a programme track</option>
                      {LEADERSHIP_TRACKS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                    <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1l5 5 5-5" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  {track && track.fields.map((f, fi) => (
                    <input key={fi} name={f.placeholder.toLowerCase().includes('name') ? 'name' : f.placeholder.toLowerCase().includes('phone') ? 'phone' : 'church'} className="field" type={f.type} placeholder={f.placeholder} required={f.required} />
                  ))}
                  <textarea name="notes" className="field" placeholder="Anything else you would like us to know (optional)" rows={3} style={{ resize: 'vertical' }} />
                  <button type="submit" className="btn btn-brass" style={{ marginTop: 6 }} disabled={!activeTrack}>
                    Submit Enquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
      <style>{`@media(max-width:768px){.leadership-header{grid-template-columns:1fr!important}.enquiry-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}

// ─── ANNUAL COVENANT ──────────────────────────────────────────────────────────

const PASTOR_ITEMS = ['100 believers baptised', 'Seven days of prayer meetings', 'A dedicated prayer room', 'Dedicated Bible training', 'Dedicated fasting days']
const BELIEVER_ITEMS = ['A minimum of two care-cell groups', 'Reach at least one believer each week', 'Attend church prayer meetings', "Participate in planning the church's future", 'Grow in biblical knowledge and life in Christ']

function AnnualCovenant() {
  return (
    <section id="covenant" style={{ padding: 'clamp(80px,10vw,160px) clamp(24px,6vw,96px)', background: 'var(--parchment)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHead
          label="Our Annual Covenant"
          title={<>Shared commitments,<br /><em style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontWeight: 400, color: 'var(--burgundy)' }}>shared growth</em></>}
          subtitle="These are not targets imposed from above. They are covenants made together as a ministry family, renewed each year."
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px,4vw,48px)' }} className="covenant-grid">
          <Reveal delay={0.1} style={{ height: '100%' }}>
            <div style={{ background: '#202322', padding: 'clamp(32px,4vw,52px)', borderRadius: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: 2, height: 48, background: 'var(--brick)', marginBottom: 28 }} />
              <span className="label" style={{ color: 'rgba(181,101,74,0.7)', marginBottom: 12, display: 'block' }}>For Pastors &amp; Leaders</span>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 'clamp(20px,2.6vw,28px)', color: '#F4F0E8', lineHeight: 1.15, marginBottom: 36, letterSpacing: '-0.01em' }}>Year Targets<br />for Pastors</h3>
              {PASTOR_ITEMS.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 18 }}>
                  <div style={{ width: 18, height: 18, border: '1px solid rgba(181,101,74,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <div style={{ width: 7, height: 7, background: 'var(--brick)' }} />
                  </div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: 'rgba(244,240,232,0.75)', lineHeight: 1.65 }}>{item}</span>
                </div>
              ))}
              <div style={{ marginTop: 'auto', paddingTop: 32, borderTop: '1px solid rgba(181,101,74,0.12)', fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(244,240,232,0.3)', fontStyle: 'italic' }}>
                Progress updates will be published here when ministry details are confirmed.
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2} style={{ height: '100%' }}>
            <div style={{ background: 'white', border: '1px solid var(--border)', padding: 'clamp(32px,4vw,52px)', borderRadius: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: 2, height: 48, background: 'var(--sage)', marginBottom: 28 }} />
              <span className="label" style={{ color: 'var(--sage)', marginBottom: 12, display: 'block' }}>For Every Believer</span>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 'clamp(20px,2.6vw,28px)', color: 'var(--ink)', lineHeight: 1.15, marginBottom: 36, letterSpacing: '-0.01em' }}>Year Targets<br />for Believers</h3>
              {BELIEVER_ITEMS.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 18 }}>
                  <div style={{ width: 18, height: 18, border: '1px solid var(--sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <div style={{ width: 7, height: 7, background: 'var(--sage)' }} />
                  </div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: 'var(--muted)', lineHeight: 1.65 }}>{item}</span>
                </div>
              ))}
              <div style={{ marginTop: 'auto', paddingTop: 32 }}>
                <button className="btn btn-primary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                  Join a Care Cell
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`@media(max-width:768px){.covenant-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}

// ─── VISION PROJECTS ──────────────────────────────────────────────────────────

const PROJECTS_DATA = [
  { title: 'Church Building',  purpose: 'Establishing a permanent, purpose-built place of worship for the local congregation.', img: imgTrainingSession, alt: 'Mispha congregation gathered in worship', col: 7 },
  { title: 'Bible College',    purpose: 'A dedicated facility for training the next generation of pastors, missionaries and ministry leaders.', img: imgBibleCollege, alt: 'Bible college campus building', col: 5 },
  { title: 'School',           purpose: 'Providing quality Christian education that forms character, intellect and leadership.', img: imgSchool, alt: 'Children learning in a classroom', col: 4 },
  { title: 'College',          purpose: 'Higher education grounded in Christian values, equipping graduates for service in every field.', img: imgCollege, alt: 'University building and campus', col: 4 },
  { title: 'Dairy Farm',       purpose: 'A sustainable agricultural enterprise ensuring community food security and economic empowerment.', img: imgDairyFarm, alt: 'Cows grazing in a lush green pastoral field', col: 4 },
  { title: 'Paddy Farm',       purpose: 'Cultivating land for long-term community livelihood and Kingdom-centred enterprise.', img: imgPaddyFarm, alt: 'Green rice paddy field with palm trees', col: 5 },
  { title: 'Fruit Farm',       purpose: 'Building sustainable farming for community provision and ministry funding.', img: imgFruitFarm, alt: 'Fruit trees in an orchard at harvest', col: 7 },
]

type VProject = { title: string; purpose: string; img: string; alt: string; col: number }

function VisionCard({ project: p, expanded, setExpanded }: { project: VProject; expanded: string | null; setExpanded: (t: string | null) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const isOpen = expanded === p.title
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75 }}
      onClick={() => setExpanded(isOpen ? null : p.title)}
      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', minHeight: 260, background: '#1A1410', borderRadius: 16 }}
    >
      <img src={p.img} alt={p.alt}
        style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          position: 'absolute', inset: 0,
          transition: 'transform 0.65s cubic-bezier(0.16,1,0.3,1)',
          transform: isOpen ? 'scale(1.06)' : 'scale(1)',
          opacity: 0.85,
        }} />
      {/* Devotional warm overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,10,4,0.94) 0%, rgba(20,10,4,0.35) 45%, transparent 100%)' }} />
      {isOpen && <div style={{ position: 'absolute', inset: 0, background: 'rgba(143,73,56,0.18)' }} />}
      {/* Content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(18px,2.5vw,28px)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: isOpen ? 'rgba(200,168,130,0.9)' : 'rgba(200,168,130,0.55)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 7, transition: 'color 0.25s' }}>In Vision</div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 'clamp(17px,1.8vw,23px)', color: '#F4F0E8', lineHeight: 1.12, margin: 0 }}>{p.title}</h3>
          </div>
          <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.25 }}
            style={{ width: 30, height: 30, border: `1px solid ${isOpen ? 'rgba(181,101,74,0.7)' : 'rgba(255,255,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: isOpen ? '#B5654A' : 'rgba(255,255,255,0.6)', fontSize: 20, fontWeight: 200, transition: 'border-color 0.25s, color 0.25s' }}>+</motion.div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'rgba(244,240,232,0.75)', lineHeight: 1.8, marginTop: 12, marginBottom: 14 }}>{p.purpose}</p>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(244,240,232,0.35)', fontStyle: 'italic', marginBottom: 16 }}>Full details and funding goals will be published when confirmed.</div>
              <button className="btn btn-brass" style={{ fontSize: 12, padding: '9px 20px' }}
                onClick={e => { e.stopPropagation(); document.getElementById('give')?.scrollIntoView({ behavior: 'smooth' }) }}>Support This Vision</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function VisionProjects() {
  const [expanded, setExpanded] = useState<string | null>(null)
  return (
    <section id="vision" style={{ padding: 'clamp(80px,10vw,160px) clamp(24px,6vw,96px)', background: '#F4F0E8' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHead
          label="Vision Projects"
          title={<>The Fields<br /><em style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontWeight: 400, color: 'var(--burgundy)' }}>Ahead</em></>}
          subtitle="Seven future projects — real plans, not inspirational concepts. Details, funding and timelines will be published as the ministry confirms them."
        />
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 10, marginBottom: 10 }} className="vision-row">
          {PROJECTS_DATA.slice(0, 2).map(p => <VisionCard key={p.title} project={p} expanded={expanded} setExpanded={setExpanded} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }} className="vision-row">
          {PROJECTS_DATA.slice(2, 5).map(p => <VisionCard key={p.title} project={p} expanded={expanded} setExpanded={setExpanded} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 10 }} className="vision-row">
          {PROJECTS_DATA.slice(5).map(p => <VisionCard key={p.title} project={p} expanded={expanded} setExpanded={setExpanded} />)}
        </div>
      </div>
      <style>{`@media(max-width:768px){.vision-row{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}

// ─── FROM THE PULPIT ──────────────────────────────────────────────────────────

const MEDIA_FILTERS = ['All', 'Sermons', 'Bible Teaching', 'Pastor Training', 'Mission', 'Prayer', 'Family']

function FromThePulpit() {
  const [filter, setFilter] = useState('All')
  const [sermons, setSermons] = useState<any[]>([])

  useEffect(() => {
    apiFetch<any[]>('/api/content/sermons').then(res => {
      if (res.length > 0) setSermons(res)
    }).catch(console.error)
  }, [])

  return (
    <section id="pulpit" style={{ padding: 'clamp(80px,10vw,160px) clamp(24px,6vw,96px)', background: 'var(--parchment)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,80px)', alignItems: 'center' }} className="pulpit-grid">
          <Reveal y={60}>
            <div style={{ position: 'relative' }}>
              <div style={{ overflow: 'hidden', background: '#2A1535', aspectRatio: '3/4', position: 'relative', borderRadius: 16 }}>
                <img src={imgJohnBenniPreaching} alt="Rev. D. John Benni preaching with microphone"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,8,28,0.55) 0%, transparent 55%)' }} />
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 20px', background: 'rgba(20,8,28,0.65)', backdropFilter: 'blur(4px)', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>
                  Rev. D. John Benni · President
                </span>
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <span className="label" style={{ color: 'var(--brick)', marginBottom: 16, display: 'block' }}>From the Pulpit</span>
              <div style={{ width: 28, height: 1, background: 'var(--brick)', marginBottom: 20 }} />
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 'clamp(30px,4vw,52px)', color: 'var(--ink)', lineHeight: 1.08, marginBottom: 20, letterSpacing: '-0.02em' }}>
                Preach the<br />Word. Build<br /><em style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontWeight: 400, color: 'var(--burgundy)' }}>the Kingdom.</em>
              </h2>
              {/* Devotional scripture block */}
              <div style={{ borderLeft: '2px solid var(--brick)', paddingLeft: 18, marginBottom: 28 }}>
                <p style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: 17, color: 'var(--ink)', lineHeight: 1.75, margin: '0 0 6px' }}>
                  "Go into all the world and preach the gospel to every creature."
                </p>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>Mark 16:15</span>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17.5, color: 'var(--muted)', lineHeight: 1.85, marginBottom: 36 }}>
                Teachings, sermons and training messages from Rev. D. John Benni will be published here as the media archive develops. Video, audio and message notes will be available for every resource.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
                {MEDIA_FILTERS.map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    style={{
                      background: filter === f ? 'var(--brick)' : 'transparent',
                      border: `1px solid ${filter === f ? 'var(--brick)' : 'rgba(32,35,34,0.18)'}`,
                      borderRadius: 99,
                      padding: '7px 16px', cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: filter === f ? '#fff' : 'rgba(32,35,34,0.45)',
                      transition: 'all 0.25s',
                    }}>{f}</button>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              {sermons.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {sermons.map(s => (
                    <div key={s.id} style={{ padding: '24px', background: 'white', border: '1px solid var(--border)', borderRadius: 12 }}>
                      <div style={{ fontSize: 13, color: 'var(--brick)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{new Date(s.date).toLocaleDateString()} • {s.category}</div>
                      <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, margin: '0 0 8px 0', color: 'var(--ink)' }}>{s.title}</h4>
                      <div style={{ fontSize: 16, color: 'var(--muted)', marginBottom: s.embedUrl ? 16 : 0 }}>{s.speaker}</div>
                      {s.embedUrl && <a href={s.embedUrl} target="_blank" rel="noreferrer" style={{ fontSize: 15, color: 'var(--brick)', fontWeight: 600, textDecoration: 'none' }}>Watch Video →</a>}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '28px', background: 'white', border: '1px solid var(--border)', borderRadius: 12 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontSize: 18, color: 'var(--muted)', lineHeight: 1.75 }}>
                    Sermon titles, video archives and message notes will be published here. Check back as the media library develops.
                  </p>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.pulpit-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}

function BoardMembers() {
  const [members, setMembers] = useState<any[]>([])

  useEffect(() => {
    apiFetch<any[]>('/api/content/board-members').then(res => {
      if (res.length > 0) setMembers(res)
    }).catch(console.error)
  }, [])

  if (members.length === 0) return null

  return (
    <section id="leadership-board" style={{ padding: 'clamp(80px,10vw,160px) clamp(24px,6vw,96px)', background: '#F4F0E8', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHead
          label="Board Members"
          title={<>Shepherds of the<br /><em style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontWeight: 400, color: 'var(--burgundy)' }}>Mission</em></>}
          subtitle="The ministry is led by servant-leaders whose lives reflect the calling of Mispha Ministries."
        />

        {members.map((member, i) => {
          const isLeft = member.side === 'left' || (!member.side && i % 2 === 0)
          
          if (isLeft) {
            return (
              <Reveal key={member.id} delay={0.1 * i}>
                <div style={{ display: 'grid', gridTemplateColumns: '55% 1fr', gap: 'clamp(32px,5vw,72px)', alignItems: 'end', marginBottom: 'clamp(48px,7vw,96px)' }} className="board-l">
                  <div style={{ position: 'relative', overflow: 'hidden', background: '#C8C3B8', aspectRatio: '4/5', borderRadius: 16 }}>
                    {member.imageUrl || member.role === 'President' || member.role === 'Secretary & Treasurer' ? (
                      <img src={member.imageUrl || (member.role === 'President' ? img162b : img159)} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,0.05)' }} />
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(32,35,34,0.18) 0%, transparent 40%)' }} />
                  </div>
                  <div style={{ paddingBottom: 8 }}>
                    <div style={{ width: 2, height: 48, background: 'var(--burgundy)', marginBottom: 24 }} />
                    <span className="label" style={{ marginBottom: 12, display: 'block' }}>{member.role}</span>
                    <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 'clamp(24px,3vw,40px)', color: 'var(--ink)', lineHeight: 1.08, marginBottom: 8, letterSpacing: '-0.02em' }}>{member.name}</h3>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontSize: 20, color: 'var(--burgundy)', marginBottom: 28 }}>{member.role}, Mispha Ministries</p>
                    <div style={{ padding: '18px 22px', background: 'white', borderLeft: '2px solid var(--border)', fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.75, marginBottom: 32 }}>
                      {member.bio || "Biography will be added here."}
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          }

          return (
            <Reveal key={member.id} delay={0.1 * i}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 55%', gap: 'clamp(32px,5vw,72px)', alignItems: 'end', marginBottom: 'clamp(48px,7vw,96px)' }} className="board-r">
                <div style={{ paddingBottom: 8 }}>
                  <div style={{ width: 2, height: 48, background: 'var(--sage)', marginBottom: 24, marginLeft: 'auto' }} />
                  <span className="label" style={{ marginBottom: 12, display: 'block', textAlign: 'right' }}>{member.role}</span>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 'clamp(24px,3vw,40px)', color: 'var(--ink)', lineHeight: 1.08, marginBottom: 8, textAlign: 'right', letterSpacing: '-0.02em' }}>{member.name}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontSize: 20, color: 'var(--sage)', marginBottom: 28, textAlign: 'right' }}>{member.role}, Mispha Ministries</p>
                  <div style={{ padding: '18px 22px', background: 'white', borderRight: '2px solid var(--border)', fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.75 }}>
                    {member.bio || "Biography will be added here."}
                  </div>
                </div>
                <div style={{ position: 'relative', overflow: 'hidden', background: '#C8C3B8', aspectRatio: '4/5', borderRadius: 16 }}>
                  {member.imageUrl || member.role === 'President' || member.role === 'Secretary & Treasurer' ? (
                    <img src={member.imageUrl || (member.role === 'President' ? img162b : img159)} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,0.05)' }} />
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(32,35,34,0.12) 0%, transparent 40%)' }} />
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
      <style>{`
        @media(max-width:768px){
          .board-l,.board-r{grid-template-columns:1fr!important}
          .board-r>div:first-child{text-align:left!important}
          .board-r>div:first-child .label{text-align:left!important}
          .board-r>div:first-child h3,.board-r>div:first-child p{text-align:left!important}
          .board-r>div:first-child>div:first-child{margin-left:0!important}
        }
      `}</style>
    </section>
  )
}

// ─── GALLERY ──────────────────────────────────────────────────────────────────

const GALLERY_SLIDES = [
  {
    img: imgPalmOutreach,
    alt: 'Palm Sunday congregation outreach procession',
    title: 'Palm Sunday Outreach Ministry',
    index: '01',
    detail: 'The congregation gathered in white, moving through the community with drums and palms — carrying the message of Christ to the streets.',
    occasion: 'Palm Sunday Outreach',
    location: 'Community Outreach',
    participants: 'Full congregation — men, women and children',
  },
  {
    img: imgYoungPastorsMeetup,
    alt: 'Young pastors gathered for a ministry meetup',
    title: 'Young Pastors Meetup',
    index: '02',
    detail: "A gathering of young pastors and emerging leaders — encouraged by John 4:24, meeting to strengthen one another in ministry and in truth.",
    occasion: 'Leadership Gathering',
    location: 'Local Church Hall',
    participants: 'Young pastors and emerging ministry leaders',
  },
]

function GallerySection() {
  const [active, setActive] = useState(0)
  const [slides, setSlides] = useState<any[]>([])

  useEffect(() => {
    apiFetch<any[]>('/api/content/gallery').then(res => {
      if (res.length > 0) {
        // Map over the results and provide static fallbacks if URL is missing
        const mapped = res.map((r, i) => ({
          ...r,
          url: r.url || GALLERY_SLIDES[i % GALLERY_SLIDES.length].img
        }))
        setSlides(mapped)
      } else {
        setSlides(GALLERY_SLIDES)
      }
    }).catch((err) => {
      console.error(err)
      setSlides(GALLERY_SLIDES)
    })
  }, [])

  if (slides.length === 0) return null
  const slide = slides[active] || slides[0]

  return (
    <section id="gallery" style={{ padding: 'clamp(60px,8vw,120px) 0', background: '#F4F0E8', overflow: 'hidden' }}>
      {/* Section header */}
      <div style={{ padding: '0 clamp(24px,6vw,96px)', maxWidth: 1300, margin: '0 auto 48px' }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <span className="label" style={{ color: 'var(--brick)', marginBottom: 12, display: 'block' }}>Ministry in Action</span>
              <div style={{ width: 28, height: 1, background: 'var(--brick)', marginBottom: 18 }} />
              <h2 style={{
                fontFamily: "'Fraunces', serif", fontWeight: 700,
                fontSize: 'clamp(26px,3.5vw,48px)',
                color: 'var(--ink)', lineHeight: 1.1, letterSpacing: '-0.01em', margin: 0,
              }}>Glimpses from the{' '}
                <em style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontWeight: 400, color: 'var(--burgundy)' }}>field</em>
              </h2>
            </div>
            {/* Navigation dots */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingBottom: 6 }}>
              {slides.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  aria-label={`View slide ${i + 1}`}
                  style={{
                    width: i === active ? 32 : 8, height: 8,
                    background: i === active ? 'var(--brick)' : 'var(--border)',
                    border: 'none', cursor: 'pointer', padding: 0, borderRadius: 4,
                    transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                  }}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Featured slide */}
      <div style={{ padding: '0 clamp(24px,6vw,96px)', maxWidth: 1300, margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.55, ease: E }}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 0, border: '1px solid var(--border)', overflow: 'hidden', background: '#FFFFFF', borderRadius: 16,
              boxShadow: '0 12px 34px rgba(32,35,34,0.06)',
            }}
            className="gallery-featured"
          >
            {/* Photo */}
            <div style={{ position: 'relative', overflow: 'hidden', alignSelf: 'stretch', minHeight: 0, background: '#ECE8DE', padding: 'clamp(12px,1.6vw,20px)', borderRadius: 16 }} className="gallery-photo">
              <img src={slide.url || slide.img} alt={slide.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', background: '#FFFFFF', boxShadow: '0 5px 16px rgba(32,35,34,0.10)', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)', borderRadius: 8 }}
              />
              {/* index badge */}
              <div style={{
                position: 'absolute', top: 'clamp(24px,3vw,40px)', left: 'clamp(24px,3vw,40px)',
                fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontSize: 42, fontWeight: 500,
                color: 'rgba(255,255,255,0.35)', lineHeight: 1, userSelect: 'none',
              }}>{String(active + 1).padStart(2, '0')}</div>
            </div>

            {/* Details panel */}
            <div style={{
              background: '#FFFFFF', padding: 'clamp(32px,4vw,56px)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 0,
              borderLeft: '1px solid var(--border)',
            }} className="gallery-details">
              <div>
                <span className="label" style={{ color: 'var(--brick)', marginBottom: 20, display: 'block' }}>{slide.occasion}</span>
                <h3 style={{
                  fontFamily: "'Fraunces', serif", fontWeight: 700,
                  fontSize: 'clamp(20px,2.8vw,34px)', color: 'var(--ink)',
                  lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 20,
                }}>{slide.title}</h3>
                <div style={{ width: 28, height: 1, background: 'var(--border)', marginBottom: 24 }} />
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(16px,1.4vw,18px)',
                  color: 'var(--muted)', lineHeight: 1.85, marginBottom: 32,
                }}>{slide.detail}</p>

                {/* Meta rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { label: 'Location', value: slide.location },
                    { label: 'Participants', value: slide.participants },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', paddingBottom: 14, borderBottom: '1px solid #F0EDE7' }}>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                        letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)',
                        minWidth: 90, paddingTop: 2,
                      }}>{row.label}</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: 'var(--ink)', lineHeight: 1.5 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation arrows */}
              <div style={{ display: 'flex', gap: 10, marginTop: 40 }}>
                <button
                  onClick={() => setActive(a => (a - 1 + slides.length) % slides.length)}
                  aria-label="Previous"
                  style={{
                    width: 44, height: 44, border: '1px solid var(--border)', borderRadius: '50%',
                    background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--muted)', transition: 'all 0.22s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--brick)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--brick)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)' }}
                >
                  ←
                </button>
                <button
                  onClick={() => setActive(a => (a + 1) % slides.length)}
                  aria-label="Next"
                  style={{
                    width: 44, height: 44, border: '1px solid var(--border)', borderRadius: '50%',
                    background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--muted)', transition: 'all 0.22s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--brick)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--brick)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)' }}
                >
                  →
                </button>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--muted)',
                  display: 'flex', alignItems: 'center', marginLeft: 8,
                  letterSpacing: '0.06em',
                }}>
                  <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{String(active + 1).padStart(2, '0')}</span>
                  <span style={{ margin: '0 6px' }}>/</span>
                  {String(slides.length).padStart(2, '0')}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <style>{`@media(max-width:768px){.gallery-featured{grid-template-columns:1fr!important}.gallery-photo{aspect-ratio:16/9!important}.gallery-details{border-left:none!important;border-top:1px solid var(--border)!important}}`}</style>
    </section>
  )
}

// ─── GIVE & PARTNER ───────────────────────────────────────────────────────────

const GIVING_AREAS = [
  { title: 'Church Planting',        desc: 'Support the establishment of new gospel-centred churches.' },
  { title: 'Missionary Support',     desc: 'Help prepare and sustain missionaries in the harvest fields.' },
  { title: 'Bible College',          desc: 'Invest in the formation of the next generation of pastors.' },
  { title: 'Leadership Training',    desc: 'Equip women, men, youth and children for Kingdom service.' },
  { title: 'School & College Vision', desc: 'Help build Christian education facilities for communities.' },
  { title: 'Agricultural Projects',  desc: 'Fund dairy, paddy and fruit farming for community provision.' },
  { title: 'Family & Counselling',   desc: 'Support pastoral care and family ministry programmes.' },
  { title: 'Media Ministry',         desc: 'Extend the Gospel reach through audio, video and digital media.' },
]

const DONATION_TIERS = [
  { amount: '₹500',  label: 'Seed Gift',     impact: 'Covers one week of discipleship materials for a new believer.' },
  { amount: '₹1,500', label: 'Monthly Giver', impact: 'Sponsors one day of Bible College training per month.' },
  { amount: '₹5,000', label: 'Church Builder', impact: 'Contributes directly toward a local church planting effort.' },
  { amount: 'Custom', label: 'Your Gift',     impact: 'Name your amount — every rupee is a stone in the Kingdom.' },
]

function GivePartner() {
  const [activeArea, setActiveArea] = useState<string>('Church Planting')
  const [activeTier, setActiveTier] = useState<string>('Monthly Giver')
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [sent, setSent] = useState(false)
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true) }

  const sage       = '#4D6B4F'
  const sageDark   = '#2E4530'
  const sageMid    = '#6B8F6D'
  const sageBg     = '#EEF4EE'
  const sageBorder = 'rgba(77,107,79,0.2)'
  const sageCard   = 'rgba(77,107,79,0.06)'

  return (
    <section id="give" style={{ background: sageBg, position: 'relative', overflow: 'hidden' }}>

      {/* Top banner strip */}
      <div style={{ background: sageDark, padding: 'clamp(56px,7vw,100px) clamp(24px,6vw,96px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 40 }} className="give-banner-grid">
          <div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,220,200,0.6)', display: 'block', marginBottom: 18 }}>Give &amp; Partner</span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 'clamp(28px,4.5vw,58px)', color: '#F4F0E8', lineHeight: 1.06, letterSpacing: '-0.02em', margin: 0 }}>
              Your generosity<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300, color: 'rgba(200,220,200,0.75)' }}>builds what endures.</em>
            </h2>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { n: '14+', label: 'Churches planted' },
                { n: '200+', label: 'Pastors trained' },
                { n: '6', label: 'Active mission fields' },
              ].map(stat => (
                <div key={stat.n} style={{ display: 'flex', alignItems: 'baseline', gap: 10, justifyContent: 'flex-end' }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 'clamp(22px,2.5vw,32px)', color: '#F4F0E8' }}>{stat.n}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(200,220,200,0.55)', letterSpacing: '0.06em' }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scripture pull-quote bridge */}
      <div style={{ background: sage, padding: '20px clamp(24px,6vw,96px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
          <p style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: 'clamp(15px,1.2vw,17px)', color: 'rgba(255,255,255,0.72)', margin: 0 }}>
            "Each of you should give what you have decided in your heart to give — not reluctantly or under compulsion, for God loves a cheerful giver."
          </p>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)', flexShrink: 0, marginLeft: 'auto' }}>2 Cor 9:7</span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: 'clamp(60px,8vw,120px) clamp(24px,6vw,96px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Giving tier selector */}
          <Reveal>
            <div style={{ marginBottom: 'clamp(40px,6vw,72px)' }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: sageMid, marginBottom: 20 }}>Choose a giving level</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }} className="tier-grid">
                {DONATION_TIERS.map(t => {
                  const isActive = activeTier === t.label
                  return (
                    <button key={t.label} onClick={() => setActiveTier(t.label)}
                      style={{
                        textAlign: 'left', cursor: 'pointer', outline: 'none',
                        padding: '22px 20px',
                        background: isActive ? sage : 'white',
                        border: `1px solid ${isActive ? sage : sageBorder}`,
                        borderRadius: 12,
                        boxShadow: isActive ? '0 6px 28px rgba(77,107,79,0.22)' : 'none',
                        transition: 'all 0.28s',
                      }}>
                      <div style={{
                        fontFamily: "'Fraunces', serif", fontWeight: 800,
                        fontSize: 'clamp(18px,2vw,26px)',
                        color: isActive ? 'white' : sageDark,
                        lineHeight: 1, marginBottom: 8,
                      }}>{t.amount}</div>
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: isActive ? 'rgba(255,255,255,0.7)' : sageMid,
                        marginBottom: 10,
                      }}>{t.label}</div>
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                        color: isActive ? 'rgba(255,255,255,0.65)' : 'rgba(32,35,34,0.5)',
                        lineHeight: 1.55,
                      }}>{t.impact}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </Reveal>

          {/* Two-column lower: area selector + form */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,64px)', alignItems: 'start' }} className="give-grid">

            {/* Left: Ministry areas */}
            <Reveal>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: sageMid, marginBottom: 16 }}>Direct your gift toward</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {GIVING_AREAS.map((g) => {
                  const isActive = activeArea === g.title
                  return (
                    <button key={g.title} onClick={() => setActiveArea(g.title)}
                      style={{
                        textAlign: 'left', cursor: 'pointer', outline: 'none',
                        padding: '14px 18px',
                        background: isActive ? 'white' : 'transparent',
                        border: `1px solid ${isActive ? sageBorder : 'transparent'}`,
                        borderLeft: `3px solid ${isActive ? sage : 'transparent'}`,
                        borderRadius: 12,
                        boxShadow: isActive ? '0 2px 16px rgba(77,107,79,0.12)' : 'none',
                        transition: 'all 0.22s',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                      }}>
                      <div>
                        <div style={{
                          fontFamily: "'Fraunces', serif", fontWeight: 700,
                          fontSize: 16, color: isActive ? sageDark : 'var(--muted)',
                          marginBottom: isActive ? 4 : 0, transition: 'color 0.22s',
                        }}>{g.title}</div>
                        <AnimatePresence>
                          {isActive && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: E }}
                              style={{ overflow: 'hidden' }}>
                              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: sageMid, lineHeight: 1.6 }}>{g.desc}</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {isActive && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                          <circle cx="7" cy="7" r="6" fill={sage} />
                          <path d="M4 7.5l2 2 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            </Reveal>

            {/* Right: Donation form */}
            <Reveal delay={0.15}>
              <div style={{ background: 'white', border: `1px solid ${sageBorder}`, borderRadius: 16, padding: 'clamp(24px,3.5vw,44px)', position: 'sticky', top: 120 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                  <div style={{ width: 36, height: 36, background: sageBg, border: `1px solid ${sageBorder}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2C5.8 2 4 3.8 4 6c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z" fill={sage} opacity=".85"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 19, color: sageDark, lineHeight: 1 }}>Give to {activeArea}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: sageMid, marginTop: 3 }}>{activeTier} · {DONATION_TIERS.find(t => t.label === activeTier)?.amount}</div>
                  </div>
                </div>

                {sent ? (
                  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    style={{ padding: '28px 24px', background: sageBg, border: `1px solid ${sageBorder}`, borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ width: 44, height: 44, background: sage, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10l5 5 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 20, color: sageDark, marginBottom: 8 }}>Gift received — thank you.</div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: sageMid, margin: 0, lineHeight: 1.7 }}>The Mispha team will be in touch shortly with giving details.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={async e => { 
                    e.preventDefault(); 
                    await apiFetch('/api/forms/donation', {
                      method: 'POST',
                      body: JSON.stringify({ ...form, area: activeArea, tier: activeTier })
                    });
                    setSent(true); 
                  }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <input className="field" placeholder="Your name" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} required
                      style={{ borderColor: sageBorder, outline: 'none' }}
                    />
                    <input className="field" placeholder="Phone number" value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      style={{ borderColor: sageBorder }}
                    />
                    <input className="field" type="email" placeholder="Email address" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      style={{ borderColor: sageBorder }}
                    />

                    {/* Summary pill */}
                    <div style={{ padding: '12px 16px', background: sageBg, border: `1px solid ${sageBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: sageMid, marginBottom: 3 }}>Your giving summary</div>
                        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 15, color: sageDark }}>{activeArea} · {activeTier}</div>
                      </div>
                      <button type="button" onClick={() => setActiveTier('')}
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: sageMid, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                        Change
                      </button>
                    </div>

                    <button type="submit" style={{
                      marginTop: 8,
                      padding: '15px 28px',
                      background: sage,
                      border: 'none',
                      color: 'white',
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: 15.5,
                      letterSpacing: '0.04em',
                      cursor: 'pointer',
                      transition: 'background 0.22s',
                    }}>
                      Submit My Gift Interest →
                    </button>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(77,107,79,0.55)', lineHeight: 1.6, margin: 0, textAlign: 'center' }}>
                      This form connects you with the ministry team who will share bank and UPI details directly.
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){.tier-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:640px){.tier-grid{grid-template-columns:1fr!important}.give-grid{grid-template-columns:1fr!important}.give-banner-grid{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  )
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────

type FormTab = 'prayer' | 'counselling' | 'contact'
const FORM_TABS: { id: FormTab; label: string }[] = [
  { id: 'prayer',     label: 'Prayer Request'    },
  { id: 'counselling', label: 'Counselling Request' },
  { id: 'contact',    label: 'General Contact'   },
]

function Contact() {
  const [tab, setTab] = useState<FormTab>('prayer')
  const [sent, setSent] = useState<FormTab | null>(null)
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(tab) }

  return (
    <section id="contact" style={{ padding: 'clamp(80px,10vw,160px) clamp(24px,6vw,96px)', background: '#F4F0E8' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 'clamp(40px,6vw,96px)' }} className="contact-grid">
          <div>
            <Reveal>
              <span className="label" style={{ marginBottom: 16, display: 'block' }}>Contact, Prayer &amp; Counselling</span>
              <div style={{ width: 28, height: 1, background: 'var(--brick)', marginBottom: 20 }} />
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 'clamp(28px,4vw,48px)', color: 'var(--ink)', lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.02em' }}>
                We are here to<br /><em style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontWeight: 400, color: 'var(--burgundy)' }}>pray and listen</em>
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: 'var(--muted)', lineHeight: 1.85, marginBottom: 36 }}>
                All prayer requests and counselling enquiries are treated with complete confidentiality. Nothing is published publicly without your permission.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Phone', val: '+91 98849 70978', large: true, italic: false, href: 'tel:+919884970978' },
                  { label: 'Email', val: 'Email address will be published here', large: false, italic: true },
                  { label: 'Ministry Address', val: 'Address will be published here', large: false, italic: true },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '18px 22px', background: 'white', border: '1px solid var(--border)', borderRadius: 12 }}>
                    <div className="label" style={{ marginBottom: 8, color: 'var(--muted)' }}>{item.label}</div>
                    {item.href ? (
                      <a href={item.href} style={{
                        fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 22,
                        color: 'var(--ink)', textDecoration: 'none', display: 'block',
                      }}>{item.val}</a>
                    ) : (
                      <div style={{
                        fontFamily: item.large ? "'Fraunces', serif" : "'DM Sans', sans-serif",
                        fontWeight: item.large ? 700 : 400,
                        fontSize: item.large ? 20 : 15,
                        color: item.italic ? 'var(--muted)' : 'var(--ink)',
                        fontStyle: item.italic ? 'italic' : 'normal',
                      }}>{item.val}</div>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div>
              <div style={{ display: 'flex', gap: 0, marginBottom: 32, borderBottom: '1px solid var(--border)' }}>
                {FORM_TABS.map(t => (
                  <button key={t.id} onClick={() => { setTab(t.id); setSent(null) }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: '12px 18px',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase',
                      color: tab === t.id ? 'var(--ink)' : 'var(--muted)',
                      borderBottom: `2px solid ${tab === t.id ? 'var(--brick)' : 'transparent'}`,
                      marginBottom: -1, transition: 'all 0.25s',
                    }}>{t.label}</button>
                ))}
              </div>
              {sent === tab ? (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  style={{ padding: '32px', background: 'white', border: '1px solid var(--border)', textAlign: 'center', borderRadius: 16 }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 22, color: 'var(--ink)', marginBottom: 12 }}>Received</div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: 'var(--muted)', lineHeight: 1.75 }}>
                    {tab === 'prayer' ? 'Your prayer request has been received. It will be held in confidence and brought before the ministry in prayer.'
                      : tab === 'counselling' ? 'Your counselling request has been received. The ministry will contact you to arrange a confidential conversation.'
                        : 'Your message has been received. The ministry will respond as soon as possible.'}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={async e => { 
                  e.preventDefault(); 
                  const fd = new FormData(e.currentTarget as HTMLFormElement);
                  if (tab === 'prayer') {
                    await apiFetch('/api/forms/prayer', { method: 'POST', body: JSON.stringify({ name: fd.get('name'), contact: fd.get('contact'), category: fd.get('category'), request: fd.get('request'), consent: !!fd.get('consent') }) });
                  } else if (tab === 'counselling') {
                    await apiFetch('/api/forms/counselling', { method: 'POST', body: JSON.stringify({ name: fd.get('name'), phone: fd.get('phone'), email: fd.get('email'), type: fd.get('type'), language: fd.get('language'), description: fd.get('desc') }) });
                  } else {
                    await apiFetch('/api/forms/contact', { method: 'POST', body: JSON.stringify({ name: fd.get('name'), phone: fd.get('phone'), email: fd.get('email'), reason: fd.get('reason'), message: fd.get('message') }) });
                  }
                  setSent(tab); 
                }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {tab === 'prayer' && (<>
                    <input name="name" className="field" placeholder="Name (optional)" />
                    <input name="contact" className="field" placeholder="Phone or email (optional)" />
                    <select name="category" className="field">
                      <option value="">Prayer category</option>
                      <option>Health</option><option>Family</option><option>Salvation</option>
                      <option>Work and provision</option><option>Ministry and calling</option><option>Other</option>
                    </select>
                    <textarea name="request" className="field" rows={5} placeholder="Your prayer request" required style={{ resize: 'vertical' }} />
                    <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'var(--muted)', lineHeight: 1.6, cursor: 'pointer' }}>
                      <input name="consent" type="checkbox" style={{ marginTop: 3, flexShrink: 0, accentColor: 'var(--brick)' }} />
                      I consent to the ministry holding this request privately for prayer purposes.
                    </label>
                  </>)}
                  {tab === 'counselling' && (<>
                    <input name="name" className="field" placeholder="Full name" required />
                    <input name="phone" className="field" placeholder="Phone number" required />
                    <input name="email" className="field" type="email" placeholder="Email address (optional)" />
                    <select name="type" className="field">
                      <option value="">Individual, couple or family</option>
                      <option>Individual</option><option>Couple</option><option>Family</option>
                    </select>
                    <input name="language" className="field" placeholder="Preferred language" />
                    <textarea name="desc" className="field" rows={3} placeholder="Brief description (general topics only)" style={{ resize: 'vertical' }} />
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.6 }}>All enquiries are treated with complete confidentiality. For immediate crisis support, please contact your local emergency services.</p>
                  </>)}
                  {tab === 'contact' && (<>
                    <input name="name" className="field" placeholder="Name" required />
                    <input name="phone" className="field" placeholder="Phone number" />
                    <input name="email" className="field" type="email" placeholder="Email address" />
                    <select name="reason" className="field">
                      <option value="">Reason for contact</option>
                      <option>General enquiry</option><option>Training programme</option>
                      <option>Partnership</option><option>Media team</option>
                      <option>Volunteer opportunities</option><option>Other</option>
                    </select>
                    <textarea name="message" className="field" rows={4} placeholder="Your message" style={{ resize: 'vertical' }} />
                  </>)}
                  <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
                    {tab === 'prayer' ? 'Submit Prayer Request' : tab === 'counselling' ? 'Send Counselling Request' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`@media(max-width:768px){.contact-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}

// ─── FINAL CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section style={{ padding: 'clamp(80px,10vw,140px) clamp(24px,6vw,96px)', background: '#202322', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(181,101,74,0.07)', transform: 'translateX(-50%)' }} />
      <div style={{ position: 'absolute', top: '50%', left: '8%', right: '8%', height: 1, background: 'rgba(181,101,74,0.05)', transform: 'translateY(-50%)' }} />
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <span className="label" style={{ color: 'rgba(200,168,130,0.6)', marginBottom: 32, display: 'inline-block' }}>Join the Mission</span>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 'clamp(34px,5.5vw,68px)', color: '#F4F0E8', lineHeight: 1.05, marginBottom: 28, letterSpacing: '-0.02em' }}>
            Every vision needs people<br />willing to{' '}
            <em style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontWeight: 400, color: 'var(--brick)' }}>pray, serve and build</em>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, color: 'rgba(244,240,232,0.45)', lineHeight: 1.85, maxWidth: 520, margin: '0 auto 52px' }}>
            There is a place for you in the Mispha Ministries family, whether you come to pray, to partner, to serve or to learn.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 44 }}>
            <button className="btn btn-brass" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Pray With Us</button>
            <button className="btn btn-outline btn-outline-light" onClick={() => document.getElementById('give')?.scrollIntoView({ behavior: 'smooth' })}>Partner With Us</button>
            <button className="btn btn-outline btn-outline-light" onClick={() => document.getElementById('vision')?.scrollIntoView({ behavior: 'smooth' })}>Support a Project</button>
            <button className="btn btn-outline btn-outline-light" onClick={() => document.getElementById('training')?.scrollIntoView({ behavior: 'smooth' })}>Apply for Training</button>
          </div>
          <a href="tel:+919884970978"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 'clamp(20px,3vw,32px)', color: '#F4F0E8', letterSpacing: '0.04em', textDecoration: 'none', display: 'inline-block' }}>
            +91 98849 70978
          </a>
        </Reveal>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const ls: React.CSSProperties = {
    display: 'block', background: 'none', border: 'none', cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif", fontSize: 16,
    color: 'rgba(244,240,232,0.38)', marginBottom: 12,
    textAlign: 'left', padding: 0, transition: 'color 0.25s', lineHeight: 1.5,
  }
  return (
    <footer style={{ background: '#171918', borderTop: '1px solid rgba(244,240,232,0.05)' }}>
      <div style={{ maxWidth: 1380, margin: '0 auto', padding: 'clamp(64px,8vw,100px) clamp(24px,6vw,96px) 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 'clamp(32px,4vw,64px)', marginBottom: 64 }} className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <img src={img157} alt="Mispha logo" style={{ width: 38, height: 38, objectFit: 'contain', mixBlendMode: 'lighten' }} />
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 800, fontSize: 16, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F4F0E8', lineHeight: 1 }}>Mispha Ministries</div>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontSize: 17, color: 'rgba(181,101,74,0.5)', lineHeight: 1.85, maxWidth: 260, marginBottom: 22 }}>
              Prayer is the key for vision.<br />Vision is the key for heaven.<br />Heaven is the key for prayer.
            </p>
            <a href="tel:+919884970978"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 18, color: '#F4F0E8', textDecoration: 'none', display: 'inline-block' }}>
              +91 98849 70978
            </a>
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 12.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(200,168,130,0.55)', marginBottom: 20 }}>Ministry</div>
            {[{ label: 'Our Calling', id: 'calling' }, { label: 'Church Strengthening', id: 'training' }, { label: 'Leadership Network', id: 'leadership' }, { label: 'Annual Covenant', id: 'covenant' }].map(l => (
              <button key={l.id} onClick={() => go(l.id)} style={ls}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(244,240,232,0.82)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(244,240,232,0.38)')}>{l.label}</button>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 12.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(200,168,130,0.55)', marginBottom: 20 }}>Projects &amp; Media</div>
            {[{ label: 'Vision Projects', id: 'vision' }, { label: 'From the Pulpit', id: 'pulpit' }, { label: 'Board Members', id: 'leadership-board' }, { label: 'Gallery', id: 'gallery' }].map(l => (
              <button key={l.id} onClick={() => go(l.id)} style={ls}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(244,240,232,0.82)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(244,240,232,0.38)')}>{l.label}</button>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 12.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(200,168,130,0.55)', marginBottom: 20 }}>Connect</div>
            {[{ label: 'Give & Partner', id: 'give' }, { label: 'Request Prayer', id: 'contact' }, { label: 'Counselling', id: 'contact' }, { label: 'General Contact', id: 'contact' }].map((l, i) => (
              <button key={`${l.id}-${i}`} onClick={() => go(l.id)} style={ls}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(244,240,232,0.82)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(244,240,232,0.38)')}>{l.label}</button>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(181,101,74,0.08)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={img157} alt="" style={{ width: 18, height: 18, objectFit: 'contain', mixBlendMode: 'lighten', opacity: 0.3 }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(244,240,232,0.2)' }}>Mispha Ministries. Registered organisation details will be published here.</span>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Donation Policy', 'Terms'].map(l => (
              <span key={l} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(244,240,232,0.16)' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){.footer-grid{grid-template-columns:1fr 1fr!important}}
        @media(max-width:480px){.footer-grid{grid-template-columns:1fr!important}}
      `}</style>
    </footer>
  )
}

// ─── SCROLL PROGRESS ──────────────────────────────────────────────────────────

function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const h = () => {
      const el = document.documentElement
      setPct(el.scrollTop / (el.scrollHeight - el.clientHeight) * 100)
    }
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, zIndex: 9999,
      height: 2, width: `${pct}%`,
      background: 'linear-gradient(to right, var(--brick), var(--sage))',
      transition: 'width 0.1s linear', pointerEvents: 'none',
    }} />
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const handleDone = useCallback(() => setLoaded(true), [])

  return (
    <>
      <style>{`
        /* Overall typography & form styles */
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        input,
        textarea,
        select {
          font-size: 15px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        footer button,
        footer a,
        footer span {
          font-size: 14px;
          line-height: 1.6;
        }
      `}</style>

      <Loader onDone={handleDone} />

      {loaded && (
        <>
          <ScrollProgress />
          <Navbar loaded={loaded} />
          <Hero />
          <MovingBand />
          <OurCalling />
          <StrengtheningChurch />
          <LeadershipNetwork />
          <AnnualCovenant />
          <VisionProjects />
          <FromThePulpit />
          <BoardMembers />
          <GallerySection />
          <GivePartner />
          <Contact />
          <FinalCTA />
          <Footer />
        </>
      )}
    </>
  )
}
