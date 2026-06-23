import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Link2, Loader2, Eye, EyeOff, ArrowLeft, MailCheck, KeyRound } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { ApiError } from "@/lib/api"
import { ModeToggle } from "@/features/theme/mode-toggle"

type Tab = "login" | "register" | "verify" | "forgot" | "reset"

interface AuthScreenProps {
  initialTab?: Tab
}

export function AuthScreen({ initialTab = "login" }: AuthScreenProps) {
  const navigate = useNavigate()
  const { login, register, verifyOtp, resendOtp, forgotPassword, resetPassword } = useAuth()
  const [tab, setTab] = useState<Tab>(initialTab)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState("")
  const [infoMessage, setInfoMessage] = useState("")

  useEffect(() => {
    if (initialTab && initialTab !== "verify" && initialTab !== "forgot" && initialTab !== "reset") {
      setTab(initialTab)
      setError("")
      setInfoMessage("")
    }
  }, [initialTab])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (tab === "verify") {
      if (!email.trim() || !otpCode.trim()) {
        setError("Email and verification code are required.")
        return
      }
      setIsLoading(true)
      setError("")
      try {
        await verifyOtp(email.trim(), otpCode.trim())
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Verification failed.")
      } finally {
        setIsLoading(false)
      }
      return
    }

    if (tab === "forgot") {
      if (!email.trim()) {
        setError("Email is required.")
        return
      }
      setIsLoading(true)
      setError("")
      setInfoMessage("")
      try {
        const res = await forgotPassword(email.trim())
        setInfoMessage(res.message || "OTP code sent to email.")
        setTab("reset")
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to send reset code.")
      } finally {
        setIsLoading(false)
      }
      return
    }

    if (tab === "reset") {
      if (!email.trim() || !otpCode.trim() || !newPassword.trim()) {
        setError("All fields are required.")
        return
      }
      if (newPassword !== confirmNewPassword) {
        setError("Passwords do not match.")
        return
      }
      setIsLoading(true)
      setError("")
      setInfoMessage("")
      try {
        const res = await resetPassword({
          email: email.trim(),
          otpCode: otpCode.trim(),
          newPassword,
        })
        setInfoMessage(res.message || "Password reset successful.")
        setTab("login")
        setPassword("")
        setNewPassword("")
        setConfirmNewPassword("")
        setOtpCode("")
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Password reset failed.")
      } finally {
        setIsLoading(false)
      }
      return
    }

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.")
      return
    }
    setIsLoading(true)
    setError("")
    setInfoMessage("")
    try {
      if (tab === "login") {
        await login({ email: email.trim(), password })
      } else {
        const res = await register({ email: email.trim(), password })
        setInfoMessage(res.message || "Verification code sent. Please check your inbox.")
        setTab("verify")
      }
    } catch (err) {
      const errMsg = err instanceof ApiError ? err.message : "Something went wrong."
      setError(errMsg)
      if (errMsg.toLowerCase().includes("verify") || errMsg.toLowerCase().includes("verification")) {
        setTab("verify")
        setInfoMessage(errMsg)
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResend() {
    if (!email.trim()) {
      setError("Email is required to resend verification code.")
      return
    }
    setIsResending(true)
    setError("")
    setInfoMessage("")
    try {
      const res = await resendOtp(email.trim())
      setInfoMessage(res.message || "Verification code resent. Please check your inbox.")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to resend code.")
    } finally {
      setIsResending(false)
    }
  }

  function switchTab(next: "login" | "register") {
    setTab(next)
    navigate(next === "login" ? "/signin" : "/signup")
    setError("")
    setInfoMessage("")
    setOtpCode("")
    setEmail("")
    setPassword("")
    setNewPassword("")
    setConfirmNewPassword("")
  }

  const isOtpFlow = tab === "verify" || tab === "reset"
  const isSwitcherVisible = tab !== "verify" && tab !== "forgot" && tab !== "reset"

  const title = (() => {
    if (tab === "login") return "Welcome back"
    if (tab === "register") return "Create an account"
    if (tab === "verify") return "Verify your email"
    if (tab === "forgot") return "Forgot password?"
    return "Reset password"
  })()

  const description = (() => {
    if (tab === "login") return "Sign in to manage your short links"
    if (tab === "register") return "Start shortening URLs for free"
    if (tab === "verify") return "Enter the 6-digit code sent to your inbox"
    if (tab === "forgot") return "Enter your email to receive a password reset code"
    return "Enter code and choose a new password"
  })()

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Floating Back Button */}
      <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Floating Theme Switcher */}
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <ModeToggle />
      </div>

      {/* Center card */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm flex flex-col">
          {/* Logo hero */}
          <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              {tab === "verify" ? (
                <MailCheck className="h-7 w-7" />
              ) : tab === "forgot" || tab === "reset" ? (
                <KeyRound className="h-7 w-7" />
              ) : (
                <Link2 className="h-7 w-7" />
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Tab switcher */}
          {isSwitcherVisible && (
            <div className="mb-6 flex rounded-lg bg-muted p-1">
              {(["login", "register"] as const).map((t) => (
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
          )}

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
                  disabled={isLoading || tab === "verify" || tab === "reset"}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:bg-muted/40"
                />
              </div>

              {isOtpFlow && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="auth-otp"
                    className="text-sm font-medium text-foreground"
                  >
                    Verification Code
                  </label>
                  <input
                    id="auth-otp"
                    type="text"
                    pattern="\d{6}"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    disabled={isLoading}
                    className="w-full text-center tracking-[0.75em] text-lg font-mono rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  />
                </div>
              )}

              {tab === "login" && (
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="auth-password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setTab("forgot")
                      setError("")
                      setInfoMessage("")
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {tab === "register" && (
                <label
                  htmlFor="auth-password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>
              )}

              {(tab === "login" || tab === "register") && (
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
              )}

              {tab === "reset" && (
                <>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="auth-new-password"
                      className="text-sm font-medium text-foreground"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="auth-new-password"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isLoading}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="auth-confirm-new-password"
                      className="text-sm font-medium text-foreground"
                    >
                      Confirm New Password
                    </label>
                    <input
                      id="auth-confirm-new-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    />
                  </div>
                </>
              )}

              {infoMessage && (
                <div className="rounded-md bg-primary/10 border border-primary/20 px-3 py-2 text-sm text-primary">
                  {infoMessage}
                </div>
              )}

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
                {tab === "login"
                  ? "Sign in"
                  : tab === "register"
                    ? "Create account"
                    : tab === "verify"
                      ? "Verify & Sign in"
                      : tab === "forgot"
                        ? "Send Reset Code"
                        : "Reset Password"}
              </button>

              {tab === "verify" && (
                <div className="text-center text-xs mt-2">
                  <span className="text-muted-foreground">Didn't receive the code? </span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending || isLoading}
                    className="underline text-primary hover:text-primary/80 font-medium disabled:opacity-50"
                  >
                    {isResending ? "Resending..." : "Resend code"}
                  </button>
                </div>
              )}
            </form>
          </div>

          {isSwitcherVisible ? (
            <p className="mt-4 text-center text-xs text-muted-foreground animate-in fade-in duration-200">
              {tab === "login" ? "Don't have an account? " : "Already have one? "}
              <button
                type="button"
                onClick={() => switchTab(tab === "login" ? "register" : "login")}
                className="underline hover:text-foreground"
              >
                {tab === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          ) : (
            <p className="mt-4 text-center text-xs text-muted-foreground animate-in fade-in duration-200">
              <button
                type="button"
                onClick={() => {
                  setTab("login")
                  setError("")
                  setInfoMessage("")
                  setOtpCode("")
                  setEmail("")
                  setPassword("")
                  setNewPassword("")
                  setConfirmNewPassword("")
                }}
                className="underline hover:text-foreground"
              >
                Back to Sign in
              </button>
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
