# Auth Workflows

## Current Scope

Single HR user. No self-registration. No password reset.

---

## Login

**Trigger:** User visits a protected route or navigates to `/login`.

**Flow:**

1. User enters email and password.
2. Client sends `POST /auth/login` with credentials.
3. Server looks up HRUser by email.
4. Server verifies password against stored hash.
5. On success: server creates a session and returns session token.
6. Client stores session token.
7. Client redirects to `/dashboard`.

**Failure cases:**

| Condition | Response |
|---|---|
| Email not found | 401 Invalid credentials |
| Password incorrect | 401 Invalid credentials |
| Missing fields | 400 Validation error |

Note: Do not distinguish between "email not found" and "wrong password" in the error message. Return a generic invalid credentials message to avoid user enumeration.

---

## Logout

**Trigger:** User clicks Logout.

**Flow:**

1. Client sends `POST /auth/logout`.
2. Server invalidates the session.
3. Client clears session token.
4. Client redirects to `/login`.

---

## Protected Routes

All routes except `/login` are protected.

**Flow:**

1. Request arrives at a protected route.
2. Middleware checks for a valid session token.
3. If valid: request proceeds.
4. If missing or expired: redirect to `/login`.

---

## Future Scope

* Password reset via email.
* OAuth (Google, Microsoft).
* SSO integration.
* Role-based access control (RBAC).
