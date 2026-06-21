import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link2, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { ApiError } from "@/lib/api"
import { ModeToggle } from "@/features/theme/mode-toggle"

type Tab = "login" | "register"

interface AuthScreenProps {
  initialTab?: Tab
}

export function AuthScreen({ initialTab = "login" }: AuthScreenProps) {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [tab, setTab] = useState<Tab>(initialTab)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.")
      return
    }
    setIsLoading(true)
    setError("")
    try {
      if (tab === "login") {
        await login({ email: email.trim(), password })
      } else {
        await register({ email: email.trim(), password })
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  function switchTab(next: Tab) {
    navigate(next === "login" ? "/signin" : "/signup")
    setError("")
    setEmail("")
    setPassword("")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mr-1 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Link2 className="h-4 w-4" />
          </div>
          <span className="font-semibold text-foreground">Shrtn</span>
        </div>
        <ModeToggle />
      </header>

      {/* Center card */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Logo hero */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <Link2 className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {tab === "login" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {tab === "login"
                ? "Sign in to manage your short links"
                : "Start shortening URLs for free"}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="mb-6 flex rounded-lg bg-muted p-1">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => switchTab(t)}
                className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-all ${
                  tab === t
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "login" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          {/* Form card */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="auth-email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="auth-password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      tab === "login" ? "current-password" : "new-password"
                    }
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {tab === "login" ? "Sign in" : "Create account"}
              </button>
            </form>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            {tab === "login" ? "Don't have an account? " : "Already have one? "}
            <button
              type="button"
              onClick={() => navigate(tab === "login" ? "/signup" : "/signin")}
              className="underline hover:text-foreground"
            >
              {tab === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}
