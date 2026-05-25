# PPT Summarizer API

REST API for uploading PowerPoint files and generating AI-powered summaries.

---

## Base URL

```
http://localhost:8000
```

---

## Authentication

This API uses **JWT tokens** delivered via **HTTP-only cookies** (set automatically on login).

- Access token expires in **15 minutes**
- Refresh token expires in **7 days**
- On `401`, call `/auth/v1/refresh-token` to get a new access token, then retry the request

---

## Error Response Format

All errors follow this shape:

```json
{
  "code": 400,
  "status": "error",
  "message": "Here's my message"
}
```

Validation errors include an `errors` array:

```json
{
  "code": 400,
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "path": "body.summaryDetail",
      "message": "Please select a summary detail level"
    }
  ]
}
```

---

## Auth Endpoints

### POST `/api/auth/v1/signup`

Register a new account.

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Secret123"
}
```

**Rules:**

- `name` — min 2 characters
- `password` — min 8 characters, at least 1 uppercase letter, at least 1 number

---

### POST `/api/auth/v1/login`

Login with email and password.

**Body:**

```json
{
  "email": "john@example.com",
  "password": "Secret123"
}
```

**Response:** Sets `accessToken` and `refreshToken` cookies. Also returns tokens in the response body.

---

### GET `/api/auth/v1/verify-email?token=<uuid>`

Verify email address using the token sent to the user's inbox.

**Query param:**

- `token` — UUID from the verification email

---

### POST `/api/auth/v1/resend-email-verification`

Resend the email verification link.

**Body:**

```json
{
  "email": "john@example.com"
}
```

---

### POST `/api/auth/v1/refresh-token`

Get a new access token using a refresh token.

**Body (optional if using cookies):**

```json
{
  "refreshToken": "your-refresh-token"
}
```

> If cookies are enabled, send an empty body — the refresh token is read from the cookie automatically.

---

### POST `/api/auth/v1/logout`

Logout and clear session cookies. No body required.

---

### GET `/api/auth/v1/me` `🔒`

Get the currently logged-in user's profile.

---

## Presentation Endpoints

All presentation endpoints require authentication.

---

### POST `/api/presentations/v1/upload` `🔒`

Upload a `.pptx` file and generate an AI summary.

**Content-Type:** `multipart/form-data`

**Form fields:**

| Field           | Type | Required | Values                         |
| --------------- | ---- | :------: | ------------------------------ |
| `file`          | File |   Yes    | `.pptx` only                   |
| `summaryDetail` | Text |   Yes    | `SHORT`, `MEDIUM`, `DEEP_DIVE` |

**Summary detail levels:**

- `SHORT` — 3-5 bullet points, very brief
- `MEDIUM` — key points per topic with bullet points
- `DEEP_DIVE` — comprehensive summary covering every topic

> Note: This is a synchronous request — it will take several seconds while the AI processes the file. Do not set a short timeout.

---

### GET `/api/presentations/v1` `🔒`

Get all presentations for the logged-in user.

---

### GET `/api/presentations/v1/:id` `🔒`

Get a single presentation by ID.

**Params:**

- `id` — UUID of the presentation

---

### GET `/api/presentations/v1/:id/status` `🔒`

Get the processing status of a presentation.

**Params:**

- `id` — UUID of the presentation

**Status values:**

| Status       | Meaning                      |
| ------------ | ---------------------------- |
| `PENDING`    | Queued, not yet started      |
| `PROCESSING` | AI is generating the summary |
| `DONE`       | Summary is ready             |
| `FAILED`     | Processing failed            |

---

### GET `/api/presentations/v1/:id/download?format=<format>` `🔒`

Download the summary as a file.

**Params:**

- `id` — UUID of the presentation

**Query:**

- `format` — `pdf` or `docx`

**Response:** Binary file download (`application/pdf` or `application/vnd.openxmlformats-officedocument.wordprocessingml.document`)

---

### DELETE `/api/presentations/v1/:id` `🔒`

Delete a presentation.

**Params:**

- `id` — UUID of the presentation

---

## Health Check

### GET `/`

Returns server status.

```json
{
  "status": "success",
  "message": "PPT Summarizer API instance is healthy"
}
```

---

## Notes for Frontend

- All cookies are `HttpOnly` — they cannot be accessed via JavaScript
- On `401` responses, automatically call `/refresh-token` and retry (axios interceptor recommended)
- The upload endpoint blocks until the AI finishes — show a loading state
- UUIDs are validated server-side — sending a non-UUID as `:id` returns a `400` before hitting the database
