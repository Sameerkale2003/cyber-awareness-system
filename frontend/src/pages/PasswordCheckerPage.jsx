import React, { useState } from 'react'
import toast from 'react-hot-toast'

const commonPasswords = [
  '123456', '123456789', 'picture1', 'password', '12345678', '111111',
  '123123', '12345', 'qwerty', '1234567', 'dragon', 'pussy', 'baseball',
  'football', 'iloveyou', 'monkey', 'mustang', 'michael', 'shadow',
  'master', 'jordan', 'superman', 'harley', 'trustno1', 'welcome',
  'admin', 'administrator', 'pass123', 'dateofbirth', 'name123'
]

export default function PasswordCheckerPage() {
  const [password, setPassword] = useState('')
  const [genLength, setGenLength] = useState(16)
  const [useUpper, setUseUpper] = useState(true)
  const [useLower, setUseLower] = useState(true)
  const [useNum, setUseNum]     = useState(true)
  const [useSym, setUseSym]     = useState(true)

  // Calculations
  const isCommon = commonPasswords.includes(password.toLowerCase())
  const hasLength = password.length >= 12
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNum   = /\d/.test(password)
  const hasSym   = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  let charsetSize = 0
  if (/[a-z]/.test(password)) charsetSize += 26
  if (/[A-Z]/.test(password)) charsetSize += 26
  if (/\d/.test(password)) charsetSize += 10
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) charsetSize += 32

  const entropy = password.length > 0 && charsetSize > 0
    ? Math.floor(password.length * Math.log2(charsetSize))
    : 0

  let crackTime = 'Instant'
  let score = 0
  let levelName = 'Too Short'
  let levelColor = '#e74c3c'

  if (isCommon) {
    crackTime = 'Instant (Found in database of leaked passwords)'
    score = 1
    levelName = 'Compromised / Extremely Weak'
    levelColor = '#e74c3c'
  } else if (entropy < 28) {
    crackTime = 'Fractions of a second'
    score = 1
    levelName = 'Very Weak'
    levelColor = '#e74c3c'
  } else if (entropy < 36) {
    crackTime = 'Few seconds to minutes'
    score = 2
    levelName = 'Weak'
    levelColor = '#e67e22'
  } else if (entropy < 60) {
    crackTime = 'Several days to months'
    score = 3
    levelName = 'Fair'
    levelColor = '#f39c12'
  } else if (entropy < 80) {
    crackTime = 'Several years to decades'
    score = 4
    levelName = 'Strong'
    levelColor = '#3498db'
  } else {
    crackTime = 'Centuries (300+ years)'
    score = 5
    levelName = 'Very Strong / Military Grade'
    levelColor = '#00d4aa'
  }

  const generatePassword = () => {
    let chars = ''
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz'
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (useNum)   chars += '0123456789'
    if (useSym)   chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    if (!chars) {
      toast.error('Select at least one character set')
      return
    }

    let result = ''
    for (let i = 0; i < genLength; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(result)
    toast.success('🔑 Strong password generated!')
  }

  const copyToClipboard = () => {
    if (!password) return
    navigator.clipboard.writeText(password)
    toast.success('📋 Password copied to clipboard!')
  }

  return (
    <div className="fade-in-up" style={{ maxWidth: 850, margin: '0 auto' }}>
      <div className="mb-4">
        <h1 className="section-title">🔑 Password Strength Analyzer & Generator</h1>
        <p className="section-subtitle">Test password security, estimate crack time, and generate ultra-secure passphrases</p>
      </div>

      <div className="row g-4">
        {/* Left Column: Password Analyzer */}
        <div className="col-12 col-lg-7">
          <div className="glass-card p-4">
            <h5 className="text-white fw-bold mb-3 d-flex align-items-center justify-content-between">
              <span>🔍 Test Password Strength</span>
              {password && (
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setPassword('')}>
                  Clear
                </button>
              )}
            </h5>

            <div className="position-relative mb-3">
              <input
                type="text"
                className="form-control cyber-input pe-5 font-orbitron"
                style={{ fontSize: '1.1rem', letterSpacing: '1px' }}
                placeholder="Type or paste a password..."
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              {password && (
                <button
                  className="btn border-0 position-absolute top-50 end-0 translate-middle-y me-2 text-cyber-muted"
                  onClick={copyToClipboard}
                  title="Copy password"
                >
                  📋
                </button>
              )}
            </div>

            {/* Score Bar */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-cyber-muted" style={{ fontSize: '0.8rem' }}>Strength Score</span>
                <span className="fw-bold" style={{ color: levelColor, fontSize: '0.9rem' }}>
                  {password ? levelName : 'Awaiting input...'}
                </span>
              </div>
              <div className="d-flex gap-1" style={{ height: 8 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className="flex-fill rounded"
                    style={{
                      background: password && i <= score ? levelColor : 'rgba(255,255,255,0.08)',
                      transition: 'background 0.3s'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Details Box */}
            {password ? (
              <div className="glass-card p-3 mb-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="row text-center g-2">
                  <div className="col-6">
                    <div className="text-cyber-muted" style={{ fontSize: '0.75rem' }}>Estimated Entropy</div>
                    <div className="fw-bold font-orbitron text-cyber-highlight" style={{ fontSize: '1.1rem' }}>
                      {entropy} bits
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-cyber-muted" style={{ fontSize: '0.75rem' }}>Est. Crack Time</div>
                    <div className="fw-bold font-orbitron" style={{ color: levelColor, fontSize: '0.95rem' }}>
                      {crackTime}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Checklist */}
            <div className="row g-2" style={{ fontSize: '0.85rem' }}>
              <div className={`col-6 ${hasLength ? 'text-cyber-success' : 'text-cyber-muted'}`}>
                {hasLength ? '✅' : '❌'} 12+ Characters ({password.length})
              </div>
              <div className={`col-6 ${hasUpper ? 'text-cyber-success' : 'text-cyber-muted'}`}>
                {hasUpper ? '✅' : '❌'} Uppercase Letter (A-Z)
              </div>
              <div className={`col-6 ${hasLower ? 'text-cyber-success' : 'text-cyber-muted'}`}>
                {hasLower ? '✅' : '❌'} Lowercase Letter (a-z)
              </div>
              <div className={`col-6 ${hasNum ? 'text-cyber-success' : 'text-cyber-muted'}`}>
                {hasNum ? '✅' : '❌'} Number (0-9)
              </div>
              <div className={`col-6 ${hasSym ? 'text-cyber-success' : 'text-cyber-muted'}`}>
                {hasSym ? '✅' : '❌'} Special Character (!@#$)
              </div>
              <div className={`col-6 ${!isCommon && password ? 'text-cyber-success' : 'text-cyber-muted'}`}>
                {!isCommon ? '✅' : '🚨'} Not in Common Leaks
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Strong Password Generator */}
        <div className="col-12 col-lg-5">
          <div className="glass-card p-4 h-100">
            <h5 className="text-white fw-bold mb-3">🎲 Password Generator</h5>

            <div className="mb-3">
              <div className="d-flex justify-content-between text-cyber-muted mb-1" style={{ fontSize: '0.85rem' }}>
                <span>Length</span>
                <span className="fw-bold text-white font-orbitron">{genLength} chars</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="8"
                max="32"
                value={genLength}
                onChange={e => setGenLength(Number(e.target.value))}
              />
            </div>

            <div className="mb-4 d-flex flex-column gap-2" style={{ fontSize: '0.85rem' }}>
              <label className="d-flex align-items-center gap-2 text-white" style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={useUpper} onChange={e => setUseUpper(e.target.checked)} />
                Include Uppercase (A-Z)
              </label>
              <label className="d-flex align-items-center gap-2 text-white" style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={useLower} onChange={e => setUseLower(e.target.checked)} />
                Include Lowercase (a-z)
              </label>
              <label className="d-flex align-items-center gap-2 text-white" style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={useNum} onChange={e => setUseNum(e.target.checked)} />
                Include Numbers (0-9)
              </label>
              <label className="d-flex align-items-center gap-2 text-white" style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={useSym} onChange={e => setUseSym(e.target.checked)} />
                Include Symbols (!@#$)
              </label>
            </div>

            <button className="btn-cyber-teal w-100 py-2 rounded-3 fw-bold mb-2" onClick={generatePassword}>
              ⚡ Generate Strong Password
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
