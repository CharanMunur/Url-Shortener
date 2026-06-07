# UrlShortener

Monorepo for a URL shortener with a Spring Boot backend and a React + Vite frontend.

## Structure

- `server/` - Spring Boot API, PostgreSQL, Redis
- `client/` - React UI

## Quick Start

### Server

1. Copy `server/.env.example` to `server/.env`
2. Fill in your values
3. Run the backend from `server/`

### Client

1. Install dependencies in `client/`
2. Run the Vite dev server
3. Make sure the backend is running on `http://localhost:8080`

## Features

- Paste a long URL
- Generate a short URL
- Open the shortened URL as a link
- Copy the shortened URL
- Theme toggle

## Upcoming Features

- Redis caching
- Custom aliases
- Link expiry / TTL
- Click analytics
- User accounts / dashboard
- QR code generation
- Rate limiting

## Notes

- Secrets should stay in `server/.env`
- `server/.env.example` contains the required environment variables without real values
