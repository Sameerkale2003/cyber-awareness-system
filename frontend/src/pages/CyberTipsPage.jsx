import React, { useEffect, useState } from 'react'
import { learningService } from '../services'
import toast from 'react-hot-toast'

export default function CyberTipsPage() {
  const [tips, setTips]         = useState([])
  const [categories, setCats]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [activeCat, setActiveCat] = useState('')
  const [search, setSearch]     = useState('')
  const [read, setRead]         = useState(() => JSON.parse(localStorage.getItem('readTips') || '[]'))

  useEffect(() => {
    Promise.all([learningService.getTips(), learningService.getCategories()])
      .then(([t, c]) => {
        const tipsList = Array.isArray(t.data) ? t.data : (t.data?.results || [])
        const catsList = Array.isArray(c.data) ? c.data : (c.data?.results || [])
        setTips(tipsList)
        setCats(catsList)
      })
      .catch(err => {
        console.error('Error loading cyber tips:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  const markRead = (id) => {
    const updated = read.includes(id) ? read : [...read, id]
    setRead(updated)
    localStorage.setItem('readTips', JSON.stringify(updated))
    if (!read.includes(id)) toast.success('✅ Tip marked as read! +2 points')
  }

  const filtered = (tips || []).filter(t => {
    const matchCat = !activeCat || t.category?.id === Number(activeCat)
    const matchS   = !search || t.title?.toLowerCase().includes(search.toLowerCase()) || t.content?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchS
  })

  const featured = (tips || []).find(t => t.is_featured) || tips[0]

  return (
    <div className="fade-in-up">
      <div className="mb-4">
        <h1 className="section-title">💡 Cyber Safety Tips</h1>
        <p className="section-subtitle">Stay informed, stay protected</p>
      </div>

      {/* Tip of the Day */}
      {featured && (
        <div className="glass-card p-4 mb-4" style={{
          background: 'linear-gradient(135deg,rgba(255,215,0,0.08),rgba(0,212,170,0.06))',
          borderLeft: '4px solid var(--cyber-warning)'
        }}>
          <div className="d-flex align-items-start gap-3">
            <span style={{ fontSize: '2.5rem', flexShrink: 0 }}>{featured.icon}</span>
            <div>
              <div className="cyber-badge badge-intermediate mb-2" style={{ fontSize: '0.7rem' }}>⭐ Tip of the Day</div>
              <h5 className="text-white fw-bold mb-2">{featured.title}</h5>
              <p className="text-cyber-muted mb-0" style={{ lineHeight: 1.7 }}>{featured.content}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search + Filter */}
      <div className="glass-card p-3 mb-4">
        <div className="row g-2">
          <div className="col-12 col-md-7">
            <div className="position-relative">
              <i className="bi bi-search position-absolute" style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--cyber-text-muted)' }} />
              <input className="form-control cyber-input ps-4" placeholder="Search tips..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-12 col-md-5">
            <select className="form-select cyber-input" value={activeCat} onChange={e => setActiveCat(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="d-flex gap-4 mb-4 text-cyber-muted" style={{ fontSize: '0.85rem' }}>
        <span>📋 {filtered.length} tips</span>
        <span>✅ {read.length} read</span>
      </div>

      {/* Tips Grid */}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-danger" /></div>
      ) : (
        <div className="row g-3">
          {filtered.map(tip => (
            <div key={tip.id} className="col-12 col-md-6 col-xl-4">
              <div className={`tip-card d-flex flex-column ${read.includes(tip.id) ? 'opacity-75' : ''}`}
                style={{ borderColor: read.includes(tip.id) ? 'rgba(0,212,170,0.2)' : 'var(--cyber-border)' }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span style={{ fontSize: '1.5rem' }}>{tip.icon}</span>
                  <div className="flex-fill">
                    <h6 className="text-white fw-bold mb-0" style={{ fontSize: '0.9rem' }}>{tip.title}</h6>
                    {tip.category && (
                      <span style={{ fontSize: '0.7rem', color: tip.category.color }}>{tip.category.name}</span>
                    )}
                  </div>
                  {read.includes(tip.id) && <i className="bi bi-check-circle-fill text-cyber-success" />}
                </div>
                <p className="text-cyber-muted flex-fill mb-3" style={{ fontSize: '0.83rem', lineHeight: 1.6 }}>
                  {tip.content}
                </p>
                <button
                  className={`w-100 rounded-3 py-1 border-0 fw-semibold ${read.includes(tip.id) ? '' : 'btn-cyber-teal'}`}
                  style={{
                    fontSize: '0.8rem', cursor: 'pointer',
                    background: read.includes(tip.id) ? 'rgba(0,212,170,0.1)' : undefined,
                    color: read.includes(tip.id) ? 'var(--cyber-success)' : undefined,
                  }}
                  onClick={() => markRead(tip.id)}>
                  {read.includes(tip.id) ? '✅ Marked as Read' : '📌 Mark as Read'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
