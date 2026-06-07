# Client

React + TypeScript + Vite frontend for the URL shortener.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## What It Does

- Paste a long URL
- Send it to the backend at `/shorten`
- Show the shortened URL as a clickable link
- Copy the shortened URL
- Toggle the theme

## UI Structure

- `src/components/url-shortener/urlShortenerPage.tsx`
- `src/components/url-shortener/urlShortenerHeader.tsx`
- `src/components/url-shortener/urlShortenerForm.tsx`
- `src/components/url-shortener/shortenedUrlResult.tsx`

## Notes

- The Vite dev server proxies `/shorten` to `http://localhost:8080`
- The app uses shadcn-style components in `src/components/ui`
