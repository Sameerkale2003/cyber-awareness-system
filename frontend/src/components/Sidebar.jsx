import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/dashboard',        icon: 'bi-grid-fill',           label: 'Dashboard' },
  { to: '/learning',         icon: 'bi-book-fill',           label: 'Learning Hub' },
  { to: '/quizzes',          icon: 'bi-question-circle-fill',label: 'Quizzes' },
  { to: '/tips',             icon: 'bi-lightbulb-fill',      label: 'Cyber Tips' },
  { to: '/password-checker', icon: 'bi-key-fill',            label: 'Password Checker' },
  { to: '/data-protection',  icon: 'bi-shield-lock-fill',    label: 'Data Protection' },
  { to: '/pledge',           icon: 'bi-shield-fill-check',   label: 'Safety Pledge' },
  { to: '/leaderboard',      icon: 'bi-trophy-fill',         label: 'Leaderboard' },
  { to: '/profile',          icon: 'bi-person-fill',         label: 'My Profile' },
  { to: '/admin-dashboard',  icon: 'bi-gear-fill',           label: 'Admin Dashboard' },
]

export default function Sidebar({ collapsed, onToggle }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo d-flex align-items-center gap-3">
        <div style={{
          width: 40, height: 40,
          background: 'linear-gradient(135deg,#e94560,#c0392b)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem', flexShrink: 0,
        }}>🛡️</div>
        <div>
          <div className="fw-bold text-white font-orbitron" style={{ fontSize: '0.85rem', lineHeight: 1.2 }}>
            CYBER<span className="text-cyber-highlight">AWARE</span>
          </div>
          <div className="text-cyber-muted" style={{ fontSize: '0.7rem' }}>Security Platform</div>
        </div>
      </div>

      {/* User mini-card */}
      {user && (
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--cyber-border)' }}>
          <div className="d-flex align-items-center gap-2">
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg,#e94560,#0f3460)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
            }}>
              {(user.first_name?.[0] || user.username?.[0] || '?').toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div className="text-white fw-semibold text-truncate" style={{ fontSize: '0.85rem' }}>
                {user.first_name || user.username}
              </div>
              <div className="text-cyber-highlight" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                ⚡ {user.points || 0} pts
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="sidebar-nav">
        <div className="sidebar-section-title">Navigation</div>
        {navItems.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            `sidebar-nav-item ${isActive ? 'active' : ''}`
          }>
            <i className={`bi ${icon}`} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
