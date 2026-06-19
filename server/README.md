# Server

Spring Boot backend for the URL shortener.

## Run

```bash
./gradlew bootRun
```

`application.properties` imports `.env` automatically, so the local file only needs valid key/value pairs.

## Environment

Copy `.env.example` to `.env` and fill in:

- `DB_PASSWORD`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `JWT_SECRET`

## API

- `POST /shorten` - accepts `{ "originalUrl": "https://..." }`
- `GET /{shortCode}` - redirects to the original URL

## Data Stores

- PostgreSQL for URL mappings
- Redis for caching / future use
