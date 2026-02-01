# webhook

Webhook receiver service built with NestJS. Receives, stores, and retrieves webhooks from external services.

## How to run

Follow these steps to run the project:

1. Clone the repository
2. Install dependencies by running `yarn`
3. Create .env file and copy the content from .env.example
4. Run the project by running `yarn dev`
5. Call endpoints with API key (see below).

## How to run test

- Use `yarn test` to run test in spec file
- use `yarn test:e2e` to run e2e test

**Authentication**: All webhook endpoints require an API key. Set `API_KEY` in `.env` (see `.env.example`). Send the key in one of two ways:

- Header: `x-api-key: <your-api-key>`
- Header: `Authorization: Bearer <your-api-key>`

**Endpoints** (all require API key):

| Method | Path          | Description                                                    |
| ------ | ------------- | -------------------------------------------------------------- | 
| POST   | /webhooks     | Create a webhook (body: `source`, `event`, optional `payload`) |
| GET    | /webhooks     | List all webhooks                                              |
| GET    | /webhooks/:id | Get a webhook by ID                                            |
| PATCH  | /webhooks/:id | Update a webhook (body: optional `source`, `event`, `payload`) |

## Changes made

Improvements and fixes applied to the original sample code:

- **NestJS and structure**: Service implemented with NestJS; controller and service logic are separated for maintainability and testability.
- **Webhook ID**: Replaced `Math.random().toString(36)` with `randomUUID()` (crypto) to avoid ID collisions.
- **GET /webhooks/:id**: Service now throws `NotFoundException` when webhook is not found instead of using raw Express `res`.
- **PATCH /webhooks/:id – update webhook**: New endpoint to update an existing webhook by ID. Body uses `UpdateWebhookDto`; all fields (`source`, `event`, `payload`) are optional (partial update). Returns the updated webhook or 404 if not found. _Note: Added to support editing webhook data after creation._
- **Input validation**: Request body is validated via DTO (`CreateWebhookDto`, `UpdateWebhookDto`) with class-validator; `ValidationPipe` is enabled globally. Create: `source` and `event` required, `payload` optional. Update: all fields optional.
- **Error handling**: Global `ErrorHandlerInterceptor` normalizes error responses (statusCode, message, error). Removed ineffective Express error middleware.
- **Authentication**: `ApiKeyGuard` applied globally; requests must send a valid API key via `x-api-key` header or `Authorization: Bearer <key>`. Key is configured via `API_KEY` in `.env`.
- **Tests**: Unit tests for `AppController` (create, getAll, getById, update; including 404 cases) with mocked `AppService`. E2E tests for POST/GET/PATCH webhooks (with API key), 404 for update, and 401 when key is missing.
