import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { quizService } from '../services'
import toast from 'react-hot-toast'

export default function QuizTake() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [current, setCurrent]   = useState(0)
  const [answers, setAnswers]   = useState({})          // { questionId: answerId }
  const [timeLeft, setTimeLeft] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    quizService.getQuiz(id)
      .then(r => {
        setQuiz(r.data)
        setTimeLeft(r.data.time_limit_minutes * 60)
      })
      .catch(() => toast.error('Quiz not found'))
      .finally(() => setLoading(false))
  }, [id])

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return
    const t = setInterval(() => setTimeLeft(p => {
      if (p <= 1) { clearInterval(t); handleSubmit(); return 0 }
      return p - 1
    }), 1000)
    return () => clearInterval(t)
  }, [timeLeft])

  const handleSubmit = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)
    const answersArr = Object.entries(answers).map(([qId, aId]) => ({
      question_id: Number(qId), answer_id: Number(aId)
    }))
    const elapsed = quiz ? quiz.time_limit_minutes * 60 - (timeLeft || 0) : 0
    try {
      const res = await quizService.submitQuiz(id, { answers: answersArr, time_taken_seconds: elapsed })
      toast.success(res.data.message)
      navigate(`/quizzes/result/${res.data.attempt_id}`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Submission failed')
      setSubmitting(false)
    }
  }, [answers, id, quiz, timeLeft, submitting, navigate])

  const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger" /></div>
  if (!quiz)   return <div className="text-center py-5 text-cyber-muted">Quiz not found.</div>

  const questions = quiz.questions || []
  const q         = questions[current]
  const letters   = ['A', 'B', 'C', 'D', 'E']
  const answered  = Object.keys(answers).length
  const pct       = Math.round(((current + 1) / questions.length) * 100)
  const isLow     = timeLeft !== null && timeLeft < 60

  return (
    <div className="fade-in-up" style={{ maxWidth: 780, margin: '0 auto' }}>
      {/* Header */}
      <div className="glass-card p-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h5 className="text-white fw-bold mb-0">{quiz.title}</h5>
          <span className="text-cyber-muted" style={{ fontSize: '0.8rem' }}>
            Question {current + 1} of {questions.length}
          </span>
        </div>
        {timeLeft !== null && (
          <div className={`d-flex align-items-center gap-2 px-3 py-1 rounded-pill fw-bold font-orbitron`}
            style={{
              background: isLow ? 'rgba(233,69,96,0.2)' : 'rgba(0,212,170,0.1)',
              border: `1px solid ${isLow ? 'rgba(233,69,96,0.5)' : 'rgba(0,212,170,0.3)'}`,
              color: isLow ? 'var(--cyber-highlight)' : 'var(--cyber-success)',
              fontSize: '1rem', animation: isLow ? 'pulse 1s infinite' : 'none',
            }}>
            <i className="bi bi-clock" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="cyber-progress mb-4" style={{ height: 10 }}>
        <div className="cyber-progress-bar" style={{ width: `${pct}%` }} />
      </div>

      {/* Question */}
      {q && (
        <div className="glass-card p-4 mb-4">
          <div className="mb-1">
            <span className="cyber-badge badge-intermediate" style={{ marginBottom: 8 }}>
              {q.question_type === 'true_false' ? 'True / False' : 'Multiple Choice'}
            </span>
          </div>
          <h4 className="text-white fw-bold mb-4" style={{ lineHeight: 1.4 }}>{q.question_text}</h4>
          <div>
            {(q.answers || []).map((ans, i) => {
              const selected = answers[q.id] === ans.id
              return (
                <button key={ans.id} className={`quiz-option ${selected ? 'selected' : ''}`}
                  onClick={() => setAnswers(p => ({ ...p, [q.id]: ans.id }))}>
                  <span className="quiz-option-letter" style={{ color: selected ? 'var(--cyber-highlight)' : 'var(--cyber-text-muted)' }}>
                    {letters[i]}
                  </span>
                  <span className="text-white" style={{ fontSize: '0.95rem' }}>{ans.answer_text}</span>
                  {selected && <i className="bi bi-check-circle-fill text-cyber-highlight ms-auto" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="d-flex align-items-center justify-content-between">
        <button className="btn-cyber-outline px-3 py-1 rounded-3"
          disabled={current === 0} onClick={() => setCurrent(p => p - 1)}>
          ← Back
        </button>
        <span className="text-cyber-muted" style={{ fontSize: '0.8rem' }}>
          {answered} / {questions.length} answered
        </span>
        {current < questions.length - 1 ? (
          <button className="btn-cyber px-3 py-1 rounded-3" onClick={() => setCurrent(p => p + 1)}>
            Next →
          </button>
        ) : (
          <button className="btn-cyber-teal px-4 py-1 rounded-3 fw-bold"
            onClick={() => setShowConfirm(true)} disabled={submitting}>
            Submit Quiz ✅
          </button>
        )}
      </div>

      {/* Question dots */}
      <div className="d-flex flex-wrap gap-1 mt-4 justify-content-center">
        {questions.map((ques, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className="rounded border-0"
            style={{
              width: 28, height: 28, fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
              background: i === current ? 'var(--cyber-highlight)' : answers[ques.id] ? 'rgba(0,212,170,0.3)' : 'rgba(255,255,255,0.07)',
              color: i === current ? 'white' : answers[ques.id] ? 'var(--cyber-success)' : 'var(--cyber-text-muted)',
              border: i === current ? '2px solid var(--cyber-highlight)' : '',
            }}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* Confirm submit modal */}
      {showConfirm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: 'rgba(0,0,0,0.7)', zIndex: 2000 }}>
          <div className="glass-card p-4 mx-3" style={{ maxWidth: 400, width: '100%' }}>
            <h5 className="text-white fw-bold mb-2">Submit Quiz?</h5>
            <p className="text-cyber-muted" style={{ fontSize: '0.875rem' }}>
              You answered {answered} of {questions.length} questions.
              {answered < questions.length && ` ${questions.length - answered} question(s) unanswered.`}
            </p>
            <div className="d-flex gap-2 mt-3">
              <button className="btn-cyber-outline flex-fill py-2 rounded-3" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn-cyber flex-fill py-2 rounded-3 fw-bold" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <span className="spinner-border spinner-border-sm" /> : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
