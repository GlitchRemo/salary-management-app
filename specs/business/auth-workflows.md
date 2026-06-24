# Auth Workflows

## Current Scope

Single HR user. No self-registration. No password reset.

---

## Login

**Trigger:** User visits a protected route or navigates to `/login`.

**Flow:**

1. User enters email and password.
2. Login form submits to a Server Action.
3. Server Action validates input with Zod.
4. Server looks up HRUser by email.
5. Server verifies password against stored hash (SHA-256).
6. On success: server signs a stateless session token (HMAC-SHA256, 7-day TTL) and writes it as an `HttpOnly` session cookie.
7. Server Action redirects to `/dashboard`.

**Session token**

Stateless HMAC-SHA256 signed token. Format: `<base64url(payload)>.<signature>`

Payload contains `userId` and `expiresAt` (Unix timestamp ms). Verified on every protected request by Next.js middleware.

**Failure cases:**

| Condition | Shown to user |
|---|---|
| Email not found | "Invalid credentials" |
| Password incorrect | "Invalid credentials" |
| Missing or invalid fields | Zod validation error |

Note: Do not distinguish between "email not found" and "wrong password" to avoid user enumeration.

---

## Logout

**Trigger:** User clicks Logout.

**Flow:**

1. Logout button submits to a Server Action.
2. Server Action clears the `session` cookie.
3. Server Action redirects to `/login`.

---

## Protected Routes

All routes except `/login` are protected.

**Flow:**

1. Request arrives at a protected route.
2. Next.js middleware checks the `session` cookie for a valid, unexpired token.
3. If valid: request proceeds.
4. If missing or expired: redirect to `/login`.

---

## Future Scope

* Password reset via email.
* OAuth (Google, Microsoft).
* SSO integration.
* Role-based access control (RBAC).
