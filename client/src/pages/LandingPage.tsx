import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Link2,
  Zap,
  BarChart3,
  Shield,
  Copy,
  ArrowRight,
  CheckCircle2,
  MousePointerClick,
  Globe2,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/features/theme/mode-toggle"

const FEATURES = [
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Instant shortening",
    description: "Paste a long URL and get a clean, shareable link in milliseconds.",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Click analytics",
    description: "Track every click with browser, OS, and time breakdowns in real time.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Secure & private",
    description: "Your links and analytics are tied to your account — no data sharing.",
  },
  {
    icon: <Globe2 className="h-5 w-5" />,
    title: "Works everywhere",
    description: "Share links across any platform — social media, email, or docs.",
  },
]

const STATS = [
  { value: "< 1ms", label: "Redirect latency" },
  { value: "100%", label: "Uptime SLA" },
  { value: "∞", label: "Links per account" },
]

const DEMO_URL = "https://www.example.com/some/very/long/path/to/a/page?with=query&params=here"
const DEMO_SHORT = "shrtn.app/xK9mPq"

export function LandingPage() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  function copyDemo() {
    navigator.clipboard.writeText(DEMO_SHORT).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Link2 className="h-4 w-4" />
            </div>
            <span className="font-bold tracking-tight text-foreground">Shrtn</span>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button variant="ghost" size="sm" onClick={() => navigate("/signin")} className="text-sm">
              Sign in
            </Button>
            <Button size="sm" onClick={() => navigate("/signup")} className="text-sm gap-1.5">
              Get started
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24">
          {/* Subtle radial gradient background decoration */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% -10%, hsl(var(--primary) / 0.08), transparent)",
            }}
          />

          <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
            <Badge variant="secondary" className="mb-6 gap-1.5 text-xs font-medium px-3 py-1">
              <TrendingUp className="h-3 w-3" />
              Free forever · No credit card required
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              Short links.{" "}
              <span className="text-muted-foreground font-normal">Big insights.</span>
            </h1>

            <p className="mx-auto max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed mb-10">
              Shrtn turns unwieldy URLs into clean, memorable links — with built‑in analytics so you
              always know who's clicking.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
              <Button size="lg" onClick={() => navigate("/signup")} className="gap-2 px-7 w-full sm:w-auto">
                Start shortening — it's free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/signin")}
                className="w-full sm:w-auto"
              >
                Sign in
              </Button>
            </div>

            {/* Demo card */}
            <div className="mx-auto max-w-lg rounded-xl border border-border bg-card shadow-sm overflow-hidden text-left">
              {/* Input row */}
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                  Long URL
                </p>
                <p className="text-sm text-muted-foreground font-mono truncate">{DEMO_URL}</p>
              </div>
              {/* Output row */}
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Short link
                  </p>
                  <p className="text-sm font-semibold text-primary font-mono">{DEMO_SHORT}</p>
                </div>
                <button
                  onClick={copyDemo}
                  className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors shrink-0"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ───────────────────────────────────────────────────────── */}
        <section className="border-y border-border bg-muted/30 py-10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="grid grid-cols-3 gap-6 sm:gap-12">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold tabular-nums text-foreground">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                Everything you need. Nothing you don't.
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
                A focused set of tools to create, manage, and measure your short links.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="group rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8 text-primary mb-4 group-hover:bg-primary/12 transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-base mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Analytics preview ───────────────────────────────────────────── */}
        <section className="border-t border-border bg-muted/20 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Copy */}
              <div>
                <Badge variant="secondary" className="mb-4 text-xs gap-1.5 px-3 py-1">
                  <MousePointerClick className="h-3 w-3" />
                  Analytics
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                  Know exactly who's clicking
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                  Every short link comes with a live analytics dashboard. See total clicks, browser
                  breakdown, OS breakdown, and a log of recent visits — all in one place.
                </p>
                <ul className="space-y-2.5">
                  {[
                    "Total clicks over time",
                    "Browser & OS breakdown",
                    "Recent click log with timestamps",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mock analytics card */}
              <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">Browsers</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Clicks</span>
                </div>
                {/* Rows */}
                {[
                  { name: "Chrome", pct: 72, count: 1842, color: "#4285F4" },
                  { name: "Firefox", pct: 16, count: 409, color: "#FF7139" },
                  { name: "Safari", pct: 9, count: 230, color: "#006CFF" },
                  { name: "Edge", pct: 3, count: 77, color: "#0078D7" },
                ].map((row) => (
                  <div key={row.name} className="relative px-5 py-3 hover:bg-muted/20 transition-colors">
                    <div
                      className="absolute inset-y-0 left-0 bg-primary/8 rounded-r transition-all"
                      style={{ width: `${row.pct}%` }}
                    />
                    <div className="relative flex items-center gap-3">
                      <div
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: row.color }}
                      />
                      <span className="flex-1 text-sm font-medium">{row.name}</span>
                      <span className="text-xs text-muted-foreground w-8 text-right">{row.pct}%</span>
                      <span className="text-sm font-semibold tabular-nums w-12 text-right">
                        {row.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
                {/* Footer total */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/30">
                  <span className="text-xs text-muted-foreground">Total clicks</span>
                  <span className="text-sm font-bold tabular-nums">2,558</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="border-t border-border py-20 sm:py-28">
          <div className="mx-auto max-w-xl px-4 sm:px-6 text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <Link2 className="h-7 w-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Start for free, right now
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-8">
              No credit card. No limits. Just cleaner links.
            </p>
            <Button size="lg" onClick={() => navigate("/signup")} className="gap-2 px-8">
              Create your account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Link2 className="h-3 w-3" />
              </div>
              <span className="text-sm font-semibold">Shrtn</span>
            </div>
            <Separator orientation="vertical" className="hidden sm:block h-4" />
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Shrtn. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
