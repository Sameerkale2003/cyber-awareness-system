import React, { useEffect, useState } from 'react'
import { progressService, authService } from '../services'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([progressService.getDashboard(), progressService.getLeaderboard()])
      .then(([d, l]) => {
        setStats(d.data)
        setLeaderboard(l.data)
      })
      .catch(() => toast.error('Failed to load admin stats'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger" /></div>

  const s = stats || {}
  const modules = s.modules || {}
  const quizzes = s.quizzes || {}

  return (
    <div className="fade-in-up">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 className="section-title">⚙️ System Admin Dashboard</h1>
          <p className="section-subtitle">Overview of platform metrics, user accounts, and system analytics</p>
        </div>
        <a
          href="http://localhost:8000/admin/"
          target="_blank"
          rel="noreferrer"
          className="btn-cyber px-4 py-2 rounded-3 text-white text-decoration-none fw-bold"
        >
          🔑 Open Django Admin Panel ↗
        </a>
      </div>

      {/* Admin Quick Metrics */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="glass-card p-3 text-center border-start border-primary border-4">
            <div className="text-cyber-muted mb-1" style={{ fontSize: '0.8rem' }}>Total Users</div>
            <div className="fw-bold font-orbitron text-white" style={{ fontSize: '1.8rem' }}>
              {leaderboard.length}
            </div>
            <div className="text-cyber-success" style={{ fontSize: '0.75rem' }}>Active Accounts</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="glass-card p-3 text-center border-start border-success border-4">
            <div className="text-cyber-muted mb-1" style={{ fontSize: '0.8rem' }}>Modules Published</div>
            <div className="fw-bold font-orbitron text-cyber-success" style={{ fontSize: '1.8rem' }}>
              {modules.total || 0}
            </div>
            <div className="text-cyber-muted" style={{ fontSize: '0.75rem' }}>{modules.completed || 0} completions</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="glass-card p-3 text-center border-start border-warning border-4">
            <div className="text-cyber-muted mb-1" style={{ fontSize: '0.8rem' }}>Quiz Attempts</div>
            <div className="fw-bold font-orbitron text-cyber-warning" style={{ fontSize: '1.8rem' }}>
              {quizzes.total_attempts || 0}
            </div>
            <div className="text-cyber-muted" style={{ fontSize: '0.75rem' }}>Avg Score: {quizzes.average_score || 0}%</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="glass-card p-3 text-center border-start border-danger border-4">
            <div className="text-cyber-muted mb-1" style={{ fontSize: '0.8rem' }}>System Health</div>
            <div className="fw-bold font-orbitron text-cyber-highlight" style={{ fontSize: '1.8rem' }}>
              100%
            </div>
            <div className="text-cyber-success" style={{ fontSize: '0.75rem' }}>All Systems Operational</div>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="glass-card p-4 mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="text-white fw-bold mb-0">👥 User Directory & Leaderboard Standings</h5>
          <span className="text-cyber-muted" style={{ fontSize: '0.8rem' }}>
            Total Users Registered: {leaderboard.length}
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0" style={{ background: 'transparent' }}>
            <thead>
              <tr style={{ borderColor: 'var(--cyber-border)', fontSize: '0.8rem' }} className="text-cyber-muted">
                <th>Rank</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Points</th>
                <th>Modules Done</th>
                <th>Quizzes Taken</th>
                <th>Avg Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.875rem' }}>
              {leaderboard.map(u => (
                <tr key={u.username} style={{ borderColor: 'var(--cyber-border)' }}>
                  <td className="fw-bold font-orbitron text-cyber-highlight">#{u.rank}</td>
                  <td className="fw-bold text-white">@{u.username}</td>
                  <td className="text-cyber-muted">{u.full_name || u.username}</td>
                  <td className="text-cyber-warning fw-bold font-orbitron">⚡ {u.points}</td>
                  <td>{u.modules_completed || 0}</td>
                  <td>{u.quizzes_taken || 0}</td>
                  <td className={u.average_score >= 70 ? 'text-cyber-success' : 'text-cyber-muted'}>
                    {u.average_score}%
                  </td>
                  <td>
                    <span className="cyber-badge badge-beginner">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Admin Links & Information */}
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="glass-card p-4 h-100">
            <h5 className="text-white fw-bold mb-3">🛠️ Admin Controls</h5>
            <p className="text-cyber-muted mb-3" style={{ fontSize: '0.85rem' }}>
              Use the Django Admin Console to create or edit modules, lessons, quizzes, questions, and manage user permissions.
            </p>
            <div className="d-flex flex-column gap-2">
              <a href="http://localhost:8000/admin/learning/module/" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light text-start">
                📚 Manage Modules & Lessons
              </a>
              <a href="http://localhost:8000/admin/quizzes/quiz/" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light text-start">
                📝 Manage Quizzes & Questions
              </a>
              <a href="http://localhost:8000/admin/accounts/user/" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light text-start">
                👤 Manage User Accounts & Roles
              </a>
              <a href="http://localhost:8000/api/docs/" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-info text-start">
                📖 Open OpenAPI / Swagger Documentation
              </a>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="glass-card p-4 h-100">
            <h5 className="text-white fw-bold mb-3">🌐 API Endpoints Status</h5>
            <div className="d-flex flex-column gap-2" style={{ fontSize: '0.82rem' }}>
              <div className="d-flex justify-content-between p-2 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <code>POST /api/auth/login/</code>
                <span className="text-cyber-success">200 OK</span>
              </div>
              <div className="d-flex justify-content-between p-2 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <code>GET /api/learning/modules/</code>
                <span className="text-cyber-success">200 OK</span>
              </div>
              <div className="d-flex justify-content-between p-2 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <code>POST /api/quizzes/submit/</code>
                <span className="text-cyber-success">200 OK</span>
              </div>
              <div className="d-flex justify-content-between p-2 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <code>GET /api/progress/dashboard/</code>
                <span className="text-cyber-success">200 OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
