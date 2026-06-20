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

### Implemented

- `POST /api/v1/auth/register` - create a user
- `POST /api/v1/auth/login` - login and receive a JWT
- `POST /shorten` - create a short URL for the authenticated user, requires `Authorization: Bearer <token>`
- `GET /{shortCode}` - redirect to the original URL, public
- `GET /urls` - list the current user's URLs, requires JWT
- `PATCH /urls/{shortCode}/toggle` - toggle active state for a URL you own, requires JWT
- `DELETE /urls/{shortCode}` - delete a URL you own, requires JWT
- `GET /urls/{shortCode}/analytics` - view click analytics for a URL you own, requires JWT

### Shorten Request

```json
{
  "originalUrl": "https://example.com"
}
```

### Current URL Behavior

- URLs are owned by the authenticated user that created them
- New URLs are created active by default
- URLs expire 30 days after creation
- Redirects fail for disabled or expired URLs
- Redirects are logged with click time, IP address, and user agent
- Toggle and delete are owner-only actions
- Analytics currently include total clicks, recent clicks, browser breakdown, and OS breakdown

### Auth Notes

- JWTs are sent through the `Authorization` header as `Bearer <token>`
- `register` and `login` both return a JWT token in the response body

## Data Stores

- PostgreSQL for URL mappings

## Still Pending

The repository already has the data structures for this next layer, but the endpoints are not built yet:

- Redis caching / key-value use
- analytics endpoints
  - total clicks per URL
  - clicks over time
  - last clicked at
  - top URLs per user
  - device breakdown
  - location breakdown
- dashboard endpoints for richer "my URLs" views

Supporting types already exist for future analytics work:

- `src/main/java/com/example/demo/model/Click.java`
- `src/main/java/com/example/demo/dto/UrlAnalyticsResponse.java`
- `src/main/java/com/example/demo/dto/ClickDetailDTO.java`
