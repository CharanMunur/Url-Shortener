import { getPublicShortUrlBase } from "@/lib/env"

export function buildShortUrl(shortCode: string) {
  const base = getPublicShortUrlBase().replace(/\/$/, "")
  return `${base}/${shortCode}`
}

export function extractShortCode(shortUrl: string | null | undefined): string {
  if (!shortUrl) return ""
  try {
    const parsed = new URL(shortUrl)
    const segments = parsed.pathname.split("/").filter(Boolean)
    return segments.at(-1) ?? ""
  } catch {
    try {
      const segments = shortUrl.split("/").filter(Boolean)
      return segments.at(-1) ?? ""
    } catch {
      return ""
    }
  }
}

export function safeDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDateTime(value: string | Date) {
  const date = safeDate(value)
  if (!date) {
    return "Unknown"
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

export function formatRelativeTime(value: string | Date) {
  const date = safeDate(value)
  if (!date) {
    return "Unknown"
  }

  const diff = date.getTime() - Date.now()
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
  const absSeconds = Math.round(Math.abs(diff) / 1000)

  if (absSeconds < 60) {
    return formatter.format(Math.sign(diff) * absSeconds, "second")
  }

  const absMinutes = Math.round(absSeconds / 60)
  if (absMinutes < 60) {
    return formatter.format(Math.sign(diff) * absMinutes, "minute")
  }

  const absHours = Math.round(absMinutes / 60)
  if (absHours < 24) {
    return formatter.format(Math.sign(diff) * absHours, "hour")
  }

  const absDays = Math.round(absHours / 24)
  return formatter.format(Math.sign(diff) * absDays, "day")
}
