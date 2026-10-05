import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-danger mb-3" role="status" />
        <div className="text-cyber-muted">Loading...</div>
      </div>
    </div>
  )
  return isAuthenticated ? children : <Navigate to="/login" replace />
}
