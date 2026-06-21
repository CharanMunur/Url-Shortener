import { useState } from "react"
import { Loader2, Link2, CheckCircle2, Copy, ExternalLink, Zap } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { createShortUrl } from "@/lib/urls-api"
import { ApiError } from "@/lib/api"
import { extractShortCode } from "@/lib/url"

export function ShortenPage() {
  const { token } = useAuth()
  const [longUrl, setLongUrl] = useState("")
  const [result, setResult] = useState<{ shortCode: string; shortUrl: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = longUrl.trim()
    if (!trimmed) {
      setError("Please enter a URL.")
      return
    }
    setIsLoading(true)
    setError("")
    setResult(null)
    setCopied(false)
    try {
      const data = await createShortUrl({ originalUrl: trimmed }, token!)
      setResult({
        shortCode: extractShortCode(data.shortUrl),
        shortUrl: data.shortUrl,
      })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to shorten URL.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCopy() {
    if (!result) return
    await navigator.clipboard.writeText(result.shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
          <Zap className="h-4 w-4" />
          <span>Quick shorten</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Shorten a URL</h1>
        <p className="mt-1 text-muted-foreground">
          Paste a long URL below and get a short link instantly.
        </p>
      </div>

      {/* Form card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="long-url" className="text-sm font-medium">
              Long URL
            </label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="long-url"
                type="url"
                placeholder="https://example.com/a-very-long-path/that/needs/shortening"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              />
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
            className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Shortening…
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Shorten
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result */}
      {result && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="font-semibold">Your short link is ready!</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-md border border-border bg-muted px-3 py-2.5 text-sm font-mono text-foreground truncate">
              {result.shortUrl}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2.5 text-sm font-medium hover:bg-muted transition-colors shrink-0"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </button>
            <a
              href={result.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2.5 text-sm font-medium hover:bg-muted transition-colors shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
              Open
            </a>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            This link will expire in 30 days. Find it in{" "}
            <span className="text-foreground font-medium">My Links</span>.
          </p>
        </div>
      )}
    </div>
  )
}
