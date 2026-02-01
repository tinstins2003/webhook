# Code Review – Webhook Receiver Service

Lists issues found, grouped by category and severity. **Fixed** indicates items addressed in the latest update.

**Priority** (for remaining work): **P1** = highest (fix first), **P2** = high, **P3** = medium, **P4** = low. Fixed items are marked —.

---

## SECURITY

| Severity | Priority | Issue                                                                                                 | Status                                                                                         |
| -------- | -------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Critical | —        | **No Authentication**: Anyone can send/receive webhooks without authentication.                       | **Fixed** – `ApiKeyGuard`; API key via `x-api-key` header or `Authorization: Bearer <key>`.    |
| Critical | —        | **No rate limiting / payload size limit**: No limit on body size or request count; vulnerable to DoS. | **Fixed** – Rate limit and body size limit in `main.ts` (express-rate-limit, BODY_SIZE_LIMIT). |
| Critical | —        | **No input validation**: Payload was not validated, risking data corruption.                          | **Fixed** – DTO (class-validator) and ValidationPipe; `source` and `event` required.           |

---

## CODE QUALITY

| Severity | Priority | Issue                                                                                     | Status                                                                                               |
| -------- | -------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Medium   | —        | **ID generation**: `Math.random().toString(36).substring(7)` could produce duplicate IDs. | **Fixed** – Using `randomUUID()` (crypto).                                                           |
| Medium   | —        | **Separation of concerns**: Logic should be split between Controller and Service.         | **Fixed** – NestJS Controller + Service; Service handles business logic, Controller handles routing. |

---

## RELIABILITY

| Severity | Priority | Issue                                                                                    | Status                                                            |
| -------- | -------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Critical | **P1**   | **In-memory storage**: Data stored in a variable (storage.ts), lost on server restart.   | Remaining – Consider a DB (MongoDB, PostgreSQL) for persistence.  |
| Medium   | **P2**   | **No pagination**: `getAll()` returns all webhooks at once; may be slow with large data. | Remaining – Consider query params `?page=&limit=` and pagination. |

---

## SCALABILITY

| Severity | Priority | Issue                                                                      | Status                                                        |
| -------- | -------- | -------------------------------------------------------------------------- | ------------------------------------------------------------- |
| High     | —        | **Error handler registered after listen**: Error middleware had no effect. | **Fixed** – Removed middleware; using NestJS exception layer. |

---

## Priority order (remaining)

| Priority | Item                                                |
| -------- | --------------------------------------------------- |
| **P1**   | In-memory storage → move to DB for persistence.     |
| **P2**   | Pagination for GET /webhooks → add `?page=&limit=`. |

---
