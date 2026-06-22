import { useEffect, useState, useCallback } from "react"
import {
  Copy,
  ExternalLink,
  Trash2,
  BarChart2,
  Loader2,
  RefreshCw,
  Link2,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/providers/auth-provider"
import { getUserUrls, toggleUrl, deleteUrl } from "@/lib/urls-api"
import { ApiError } from "@/lib/api"
import { formatRelativeTime, enrichUrls, type EnrichedUrl } from "@/lib/url"

interface MyLinksPageProps {
  onViewAnalytics: (shortCode: string) => void
}

export function MyLinksPage({ onViewAnalytics }: MyLinksPageProps) {
  const { token } = useAuth()
  const [urls, setUrls] = useState<EnrichedUrl[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [togglingUrl, setTogglingUrl] = useState<string | null>(null)
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null)
  const [confirmDeleteUrl, setConfirmDeleteUrl] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError("")
    try {
      const data = await getUserUrls(token!)
      setUrls(enrichUrls(data))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load links.")
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  async function handleToggle(url: EnrichedUrl) {
    if (!url.shortCode) return
    setTogglingUrl(url.shortUrl)
    try {
      const newActive = await toggleUrl(url.shortCode, token!)
      setUrls((prev) =>
        prev.map((u) => (u.shortUrl === url.shortUrl ? { ...u, isActive: newActive } : u))
      )
    } catch {
      // silently fail; refresh will sync
    } finally {
      setTogglingUrl(null)
    }
  }

  async function handleDelete(url: EnrichedUrl) {
    if (!url.shortCode) return
    setDeletingUrl(url.shortUrl)
    try {
      await deleteUrl(url.shortCode, token!)
      setUrls((prev) => prev.filter((u) => u.shortUrl !== url.shortUrl))
    } catch {
      // silently fail
    } finally {
      setDeletingUrl(null)
      setConfirmDeleteUrl(null)
    }
  }

  async function handleCopy(shortUrl: string) {
    await navigator.clipboard.writeText(shortUrl)
    setCopiedUrl(shortUrl)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="text-sm">Loading your links…</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Links</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Manage and monitor all your shortened URLs.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {urls.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Link2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">No links yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Shorten your first URL to see it here.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          {/* Table header - desktop only */}
          <div className="hidden md:grid md:grid-cols-[6rem_1fr_5rem_8.5rem_8rem_9.5rem] gap-4 px-5 py-3 border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Code</span>
            <span>Short URL</span>
            <span className="text-right pr-2">Clicks</span>
            <span className="text-center">Status</span>
            <span>Expires</span>
            <span>Actions</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {urls.map((url, i) => {
              const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date()
              const isActive = url.isActive && !isExpired

              return (
                <div
                  key={`${url.shortUrl || url.shortCode || "link"}-${i}`}
                  className="flex flex-col md:grid md:grid-cols-[6rem_1fr_5rem_8.5rem_8rem_9.5rem] gap-2 md:gap-4 px-5 py-4 items-start md:items-center hover:bg-muted/20 transition-colors"
                >
                  {/* Short code */}
                  <div className="shrink-0">
                    <span className="text-sm font-mono font-bold text-primary">
                      {url.shortCode || "—"}
                    </span>
                  </div>

                  {/* Short URL */}
                  <div className="min-w-0 w-full">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground hover:underline block truncate"
                    >
                      {url.shortUrl}
                    </a>
                  </div>

                  {/* Clicks */}
                  <div className="w-full md:w-auto md:text-right md:pr-2">
                    <span className="text-sm font-semibold tabular-nums">{url.totalClicks.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground md:hidden ml-1">clicks</span>
                  </div>

                  {/* Status toggle field */}
                  <div className="flex md:justify-center items-center gap-2">
                    <Switch
                      checked={isActive}
                      onCheckedChange={() => handleToggle(url)}
                      disabled={togglingUrl === url.shortUrl || !!isExpired || !url.shortCode}
                      aria-label="Toggle URL active status"
                    />
                    {togglingUrl === url.shortUrl ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                    ) : isActive ? (
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground">
                        {isExpired ? "Expired" : "Off"}
                      </span>
                    )}
                  </div>

                  {/* Expiry */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                    <Clock className="h-3 w-3 shrink-0" />
                    {url.expiresAt
                      ? isExpired
                        ? <span className="text-destructive">Expired</span>
                        : formatRelativeTime(url.expiresAt)
                      : "—"}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5">
                    <IconBtn title="View analytics" onClick={() => onViewAnalytics(url.shortCode)}>
                      <BarChart2 className="h-4 w-4" />
                    </IconBtn>

                    <IconBtn title="Copy short URL" onClick={() => handleCopy(url.shortUrl)}>
                      {copiedUrl === url.shortUrl
                        ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                        : <Copy className="h-4 w-4" />}
                    </IconBtn>

                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open link"
                      className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>

                    {confirmDeleteUrl === url.shortUrl ? (
                      <div className="flex items-center gap-1 ml-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDelete(url)}
                          disabled={deletingUrl === url.shortUrl}
                          className="text-xs text-destructive hover:underline font-medium px-1"
                        >
                          {deletingUrl === url.shortUrl
                            ? <Loader2 className="h-3 w-3 animate-spin" />
                            : "Confirm"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteUrl(null)}
                          className="text-xs text-muted-foreground hover:underline px-1"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <IconBtn
                        title="Delete"
                        onClick={() => setConfirmDeleteUrl(url.shortUrl)}
                        className="hover:bg-destructive/10 hover:text-destructive animate-in fade-in duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </IconBtn>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {urls.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {urls.length} link{urls.length !== 1 ? "s" : ""} ·{" "}
          {urls.filter((u) => u.isActive).length} active ·{" "}
          {urls.reduce((sum, u) => sum + u.totalClicks, 0).toLocaleString()} total clicks
        </p>
      )}
    </div>
  )
}

function IconBtn({
  children,
  title,
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode
  title?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}
