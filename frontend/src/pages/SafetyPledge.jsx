import React, { useEffect, useState } from 'react'
import { learningService } from '../services'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const pledgeItems = [
  'I will use strong, unique passwords for every account.',
  'I will enable two-factor authentication wherever possible.',
  'I will never share OTPs, passwords, or sensitive personal information.',
  'I will verify website links before entering any personal data.',
  'I will keep my software and devices updated.',
  "I will think before I click on links or download files.",
  'I will review my privacy settings on social media regularly.',
  'I will log out of accounts on shared or public devices.',
]

export default function SafetyPledge() {
  const { user, refreshProfile } = useAuth()
  const [pledgeData, setPledgeData] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [pledging, setPledging] = useState(false)
  const [checked, setChecked]   = useState({})

  useEffect(() => {
    learningService.getPledge()
      .then(r => setPledgeData(r.data))
      .finally(() => setLoading(false))
  }, [])

  const allChecked = pledgeItems.every((_, i) => checked[i])

  const handlePledge = async () => {
    if (!allChecked) { toast.error('Please confirm all pledge items first!'); return }
    setPledging(true)
    try {
      const r = await learningService.takePledge()
      toast.success('🎉 ' + r.data.message)
      setPledgeData({ has_pledged: true, pledge: r.data.pledge, total_pledges: r.data.total_pledges })
      refreshProfile()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Could not take pledge')
    } finally {
      setPledging(false)
    }
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger" /></div>

  return (
    <div className="fade-in-up" style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Header */}
      <div className="text-center mb-5">
        <div style={{ fontSize: '4rem', marginBottom: 12, filter: 'drop-shadow(0 0 20px rgba(155,89,182,0.6))' }}>🤝</div>
        <h1 className="font-orbitron text-white mb-2" style={{ fontSize: '1.8rem' }}>
          Our <span className="gradient-text">Campaign</span>
        </h1>
        <p className="text-cyber-muted" style={{ maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
          Our campaign aims to spread awareness about password security and personal data protection.
          Small safety habits can help prevent cyber attacks and protect your digital identity.
        </p>
        <div className="mt-3">
          <span className="cyber-badge badge-intermediate px-3 py-2" style={{ fontSize: '0.85rem' }}>
            🏅 {pledgeData?.total_pledges || 0} people have pledged
          </span>
        </div>
      </div>

      {pledgeData?.has_pledged ? (
        /* Already pledged */
        <div className="glass-card p-5 text-center" style={{
          borderColor: 'rgba(0,212,170,0.4)',
          background: 'linear-gradient(135deg,rgba(0,212,170,0.08),rgba(22,33,62,0.8))'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 12 }}>✅</div>
          <h3 className="text-cyber-success fw-bold mb-2">Pledge Taken!</h3>
          <p className="text-cyber-muted mb-3">
            You took the Safety Pledge on{' '}
            <strong className="text-white">
              {new Date(pledgeData.pledge?.pledged_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </strong>
          </p>
          <div className="glass-card p-3 text-start" style={{ borderColor: 'rgba(0,212,170,0.2)' }}>
            <p className="text-cyber-muted mb-0 fst-italic" style={{ lineHeight: 1.7, fontSize: '0.875rem' }}>
              "{pledgeData.pledge?.pledge_text}"
            </p>
          </div>
          <div className="mt-4 text-cyber-success">
            <i className="bi bi-shield-fill-check me-2 fs-5" />
            <span className="fw-semibold">Thank you for your commitment to cyber safety!</span>
          </div>
        </div>
      ) : (
        /* Take the pledge */
        <div className="glass-card p-4">
          <h4 className="text-white fw-bold mb-1">🛡️ The Cyber Safety Pledge</h4>
          <p className="text-cyber-muted mb-4" style={{ fontSize: '0.875rem' }}>
            Check each commitment below, then click "Take the Safety Pledge"
          </p>

          <div className="mb-4">
            {pledgeItems.map((item, i) => (
              <label key={i} className="d-flex align-items-start gap-3 mb-3 p-3 rounded-3 hover-lift"
                style={{
                  background: checked[i] ? 'rgba(0,212,170,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${checked[i] ? 'rgba(0,212,170,0.3)' : 'var(--cyber-border)'}`,
                  cursor: 'pointer', transition: 'all 0.2s'
                }}>
                <input type="checkbox" checked={!!checked[i]}
                  onChange={e => setChecked(p => ({ ...p, [i]: e.target.checked }))}
                  style={{ width: 18, height: 18, accentColor: 'var(--cyber-success)', marginTop: 2, flexShrink: 0 }} />
                <span className={checked[i] ? 'text-cyber-success' : 'text-cyber-muted'} style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                  {item}
                </span>
              </label>
            ))}
          </div>

          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <span className="text-cyber-muted" style={{ fontSize: '0.8rem' }}>
              {Object.values(checked).filter(Boolean).length} / {pledgeItems.length} confirmed
            </span>
            <button className={`btn-cyber px-5 py-2 rounded-3 fw-bold ${!allChecked ? 'opacity-50' : ''}`}
              style={{ fontSize: '1rem' }}
              onClick={handlePledge} disabled={pledging || !allChecked}>
              {pledging
                ? <><span className="spinner-border spinner-border-sm me-2" />Taking Pledge...</>
                : '🤝 Take the Safety Pledge'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
