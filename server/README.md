# Shrtn Server: Spring Boot API Backend

The backend system of Shrtn is built with **Spring Boot 3.x**, using **PostgreSQL** as the relational data store, **Redis** as a caching engine, and **Spring Security** for stateless user sessions based on JSON Web Tokens (JWT). 

---

## System Architecture & Components

*   **Base62 Encoding Utility (`utils/Base62Encoder.java`):** Converts the autoincremented PostgreSQL ID of a saved URL to a base-62 alphanumeric short code string (using character set `[a-zA-Z0-9]`). This ensures compact link paths.
*   **Access Telemetry Engine (`service/UrlService.java`):** Captures the client IP and parsing metadata from the incoming `User-Agent` HTTP header via the `ua-parser` module, logging browser and operating system metrics asynchronously inside the click audit logs database.
*   **Security & Stateless Auth (`security/`):** Provides stateless filters (`JwtAuthenticationFilter`) that intercept incoming API calls, extract bearer tokens, parse signatures, and populate the thread-bound `SecurityContext` with verified principals.
*   **OTP Generation Engine (`service/OtpService.java`):** Generates 6-digit secure numbers linked with expiration properties, sending email alerts via Gmail SMTP transport for registration verification (`REGISTER`) and password recovery (`FORGOT`).

---

## Database Design (PostgreSQL)

```text
  ┌─────────────────────────────────┐
  │              users              │
  ├─────────────────────────────────┤
  │ id          : bigint (PK)       │
  │ email       : varchar(255) (UK) │
  │ password    : varchar(255)      │
  │ is_verified : boolean           │
  └────────────────┬────────────────┘
                   │ 1
                   ├───┐
                 1 │   │ 1
                   │   ▼
                   │ ┌─────────────────────────────────┐
                   │ │              otps               │
                   │ ├─────────────────────────────────┤
                   │ │ id         : bigint (PK)        │
                   │ │ code       : varchar(6)         │
                   │ │ purpose    : varchar(255)       │
                   │ │ expires_at : timestamp          │
                   │ │ user_id    : bigint (FK)        │
                   │ └─────────────────────────────────┘
                   ▼
  ┌─────────────────────────────────┐
  │              urls               │
  ├─────────────────────────────────┤
  │ id           : bigint (PK)      │
  │ short_code   : varchar(255) (UK)│
  │ original_url : varchar(2048)    │
  │ created_at   : timestamp        │
  │ expires_at   : timestamp        │
  │ is_active    : boolean          │
  │ user_id      : bigint (FK)      │
  └────────────────┬────────────────┘
                   │ 1
                   │
                   ▼
  ┌─────────────────────────────────┐
  │             clicks              │
  ├─────────────────────────────────┤
  │ id         : bigint (PK)        │
  │ clicked_at : timestamp          │
  │ ip_address : varchar(255)       │
  │ user_agent : varchar(255)       │
  │ url_id     : bigint (FK)        │
  └─────────────────────────────────┘
```

---

## Caching Architecture & Redis Flows

To bypass expensive relational database calls on hot redirect paths and dashboard metrics, Shrtn relies on a Redis cache:

1.  **Redirection Cache (`url:{shortCode}`):**
    *   *Set:* When a user hits `GET /{shortCode}` and it is not cached, the backend queries PostgreSQL. If valid and active, it writes the mapping `url:{shortCode} -> originalUrl` in Redis with a **24-hour TTL**.
    *   *Get:* Subsequence clicks look up the code in Redis directly, executing redirects instantly.
    *   *Eviction:* Deleting or disabling a URL deletes the key `url:{shortCode}` from Redis.
2.  **Analytics Summary Cache (`analytics:{shortCode}`):**
    *   *Set:* Aggregations of browser splits, OS splits, timelines, and recent logs are cached under `analytics:{shortCode}`.
    *   *Eviction:* Clicking a link deletes the `analytics:{shortCode}` key to force dashboard stats updates on next fetch. Deleting a URL deletes the cache key.

---

## API Endpoints Reference

### 1. Public Redirection Route
#### `GET /{shortCode}`
*   **Description:** Public URL lookup and client redirection.
*   **Headers:** Standard browser headers. Captures `User-Agent` and client IP address.
*   **Response:** 
    *   `302 Found` with `Location` header matching the target URL.
    *   `400 Bad Request` if disabled, expired, or non-existent.

---

### 2. User & Authentication Services (Base Path: `/api/v1/auth`)

#### `POST /api/v1/auth/register`
*   **Description:** Creates a user profile. Triggers email OTP code.
*   **Request Body (`RegisterRequest`):**
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword123"
    }
    ```
*   **Response (`MessageResponse`):**
    ```json
    {
      "message": "User registered successfully. Check email for verification code."
    }
    ```

#### `POST /api/v1/auth/verify-otp`
*   **Description:** Verify OTP code sent to user email. Activates account.
*   **Request Body (`VerifyOtpRequest`):**
    ```json
    {
      "email": "user@example.com",
      "otpCode": "123456"
    }
    ```
*   **Response (`AuthResponse`):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "email": "user@example.com"
    }
    ```

