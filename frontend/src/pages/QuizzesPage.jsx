import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { quizService } from '../services'

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([quizService.getQuizzes(), quizService.getHistory()])
      .then(([q, h]) => {
        setQuizzes(q.data.results || q.data)
        setHistory(h.data.results || h.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const getAttempt = (quizId) => history.filter(h => h.quiz_title && quizzes.find(q => q.id === quizId && q.title === h.quiz_title))
  const bestScore  = (quizId) => {
    const q = quizzes.find(q => q.id === quizId)
    if (!q) return null
    const attempts = history.filter(h => h.quiz_title === q.title)
    if (!attempts.length) return null
    return Math.max(...attempts.map(a => a.score))
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger" /></div>

  return (
    <div className="fade-in-up">
      <div className="mb-4">
        <h1 className="section-title">📝 Quizzes</h1>
        <p className="section-subtitle">Test your cyber security knowledge</p>
      </div>

      <div className="row g-3">
        {quizzes.map(quiz => {
          const best = bestScore(quiz.id)
          const passed = best !== null && best >= quiz.passing_score
          return (
            <div key={quiz.id} className="col-12 col-md-6 col-xl-4">
              <div className="glass-card p-4 h-100 d-flex flex-column">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div style={{ fontSize: '2.5rem' }}>📋</div>
                  {best !== null && (
                    <span className={`cyber-badge ${passed ? 'badge-beginner' : 'badge-advanced'}`}>
                      {passed ? '✅ Passed' : '❌ Retry'}
                    </span>
                  )}
                </div>
                <h5 className="text-white fw-bold mb-2">{quiz.title}</h5>
                <p className="text-cyber-muted mb-3 flex-fill" style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {quiz.description}
                </p>
                <div className="d-flex gap-3 mb-3 text-cyber-muted" style={{ fontSize: '0.78rem' }}>
                  <span><i className="bi bi-question-circle me-1" />{quiz.questions_count} questions</span>
                  <span><i className="bi bi-clock me-1" />{quiz.time_limit_minutes} min</span>
                  <span><i className="bi bi-check2-circle me-1" />Pass: {quiz.passing_score}%</span>
                </div>
                {best !== null && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.78rem' }}>
                      <span className="text-cyber-muted">Best Score</span>
                      <span className={passed ? 'text-cyber-success' : 'text-cyber-highlight'} style={{ fontWeight: 700 }}>{best}%</span>
                    </div>
                    <div className="cyber-progress">
                      <div className="cyber-progress-bar" style={{ width: `${best}%`, background: passed ? 'var(--cyber-success)' : 'var(--cyber-highlight)' }} />
                    </div>
                  </div>
                )}
                <Link to={`/quizzes/${quiz.id}`}
                  className="btn-cyber text-center rounded-3 py-2 text-white text-decoration-none fw-bold d-block"
                  style={{ fontSize: '0.875rem' }}>
                  {best !== null ? '🔄 Retake Quiz' : '🚀 Start Quiz'}
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent attempts */}
      {history.length > 0 && (
        <div className="mt-5">
          <h5 className="text-white fw-bold mb-3">📊 Recent Attempts</h5>
          <div className="glass-card">
            {history.slice(0, 5).map((attempt, i) => (
              <div key={attempt.id} className={`d-flex align-items-center gap-3 p-3 ${i < history.length - 1 ? 'border-bottom' : ''}`}
                style={{ borderColor: 'var(--cyber-border)' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: attempt.passed ? 'rgba(0,212,170,0.15)' : 'rgba(233,69,96,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  {attempt.passed ? '✅' : '❌'}
                </div>
                <div className="flex-fill">
                  <div className="text-white fw-semibold" style={{ fontSize: '0.875rem' }}>{attempt.quiz_title}</div>
                  <div className="text-cyber-muted" style={{ fontSize: '0.75rem' }}>{new Date(attempt.started_at).toLocaleDateString()}</div>
                </div>
                <div className="text-end">
                  <div className={`fw-bold ${attempt.passed ? 'text-cyber-success' : 'text-cyber-highlight'}`} style={{ fontSize: '1.1rem' }}>
                    {attempt.score}%
                  </div>
                  <Link to={`/quizzes/result/${attempt.id}`} className="text-cyber-muted" style={{ fontSize: '0.72rem' }}>View →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
