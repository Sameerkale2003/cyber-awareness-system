import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'

// Pages
import LandingPage   from './pages/LandingPage'
import LoginPage     from './pages/LoginPage'
import RegisterPage  from './pages/RegisterPage'
import Dashboard     from './pages/Dashboard'
import LearningHub   from './pages/LearningHub'
import ModuleDetail  from './pages/ModuleDetail'
import QuizzesPage   from './pages/QuizzesPage'
import QuizTake      from './pages/QuizTake'
import QuizResult    from './pages/QuizResult'
import CyberTipsPage from './pages/CyberTipsPage'
import SafetyPledge  from './pages/SafetyPledge'
import Leaderboard   from './pages/Leaderboard'
import ProfilePage   from './pages/ProfilePage'
import PasswordCheckerPage from './pages/PasswordCheckerPage'
import DataProtectionPage  from './pages/DataProtectionPage'
import AdminDashboardPage  from './pages/AdminDashboardPage'
import NotFound      from './pages/NotFound'

export default function App() {
  const { isAuthenticated } = useAuth()
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login"    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

      {/* Protected — use DashboardLayout (sidebar + navbar) */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard"          element={<Dashboard />} />
        <Route path="/learning"           element={<LearningHub />} />
        <Route path="/learning/:id"       element={<ModuleDetail />} />
        <Route path="/quizzes"            element={<QuizzesPage />} />
        <Route path="/quizzes/:id"        element={<QuizTake />} />
        <Route path="/quizzes/result/:id" element={<QuizResult />} />
        <Route path="/tips"               element={<CyberTipsPage />} />
        <Route path="/pledge"             element={<SafetyPledge />} />
        <Route path="/leaderboard"        element={<Leaderboard />} />
        <Route path="/profile"            element={<ProfilePage />} />
        <Route path="/password-checker"   element={<PasswordCheckerPage />} />
        <Route path="/data-protection"    element={<DataProtectionPage />} />
        <Route path="/admin-dashboard"    element={<AdminDashboardPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
