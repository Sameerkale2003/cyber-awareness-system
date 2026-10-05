import React, { useEffect, useState } from 'react'
import { progressService } from '../services'
import { useAuth } from '../context/AuthContext'

const medals = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { user } = useAuth()
  const [board, setBoard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    progressService.getLeaderboard()
      .then(r => setBoard(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger" /></div>

  const top3 = board.slice(0, 3)
  const rest = board.slice(3)
  const myEntry = board.find(u => u.username === user?.username)

  return (
    <div className="fade-in-up">
      <div className="mb-4">
        <h1 className="section-title">🏆 Leaderboard</h1>
        <p className="section-subtitle">Global cyber awareness rankings</p>
      </div>

      {/* My rank card */}
      {myEntry && (
        <div className="glass-card p-3 mb-4 d-flex align-items-center gap-3"
          style={{ borderColor: 'rgba(233,69,96,0.4)', background: 'rgba(233,69,96,0.07)' }}>
          <div className="text-cyber-highlight fw-bold font-orbitron" style={{ fontSize: '1.3rem', minWidth: 36, textAlign: 'center' }}>
            #{myEntry.rank}
          </div>
          <div className="flex-fill">
            <div className="text-white fw-semibold">{myEntry.full_name || myEntry.username} <span className="text-cyber-muted">(You)</span></div>
            <div className="text-cyber-muted" style={{ fontSize: '0.78rem' }}>
              {myEntry.modules_completed} modules • {myEntry.quizzes_taken} quizzes • avg {myEntry.average_score}%
            </div>
          </div>
          <div className="text-cyber-warning fw-bold font-orbitron" style={{ fontSize: '1.1rem' }}>
            ⚡ {myEntry.points}
          </div>
        </div>
      )}

      {/* Top 3 podium */}
      {top3.length >= 3 && (
        <div className="row g-3 mb-4 justify-content-center">
          {[top3[1], top3[0], top3[2]].map((entry, i) => {
            const actualRank = entry.rank
            const heights = [120, 160, 100]
            return (
              <div key={entry.username} className="col-4" style={{ maxWidth: 160 }}>
                <div className="text-center">
                  <div style={{ fontSize: '2.5rem' }}>{medals[actualRank - 1]}</div>
                  <div className="glass-card p-3" style={{
                    height: heights[i],
                    borderColor: actualRank === 1 ? 'gold' : actualRank === 2 ? 'silver' : '#cd7f32',
                    background: actualRank === 1 ? 'rgba(255,215,0,0.08)' : undefined,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div className="fw-bold text-white text-truncate" style={{ fontSize: '0.85rem', maxWidth: '100%' }}>
                      {entry.username}
                    </div>
                    <div className="text-cyber-warning fw-bold font-orbitron mt-1" style={{ fontSize: '1rem' }}>
                      {entry.points}
                    </div>
                  </div>
                  <div className="text-cyber-muted mt-1" style={{ fontSize: '0.7rem' }}>#{actualRank}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Full table */}
      <div className="glass-card">
        <div className="p-3 border-bottom d-flex" style={{ borderColor: 'var(--cyber-border)', fontSize: '0.75rem', color: 'var(--cyber-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
          <span style={{ width: 48 }}>#</span>
          <span className="flex-fill">User</span>
          <span style={{ width: 80, textAlign: 'right' }}>Points</span>
          <span className="d-none d-md-block" style={{ width: 90, textAlign: 'right' }}>Modules</span>
          <span className="d-none d-sm-block" style={{ width: 80, textAlign: 'right' }}>Avg Score</span>
        </div>
        {board.map(entry => (
          <div key={entry.username}
            className={`leaderboard-row ${entry.is_current_user ? 'current-user' : ''} ${entry.rank <= 3 ? `rank-${entry.rank}` : ''}`}>
            <div style={{ width: 48, fontWeight: 800, fontSize: '1rem', color: entry.rank <= 3 ? ['gold', 'silver', '#cd7f32'][entry.rank - 1] : 'var(--cyber-text-muted)' }}>
              {entry.rank <= 3 ? medals[entry.rank - 1] : `#${entry.rank}`}
            </div>
            <div className="flex-fill" style={{ overflow: 'hidden' }}>
              <div className="text-white fw-semibold text-truncate" style={{ fontSize: '0.875rem' }}>
                {entry.full_name || entry.username}
                {entry.is_current_user && <span className="text-cyber-highlight ms-2" style={{ fontSize: '0.75rem' }}>← You</span>}
              </div>
              <div className="text-cyber-muted" style={{ fontSize: '0.72rem' }}>@{entry.username}</div>
            </div>
            <div style={{ width: 80, textAlign: 'right' }}>
              <span className="text-cyber-warning fw-bold font-orbitron" style={{ fontSize: '0.9rem' }}>⚡ {entry.points}</span>
            </div>
            <div className="d-none d-md-block text-cyber-muted" style={{ width: 90, textAlign: 'right', fontSize: '0.8rem' }}>
              {entry.modules_completed}
            </div>
            <div className="d-none d-sm-block" style={{ width: 80, textAlign: 'right', fontSize: '0.8rem' }}>
              <span className={entry.average_score >= 70 ? 'text-cyber-success' : 'text-cyber-muted'} style={{ fontWeight: 600 }}>
                {entry.average_score}%
              </span>
            </div>
          </div>
        ))}
        {board.length === 0 && (
          <div className="text-center py-5 text-cyber-muted">
            <div style={{ fontSize: '2.5rem' }}>🏆</div>
            <div className="mt-2">No rankings yet. Be the first!</div>
          </div>
        )}
      </div>
    </div>
  )
}
