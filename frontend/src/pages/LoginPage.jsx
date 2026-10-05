import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await login(form)
      toast.success(`👋 ${data.message}`)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0]
        || err.response?.data?.detail
        || 'Login failed. Check your credentials.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page cyber-grid-bg">
      <div className="auth-card mx-3">
        {/* Header */}
        <div className="text-center mb-4">
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>🔐</div>
          <h1 className="font-orbitron text-white" style={{ fontSize: '1.4rem' }}>
            Welcome Back
          </h1>
          <p className="text-cyber-muted mt-1" style={{ fontSize: '0.85rem' }}>
            Sign in to your <span className="text-cyber-highlight">CyberAware</span> account
          </p>
        </div>

        {error && (
          <div className="alert mb-3 py-2 px-3 rounded-3" style={{
            background: 'rgba(233,69,96,0.12)',
            border: '1px solid rgba(233,69,96,0.4)',
            color: '#e94560', fontSize: '0.85rem'
          }}>
            <i className="bi bi-exclamation-triangle me-2" />{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="cyber-label">Username or Email</label>
            <input type="text" name="username" value={form.username}
              onChange={handleChange} placeholder="Enter your username or email" required
              className="form-control cyber-input" />
          </div>

          <div className="mb-4">
            <label className="cyber-label">Password</label>
            <div className="position-relative">
              <input type={showPwd ? 'text' : 'password'} name="password"
                value={form.password} onChange={handleChange}
                placeholder="Enter your password" required
                className="form-control cyber-input pe-5" />
              <button type="button" onClick={() => setShowPwd(p => !p)}
                className="btn border-0 position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-cyber-muted">
                <i className={`bi bi-eye${showPwd ? '-slash' : ''}`} />
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-100 btn-cyber py-2 rounded-3 fw-bold"
            style={{ fontSize: '1rem' }}>
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2" />Signing In...</>
              : '🔑 Sign In'}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-3 p-2 rounded-3 text-center" style={{
          background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)',
          fontSize: '0.78rem'
        }}>
          <span className="text-cyber-muted">Demo: </span>
          <span className="text-cyber-success fw-semibold">admin</span>
          <span className="text-cyber-muted"> / </span>
          <span className="text-cyber-success fw-semibold">Admin@123</span>
        </div>

        <div className="text-center mt-3">
          <span className="text-cyber-muted" style={{ fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Link to="/register" className="text-cyber-highlight fw-semibold">Register Free</Link>
          </span>
        </div>
      </div>
    </div>
  )
}
