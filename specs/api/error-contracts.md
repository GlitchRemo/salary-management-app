# Error Contracts

> **Note (2026-06-23):** There is no REST API or Server Actions layer.
> Errors are surfaced by throwing typed error classes from services,
> caught by pages or components, and mapped to UI state.

---

## Error Classes

Defined in `server/errors.ts`. Thrown by services and caught at the page or component level.

### ValidationError

Thrown when input fails Zod validation.

```ts
class ValidationError extends Error {
  code = "VALIDATION_ERROR";
  details: Array<{ field: string; message: string }>;
}
```

---

### NotFoundError

Thrown when a referenced entity does not exist.

```ts
class NotFoundError extends Error {
  code = "NOT_FOUND";
}
```

For page-level 404s call `notFound()` from `next/navigation` — Next.js renders the nearest `not-found.tsx`.

---

### AppError

Base class for all application errors.

```ts
class AppError extends Error {
  code: string;
}
```

---

## Authentication Errors

Phase 8 will introduce session-based authentication. Unauthenticated access to
protected routes will be handled by Next.js middleware redirecting to `/login`.


```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Employee not found"
  }
}
```

---

## HTTP Status Codes

| Status | Code | Meaning |
|---|---|---|
| 400 | VALIDATION_ERROR | Request body or query parameters failed validation |
| 401 | UNAUTHORIZED | Missing or invalid session token |
| 401 | INVALID_CREDENTIALS | Email or password is incorrect |
| 404 | NOT_FOUND | Requested resource does not exist |
| 500 | INTERNAL_ERROR | Unexpected server error |

---

## 400 — Validation Error

Returned when request input fails Zod validation.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "baseSalary",
        "message": "Base salary must be greater than 0"
      }
    ]
  }
}
```

---

## 401 — Unauthorized

Returned when no valid session is present.

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

---

## 401 — Invalid Credentials

Returned on failed login. Generic message to prevent user enumeration.

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

---

## 404 — Not Found

Returned when a resource cannot be located.

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Employee not found"
  }
}
```

---

## 500 — Internal Server Error

Returned for unexpected failures. Internal details are not exposed to the client.

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```