#### `POST /api/v1/auth/resend-otp`
*   **Description:** Requests a fresh verification OTP.
*   **Request Body:**
    ```json
    {
      "email": "user@example.com"
    }
    ```
*   **Response:** `MessageResponse` (e.g. OTP code resent).

#### `POST /api/v1/auth/login`
*   **Description:** Validates credentials. Returns stateless JWT access token.
*   **Request Body (`LoginRequest`):**
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword123"
    }
    ```
*   **Response (`AuthResponse`):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "email": "user@example.com"
    }
    ```

#### `POST /api/v1/auth/forgot-password`
*   **Description:** Sends a password reset verification code email.
*   **Request Body:**
    ```json
    {
      "email": "user@example.com"
    }
    ```
*   **Response:** `MessageResponse`.

#### `POST /api/v1/auth/reset-password`
*   **Description:** Validates recovery code and resets account password.
*   **Request Body (`ResetPasswordRequest`):**
    ```json
    {
      "email": "user@example.com",
      "otpCode": "654321",
      "newPassword": "newsecurepassword123"
    }
    ```
*   **Response:** `MessageResponse`.

---

### 3. Account Settings (Base Path: `/api/v1/users`)

#### `POST /api/v1/users/change-password`
*   **Description:** Modifies current password.
*   **Required Header:** `Authorization: Bearer <JWT_TOKEN>`
*   **Request Body (`ChangePasswordRequest`):**
    ```json
    {
      "currentPassword": "securepassword123",
      "newPassword": "newsecurepassword123"
    }
    ```
*   **Response:** `MessageResponse`.

---

### 4. URL Management Services (Require JWT Header)

#### `POST /shorten`
*   **Description:** Creates a shortened base62 code for a long URL. Limit: max 25 links.
*   **Required Header:** `Authorization: Bearer <JWT_TOKEN>`
*   **Request Body (`UrlRequest`):**
    ```json
    {
      "originalUrl": "https://example.com/very/long/path/name"
    }
    ```
*   **Response (`UrlResponse`):**
    ```json
    {
      "shortCode": "xK9mPq",
      "totalClicks": 0,
      "isActive": true,
      "expiresAt": "2026-07-23T20:59:19"
    }
    ```

#### `GET /urls`
*   **Description:** Returns all shortened links generated by the current account.
*   **Required Header:** `Authorization: Bearer <JWT_TOKEN>`
*   **Response:** List of `UrlResponse`.
    ```json
    [
      {
        "shortCode": "xK9mPq",
        "totalClicks": 142,
        "isActive": true,
        "expiresAt": "2026-07-23T20:59:19"
      }
    ]
    ```

#### `PATCH /urls/{shortCode}/toggle`
*   **Description:** Disables or enables redirect routing for a short code.
*   **Required Header:** `Authorization: Bearer <JWT_TOKEN>`
*   **Response:** Boolean indicating active status (e.g. `true` / `false`).

#### `DELETE /urls/{shortCode}`
*   **Description:** Deletes link mapping, click audit logs, and clears cache keys.
*   **Required Header:** `Authorization: Bearer <JWT_TOKEN>`
*   **Response:** `244 No Content`.

#### `GET /urls/{shortCode}/analytics`
*   **Description:** Compiles timelines, browsers count, OS details, and recent click logs.
*   **Required Header:** `Authorization: Bearer <JWT_TOKEN>`
*   **Response (`UrlAnalyticsResponse`):**
    ```json
    {
      "shortCode": "xK9mPq",
      "originalUrl": "https://example.com/very/long/path/name",
      "totalClicks": 12,
      "browserBreakdown": {
        "Chrome": 8,
        "Firefox": 4
      },
      "osBreakdown": {
        "Windows": 6,
        "macOS": 6
      },
      "lastClicks": [
        {
          "clickedAt": "2026-06-23T21:00:15",
          "ipAddress": "127.0.0.1",
          "userAgent": "Mozilla/5.0..."
        }
      ]
    }
    ```

---

## Operational Details

### Configuration Configs (`.env`)
Create a `.env` in the server root:
```env
DB_PASSWORD=            # Database Password
REDIS_HOST=             # Redis Cache Endpoint Host
REDIS_PORT=             # Redis Cache Port
REDIS_PASSWORD=         # Redis connection password
JWT_SECRET=             # JWT token HMAC-SHA256 signature key
MAIL_PASSWORD=          # Gmail SMTP App password
```

### Server Run
Launch the application:
```bash
./gradlew bootRun
```
The Spring Boot server exposes port `8080` by default.
