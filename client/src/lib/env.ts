export function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL?.trim() ?? ""
}

export function getPublicShortUrlBase() {
  return import.meta.env.VITE_PUBLIC_SHORT_URL_BASE?.trim() || "http://localhost:8080"
}
