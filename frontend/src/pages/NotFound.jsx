import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="auth-page cyber-grid-bg text-center">
      <div>
        <div style={{ fontSize: '6rem', filter: 'drop-shadow(0 0 30px rgba(233,69,96,0.5))' }}>🔍</div>
        <h1 className="font-orbitron text-white mt-3" style={{ fontSize: '3rem' }}>404</h1>
        <h2 className="text-cyber-highlight mb-3" style={{ fontSize: '1.2rem' }}>Page Not Found</h2>
        <p className="text-cyber-muted mb-4">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-cyber px-4 py-2 rounded-3 text-white text-decoration-none" style={{ fontSize: '0.95rem' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
