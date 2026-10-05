import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { progressService } from '../services'

// ── Reusable Stat Card ──────────────────────────────────────
function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className="stat-card" style={{ '--accent-color': color }}>
      <div className="stat-icon" style={{ background: `${color}18` }}>
        <span>{icon}</span>
      </div>
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="text-cyber-muted mt-1" style={{ fontSize: '0.75rem' }}>{sub}</div>}
    </div>
  )
}

// ── Activity type icons ─────────────────────────────────────
const activityMeta = {
  module_viewed:    { icon: '👁️',  color: 'rgba(79,195,247,0.15)', label: 'Viewed' },
  module_completed: { icon: '✅',  color: 'rgba(0,212,170,0.15)',   label: 'Completed' },
  quiz_taken:       { icon: '📝',  color: 'rgba(255,215,0,0.15)',   label: 'Quiz' },
  tip_read:         { icon: '💡',  color: 'rgba(233,69,96,0.15)',   label: 'Tip' },
  pledge_taken:     { icon: '🤝',  color: 'rgba(155,89,182,0.15)', label: 'Pledge' },
  login:            { icon: '🔑',  color: 'rgba(255,255,255,0.06)', label: 'Login' },
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    progressService.getDashboard()
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="spinner-border text-danger" />
    </div>
  )

  const s = stats || {}
  const modules  = s.modules  || { completed: 0, total: 0, in_progress: 0, completion_rate: 0 }
  const quizzes  = s.quizzes  || { total_attempts: 0, passed: 0, average_score: 0 }
  const streak   = s.streak   || { current: 0, longest: 0 }
  const catProg  = s.category_progress || []
  const activities = s.recent_activities || []
  const userData = s.user || { username: user?.username, points: user?.points || 0, rank: '—' }

  return (
    <div className="fade-in-up">
      {/* ── Welcome Banner ── */}
      <div className="glass-card p-4 mb-4" style={{
        background: 'linear-gradient(135deg, rgba(233,69,96,0.12), rgba(15,52,96,0.3))',
        borderLeft: '4px solid var(--cyber-highlight)'
      }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <h1 className="text-white fw-bold mb-1" style={{ fontSize: '1.5rem' }}>
              👋 Welcome back, <span className="text-cyber-highlight">{user?.first_name || user?.username}</span>!
            </h1>
            <p className="text-cyber-muted mb-0" style={{ fontSize: '0.9rem' }}>
              {streak.current > 0
                ? `🔥 You're on a ${streak.current}-day streak! Keep it up.`
                : "Start your cyber awareness journey today."}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/quizzes" className="btn-cyber px-3 py-1 rounded-3 text-white" style={{ fontSize: '0.875rem', textDecoration: 'none' }}>
              📝 Take a Quiz
            </Link>
            <Link to="/learning" className="btn-cyber-outline px-3 py-1 rounded-3" style={{ fontSize: '0.875rem', textDecoration: 'none' }}>
              📚 Learn
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <StatCard icon="📚" label="Modules Completed" value={modules.completed}
            color="#00d4aa" sub={`of ${modules.total} total`} />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard icon="🎯" label="Avg Quiz Score" value={`${quizzes.average_score}%`}
            color="#4fc3f7" sub={`${quizzes.total_attempts} attempt(s)`} />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard icon="⚡" label="Points Earned" value={userData.points}
            color="#ffd700" sub={`Rank #${userData.rank}`} />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard icon="🔥" label="Day Streak" value={streak.current}
            color="#e94560" sub={`Best: ${streak.longest}`} />
        </div>
      </div>

      <div className="row g-4">
        {/* ── Category Progress ── */}
        <div className="col-12 col-lg-7">
          <div className="glass-card p-4 h-100">
            <h5 className="text-white fw-bold mb-3">
              <i className="bi bi-bar-chart-fill text-cyber-highlight me-2" />
              Progress by Category
            </h5>
            {catProg.length === 0 ? (
              <div className="text-cyber-muted text-center py-4">
                <div style={{ fontSize: '2rem' }}>📚</div>
                <div className="mt-2">No progress yet — start a module!</div>
                <Link to="/learning" className="btn-cyber px-3 py-1 rounded-3 mt-3 d-inline-block text-white"
                  style={{ fontSize: '0.875rem', textDecoration: 'none' }}>Start Learning</Link>
              </div>
            ) : catProg.map(cat => (
              <div key={cat.name} className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-white" style={{ fontSize: '0.875rem' }}>
                    {cat.icon} {cat.name}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: cat.color, fontWeight: 600 }}>
                    {cat.completed}/{cat.total}
                  </span>
                </div>
                <div className="cyber-progress">
                  <div className="cyber-progress-bar" style={{ width: `${cat.percentage}%`, background: `linear-gradient(90deg, ${cat.color}, ${cat.color}aa)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent Activity ── */}
        <div className="col-12 col-lg-5">
          <div className="glass-card p-4 h-100">
            <h5 className="text-white fw-bold mb-3">
              <i className="bi bi-activity text-cyber-highlight me-2" />
              Recent Activity
            </h5>
            {activities.length === 0 ? (
              <div className="text-cyber-muted text-center py-4">
                <div style={{ fontSize: '2rem' }}>🏁</div>
                <div className="mt-2">No activity yet. Take your first action!</div>
              </div>
            ) : activities.slice(0, 7).map(act => {
              const meta = activityMeta[act.activity_type] || activityMeta.login
              return (
                <div key={act.id} className="activity-item">
                  <div className="activity-icon" style={{ background: meta.color, fontSize: '1rem' }}>
                    {meta.icon}
                  </div>
                  <div className="flex-fill" style={{ overflow: 'hidden' }}>
                    <div className="text-white text-truncate" style={{ fontSize: '0.83rem' }}>{act.description}</div>
                    <div className="text-cyber-muted" style={{ fontSize: '0.72rem' }}>
                      {new Date(act.created_at).toLocaleString()}
                    </div>
                  </div>
                  {act.points_earned > 0 && (
                    <span className="text-cyber-warning fw-bold" style={{ fontSize: '0.78rem', flexShrink: 0 }}>
                      +{act.points_earned}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="row g-3 mt-2">
        {[
          { to: '/quizzes',     icon: '📝', label: 'Take a Quiz',        sub: 'Test your knowledge', color: '#e94560' },
          { to: '/tips',        icon: '💡', label: 'Read Cyber Tips',    sub: 'Stay informed', color: '#ffd700' },
          { to: '/pledge',      icon: '🤝', label: 'Safety Pledge',      sub: 'Make a commitment', color: '#9b59b6' },
          { to: '/leaderboard', icon: '🏆', label: 'Leaderboard',        sub: 'See global rankings', color: '#00d4aa' },
        ].map(item => (
          <div key={item.to} className="col-6 col-lg-3">
            <Link to={item.to} className="text-decoration-none d-block glass-card p-3 text-center h-100">
              <div style={{ fontSize: '2rem', marginBottom: 6 }}>{item.icon}</div>
              <div className="fw-semibold text-white" style={{ fontSize: '0.875rem' }}>{item.label}</div>
              <div className="text-cyber-muted" style={{ fontSize: '0.75rem' }}>{item.sub}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
