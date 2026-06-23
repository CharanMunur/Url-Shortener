# Shrtn Client: React Frontend Application

The React-based web client for the Shrtn URL shortener application. Features a highly refined dashboard interface, theme management, and native mobile optimization.

## Key Features

*   **Responsive Layouts:** Adaptive dashboard shell that dynamically converts a desktop navigation column into a mobile slide-out drawer sidebar, combined with an adaptive card/grid view for managing link lists on smaller viewports.
*   **Animations:** Smooth page-loading transitions, staggered layout builds, and scroll-revealed sections built using Framer Motion.
*   **Telemetry Graphs:** Analytics dashboards visualization (timelines, browser ratios, operating system breakdowns) built with Recharts.
*   **State Hydration:** Client-side token hydration and session management via React Context.

---

## Directory Layout

```text
src/
├── components/
│   ├── ui/               # Reusable atomic design system elements
│   ├── url-shortener/    # Components for public url shortening
│   ├── auth-screen.tsx   # Sign-in, sign-up, verification, and recovery forms logic
│   └── dashboard-shell.tsx # Shell container managing sidebars & routes
├── features/
│   └── theme/            # Theme context provider & ModeToggle switcher
├── lib/
│   ├── api.ts            # Network client configuration
│   └── urls-api.ts       # Backend endpoint mappings
├── pages/
│   ├── AnalyticsPage.tsx # Link traffic logs, timelines, and metrics charts
│   ├── DashboardPage.tsx # Overview statistics, metrics cards, and recent actions
│   ├── LandingPage.tsx   # Public marketing presentation page
│   ├── MyLinksPage.tsx   # Adaptive grid/card managing user's urls
│   ├── PersonalInfoPage.tsx # User profile preferences and layout mode config
│   └── SettingsPage.tsx  # User password security modifications
└── providers/
    ├── auth-provider.tsx # Session authorization context provider
    └── theme-provider.tsx # Theme variables wrapper
```

---

## Operations

### Development
Start the local Vite server:
```bash
bun install
bun run dev
```

### Production
Verify compile typings and generate build distribution outputs:
```bash
bun run build
```
Output files will be generated under `dist/`.
