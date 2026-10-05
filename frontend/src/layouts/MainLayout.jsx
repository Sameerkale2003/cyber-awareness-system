import React from 'react'
import { Link } from 'react-router-dom'

export default function MainLayout({ children }) {
  return (
    <div className="cyber-grid-bg" style={{ minHeight: '100vh' }}>
      {children}
    </div>
  )
}
