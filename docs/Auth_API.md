# Auth API Documentation

Google OAuth2 login, JWT stored in `httpOnly` cookie, two roles (`USER`, `ADMIN`) assigned server-side via an admin email allowlist.

## Endpoints

### `GET /oauth2/authorization/google`
Starts login. Frontend does a full page redirect (not fetch) to this URL.
- Auth required: No
- Response: redirects to Google consent screen, then back to `frontend.url + /dashboard` (or `/admin/dashboard` for admins)

### `GET /api/me`
Returns current user's email + role.
- Auth required: Yes
- **200**: `{"success": true, "email": "user@example.com", "role": "USER"}`
- **401**: `{"success": false, "message": "User is not authenticated"}`

### `POST /api/logout`
Clears the `token` cookie.
- Auth required: No
- **200**: no body

### `GET /api/admin/dashboard` (example admin route)
- Auth required: Yes, role `ADMIN`
- **200**: `{"success": true, "message": "Welcome admin ..."}`
- **403**: if role is `USER`

## Role assignment

Decided server-side, on every login, by checking the email against `app.admin.emails` in config:

```yaml
app:
  admin:
    emails:
      - owner@yourgranitestore.com
```

In allowlist → `ADMIN`. Otherwise → `USER`. Re-checked each login, so no manual DB edit needed to promote/demote.

## Authorization rules

| Route | Access |
|---|---|
| `/oauth2/**`, `/login/**`, `/api/logout` | Public |
| `/api/admin/**` | `ROLE_ADMIN` only |
| Everything else | Any authenticated user |

## Config reference

| Property | Purpose |
|---|---|
| `jwt.secret` | JWT signing key |
| `frontend.url` | Used for CORS + post-login redirect |
| `app.admin.emails` | Emails granted admin role |

## Known limitations

- Logout clears the cookie but doesn't revoke the JWT server-side (stateless) — a leaked token stays valid until its 24h expiry.
- App logout doesn't end the Google session; user may get silently re-authenticated on next Google login.
- `cookie.secure(false)` is dev-only — set to `true` in production (HTTPS).