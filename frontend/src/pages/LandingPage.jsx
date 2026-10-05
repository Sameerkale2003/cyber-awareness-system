import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: '🎓', title: 'Interactive Modules',   desc: '8+ learning modules covering password security, phishing, data protection & more.' },
  { icon: '📝', title: 'Knowledge Quizzes',     desc: 'Test your skills with timed quizzes and get instant feedback with explanations.' },
  { icon: '💡', title: 'Cyber Safety Tips',     desc: '17+ actionable tips sourced from real security best practices.' },
  { icon: '🏆', title: 'Leaderboard & Points',  desc: 'Earn points, unlock badges, and compete on the global leaderboard.' },
  { icon: '📊', title: 'Progress Tracking',     desc: 'Visual dashboard showing your completion rate across all categories.' },
  { icon: '🤝', title: 'Safety Pledge',         desc: 'Join thousands who pledged to practice safe digital habits every day.' },
]

const categories = [
  { icon: '🔑', name: 'Password Security',        color: '#e74c3c' },
  { icon: '🛡️', name: 'Personal Data Protection', color: '#3498db' },
  { icon: '💡', name: 'Cyber Safety',             color: '#2ecc71' },
  { icon: '🎣', name: 'Phishing Awareness',       color: '#f39c12' },
  { icon: '📱', name: 'Social Media Safety',      color: '#9b59b6' },
  { icon: '🌐', name: 'Network Security',         color: '#1abc9c' },
]

const tips = [
  { icon: '✅', title: 'Use Strong Passwords',       desc: 'Combine uppercase, lowercase, numbers & special characters.' },
  { icon: '❌', title: 'Avoid Common Passwords',     desc: 'Never use 123456, password, your name or birthday.' },
  { icon: '🔄', title: 'Change Compromised Passwords', desc: 'If exposed or stolen, change it immediately.' },
  { icon: '🛡️', title: 'Never Share OTPs',           desc: 'Legitimate organisations never ask for your OTP.' },
  { icon: '🔗', title: 'Check Website Links',        desc: 'Always verify HTTPS and the correct domain before entering data.' },
  { icon: '🔑', title: 'Enable 2FA',                 desc: 'Two-factor authentication stops attackers even with your password.' },
]

