import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="cyber-navbar d-flex align-items-center justify-content-between">
      {/* Left: Toggle + Brand */}
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-sm text-white border-0"
          onClick={onToggleSidebar}
          style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, width: 36, height: 36 }}
        >
          <i className="bi bi-list fs-5" />
        </button>
        <Link to="/dashboard" className="text-decoration-none d-flex align-items-center gap-2 me-3">
          <span className="fw-bold font-orbitron text-white" style={{ fontSize: '0.9rem' }}>
            CYBER<span className="text-cyber-highlight">AWARE</span>
          </span>
        </Link>

        {/* Quick Nav Links for Medium+ screens */}
        <div className="d-none d-lg-flex align-items-center gap-3 ms-2">
          <Link to="/learning" className="text-cyber-muted text-decoration-none hover-lift" style={{ fontSize: '0.85rem' }}>
            📚 Learning Hub
          </Link>
          <Link to="/tips" className="text-cyber-muted text-decoration-none hover-lift" style={{ fontSize: '0.85rem' }}>
            💡 Cyber Tips
          </Link>
          <Link to="/password-checker" className="text-cyber-muted text-decoration-none hover-lift" style={{ fontSize: '0.85rem' }}>
            🔑 Password Checker
          </Link>
          <Link to="/data-protection" className="text-cyber-muted text-decoration-none hover-lift" style={{ fontSize: '0.85rem' }}>
            🛡️ Data Protection
          </Link>
          <Link to="/quizzes" className="text-cyber-muted text-decoration-none hover-lift" style={{ fontSize: '0.85rem' }}>
            📝 Quizzes
          </Link>
          <Link to="/leaderboard" className="text-cyber-muted text-decoration-none hover-lift" style={{ fontSize: '0.85rem' }}>
            🏆 Leaderboard
          </Link>
        </div>
      </div>

      {/* Right: User menu */}
      {user && (
        <div className="d-flex align-items-center gap-3">
          {/* Points Badge */}
          <div className="d-none d-sm-flex align-items-center gap-1 px-3 py-1 rounded-pill"
            style={{ background: 'rgba(233,69,96,0.12)', border: '1px solid rgba(233,69,96,0.3)' }}>
            <span style={{ fontSize: '0.8rem' }}>⚡</span>
            <span className="text-cyber-highlight fw-bold" style={{ fontSize: '0.85rem' }}>{user.points || 0} pts</span>
          </div>

          {/* User Dropdown */}
          <div className="position-relative">
            <button
              className="d-flex align-items-center gap-2 btn border-0 px-2"
              style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}
              onClick={() => setShowDropdown(p => !p)}
            >
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg,#e94560,#0f3460)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.85rem', color: 'white',
              }}>
                {(user.first_name?.[0] || user.username?.[0] || '?').toUpperCase()}
              </div>
              <span className="d-none d-sm-block text-white" style={{ fontSize: '0.85rem' }}>
                {user.first_name || user.username}
              </span>
              <i className="bi bi-chevron-down text-cyber-muted" style={{ fontSize: '0.75rem' }} />
            </button>

            {showDropdown && (
              <div className="position-absolute end-0 mt-1 py-1 rounded-3 shadow-lg"
                style={{
                  width: 220, background: 'rgba(22,33,62,0.98)',
                  border: '1px solid var(--cyber-border)', zIndex: 1050, top: '100%',
                }}>
                <div className="px-3 py-2 border-bottom" style={{ borderColor: 'var(--cyber-border) !important' }}>
                  <div className="text-white fw-semibold" style={{ fontSize: '0.85rem' }}>{user.username}</div>
                  <div className="text-cyber-muted" style={{ fontSize: '0.75rem' }}>{user.email}</div>
                </div>
                <Link to="/profile" className="d-flex align-items-center gap-2 px-3 py-2 text-cyber-muted text-decoration-none"
                  style={{ fontSize: '0.875rem' }}
                  onClick={() => setShowDropdown(false)}>
                  <i className="bi bi-person" /> Profile
                </Link>
                <Link to="/dashboard" className="d-flex align-items-center gap-2 px-3 py-2 text-cyber-muted text-decoration-none"
                  style={{ fontSize: '0.875rem' }}
                  onClick={() => setShowDropdown(false)}>
                  <i className="bi bi-grid" /> User Dashboard
                </Link>
                <Link to="/admin-dashboard" className="d-flex align-items-center gap-2 px-3 py-2 text-cyber-highlight text-decoration-none"
                  style={{ fontSize: '0.875rem', fontWeight: 600 }}
                  onClick={() => setShowDropdown(false)}>
                  <i className="bi bi-gear-fill" /> Admin Dashboard
                </Link>
                <a href="http://localhost:8000/admin/" target="_blank" rel="noreferrer"
                  className="d-flex align-items-center gap-2 px-3 py-2 text-cyber-warning text-decoration-none"
                  style={{ fontSize: '0.875rem' }}
                  onClick={() => setShowDropdown(false)}>
                  <i className="bi bi-shield-lock" /> Django Admin Panel ↗
                </a>
                <div className="border-top my-1" style={{ borderColor: 'var(--cyber-border) !important' }} />
                <button className="d-flex align-items-center gap-2 px-3 py-2 w-100 border-0 text-start text-cyber-highlight"
                  style={{ background: 'none', fontSize: '0.875rem', cursor: 'pointer' }}
                  onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
