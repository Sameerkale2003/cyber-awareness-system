import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function DataProtectionPage() {
  const [testUrl, setTestUrl] = useState('')
  const [urlResult, setUrlResult] = useState(null)

  const analyzeUrl = (e) => {
    e.preventDefault()
    if (!testUrl) return

    let formatted = testUrl.trim()
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = 'https://' + formatted
    }

    try {
      const parsed = new URL(formatted)
      const isHttps = parsed.protocol === 'https:'
      const domain = parsed.hostname.toLowerCase()

      // Common phishing patterns
      const isSuspicious = domain.includes('paypa1') ||
                           domain.includes('goog1e') ||
                           domain.includes('bank-verify') ||
                           domain.includes('login-security') ||
                           domain.includes('free-gift')

      setUrlResult({
        url: parsed.href,
        domain: parsed.hostname,
        isHttps: isHttps,
        isSuspicious: isSuspicious,
        message: isSuspicious
          ? '🚨 WARNING: Suspicious domain pattern detected! High phishing risk.'
          : isHttps
            ? '✅ Secure Connection (HTTPS). Always double check the domain spelling.'
            : '⚠️ UNSECURE (HTTP): Data sent to this site is NOT encrypted.'
      })
    } catch {
      toast.error('Invalid URL format')
    }
  }

  return (
    <div className="fade-in-up" style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div className="mb-4">
        <h1 className="section-title">🛡️ Personal Data Protection Hub</h1>
        <p className="section-subtitle">
          Understand how personal data flows, detect threats, and protect your digital footprint
        </p>
      </div>

      {/* Campaign Banner (matching screenshot) */}
      <div className="glass-card p-4 mb-4" style={{
        background: 'linear-gradient(135deg, rgba(52,152,219,0.15), rgba(15,52,96,0.3))',
        borderLeft: '4px solid #3498db'
      }}>
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div style={{ fontSize: '3rem' }}>🛡️</div>
          <div>
            <h4 className="text-white fw-bold mb-1">Personal Data Protection</h4>
            <p className="text-cyber-muted mb-0" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              Personal data includes information such as your name, phone number, email address,
              photographs, location, and financial information.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive URL Safety Checker */}
      <div className="glass-card p-4 mb-4">
        <h5 className="text-white fw-bold mb-2">🔗 Website Link & HTTPS Analyzer</h5>
        <p className="text-cyber-muted" style={{ fontSize: '0.85rem' }}>
          Paste any website address or link to analyze its protocol and domain legitimacy:
        </p>
        <form onSubmit={analyzeUrl} className="d-flex gap-2 mb-3">
          <input
            type="text"
            className="form-control cyber-input flex-fill"
            placeholder="e.g. https://paypal.com or http://paypa1.com"
            value={testUrl}
            onChange={e => setTestUrl(e.target.value)}
          />
          <button type="submit" className="btn-cyber px-4 py-2 rounded-3 text-nowrap fw-bold">
            Check Link
          </button>
        </form>

        {urlResult && (
          <div className="p-3 rounded-3 mt-3" style={{
            background: urlResult.isSuspicious || !urlResult.isHttps ? 'rgba(233,69,96,0.12)' : 'rgba(0,212,170,0.12)',
            border: `1px solid ${urlResult.isSuspicious || !urlResult.isHttps ? '#e94560' : '#00d4aa'}`
          }}>
            <div className="fw-bold mb-1" style={{ color: urlResult.isSuspicious || !urlResult.isHttps ? '#e94560' : '#00d4aa' }}>
              {urlResult.message}
            </div>
            <div className="text-cyber-muted" style={{ fontSize: '0.8rem' }}>
              Domain: <code className="text-white">{urlResult.domain}</code> | Protocol: <code className="text-white">{urlResult.isHttps ? 'HTTPS (Encrypted)' : 'HTTP (Plain Text)'}</code>
            </div>
          </div>
        )}
      </div>

      {/* Visual Diagram Section */}
      <div className="glass-card p-4 mb-4">
        <h5 className="text-white fw-bold mb-3">📊 Personal Data Protection Architecture & Threat Matrix</h5>
        <div className="p-3 rounded-3 text-center" style={{ background: 'rgba(22,33,62,0.9)', border: '1px solid var(--cyber-border)' }}>
          {/* SVG Data Flow & Threat Matrix Diagram */}
          <svg viewBox="0 0 800 360" className="w-100" style={{ maxHeight: 360 }}>
            {/* User Data Source */}
            <rect x="20" y="130" width="160" height="100" rx="12" fill="#16213e" stroke="#3498db" strokeWidth="2" />
            <text x="100" y="165" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="14">👤 User Data</text>
            <text x="100" y="190" textAnchor="middle" fill="#94a3b8" fontSize="11">Name, OTP, Credentials</text>

            {/* Arrows to Security Checks */}
            <path d="M 180 180 L 260 180" stroke="#00d4aa" strokeWidth="3" markerEnd="url(#arrow)" />

            {/* Shield / Firewall Checkpoint */}
            <rect x="260" y="110" width="220" height="140" rx="16" fill="#0f3460" stroke="#00d4aa" strokeWidth="2" />
            <text x="370" y="145" textAnchor="middle" fill="#00d4aa" fontWeight="bold" fontSize="15">🛡️ Security Gateway</text>
            <text x="370" y="175" textAnchor="middle" fill="#ffffff" fontSize="12">1. HTTPS 256-bit SSL</text>
            <text x="370" y="195" textAnchor="middle" fill="#ffffff" fontSize="12">2. 2FA Authentication</text>
            <text x="370" y="215" textAnchor="middle" fill="#ffffff" fontSize="12">3. Zero OTP Sharing</text>

            {/* Arrow to Destination */}
            <path d="M 480 180 L 560 180" stroke="#00d4aa" strokeWidth="3" />

            {/* Safe Destination */}
            <rect x="560" y="130" width="160" height="100" rx="12" fill="#16213e" stroke="#00d4aa" strokeWidth="2" />
            <text x="640" y="165" textAnchor="middle" fill="#00d4aa" fontWeight="bold" fontSize="14">🔒 Protected Server</text>
            <text x="640" y="190" textAnchor="middle" fill="#94a3b8" fontSize="11">Encrypted Vault</text>

            {/* Threat Attack Vectors (Top and Bottom) */}
            <path d="M 370 20 L 370 110" stroke="#e94560" strokeWidth="2" strokeDasharray="5,5" />
            <rect x="290" y="10" width="160" height="40" rx="8" fill="#e94560" opacity="0.2" stroke="#e94560" />
            <text x="370" y="35" textAnchor="middle" fill="#e94560" fontWeight="bold" fontSize="12">🎣 Phishing & Spoofing</text>

            <path d="M 370 250 L 370 330" stroke="#e94560" strokeWidth="2" strokeDasharray="5,5" />
            <rect x="290" y="305" width="160" height="40" rx="8" fill="#e94560" opacity="0.2" stroke="#e94560" />
            <text x="370" y="330" textAnchor="middle" fill="#e94560" fontWeight="bold" fontSize="12">🔓 Public Wi-Fi Sniffing</text>
          </svg>
        </div>
      </div>

      {/* Guidelines (Matches Screenshots) */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6">
          <div className="glass-card p-4 h-100 border-start border-warning border-4">
            <h5 className="text-white fw-bold mb-3">⚠️ Remember</h5>
            <p className="text-cyber-muted mb-0" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
              Never share sensitive personal information with unknown people or suspicious websites.
              Legitimate organizations like banks will <strong>NEVER</strong> ask for your passwords or OTPs over phone or email.
            </p>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="glass-card p-4 h-100 border-start border-success border-4">
            <h5 className="text-white fw-bold mb-3">Protect Your Personal Data:</h5>
            <ul className="text-cyber-muted ps-3 mb-0" style={{ fontSize: '0.875rem', lineHeight: 1.8 }}>
              <li><strong>Do not share OTPs or passwords</strong> with anyone.</li>
              <li><strong>Check website links</strong> (HTTPS 🔒) before entering information.</li>
              <li><strong>Use privacy settings</strong> on social media platforms.</li>
              <li><strong>Avoid sharing unnecessary personal information</strong> online.</li>
              <li><strong>Keep your phone and applications updated</strong> regularly.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Banner */}
      <div className="glass-card p-4 text-center">
        <h5 className="text-white fw-bold mb-2">Ready to take action?</h5>
        <p className="text-cyber-muted mb-3" style={{ fontSize: '0.85rem' }}>
          Commit to protecting your digital identity by joining our community campaign.
        </p>
        <Link to="/pledge" className="btn-cyber px-4 py-2 rounded-3 text-white text-decoration-none fw-bold">
          🤝 Take the Safety Pledge
        </Link>
      </div>
    </div>
  )
}
