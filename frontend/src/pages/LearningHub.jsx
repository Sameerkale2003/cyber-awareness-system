import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { learningService } from '../services'

const diffColor = { beginner: 'badge-beginner', intermediate: 'badge-intermediate', advanced: 'badge-advanced' }

function ModuleCard({ mod }) {
  return (
    <Link to={`/learning/${mod.id}`} className="text-decoration-none d-block module-card h-100">
      {/* Card header with category color */}
      <div className="module-card-header" style={{
        background: `linear-gradient(135deg, ${mod.category?.color || '#0f3460'}22, ${mod.category?.color || '#0f3460'}44)`
      }}>
        <span style={{ fontSize: '3.5rem' }}>{mod.category?.icon || '📚'}</span>
      </div>
      <div className="module-card-body">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className={`cyber-badge ${diffColor[mod.difficulty]}`}>{mod.difficulty}</span>
          <span className="text-cyber-muted" style={{ fontSize: '0.75rem' }}>
            <i className="bi bi-clock me-1" />{mod.duration_minutes} min
          </span>
        </div>
        <h6 className="text-white fw-bold mb-1" style={{ fontSize: '0.95rem', lineHeight: 1.3 }}>{mod.title}</h6>
        <p className="text-cyber-muted mb-2" style={{ fontSize: '0.78rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {mod.description}
        </p>
        <div className="d-flex align-items-center justify-content-between mt-2">
          <span className="text-cyber-muted" style={{ fontSize: '0.75rem' }}>
            <i className="bi bi-list-ul me-1" />{mod.lessons_count} lessons
          </span>
          <span className="text-cyber-highlight" style={{ fontSize: '0.75rem' }}>
            Start →
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function LearningHub() {
  const [modules, setModules]       = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [activeCat, setActiveCat]   = useState('')
  const [activeDiff, setActiveDiff] = useState('')
  const [search, setSearch]         = useState('')

  useEffect(() => {
    Promise.all([learningService.getModules(), learningService.getCategories()])
      .then(([m, c]) => {
        const modsList = Array.isArray(m.data) ? m.data : (m.data?.results || [])
        const catsList = Array.isArray(c.data) ? c.data : (c.data?.results || [])
        setModules(modsList)
        setCategories(catsList)
      })
      .catch(err => {
        console.error('Error loading modules:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = (modules || []).filter(m => {
    const matchCat  = !activeCat  || m.category?.id === Number(activeCat)
    const matchDiff = !activeDiff || m.difficulty === activeDiff
    const matchS    = !search || m.title?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchDiff && matchS
  })

  return (
    <div className="fade-in-up">
      {/* Header */}
      <div className="mb-4">
        <h1 className="section-title">📚 Learning Hub</h1>
        <p className="section-subtitle">Master cyber security through interactive modules</p>
      </div>

      {/* Search + Filters */}
      <div className="glass-card p-3 mb-4">
        <div className="row g-2">
          <div className="col-12 col-md-5">
            <div className="position-relative">
              <i className="bi bi-search position-absolute" style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--cyber-text-muted)' }} />
              <input type="text" className="form-control cyber-input ps-4" placeholder="Search modules..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-6 col-md-4">
            <select className="form-select cyber-input" value={activeCat} onChange={e => setActiveCat(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-3">
            <select className="form-select cyber-input" value={activeDiff} onChange={e => setActiveDiff(e.target.value)}>
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button className={`cyber-badge ${!activeCat ? 'badge-intermediate' : ''}`}
          style={{ cursor: 'pointer', padding: '6px 14px', border: !activeCat ? '' : '1px solid var(--cyber-border)' }}
          onClick={() => setActiveCat('')}>All</button>
        {categories.map(c => (
          <button key={c.id}
            className={`cyber-badge ${activeCat == c.id ? 'badge-intermediate' : ''}`}
            style={{ cursor: 'pointer', padding: '6px 14px', border: activeCat == c.id ? '' : '1px solid var(--cyber-border)', color: activeCat == c.id ? '' : 'var(--cyber-text-muted)', background: activeCat == c.id ? '' : 'transparent' }}
            onClick={() => setActiveCat(activeCat == c.id ? '' : c.id)}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {/* Module Grid */}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-danger" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5 text-cyber-muted">
          <div style={{ fontSize: '3rem' }}>🔍</div>
          <div className="mt-2">No modules found. Try different filters.</div>
        </div>
      ) : (
        <>
          <div className="text-cyber-muted mb-3" style={{ fontSize: '0.85rem' }}>
            Showing {filtered.length} module{filtered.length !== 1 ? 's' : ''}
          </div>
          <div className="row g-3">
            {filtered.map(mod => (
              <div key={mod.id} className="col-12 col-sm-6 col-xl-4">
                <ModuleCard mod={mod} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
