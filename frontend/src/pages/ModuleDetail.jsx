import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { learningService, progressService } from '../services'
import toast from 'react-hot-toast'

function renderMarkdown(text) {
  // Very simple markdown-like renderer for lesson content
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('## '))  return <h4 key={i} className="text-white mt-4 mb-2 fw-bold" style={{ fontSize: '1.15rem' }}>{line.slice(3)}</h4>
      if (line.startsWith('### ')) return <h5 key={i} className="text-cyber-highlight mt-3 mb-2" style={{ fontSize: '1rem' }}>{line.slice(4)}</h5>
      if (line.startsWith('#### ')) return <h6 key={i} className="text-white mt-2 mb-1 fw-semibold">{line.slice(5)}</h6>
      if (line.startsWith('> '))  return <blockquote key={i} className="border-start border-warning ps-3 my-2 text-cyber-muted fst-italic">{line.slice(2)}</blockquote>
      if (line.startsWith('- '))  return <li key={i} className="text-cyber-text mb-1">{line.slice(2)}</li>
      if (line.match(/^\d+\./))   return <li key={i} className="text-cyber-text mb-1">{line.replace(/^\d+\.\s*/, '')}</li>
      if (line.trim() === '')     return <br key={i} />
      // Inline bold **text**
      const parts = line.split(/\*\*(.*?)\*\*/g)
      return <p key={i} className="text-cyber-muted mb-1" style={{ lineHeight: 1.7 }}>
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-white">{p}</strong> : p)}
      </p>
    })
}

export default function ModuleDetail() {
  const { id } = useParams()
  const [module, setModule]     = useState(null)
  const [lessonIdx, setLessonIdx] = useState(0)
  const [loading, setLoading]   = useState(true)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    learningService.getModule(id)
      .then(r => setModule(r.data))
      .catch(() => toast.error('Module not found'))
      .finally(() => setLoading(false))
  }, [id])

  const lessons = module?.lessons || []
  const currentLesson = lessons[lessonIdx]
  const isLast = lessonIdx === lessons.length - 1

  const handleComplete = async () => {
    setCompleting(true)
    try {
      await progressService.updateProgress({ module_id: Number(id), mark_complete: true, progress_percentage: 100 })
      toast.success('🎉 Module completed! +20 points earned!')
    } catch { toast.error('Could not save progress') }
    finally { setCompleting(false) }
  }

  const handleNext = async () => {
    const pct = Math.round(((lessonIdx + 1) / lessons.length) * 100)
    try { await progressService.updateProgress({ module_id: Number(id), progress_percentage: pct }) } catch {}
    if (isLast) handleComplete()
    else setLessonIdx(p => p + 1)
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger" /></div>
  if (!module) return <div className="text-center py-5 text-cyber-muted">Module not found.</div>

  return (
    <div className="fade-in-up">
      {/* Breadcrumb */}
      <div className="d-flex align-items-center gap-2 text-cyber-muted mb-3" style={{ fontSize: '0.85rem' }}>
        <Link to="/learning" className="text-cyber-muted text-decoration-none hover-lift">📚 Learning Hub</Link>
        <i className="bi bi-chevron-right" style={{ fontSize: '0.7rem' }} />
        <span className="text-white">{module.title}</span>
      </div>

      {/* Module Header */}
      <div className="glass-card p-4 mb-4" style={{
        background: 'linear-gradient(135deg,rgba(15,52,96,0.4),rgba(22,33,62,0.8))',
        borderLeft: `4px solid ${module.category?.color || '#e94560'}`
      }}>
        <div className="d-flex align-items-start gap-3 flex-wrap">
          <div style={{ fontSize: '3rem' }}>{module.category?.icon}</div>
          <div className="flex-fill">
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className={`cyber-badge badge-${module.difficulty}`}>{module.difficulty}</span>
              <span className="text-cyber-muted" style={{ fontSize: '0.8rem' }}>
                <i className="bi bi-clock me-1" />{module.duration_minutes} min
              </span>
              <span className="text-cyber-muted" style={{ fontSize: '0.8rem' }}>
                <i className="bi bi-list-ul me-1" />{lessons.length} lessons
              </span>
            </div>
            <h1 className="text-white fw-bold mb-1" style={{ fontSize: '1.4rem' }}>{module.title}</h1>
            <p className="text-cyber-muted mb-0" style={{ fontSize: '0.875rem' }}>{module.description}</p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* ── Lesson Content ── */}
        <div className="col-12 col-lg-8">
          <div className="glass-card p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="text-white fw-bold mb-0">
                <span className="text-cyber-highlight me-2">{lessonIdx + 1}.</span>
                {currentLesson?.title}
              </h5>
              <span className="text-cyber-muted" style={{ fontSize: '0.8rem' }}>
                {lessonIdx + 1} / {lessons.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="cyber-progress mb-4">
              <div className="cyber-progress-bar" style={{ width: `${((lessonIdx + 1) / lessons.length) * 100}%` }} />
            </div>

            {/* Lesson content */}
            <div style={{ lineHeight: 1.8 }}>
              {currentLesson && renderMarkdown(currentLesson.content)}
            </div>

            {/* Navigation */}
            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top" style={{ borderColor: 'var(--cyber-border) !important' }}>
              <button className="btn-cyber-outline px-3 py-1 rounded-3"
                disabled={lessonIdx === 0}
                onClick={() => setLessonIdx(p => p - 1)}>
                ← Previous
              </button>
              <button className={`${isLast ? 'btn-cyber-teal' : 'btn-cyber'} px-4 py-1 rounded-3`}
                onClick={handleNext} disabled={completing}>
                {completing
                  ? <span className="spinner-border spinner-border-sm" />
                  : isLast ? '✅ Complete Module' : 'Next →'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Lesson List Sidebar ── */}
        <div className="col-12 col-lg-4">
          <div className="glass-card p-3">
            <h6 className="text-white fw-bold mb-3">Lessons</h6>
            {lessons.map((lesson, i) => (
              <button key={lesson.id}
                className={`d-flex align-items-center gap-2 w-100 p-2 mb-1 rounded-3 border-0 text-start ${i === lessonIdx ? 'text-white' : 'text-cyber-muted'}`}
                style={{
                  background: i === lessonIdx ? 'rgba(233,69,96,0.15)' : 'transparent',
                  border: i === lessonIdx ? '1px solid rgba(233,69,96,0.3) !important' : 'none',
                  cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.85rem'
                }}
                onClick={() => setLessonIdx(i)}>
                <span style={{ color: i <= lessonIdx ? 'var(--cyber-success)' : 'var(--cyber-text-muted)', fontSize: '0.9rem' }}>
                  {i < lessonIdx ? '✅' : i === lessonIdx ? '▶️' : '○'}
                </span>
                <span className="text-truncate">{lesson.title}</span>
              </button>
            ))}
          </div>

          {/* Related quiz prompt */}
          <div className="glass-card p-3 mt-3 text-center" style={{ borderColor: 'rgba(255,215,0,0.2)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>📝</div>
            <div className="text-white fw-semibold mb-1" style={{ fontSize: '0.9rem' }}>Test Your Knowledge</div>
            <div className="text-cyber-muted mb-3" style={{ fontSize: '0.8rem' }}>Take a quiz related to this module</div>
            <Link to="/quizzes" className="btn-cyber px-3 py-1 rounded-3 text-white" style={{ fontSize: '0.8rem', textDecoration: 'none' }}>
              Go to Quizzes
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
