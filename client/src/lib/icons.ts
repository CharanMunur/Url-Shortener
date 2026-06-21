// Icons sourced from SimpleIcons CDN (simpleicons.org)
// Using img tags with CDN URLs for colored brand icons

export type IconData = { url: string; color: string; label: string }

const SI_CDN = "https://cdn.simpleicons.org"

export const BROWSER_ICONS: Record<string, IconData> = {
  chrome: {
    label: "Google Chrome",
    color: "#4285F4",
    url: `${SI_CDN}/googlechrome/4285F4`,
  },
  firefox: {
    label: "Firefox",
    color: "#FF7139",
    url: `${SI_CDN}/firefoxbrowser/FF7139`,
  },
  safari: {
    label: "Safari",
    color: "#006CFF",
    url: `${SI_CDN}/safari/006CFF`,
  },
  edge: {
    label: "Microsoft Edge",
    color: "#0078D7",
    url: `${SI_CDN}/microsoftedge/0078D7`,
  },
  opera: {
    label: "Opera",
    color: "#FF1B2D",
    url: `${SI_CDN}/opera/FF1B2D`,
  },
  brave: {
    label: "Brave",
    color: "#FB542B",
    url: `${SI_CDN}/brave/FB542B`,
  },
  vivaldi: {
    label: "Vivaldi",
    color: "#EF3939",
    url: `${SI_CDN}/vivaldi/EF3939`,
  },
  samsung: {
    label: "Samsung Internet",
    color: "#1428A0",
    url: `${SI_CDN}/samsung/1428A0`,
  },
}

export const OS_ICONS: Record<string, IconData> = {
  windows: {
    label: "Windows",
    color: "#0078D4",
    url: `${SI_CDN}/windows/0078D4`,
  },
  macos: {
    label: "macOS",
    color: "#000000",
    url: `${SI_CDN}/macos/555555`,
  },
  linux: {
    label: "Linux",
    color: "#FCC624",
    url: `${SI_CDN}/linux/FCC624`,
  },
  android: {
    label: "Android",
    color: "#34A853",
    url: `${SI_CDN}/android/34A853`,
  },
  ubuntu: {
    label: "Ubuntu",
    color: "#E95420",
    url: `${SI_CDN}/ubuntu/E95420`,
  },
  ios: {
    label: "iOS",
    color: "#000000",
    url: `${SI_CDN}/ios/555555`,
  },
  chromeos: {
    label: "ChromeOS",
    color: "#4285F4",
    url: `${SI_CDN}/googlechrome/4285F4`,
  },
}

export function getBrowserIcon(name: string): IconData | null {
  const k = name.toLowerCase()
  if (k.includes("chrome") || k.includes("chromium")) return BROWSER_ICONS.chrome
  if (k.includes("firefox")) return BROWSER_ICONS.firefox
  if (k.includes("safari") && !k.includes("chrome")) return BROWSER_ICONS.safari
  if (k.includes("edge")) return BROWSER_ICONS.edge
  if (k.includes("opera") || k.includes("opr")) return BROWSER_ICONS.opera
  if (k.includes("brave")) return BROWSER_ICONS.brave
  if (k.includes("vivaldi")) return BROWSER_ICONS.vivaldi
  if (k.includes("samsung")) return BROWSER_ICONS.samsung
  return null
}

export function getOsIcon(name: string): IconData | null {
  const k = name.toLowerCase()
  if (k.includes("windows")) return OS_ICONS.windows
  if (k.includes("mac") || k.includes("os x") || k.includes("osx")) return OS_ICONS.macos
  if (k.includes("ubuntu")) return OS_ICONS.ubuntu
  if (k.includes("linux")) return OS_ICONS.linux
  if (k.includes("android")) return OS_ICONS.android
  if (k.includes("ios") || k.includes("iphone") || k.includes("ipad")) return OS_ICONS.ios
  if (k.includes("chromeos") || k.includes("chrome os")) return OS_ICONS.chromeos
  return null
}
