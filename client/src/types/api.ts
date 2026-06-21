export type AuthResponse = {
  token: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = LoginRequest

export type UrlRequest = {
  originalUrl: string
}

export type UrlResponse = {
  shortUrl?: string
  shortCode?: string
  totalClicks: number
  isActive: boolean
  expiresAt: string
}

export type ClickDetailDTO = {
  clickedAt: string
  ipAddress: string
  userAgent: string
}

export type UrlAnalyticsResponse = {
  shortCode: string
  originalUrl: string
  totalClicks: number
  lastClicks: ClickDetailDTO[]
  browserBreakdown: Record<string, number>
  osBreakdown: Record<string, number>
  clicksByDate: Record<string, number>
}
