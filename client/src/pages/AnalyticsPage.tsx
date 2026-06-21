import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/providers/auth-provider"
import { getUserUrls, getUrlAnalytics } from "@/lib/urls-api"
import { ApiError } from "@/lib/api"
import { extractShortCode, formatDateTime } from "@/lib/url"
import { getBrowserIcon, getOsIcon, type IconData } from "@/lib/icons"
import type { UrlAnalyticsResponse, UrlResponse } from "@/types/api"
import {
  Loader2,
  MousePointerClick,
  Globe2,
  Monitor,
  Clock,
  ChevronDown,
  Link2,
  BarChart3,
} from "lucide-react"

interface AnalyticsPageProps {
  initialShortCode?: string | null
}

export function AnalyticsPage({ initialShortCode }: AnalyticsPageProps) {
  const { token } = useAuth()
  const [urls, setUrls] = useState<UrlResponse[]>([])
  const [selectedCode, setSelectedCode] = useState<string>(initialShortCode ?? "")
  const [analytics, setAnalytics] = useState<UrlAnalyticsResponse | null>(null)
  const [isLoadingUrls, setIsLoadingUrls] = useState(true)
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getUserUrls(token!)
        setUrls(data)
        if (!initialShortCode && data.length > 0) {
          setSelectedCode(extractShortCode(data[0].shortUrl))
        }
      } catch {
        // ignore
      } finally {
        setIsLoadingUrls(false)
      }
    })()
  }, [token, initialShortCode])

  const loadAnalytics = useCallback(
    async (code: string) => {
      if (!code) return
      setIsLoadingAnalytics(true)
      setError("")
      setAnalytics(null)
      try {
        const data = await getUrlAnalytics(code, token!)
        setAnalytics(data)
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load analytics.")
      } finally {
        setIsLoadingAnalytics(false)
      }
    },
    [token]
  )

  useEffect(() => {
    if (selectedCode) loadAnalytics(selectedCode)
  }, [selectedCode, loadAnalytics])

  function topEntries(record: Record<string, number>, max = 8) {
    return Object.entries(record ?? {})
      .sort(([, a], [, b]) => b - a)
      .slice(0, max)
  }

  const browserEntries = analytics ? topEntries(analytics.browserBreakdown) : []
  const osEntries = analytics ? topEntries(analytics.osBreakdown) : []
  const total = analytics?.totalClicks ?? 0

  return (
    <div className="space-y-6 py-8 w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Detailed click insights for your short links.
          </p>
        </div>

        {/* URL selector */}
        {!isLoadingUrls && urls.length > 0 && (
          <div className="relative">
            <select
              id="url-select"
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.target.value)}
              className="appearance-none rounded-lg border border-border bg-card px-4 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              {urls.map((u) => {
                const code = extractShortCode(u.shortUrl)
                return (
                  <option key={code || u.shortUrl} value={code}>
                    /{code}
                  </option>
                )
              })}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {isLoadingUrls || isLoadingAnalytics ? (
        <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">
            {isLoadingUrls ? "Loading links…" : "Loading analytics…"}
          </span>
        </div>
      ) : !analytics ? (
        <EmptyState urls={urls} />
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Link info card */}
          <div className="rounded-xl border border-border bg-card px-5 py-4 overflow-hidden">
            <div className="flex items-start gap-3 w-full min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Link2 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-base font-bold text-primary">
                    /{analytics.shortCode}
                  </span>
                  <span className="text-xs text-muted-foreground">short link</span>
                </div>
                {analytics.originalUrl && (
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed break-all">
                    {analytics.originalUrl}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard
              icon={<MousePointerClick className="h-4 w-4" />}
              label="Total Clicks"
              value={total.toLocaleString()}
              highlight
            />
            <MetricCard
              icon={<Globe2 className="h-4 w-4" />}
              label="Browsers"
              value={Object.keys(analytics.browserBreakdown ?? {}).length.toString()}
            />
            <MetricCard
              icon={<Monitor className="h-4 w-4" />}
              label="OS Types"
              value={Object.keys(analytics.osBreakdown ?? {}).length.toString()}
            />
            <MetricCard
              icon={<Clock className="h-4 w-4" />}
              label="Recent Clicks"
              value={(analytics.lastClicks?.length ?? 0).toString()}
            />
          </div>

          {/* Browser + OS breakdown — Umami style */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BreakdownTable
              title="Browsers"
              icon={<Globe2 className="h-4 w-4" />}
              entries={browserEntries}
              total={total}
              getIcon={getBrowserIcon}
            />
            <BreakdownTable
              title="Operating Systems"
              icon={<Monitor className="h-4 w-4" />}
              entries={osEntries}
              total={total}
              getIcon={getOsIcon}
            />
          </div>

          {/* Recent clicks */}
          {analytics.lastClicks && analytics.lastClicks.length > 0 && (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Recent Clicks</h3>
                <span className="ml-auto text-xs text-muted-foreground">
                  Last {Math.min(analytics.lastClicks.length, 5)} of {total.toLocaleString()}
                </span>
              </div>
              <div className="divide-y divide-border">
                {analytics.lastClicks.slice(0, 5).map((click, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-foreground font-medium truncate">
                        {click.userAgent ? parseUserAgent(click.userAgent) : "Unknown agent"}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                        {click.userAgent || "—"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">
                        {click.ipAddress || "—"}
                      </p>
                      <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                        {click.clickedAt ? formatDateTime(click.clickedAt) : "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function MetricCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-2 ${
        highlight
          ? "border-primary/25 bg-primary/5"
          : "border-border bg-card"
      }`}
    >
      <div className={`flex items-center gap-1.5 text-xs font-medium ${
        highlight ? "text-primary" : "text-muted-foreground"
      }`}>
        {icon}
        {label}
      </div>
      <p className={`text-2xl font-bold tabular-nums ${
        highlight ? "text-primary" : "text-foreground"
      }`}>
        {value}
      </p>
    </div>
  )
}

function BreakdownTable({
  title,
  icon,
  entries,
  total,
  getIcon,
}: {
  title: string
  icon: React.ReactNode
  entries: [string, number][]
  total: number
  getIcon: (name: string) => IconData | null
}) {
  const max = entries[0]?.[1] ?? 1

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <span className="text-muted-foreground">{icon}</span>
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="ml-auto text-xs text-muted-foreground">Clicks</span>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
          <BarChart3 className="h-6 w-6 opacity-30" />
          <p className="text-sm">No data yet</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {entries.map(([name, count]) => {
            const iconData = getIcon(name)
            const barPct = Math.round((count / max) * 100)
            const totalPct = total ? Math.round((count / total) * 100) : 0

            return (
              <div key={name} className="group relative px-5 py-3 hover:bg-muted/20 transition-colors">
                {/* Progress fill behind row */}
                <div
                  className="absolute inset-y-0 left-0 bg-primary/8 rounded-r transition-all duration-500"
                  style={{ width: `${barPct}%` }}
                />

                <div className="relative flex items-center gap-3">
                  {/* Icon */}
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center">
                    {iconData ? (
                      <img
                        src={iconData.url}
                        alt={iconData.label}
                        className="h-5 w-5 object-contain"
                        loading="lazy"
                        onError={(e) => {
                          const el = e.currentTarget
                          el.style.display = "none"
                          const fallback = el.nextElementSibling as HTMLElement | null
                          if (fallback) fallback.style.display = "flex"
                        }}
                      />
                    ) : null}
                    <div
                      className="h-5 w-5 rounded-full bg-muted-foreground/20 items-center justify-center text-[10px] font-bold text-muted-foreground uppercase"
                      style={{ display: iconData ? "none" : "flex" }}
                    >
                      {name.charAt(0)}
                    </div>
                  </div>

                  {/* Name */}
                  <span className="flex-1 text-sm font-medium truncate">
                    {name || "Unknown"}
                  </span>

                  {/* Count + percent */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {totalPct}%
                    </span>
                    <span className="text-sm font-semibold tabular-nums w-12 text-right">
                      {count.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function EmptyState({ urls }: { urls: UrlResponse[] }) {
  if (urls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 gap-3 text-center">
        <BarChart3 className="h-10 w-10 text-muted-foreground opacity-30" />
        <p className="font-medium">No links yet</p>
        <p className="text-sm text-muted-foreground">Shorten your first URL to start tracking.</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center text-muted-foreground">
      <BarChart3 className="h-10 w-10 opacity-30" />
      <p className="font-medium">No clicks yet</p>
      <p className="text-sm">Share your short link to start collecting analytics.</p>
    </div>
  )
}

function parseUserAgent(ua: string): string {
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome"
  if (ua.includes("Firefox")) return "Firefox"
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari"
  if (ua.includes("Edg")) return "Edge"
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera"
  if (ua.includes("curl")) return "curl"
  return ua.split(" ")[0] ?? "Unknown"
}
