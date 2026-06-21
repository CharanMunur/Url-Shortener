import { getApiBaseUrl } from "@/lib/env"

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
  token?: string | null
}

export async function requestJson<T>(
  path: string,
  { body, token, headers, ...options }: RequestOptions = {}
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: buildHeaders(headers, token, body),
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const payload = await readPayload(response)

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(payload, response.status), response.status)
  }

  return payload as T
}

export async function requestVoid(
  path: string,
  { body, token, headers, ...options }: RequestOptions = {}
): Promise<void> {
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: buildHeaders(headers, token, body),
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const payload = await readPayload(response)

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(payload, response.status), response.status)
  }
}

function buildUrl(path: string) {
  const baseUrl = getApiBaseUrl()
  if (!baseUrl) {
    return path
  }

  return `${baseUrl.replace(/\/$/, "")}${path}`
}

function buildHeaders(
  headers: HeadersInit | undefined,
  token: string | null | undefined,
  body: unknown
) {
  const nextHeaders = new Headers(headers)

  if (body !== undefined && !nextHeaders.has("Content-Type")) {
    nextHeaders.set("Content-Type", "application/json")
  }

  if (token) {
    nextHeaders.set("Authorization", `Bearer ${token}`)
  }

  return nextHeaders
}

async function readPayload(response: Response) {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

function extractErrorMessage(payload: unknown, status: number) {
  if (typeof payload === "string" && payload.trim()) {
    return payload
  }

  if (payload && typeof payload === "object") {
    const candidate = payload as Record<string, unknown>
    const message =
      candidate.message ?? candidate.error ?? candidate.detail ?? candidate.title

    if (typeof message === "string" && message.trim()) {
      return message
    }
  }

  switch (status) {
    case 400:
      return "The request was rejected by the server."
    case 401:
      return "Your session expired. Please sign in again."
    case 403:
      return "You are not allowed to perform this action."
    case 404:
      return "The requested resource was not found."
    default:
      return "The server could not complete the request."
  }
}