function Counter({ target, label }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(target / 60)
    const t = setInterval(() => {
      start += step
      if (start >= target) { setValue(target); clearInterval(t) }
      else setValue(start)
    }, 24)
    return () => clearInterval(t)
  }, [target])
  return (
    <div className="text-center">
      <div className="font-orbitron text-cyber-highlight" style={{ fontSize: '2rem', fontWeight: 900 }}>
        {value.toLocaleString()}+
      </div>
      <div className="text-cyber-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  return (
    <div className="cyber-grid-bg" style={{ minHeight: '100vh', color: 'var(--cyber-text)' }}>

      {/* ── Navbar ── */}
      <nav className="d-flex align-items-center justify-content-between px-4 py-3"
        style={{ background: 'rgba(16,20,40,0.95)', borderBottom: '1px solid var(--cyber-border)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="d-flex align-items-center gap-3">
          <Link to="/" className="text-decoration-none">
            <div className="font-orbitron text-white fw-bold" style={{ fontSize: '1.1rem' }}>
              CYBER<span className="text-cyber-highlight">AWARE</span>
            </div>
          </Link>
          <div className="d-none d-lg-flex align-items-center gap-3 ms-3">
            <Link to="/learning" className="text-cyber-muted text-decoration-none hover-lift" style={{ fontSize: '0.85rem' }}>📚 Learning Hub</Link>
            <Link to="/tips" className="text-cyber-muted text-decoration-none hover-lift" style={{ fontSize: '0.85rem' }}>💡 Cyber Tips</Link>
            <Link to="/quizzes" className="text-cyber-muted text-decoration-none hover-lift" style={{ fontSize: '0.85rem' }}>📝 Quizzes</Link>
            <Link to="/pledge" className="text-cyber-muted text-decoration-none hover-lift" style={{ fontSize: '0.85rem' }}>🤝 Safety Pledge</Link>
            <Link to="/leaderboard" className="text-cyber-muted text-decoration-none hover-lift" style={{ fontSize: '0.85rem' }}>🏆 Leaderboard</Link>
          </div>
        </div>
        <div className="d-flex gap-2">
          {user ? (
            <button className="btn-cyber px-3 py-1 rounded-3" style={{ fontSize: '0.875rem' }} onClick={() => navigate('/dashboard')}>
              📊 Go to Dashboard
            </button>
          ) : (
            <>
              <button className="btn-cyber-outline px-3 py-1 rounded-3" style={{ fontSize: '0.875rem' }} onClick={() => navigate('/login')}>Sign In</button>
              <button className="btn-cyber px-3 py-1 rounded-3" style={{ fontSize: '0.875rem' }} onClick={() => navigate('/register')}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero-section text-center px-3">
        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 30px rgba(233,69,96,0.5))' }}>🛡️</div>
          <h1 className="font-orbitron fw-bold" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}>
            Secure Your <span className="gradient-text">Digital World</span>
          </h1>
          <p className="text-cyber-muted mt-3 mb-4" style={{ fontSize: '1.1rem', maxWidth: 540, margin: '1rem auto 2rem' }}>
            Learn password hygiene, personal data protection, phishing awareness & more through
            interactive modules, quizzes, and gamified challenges.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button className="btn-cyber px-4 py-2 rounded-3" style={{ fontSize: '1rem' }} onClick={() => navigate(user ? '/learning' : '/register')}>
              🚀 Start Learning Now
            </button>
            <button className="btn-cyber-outline px-4 py-2 rounded-3" style={{ fontSize: '1rem' }} onClick={() => navigate(user ? '/tips' : '/login')}>
              💡 Explore Cyber Tips
            </button>
          </div>
          {/* Stats row */}
          <div className="row g-4 mt-5 mx-0 justify-content-center">
            <div className="col-6 col-sm-3" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}><Counter target={500} label="Users Protected" /></div>
            <div className="col-6 col-sm-3" style={{ cursor: 'pointer' }} onClick={() => navigate('/learning')}><Counter target={8} label="Modules" /></div>
            <div className="col-6 col-sm-3" style={{ cursor: 'pointer' }} onClick={() => navigate('/quizzes')}><Counter target={3} label="Quizzes" /></div>
            <div className="col-6 col-sm-3" style={{ cursor: 'pointer' }} onClick={() => navigate('/tips')}><Counter target={17} label="Cyber Tips" /></div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-5 px-4" style={{ background: 'rgba(22,33,62,0.5)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 className="font-orbitron text-white text-center mb-2" style={{ fontSize: '1.6rem' }}>
            Learning <span className="gradient-text">Categories</span>
          </h2>
          <p className="text-cyber-muted text-center mb-4" style={{ fontSize: '0.9rem' }}>
            Click any category to open the Learning Hub
          </p>
          <div className="row g-3">
            {categories.map(c => (
              <div key={c.name} className="col-6 col-md-4" style={{ cursor: 'pointer' }} onClick={() => navigate('/learning')}>
                <div className="glass-card p-3 text-center h-100 hover-lift" style={{ borderTop: `3px solid ${c.color}` }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>{c.icon}</div>
                  <div className="fw-semibold text-white" style={{ fontSize: '0.9rem' }}>{c.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cyber Tips Preview (from screenshots) ── */}
      <section className="py-5 px-4">
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 className="font-orbitron text-white text-center mb-2" style={{ fontSize: '1.6rem' }}>
            💡 Cyber Safety <span className="gradient-text">Tips</span>
          </h2>
          <p className="text-cyber-muted text-center mb-4" style={{ fontSize: '0.9rem' }}>
            Click to view all 17+ cyber safety tips
          </p>
          <div className="row g-3">
            {tips.map(t => (
              <div key={t.title} className="col-12 col-md-6" style={{ cursor: 'pointer' }} onClick={() => navigate('/tips')}>
                <div className="tip-card d-flex gap-3 align-items-start hover-lift">
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{t.icon}</span>
                  <div>
                    <div className="fw-semibold text-white mb-1" style={{ fontSize: '0.95rem' }}>{t.title}</div>
                    <div className="text-cyber-muted" style={{ fontSize: '0.83rem' }}>{t.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <button className="btn-cyber-outline px-4 py-2 rounded-3 fw-bold" onClick={() => navigate('/tips')}>
              💡 Open Full Cyber Tips Hub →
            </button>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-5 px-4" style={{ background: 'rgba(22,33,62,0.5)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 className="font-orbitron text-white text-center mb-2" style={{ fontSize: '1.6rem' }}>
            Platform <span className="gradient-text">Features</span>
          </h2>
          <p className="text-cyber-muted text-center mb-4" style={{ fontSize: '0.9rem' }}>
            Everything you need to become cyber-aware
          </p>
          <div className="row g-3">
            {features.map((f, i) => {
              const targets = ['/learning', '/quizzes', '/tips', '/leaderboard', '/dashboard', '/pledge']
              return (
                <div key={f.title} className="col-12 col-sm-6 col-lg-4" style={{ cursor: 'pointer' }} onClick={() => navigate(targets[i])}>
                  <div className="glass-card p-4 h-100 hover-lift">
                    <div style={{ fontSize: '2rem', marginBottom: 10 }}>{f.icon}</div>
                    <h5 className="text-white fw-bold mb-2" style={{ fontSize: '1rem' }}>{f.title}</h5>
                    <p className="text-cyber-muted mb-0" style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Campaign / Pledge (from screenshots) ── */}
      <section className="py-5 px-4 text-center">
        <div className="glass-card mx-auto p-5" style={{ maxWidth: 640 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🤝</div>
          <h2 className="font-orbitron text-white mb-3" style={{ fontSize: '1.5rem' }}>Our Campaign</h2>
          <p className="text-cyber-muted mb-4" style={{ fontSize: '0.95rem', lineHeight: 1.7 }}>
            Our campaign aims to spread awareness about password security and personal data protection.
            Small safety habits can help prevent cyber attacks and protect your digital identity.
          </p>
          <button className="btn-cyber px-4 py-2 rounded-3 fw-bold" style={{ fontSize: '1rem' }}
            onClick={() => navigate('/pledge')}>
            🛡️ Take the Safety Pledge
          </button>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-5 px-4 text-center" style={{
        background: 'linear-gradient(135deg, rgba(233,69,96,0.15), rgba(0,212,170,0.1))',
        borderTop: '1px solid var(--cyber-border)'
      }}>
        <h2 className="font-orbitron text-white mb-3" style={{ fontSize: '1.8rem' }}>
          Ready to <span className="gradient-text">Stay Secure?</span>
        </h2>
        <p className="text-cyber-muted mb-4">Join the cyber awareness movement. It's free.</p>
        <button className="btn-cyber px-5 py-2 rounded-3 fw-bold" style={{ fontSize: '1.05rem' }}
          onClick={() => navigate('/register')}>
          Create Free Account
        </button>
      </section>

      {/* ── Footer (matches screenshots) ── */}
      <footer className="py-4 text-center" style={{ background: 'var(--cyber-secondary)', borderTop: '1px solid var(--cyber-border)' }}>
        <div className="font-orbitron text-white mb-1" style={{ fontSize: '0.9rem' }}>
          🔒 Password Hygiene & Personal Data Protection Campaign
        </div>
        <div className="text-cyber-muted" style={{ fontSize: '0.8rem' }}>
          Think Before You Click • Protect Your Data • Stay Secure
        </div>
        <div className="text-cyber-muted mt-2" style={{ fontSize: '0.75rem' }}>
          © 2024 CyberAware System. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
