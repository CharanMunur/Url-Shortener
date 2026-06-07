# Server

Spring Boot backend for the URL shortener.

## Run

```bash
set -a
source .env
set +a
./gradlew bootRun
```

## Environment

Copy `.env.example` to `.env` and fill in:

- `DB_PASSWORD`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`

## API

- `POST /shorten` - accepts `{ "originalUrl": "https://..." }`
- `GET /{shortCode}` - redirects to the original URL

## Data Stores

- PostgreSQL for URL mappings
- Redis for caching / future use

