import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authService, progressService } from '../services'
import toast from 'react-hot-toast'

function PasswordStrengthMeter({ password }) {
  const checks = {
    length: password.length >= 8, upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password), number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password),
  }
  const score = Object.values(checks).filter(Boolean).length
  const colors = ['', '#e74c3c','#f39c12','#3498db','#2ecc71','#00d4aa']
  if (!password) return null
  return (
    <div className="mt-1">
      <div className="d-flex gap-1 mb-1">
        {[1,2,3,4,5].map(i => <div key={i} className="flex-fill rounded" style={{ height: 3, background: i <= score ? colors[score] : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />)}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, updateUser, refreshProfile } = useAuth()
  const [tab, setTab]           = useState('profile')
  const [form, setForm]         = useState({ first_name: '', last_name: '', bio: '' })
  const [pwdForm, setPwdForm]   = useState({ old_password: '', new_password: '', new_password2: '' })
  const [stats, setStats]       = useState(null)
  const [achievements, setAch]  = useState([])
  const [saving, setSaving]     = useState(false)

  useEffect(() => {
    if (user) setForm({ first_name: user.first_name || '', last_name: user.last_name || '', bio: user.bio || '' })
    authService.getStats().then(r => setStats(r.data)).catch(() => {})
    progressService.getAchievements().then(r => setAch(r.data)).catch(() => {})
  }, [user?.id])

  const handleProfileSave = async e => {
    e.preventDefault(); setSaving(true)
    try {
      const r = await authService.updateProfile(form)
      updateUser(r.data.user)
      toast.success('✅ Profile updated!')
    } catch { toast.error('Failed to update profile') }
    finally { setSaving(false) }
  }

  const handlePasswordChange = async e => {
    e.preventDefault(); setSaving(true)
    try {
      await authService.changePassword(pwdForm)
      toast.success('🔐 Password changed!')
      setPwdForm({ old_password: '', new_password: '', new_password2: '' })
    } catch (err) {
      const msg = Object.values(err.response?.data || {}).flat()[0] || 'Failed'
      toast.error(msg)
    } finally { setSaving(false) }
  }

  const tabs = [
    { id: 'profile', label: 'Profile',      icon: 'bi-person' },
    { id: 'stats',   label: 'Stats',         icon: 'bi-bar-chart' },
    { id: 'badges',  label: 'Achievements',  icon: 'bi-trophy' },
    { id: 'security',label: 'Security',      icon: 'bi-shield-lock' },
  ]

  return (
    <div className="fade-in-up">
      <div className="mb-4">
        <h1 className="section-title">👤 My Profile</h1>
        <p className="section-subtitle">Manage your account and view your progress</p>
      </div>

      {/* Avatar Card */}
      <div className="glass-card p-4 mb-4 d-flex align-items-center gap-4 flex-wrap">
        <div style={{
          width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,#e94560,#0f3460)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', fontWeight: 700, color: 'white',
          boxShadow: 'var(--glow-red)',
        }}>
          {(user?.first_name?.[0] || user?.username?.[0] || '?').toUpperCase()}
        </div>
        <div>
          <h2 className="text-white fw-bold mb-0" style={{ fontSize: '1.4rem' }}>
            {user?.full_name || user?.username}
          </h2>
          <div className="text-cyber-muted mb-1">@{user?.username} · {user?.email}</div>
          <div className="d-flex gap-3 flex-wrap" style={{ fontSize: '0.82rem' }}>
            <span className="text-cyber-warning">⚡ {user?.points || 0} pts</span>
            <span className="text-cyber-success">🏆 {user?.badges?.length || 0} badges</span>
            <span className="cyber-badge badge-beginner">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-1 mb-4 flex-wrap">
        {tabs.map(t => (
          <button key={t.id}
            className={`border-0 px-3 py-2 rounded-3 ${tab === t.id ? 'text-white' : 'text-cyber-muted'}`}
            style={{
              background: tab === t.id ? 'rgba(233,69,96,0.2)' : 'rgba(255,255,255,0.04)',
              border: tab === t.id ? '1px solid rgba(233,69,96,0.4)' : '1px solid var(--cyber-border)',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: tab === t.id ? 600 : 400, transition: 'all 0.2s',
            }}
            onClick={() => setTab(t.id)}>
            <i className={`bi ${t.icon} me-2`} />{t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="glass-card p-4" style={{ maxWidth: 540 }}>
          <h5 className="text-white fw-bold mb-4">Edit Profile</h5>
          <form onSubmit={handleProfileSave}>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="cyber-label">First Name</label>
                <input className="form-control cyber-input" value={form.first_name}
                  onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))} />
              </div>
              <div className="col-6">
                <label className="cyber-label">Last Name</label>
                <input className="form-control cyber-input" value={form.last_name}
                  onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))} />
              </div>
            </div>
            <div className="mb-3">
              <label className="cyber-label">Username</label>
              <input className="form-control cyber-input" value={user?.username || ''} disabled style={{ opacity: 0.5 }} />
            </div>
            <div className="mb-4">
              <label className="cyber-label">Bio</label>
              <textarea rows={3} className="form-control cyber-input" value={form.bio}
                placeholder="Tell us about yourself..."
                onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} />
            </div>
            <button type="submit" disabled={saving} className="btn-cyber px-4 py-2 rounded-3 fw-bold">
              {saving ? <span className="spinner-border spinner-border-sm" /> : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Stats Tab */}
      {tab === 'stats' && stats && (
        <div className="row g-3">
          {[
            { icon: '⚡', label: 'Total Points',     value: stats.points,           color: '#ffd700' },
            { icon: '📚', label: 'Modules Completed', value: stats.modules_completed, color: '#00d4aa' },
            { icon: '📝', label: 'Quizzes Taken',    value: stats.quizzes_taken,    color: '#4fc3f7' },
            { icon: '🎯', label: 'Average Score',    value: `${stats.average_score}%`, color: '#e94560' },
            { icon: '🔥', label: 'Current Streak',   value: `${stats.current_streak} days`, color: '#f39c12' },
            { icon: '🏆', label: 'Global Rank',      value: `#${stats.rank}`,       color: '#9b59b6' },
          ].map(s => (
            <div key={s.label} className="col-6 col-md-4">
              <div className="stat-card" style={{ '--accent-color': s.color }}>
                <div className="stat-icon" style={{ background: `${s.color}18` }}>{s.icon}</div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Badges Tab */}
      {tab === 'badges' && (
        <div className="row g-3">
          {achievements.map(ach => (
            <div key={ach.id} className="col-6 col-md-4 col-lg-3">
              <div className={`glass-card p-3 text-center ${!ach.earned ? 'opacity-40' : ''}`}
                style={{ borderColor: ach.earned ? ach.badge_color : 'var(--cyber-border)', filter: ach.earned ? 'none' : 'grayscale(80%)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 6, filter: ach.earned ? `drop-shadow(0 0 10px ${ach.badge_color})` : 'none' }}>
                  {ach.icon}
                </div>
                <div className="fw-bold text-white mb-1" style={{ fontSize: '0.85rem' }}>{ach.name}</div>
                <div className="text-cyber-muted mb-2" style={{ fontSize: '0.72rem', lineHeight: 1.4 }}>{ach.description}</div>
                {ach.earned ? (
                  <span className="cyber-badge badge-beginner">Earned ✅</span>
                ) : (
                  <div>
                    <div className="cyber-progress mb-1">
                      <div className="cyber-progress-bar" style={{ width: `${ach.progress}%` }} />
                    </div>
                    <div className="text-cyber-muted" style={{ fontSize: '0.7rem' }}>{ach.progress}% — {ach.points_required} pts required</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Security Tab */}
      {tab === 'security' && (
        <div className="glass-card p-4" style={{ maxWidth: 480 }}>
          <h5 className="text-white fw-bold mb-4">🔐 Change Password</h5>
          <form onSubmit={handlePasswordChange}>
            {[
              { name: 'old_password',  label: 'Current Password', placeholder: 'Enter current password' },
              { name: 'new_password',  label: 'New Password',     placeholder: 'Enter new password' },
              { name: 'new_password2', label: 'Confirm New',      placeholder: 'Repeat new password' },
            ].map(f => (
              <div key={f.name} className="mb-3">
                <label className="cyber-label">{f.label}</label>
                <input type="password" className="form-control cyber-input"
                  value={pwdForm[f.name]} placeholder={f.placeholder}
                  onChange={e => setPwdForm(p => ({ ...p, [f.name]: e.target.value }))} />
                {f.name === 'new_password' && <PasswordStrengthMeter password={pwdForm.new_password} />}
              </div>
            ))}
            <button type="submit" disabled={saving} className="btn-cyber px-4 py-2 rounded-3 fw-bold">
              {saving ? <span className="spinner-border spinner-border-sm" /> : 'Change Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
