import { createContext, useContext, useMemo, useState } from "react"

import { requestJson } from "@/lib/api"
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types/api"

type AuthContextValue = {
  token: string | null
  email: string | null
  isHydrated: boolean
  login: (request: LoginRequest) => Promise<void>
  register: (request: RegisterRequest) => Promise<void>
  logout: () => void
}

const TOKEN_STORAGE_KEY = "url-shortener-token"
const EMAIL_STORAGE_KEY = "url-shortener-email"

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY)
    } catch {
      return null
    }
  })
  const [email, setEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem(EMAIL_STORAGE_KEY)
    } catch {
      return null
    }
  })
  const isHydrated = true

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      email,
      isHydrated,
      login: async (request) => {
        const response = await requestJson<AuthResponse>("/api/v1/auth/login", {
          method: "POST",
          body: request,
        })

        localStorage.setItem(TOKEN_STORAGE_KEY, response.token)
        localStorage.setItem(EMAIL_STORAGE_KEY, request.email)
        setToken(response.token)
        setEmail(request.email)
      },
      register: async (request) => {
        const response = await requestJson<AuthResponse>("/api/v1/auth/register", {
          method: "POST",
          body: request,
        })

        localStorage.setItem(TOKEN_STORAGE_KEY, response.token)
        localStorage.setItem(EMAIL_STORAGE_KEY, request.email)
        setToken(response.token)
        setEmail(request.email)
      },
      logout: () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        localStorage.removeItem(EMAIL_STORAGE_KEY)
        setToken(null)
        setEmail(null)
      },
    }),
    [email, isHydrated, token]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
