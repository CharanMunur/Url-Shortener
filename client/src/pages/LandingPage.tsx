import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
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
  Clock,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 110,
      damping: 14,
      mass: 1,
    },
  },
} as const

const FEATURES = [
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Instant shortening",
    description: "Paste a long URL and get a clean, shareable link in milliseconds.",
    gradient: "from-amber-500/20 to-orange-500/10",
    iconColor: "text-amber-500",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Click analytics",
    description: "Track every click with browser, OS, and time breakdowns in real time.",
    gradient: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-blue-500",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Secure & private",
    description: "Your links and analytics are tied to your account — no data sharing.",
    gradient: "from-green-500/20 to-emerald-500/10",
    iconColor: "text-green-500",
  },
  {
    icon: <Globe2 className="h-5 w-5" />,
    title: "Works everywhere",
    description: "Share links across any platform — social media, email, or docs.",
    gradient: "from-purple-500/20 to-violet-500/10",
    iconColor: "text-purple-500",
  },
]

const STATS = [
  { value: "< 1ms", label: "Redirect latency", icon: <Zap className="h-4 w-4" /> },
  { value: "99.9%", label: "Uptime SLA", icon: <Clock className="h-4 w-4" /> },
  { value: "Free", label: "Forever plan", icon: <Sparkles className="h-4 w-4" /> },
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
    <div className="dark bg-background text-foreground min-h-screen flex flex-col">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 w-full">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Link2 className="h-4 w-4" />
            </div>
            <span className="font-bold tracking-tight text-foreground">Shrtn</span>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center">
            <Button variant="outline" size="sm" onClick={() => navigate("/signin")} className="text-sm font-medium">
              Sign in
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <motion.section
          className="relative overflow-hidden w-full min-h-[calc(100vh-3.5rem)] flex flex-col justify-center py-12 sm:py-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Background decorations */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% -5%, color-mix(in srgb, var(--primary) 12%, transparent), transparent 70%)",
            }}
          />
          {/* Floating orbs */}
          <div
            className="pointer-events-none absolute -z-10 top-1/4 left-[10%] h-94 w-64 rounded-full opacity-30 blur-3xl"
            style={{ background: "color-mix(in srgb, var(--primary) 25%, transparent)" }}
          />
          <div
            className="pointer-events-none absolute -z-10 top-1/3 right-[8%] h-48 w-48 rounded-full opacity-20 blur-3xl"
            style={{ background: "color-mix(in srgb, var(--primary) 35%, transparent)" }}
          />

          <div className="w-full mx-auto max-w-3xl px-4 sm:px-6" style={{ textAlign: "center" }}>
            <motion.div className="flex justify-center mb-4" variants={itemVariants}>
              <Badge variant="secondary" className="gap-1.5 text-xs font-medium px-3 py-1 rounded-full">
                <TrendingUp className="h-3 w-3" />
                Free forever · No credit card required
              </Badge>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-6xl lg:text-[72px] font-bold tracking-tight leading-tight mb-3 text-center"
              style={{ textAlign: "center" }}
              variants={itemVariants}
            >
              Short links.{" "}
              <span className="bg-linear-to-r from-primary to-primary/55 bg-clip-text text-transparent inline">
                Big insights.
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto max-w-lg text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 text-center"
              style={{ textAlign: "center" }}
              variants={itemVariants}
            >
              Shrtn turns unwieldy URLs into clean, memorable links — with built‑in analytics so you always know who's clicking.
            </motion.p>

            <motion.div
              className="flex flex-row items-center justify-center gap-3 mb-6"
              variants={itemVariants}
            >
              <Button size="lg" onClick={() => navigate("/signup")} className="gap-1.5 px-5 shadow-md text-sm sm:text-base">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/signin")}
                className="text-sm sm:text-base"
              >
                Sign in
              </Button>
            </motion.div>

            {/* Demo card */}
            <motion.div
              className="w-full mx-auto max-w-md rounded-2xl border border-border bg-card p-4 shadow-lg text-left flex items-center justify-between gap-4 ring-1 ring-black/5 dark:ring-white/5"
              variants={itemVariants}
            >
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider">
                  Demo Link
                </p>
                <p className="text-base font-extrabold text-primary font-mono truncate">{DEMO_SHORT}</p>
                <p className="text-xs text-muted-foreground/60 truncate font-mono">{DEMO_URL}</p>
              </div>
              <button
                onClick={copyDemo}
                className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  copied
                    ? "border-green-500/30 bg-green-500/10 text-green-600"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </motion.section>

        {/* ── Stats ───────────────────────────────────────────────────────── */}
        <section className="border-y border-border bg-muted/20 py-12">
          <div className="w-full mx-auto max-w-4xl px-4 sm:px-6">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x divide-border"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {STATS.map((s) => (
                <motion.div key={s.label} className="flex flex-col items-center gap-2 px-4 sm:px-10" variants={itemVariants}>
                  <div className="flex items-center gap-2 text-primary/70">
                    {s.icon}
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold tabular-nums text-foreground">
                    {s.value}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground text-center">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────────── */}
        <section className="py-24 sm:py-32">
          <div className="w-full mx-auto max-w-5xl px-4 sm:px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Badge variant="secondary" className="mb-4 text-xs px-3 py-1 rounded-full">
                Features
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                Everything you need.{" "}
                <span className="text-muted-foreground font-normal">Nothing you don't.</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
                A focused set of tools to create, manage, and measure your short links.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {FEATURES.map((f) => (
                <motion.div
                  key={f.title}
                  className="group relative rounded-2xl border border-border bg-card p-6 hover:border-primary/20 hover:shadow-md transition-all duration-300 overflow-hidden"
                  variants={itemVariants}
                >
                  {/* Card bg gradient on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                    style={{ background: "radial-gradient(ellipse 80% 60% at 20% 30%, color-mix(in srgb, var(--primary) 4%, transparent), transparent)" }}
                  />
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br ${f.gradient} ${f.iconColor} mb-5 group-hover:scale-105 transition-transform duration-300`}>
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Analytics preview ───────────────────────────────────────────── */}
        <section className="border-t border-border py-24 sm:py-32" style={{ background: "color-mix(in srgb, var(--muted) 15%, transparent)" }}>
          <div className="w-full mx-auto max-w-5xl px-4 sm:px-6">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Copy */}
              <div>
                <Badge variant="secondary" className="mb-5 text-xs gap-1.5 px-3 py-1 rounded-full">
                  <MousePointerClick className="h-3 w-3" />
                  Analytics
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4 leading-tight">
                  Know exactly<br />who's clicking
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8">
                  Every short link comes with a live analytics dashboard. See total clicks, browser
                  breakdown, OS breakdown, and a log of recent visits — all in one place.
                </p>
                <ul className="space-y-3">
                  {[
                    "Total clicks over time",
                    "Browser & OS breakdown",
                    "Recent click log with timestamps",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mock analytics card */}
              <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">Browser breakdown</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5">Live</Badge>
                </div>
                {/* Rows */}
                <div className="divide-y divide-border/50">
                  {[
                    { name: "Chrome", pct: 72, count: 1842, color: "#4285F4" },
                    { name: "Firefox", pct: 16, count: 409, color: "#FF7139" },
                    { name: "Safari", pct: 9, count: 230, color: "#0066FF" },
                    { name: "Edge", pct: 3, count: 77, color: "#0078D7" },
                  ].map((row) => (
                    <div key={row.name} className="relative px-5 py-3.5 group/row hover:bg-muted/20 transition-colors">
                      {/* Progress bar background */}
                      <div
                        className="absolute inset-y-0 left-0 bg-primary/6 transition-all group-hover/row:bg-primary/10"
                        style={{ width: `${row.pct}%` }}
                      />
                      <div className="relative flex items-center gap-3">
                        <div
                          className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: row.color }}
                        />
                        <span className="flex-1 text-sm font-medium">{row.name}</span>
                        <span className="text-xs text-muted-foreground w-8 text-right tabular-nums">{row.pct}%</span>
                        <span className="text-sm font-bold tabular-nums w-14 text-right">
                          {row.count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Footer total */}
                <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-muted/30">
                  <span className="text-xs font-medium text-muted-foreground">Total clicks</span>
                  <span className="text-sm font-bold tabular-nums text-foreground">2,558</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="border-t border-border py-24 sm:py-32 relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: "radial-gradient(ellipse 70% 60% at 50% 100%, color-mix(in srgb, var(--primary) 7%, transparent), transparent 70%)",
            }}
          />
          <motion.div
            className="w-full mx-auto max-w-xl px-4 sm:px-6 text-center"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/30">
              <Link2 className="h-7 w-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Start for free, right now
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-10 leading-relaxed">
              No credit card. No limits. Just cleaner links and better insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" onClick={() => navigate("/signup")} className="gap-2 px-8 shadow-lg shadow-primary/20 w-full sm:w-auto">
                Create your account
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="lg" onClick={() => navigate("/signin")} className="w-full sm:w-auto text-muted-foreground">
                Already have an account?
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-muted/20">
        <div className="w-full mx-auto max-w-6xl px-4 sm:px-6">
          {/* Main footer row */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-10 py-12">
            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <Link2 className="h-4 w-4" />
                </div>
                <span className="text-base font-bold text-foreground">Shrtn</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A fast, free URL shortener with built-in click analytics. Shorten links and understand your audience.
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Product</p>
                <ul className="space-y-2 flex flex-col items-start">
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard")}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left"
                    >
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard/analytics")}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left"
                    >
                      Analytics
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard/links")}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left"
                    >
                      My Links
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Account</p>
                <ul className="space-y-2 flex flex-col items-start">
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate("/signin")}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left"
                    >
                      Sign in
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate("/signup")}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left"
                    >
                      Sign up
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Shrtn. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made by{" "}
              <a
                href="https://www.charanmunur.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-muted-foreground/30 hover:decoration-primary text-base"
              >
                charanmunur
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
