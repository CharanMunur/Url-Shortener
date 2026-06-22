import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom"
import {
  LayoutDashboard,
  Link2,
  BarChart2,
  Scissors,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { ModeToggle } from "@/features/theme/mode-toggle"
import { DashboardPage } from "@/pages/DashboardPage"
import { MyLinksPage } from "@/pages/MyLinksPage"
import { AnalyticsPage } from "@/pages/AnalyticsPage"
import { ShortenPage } from "@/pages/ShortenPage"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

type Page = "dashboard" | "shorten" | "links" | "analytics"

const NAV_ITEMS: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "shorten", label: "Shorten URL", icon: <Scissors className="h-4 w-4" /> },
  { id: "links", label: "My Links", icon: <Link2 className="h-4 w-4" /> },
  { id: "analytics", label: "Analytics", icon: <BarChart2 className="h-4 w-4" /> },
]

export function DashboardShell() {
  const { email, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const pathname = location.pathname.replace(/\/$/, "")
  const page: Page = (() => {
    if (pathname.includes("/dashboard/shorten")) return "shorten"
    if (pathname.includes("/dashboard/links")) return "links"
    if (pathname.includes("/dashboard/analytics")) return "analytics"
    return "dashboard"
  })()

  function navigateTo(p: Page) {
    if (p === "dashboard") {
      navigate("/dashboard")
    } else {
      navigate(`/dashboard/${p}`)
    }
  }

  function viewAnalytics(shortCode: string) {
    navigate(`/dashboard/analytics/${shortCode}`)
  }

  const initials = email ? email.slice(0, 2).toUpperCase() : "U"
  const currentPage = NAV_ITEMS.find((n) => n.id === page)

  return (
    <SidebarProvider>
      <Sidebar>
        {/* ── Logo ── */}
        <SidebarHeader className="px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm shrink-0">
              <Link2 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold tracking-tight text-sidebar-foreground leading-none">
                Shrtn
              </p>
              <p className="text-[11px] text-sidebar-foreground/50 mt-0.5 leading-none">
                URL Shortener
              </p>
            </div>
          </div>
        </SidebarHeader>

        {/* ── Nav ── */}
        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 mb-1 text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {NAV_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={page === item.id}
                      onClick={() => navigateTo(item.id)}
                      tooltip={item.label}
                      className="h-10 px-3 rounded-lg gap-3 text-sm font-medium"
                    >
                      <span className={page === item.id ? "text-sidebar-primary" : "opacity-60"}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                      {page === item.id && (
                        <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-40" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* ── Footer ── */}
        <SidebarFooter className="px-4 pb-4 pt-2">
          <Separator className="mb-4 opacity-50" />

          {/* User info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary/20 text-sidebar-primary text-xs font-bold shrink-0 border border-sidebar-border">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate text-sidebar-foreground leading-snug">
                {email ? email.split("@")[0] : "User"}
              </p>
              <p className="text-[11px] text-sidebar-foreground/40 truncate mt-0.5">
                {email ?? ""}
              </p>
            </div>
          </div>

          {/* Sign out */}
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </SidebarFooter>
      </Sidebar>

      {/* ── Main ── */}
      <SidebarInset>
        {/* Top bar */}
        <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4 shrink-0 sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-muted-foreground shrink-0">{currentPage?.icon}</span>
            <span className="text-sm font-semibold truncate">{currentPage?.label}</span>
          </div>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<DashboardPage onNavigate={navigateTo} />} />
            <Route path="/shorten" element={<ShortenPage />} />
            <Route path="/links" element={<MyLinksPage onViewAnalytics={viewAnalytics} />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/analytics/:shortCode" element={<AnalyticsPage />} />
            <Route path="*" element={<Navigate to="" replace />} />
          </Routes>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
