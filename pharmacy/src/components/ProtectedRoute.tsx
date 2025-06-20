import React, { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token, loading, pharmacy, isProfileComplete } = useAuthStore()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Check if pharmacy profile is complete
  if (!isProfileComplete && location.pathname !== '/profile') {
    return <Navigate to="/profile" replace />
  }

  // Check if pharmacy is approved
  if (isProfileComplete && pharmacy && !pharmacy.isActive && location.pathname !== '/pending-approval') {
    return <Navigate to="/pending-approval" replace />
  }

  // If trying to access profile when already complete and approved, redirect to dashboard
  if (isProfileComplete && pharmacy?.isActive && location.pathname === '/profile' && location.search !== '?edit=true') {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute