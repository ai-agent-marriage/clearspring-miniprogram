import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import OrderManagement from './pages/OrderManagement'
import QualificationReview from './pages/QualificationReview'
import AppealArbitration from './pages/AppealArbitration'
import ProfitSharingConfig from './pages/ProfitSharingConfig'
import ExecutorManagement from './pages/ExecutorManagement'
import DataExport from './pages/DataExport'
import SystemSettings from './pages/SystemSettings'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // 受保护的路由组件
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrderManagement /></ProtectedRoute>} />
      <Route path="/qualifications" element={<ProtectedRoute><QualificationReview /></ProtectedRoute>} />
      <Route path="/appeals" element={<ProtectedRoute><AppealArbitration /></ProtectedRoute>} />
      <Route path="/profit-sharing" element={<ProtectedRoute><ProfitSharingConfig /></ProtectedRoute>} />
      <Route path="/executors" element={<ProtectedRoute><ExecutorManagement /></ProtectedRoute>} />
      <Route path="/export" element={<ProtectedRoute><DataExport /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SystemSettings /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
