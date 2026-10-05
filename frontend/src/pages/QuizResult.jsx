import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { quizService } from '../services'

export default function QuizResult() {
  const { id } = useParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    quizService.getResult(id)
      .then(r => setResult(r.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger" /></div>
  if (!result) return <div className="text-center py-5 text-cyber-muted">Result not found.</div>

  const passed = result.passed
  const score  = result.score

  return (
    <div className="fade-in-up" style={{ maxWidth: 780, margin: '0 auto' }}>
      {/* Score Circle */}
      <div className="text-center mb-5">
        <div style={{
          width: 160, height: 160, borderRadius: '50%', margin: '0 auto 1.5rem',
          background: passed ? 'rgba(0,212,170,0.1)' : 'rgba(233,69,96,0.1)',
          border: `6px solid ${passed ? 'var(--cyber-success)' : 'var(--cyber-highlight)'}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: passed ? 'var(--glow-teal)' : 'var(--glow-red)',
        }}>
          <div className="font-orbitron fw-bold" style={{ fontSize: '2.5rem', color: passed ? 'var(--cyber-success)' : 'var(--cyber-highlight)', lineHeight: 1 }}>
            {score}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--cyber-text-muted)', marginTop: 4 }}>score</div>
        </div>

        <h2 className="font-orbitron text-white mb-2" style={{ fontSize: '1.6rem' }}>
          {passed ? '🎉 Excellent! You Passed!' : '💪 Keep Practicing!'}
        </h2>
        <p className="text-cyber-muted mb-1">{result.quiz_title}</p>
        {result.time_taken_seconds > 0 && (
          <p className="text-cyber-muted" style={{ fontSize: '0.8rem' }}>
            <i className="bi bi-clock me-1" />
            Completed in {Math.floor(result.time_taken_seconds / 60)}m {result.time_taken_seconds % 60}s
          </p>
        )}

        <div className="d-flex gap-3 justify-content-center mt-3">
          <Link to="/quizzes" className="btn-cyber-outline px-4 py-2 rounded-3" style={{ fontSize: '0.875rem' }}>
            ← All Quizzes
          </Link>
          <Link to="/dashboard" className="btn-cyber px-4 py-2 rounded-3 text-white text-decoration-none" style={{ fontSize: '0.875rem' }}>
            Dashboard →
          </Link>
        </div>
      </div>

      {/* Question Review */}
      <h5 className="text-white fw-bold mb-3">📋 Question Review</h5>
      {(result.user_answers || []).map((ua, i) => (
        <div key={i} className="glass-card p-4 mb-3" style={{
          borderLeft: `4px solid ${ua.is_correct ? 'var(--cyber-success)' : 'var(--cyber-highlight)'}`
        }}>
          <div className="d-flex align-items-start gap-3">
            <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{ua.is_correct ? '✅' : '❌'}</span>
            <div className="flex-fill">
              <div className="text-white fw-semibold mb-2" style={{ fontSize: '0.95rem', lineHeight: 1.4 }}>
                {i + 1}. {ua.question}
              </div>
              <div className="mb-1" style={{ fontSize: '0.83rem' }}>
                <span className="text-cyber-muted">Your answer: </span>
                <span className={ua.is_correct ? 'text-cyber-success' : 'text-cyber-highlight'} style={{ fontWeight: 600 }}>
                  {ua.selected_answer || 'Not answered'}
                </span>
              </div>
              {!ua.is_correct && (
                <div className="mb-2" style={{ fontSize: '0.83rem' }}>
                  <span className="text-cyber-muted">Correct answer: </span>
                  <span className="text-cyber-success fw-semibold">{ua.correct_answer}</span>
                </div>
              )}
              {ua.explanation && (
                <div className="mt-2 p-2 rounded-3" style={{ background: 'rgba(255,255,255,0.04)', fontSize: '0.8rem', color: 'var(--cyber-text-muted)', borderLeft: '3px solid rgba(255,215,0,0.4)' }}>
                  💡 {ua.explanation}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
