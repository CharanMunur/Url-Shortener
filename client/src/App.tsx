import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom"
import { AuthProvider, useAuth } from "@/providers/auth-provider"
import { AuthScreen } from "@/components/auth-screen"
import { DashboardShell } from "@/components/dashboard-shell"
import { LandingPage } from "@/pages/LandingPage"
import { getApiBaseUrl } from "@/lib/env"
import { Loader2 } from "lucide-react"

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
  const { token, isHydrated } = useAuth()

  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-sm">Loading...</span>
      </div>
    )
  }

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
        path="/dashboard/*"
        element={token ? <DashboardShell /> : <Navigate to="/signin" replace />}
      />

      {/* Public Shortcode Redirect Handler */}
      <Route path="/:shortCode" element={<RedirectHandler />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function RedirectHandler() {
  const { shortCode } = useParams()

  useEffect(() => {
    if (shortCode) {
      const reserved = ["signin", "signup", "dashboard"]
      if (reserved.includes(shortCode.toLowerCase())) {
        return
      }
      const apiBase = getApiBaseUrl().replace(/\/$/, "")
      window.location.href = `${apiBase}/${shortCode}`
    }
  }, [shortCode])

  const reserved = ["signin", "signup", "dashboard"]
  if (shortCode && reserved.includes(shortCode.toLowerCase())) {
    return <Navigate to={`/${shortCode}`} replace />
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="ml-2 text-sm">Redirecting…</span>
    </div>
  )
}

export default App
