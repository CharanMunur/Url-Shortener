import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "@/providers/auth-provider"
import { AuthScreen } from "@/components/auth-screen"
import { DashboardShell } from "@/components/dashboard-shell"
import { LandingPage } from "@/pages/LandingPage"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

function AppRoutes() {
  const { token } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />
      <Route
        path="/signin"
        element={token ? <Navigate to="/dashboard" replace /> : <AuthScreen initialTab="login" />}
      />
      <Route
        path="/signup"
        element={token ? <Navigate to="/dashboard" replace /> : <AuthScreen initialTab="register" />}
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={token ? <DashboardShell /> : <Navigate to="/signin" replace />}
      />
      <Route
        path="/dashboard/*"
        element={token ? <DashboardShell /> : <Navigate to="/signin" replace />}
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
