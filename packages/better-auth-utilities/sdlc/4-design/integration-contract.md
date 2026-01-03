# Integration Contract: Better Auth SDK

## Overview

- **Integration Name**: Better Auth SDK Integration
- **Purpose**: Wrap Better Auth SDK server API with Effect-TS patterns
- **External Service**: `better-auth` npm package (>=1.0.0)
- **Documentation**: https://www.better-auth.com/docs
- **Environment Configuration**: Via `BetterAuthOptionsTag` Layer

---

## Authentication Approach

The Better Auth Utilities library does **not** manage authentication directly. Instead:

1. Consumer application provides `BetterAuthOptions` via Layer
2. Library constructs `betterAuth()` instance internally
3. Session tokens are passed via `headers` parameter (native `Headers` object)
4. Better Auth SDK handles token validation and session management

### Layer Setup

```typescript
import { Layer } from "effect";
import { BetterAuthOptionsTag, AuthLive } from "@emperorrag/better-auth-utilities";

// Consumer provides configuration
const BetterAuthOptionsLive = Layer.succeed(BetterAuthOptionsTag, {
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  socialProviders: {
    github: { clientId: "...", clientSecret: "..." },
    google: { clientId: "...", clientSecret: "..." },
  },
  session: { expiresIn: 60 * 60 * 24 * 7 }, // 7 days
});

// Library composes layers internally
// AuthLive = Layer.provide(AuthServerLive, BetterAuthOptionsLive)
```

---

## Endpoints Used

### OAuth Operations (E-001)

#### `authServer.api.signInSocial` (US-001)

- **URL**: POST /api/auth/sign-in/social
- **Purpose**: Initiate OAuth flow with external provider
- **Request Mapping**:

| Our Field | External Field | Transformation |
|-----------|----------------|----------------|
| `body.provider` | `provider` | Direct pass-through |
| `body.callbackURL.value` | `callbackURL` | Extract from UrlSchema wrapper |
| `body.errorCallbackURL.value` | `errorCallbackURL` | Extract from wrapper, optional |
| `body.newUserCallbackURL.value` | `newUserCallbackURL` | Extract from wrapper, optional |
| `body.disableRedirect` | `disableRedirect` | Direct boolean, optional |
| `headers` | HTTP headers | Pass native Headers object |

- **Response Mapping**:

| External Field | Our Field | Transformation |
|----------------|-----------|----------------|
| `url` | `url` | Direct string |
| `redirect` | `redirect` | Direct boolean |

---

#### `authServer.api.callbackOAuth` (US-002)

- **URL**: POST /api/auth/callback/:provider
- **Purpose**: Handle OAuth callback, exchange code for tokens
- **Request Mapping**:

| Our Field | External Field | Transformation |
|-----------|----------------|----------------|
| `body.code` | `code` | Authorization code from provider, optional |
| `body.state` | `state` | CSRF state parameter, optional |
| `body.error` | `error` | Error from provider, optional |
| `headers` | HTTP headers | Pass native Headers object |

- **Response Mapping**:

| External Field | Our Field | Transformation |
|----------------|-----------|----------------|
| `user` | `user` | User object |
| `session` | `session` | Session object |
| `account` | `account` | Linked account |

---

#### `authServer.api.linkSocialAccount` (US-003)

- **URL**: POST /api/auth/link-social
- **Purpose**: Link OAuth provider to existing account
- **Request Mapping**:

| Our Field | External Field | Transformation |
|-----------|----------------|----------------|
| `body.provider` | `provider` | Direct pass-through |
| `body.callbackURL.value` | `callbackURL` | Extract from UrlSchema wrapper |

- **Response Mapping**: Returns authorization URL

---

### Session Operations (E-002)

#### `authServer.api.getSession` (US-004)

- **URL**: GET /api/auth/session
- **Purpose**: Get current authenticated session
- **Request Mapping**:

| Our Field | External Field | Transformation |
|-----------|----------------|----------------|
| `body` | (none) | Empty object - session from headers |
| `headers` | Cookie header | Session token extraction |

- **Response Mapping**:

| External Field | Our Field | Transformation |
|----------------|-----------|----------------|
| `session` | `session` | Session object with dates |
| `user` | `user` | User object with dates |
| `null` | `null` | No active session |

---

#### `authServer.api.listSessions` (US-005)

- **URL**: GET /api/auth/list-sessions
- **Purpose**: List all user sessions
- **Response Mapping**: Array of Session objects

---

#### `authServer.api.refreshToken` (US-006)

- **URL**: POST /api/auth/refresh-token
- **Purpose**: Refresh session token
- **Request Mapping**:

| Our Field | External Field | Transformation |
|-----------|----------------|----------------|
| `body` | (none) | Empty - uses session from headers |

- **Response Mapping**:

| External Field | Our Field | Transformation |
|----------------|-----------|----------------|
| `session` | `session` | Updated session |
| `accessToken` | `accessToken` | New access token |
| `refreshToken` | `refreshToken` | New refresh token (if rotated) |

---

#### `authServer.api.getAccessToken` (US-007)

- **URL**: GET /api/auth/access-token
- **Purpose**: Get short-lived access token
- **Response Mapping**:

| External Field | Our Field | Transformation |
|----------------|-----------|----------------|
| `accessToken` | `accessToken` | JWT access token |
| `expiresIn` | `expiresIn` | Seconds until expiry |

---

#### `authServer.api.revokeSession` (US-008)

- **URL**: POST /api/auth/revoke-session
- **Purpose**: Revoke specific session
- **Request Mapping**:

| Our Field | External Field | Transformation |
|-----------|----------------|----------------|
| `body.token` | `token` | Session token to revoke, optional |
| `body.id` | `id` | Session ID to revoke, optional |

---

#### `authServer.api.revokeSessions` (US-009)

- **URL**: POST /api/auth/revoke-sessions
- **Purpose**: Revoke all user sessions
- **Response Mapping**: Success confirmation

---

#### `authServer.api.revokeOtherSessions` (US-010)

- **URL**: POST /api/auth/revoke-other-sessions
- **Purpose**: Revoke all sessions except current
- **Response Mapping**: Success confirmation

---

### Account Operations (E-003)

#### `authServer.api.getAccountInfo` (US-011)

- **URL**: GET /api/auth/account
- **Purpose**: Get linked accounts for user
- **Response Mapping**: Array of account objects

---

#### `authServer.api.listUserAccounts` (US-012)

- **URL**: GET /api/auth/list-accounts
- **Purpose**: List linked accounts
- **Request Mapping**: Empty body - uses session from headers

---

#### `authServer.api.unlinkAccount` (US-013)

- **URL**: POST /api/auth/unlink-account
- **Purpose**: Unlink provider from account
- **Request Mapping**:

| Our Field | External Field | Transformation |
|-----------|----------------|----------------|
| `body.providerId` | `providerId` | Provider to unlink |

---

### User Operations (E-004)

#### `authServer.api.updateUser` (US-014)

- **URL**: PATCH /api/auth/update-user
- **Purpose**: Update user profile
- **Request Mapping**:

| Our Field | External Field | Transformation |
|-----------|----------------|----------------|
| `body.name.value` | `name` | Extract from NameSchema wrapper |
| `body.image.value` | `image` | Extract from ImageSchema wrapper |
| `body.additionalFields` | `...rest` | Spread additional fields |

---

#### `authServer.api.deleteUser` (US-015)

- **URL**: DELETE /api/auth/delete-user
- **Purpose**: Delete user account
- **Request Mapping**:

| Our Field | External Field | Transformation |
|-----------|----------------|----------------|
| `body.password.value` | `password` | Extract from PasswordSchema wrapper |
| `body.callbackURL.value` | `callbackURL` | Extract from UrlSchema wrapper |

---

#### `authServer.api.deleteUserCallback` (US-016)

- **URL**: POST /api/auth/delete-user/callback
- **Purpose**: Complete user deletion after verification
- **Request Mapping**:

| Our Field | External Field | Transformation |
|-----------|----------------|----------------|
| `body.token` | `token` | Verification token (required) |

---

## Error Handling

### External Error Mapping

| External Error | Our Handling | Retry? |
|----------------|--------------|--------|
| `APIError { status: 400 }` | `ApiError` with message | No |
| `APIError { status: 401 }` | `ApiError` + log | No |
| `APIError { status: 403 }` | `ApiError` | No |
| `APIError { status: 404 }` | `ApiError` | No |
| `APIError { status: 409 }` | `ApiError` | No |
| `APIError { status: 429 }` | `ApiError` | Yes (with backoff) |
| `APIError { status: 500 }` | `ApiError` | Yes (1 retry) |
| `APIError { status: 502 }` | `ApiError` (provider) | Yes |
| `APIError { status: 503 }` | `ApiError` | Yes (with backoff) |
| `TypeError` (network) | `ApiError` | Yes |
| `SyntaxError` (JSON) | `ApiError` | No |

### Error Transformation

```typescript
// mapApiError implementation from src/lib/pipeline/map-api-error/mapApiError.ts
export const mapApiError = (error: unknown) =>
  Effect.fail(
    new ApiError({
      message: error instanceof Error ? error.message : "Unknown API error",
      status: error instanceof APIError ? error.status : undefined,
      cause: error,
    }),
  );
```

---

## Failure Modes

### Service Unavailable Handling

- **Detection**: `Effect.tryPromise` catches thrown errors
- **Transformation**: `mapApiError` wraps in typed `ApiError`
- **Consumer Action**: Match on `ApiError` tag, check `status` field

### Timeout Handling

- **Default Timeout**: Inherited from Better Auth SDK (30s)
- **Custom Timeout**: Consumer can wrap with `Effect.timeout`
- **Recommendation**: Add `Effect.timeoutFail` at application level

```typescript
import { Duration } from "effect";

const withTimeout = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  effect.pipe(
    Effect.timeoutFail({
      duration: Duration.seconds(10),
      onTimeout: () => new ApiError({ message: "Request timeout" }),
    }),
  );
```

### Rate Limit Handling

- **Detection**: `ApiError` with `status: 429`
- **Headers**: `Retry-After` available in response
- **Consumer Action**: Implement exponential backoff

### Circuit Breaker Configuration

Not included in library scope. Consumers should implement:

```typescript
import { Effect, Schedule } from "effect";

// Retry with exponential backoff
const retryPolicy = Schedule.exponential("100 millis").pipe(
  Schedule.compose(Schedule.recurs(3)),
  Schedule.whileInput((error: ApiError) => error.status === 429 || error.status >= 500),
);

const withRetry = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  effect.pipe(Effect.retry(retryPolicy));
```

---

## Testing Approach

### Mock/Stub Strategy

1. **Unit Tests (Service Layer)**:
   - Provide mock `AuthServerTag` via `Effect.provide`
   - Mock `authServer.api.*` methods
   - Verify correct method calls and parameters

2. **Integration Tests**:
   - Use `setupServerTestEnvironment()` with in-memory SQLite
   - Real Better Auth instance with test configuration
   - Full request/response cycle

### Integration Test Environment

```typescript
import { setupServerTestEnvironment } from "../testing/setup";
import { Layer } from "effect";

const { authServer, cleanup } = await setupServerTestEnvironment({
  database: ":memory:", // SQLite in-memory
  socialProviders: {
    github: { clientId: "test", clientSecret: "test" },
  },
});

// Test layer
const TestAuthLive = Layer.succeed(AuthServerTag, authServer);

// Run tests
await Effect.runPromise(
  testEffect.pipe(Effect.provide(TestAuthLive)),
);

// Cleanup
await cleanup();
```

### Contract Testing Approach

1. **Schema Validation**: Effect Schema ensures contract compliance
2. **Response Shape Tests**: Verify Better Auth responses match expected types
3. **Error Shape Tests**: Verify error responses contain expected fields

---

## Version Compatibility

| Better Auth Version | Library Version | Notes |
|---------------------|-----------------|-------|
| 1.0.x | 1.0.x | Full compatibility |
| 1.1.x | 1.0.x | Backward compatible |
| 2.0.x | TBD | May require updates |

### Breaking Change Detection

- Monitor Better Auth changelog
- Run integration tests against canary versions
- Document migration guides for major updates

---

## Security Considerations

### Token Handling

- Session tokens passed via native `Headers` object
- Library does not store or cache tokens
- Consumer responsible for secure token storage

### CSRF Protection

- Better Auth handles CSRF via state parameter
- Library passes state through unchanged
- Consumer must validate state on callback

### Input Sanitization

- All inputs validated via Effect Schema
- SQL injection prevented by Better Auth ORM
- XSS prevention is consumer responsibility

---

## Traceability

| User Story | Endpoint | Epic |
|------------|----------|------|
| US-001 | signInSocial | E-001 |
| US-002 | callbackOAuth | E-001 |
| US-003 | linkSocialAccount | E-001 |
| US-004 | getSession | E-002 |
| US-005 | listSessions | E-002 |
| US-006 | refreshToken | E-002 |
| US-007 | getAccessToken | E-002 |
| US-008 | revokeSession | E-002 |
| US-009 | revokeSessions | E-002 |
| US-010 | revokeOtherSessions | E-002 |
| US-011 | getAccountInfo | E-003 |
| US-012 | listUserAccounts | E-003 |
| US-013 | unlinkAccount | E-003 |
| US-014 | updateUser | E-004 |
| US-015 | deleteUser | E-004 |
| US-016 | deleteUserCallback | E-004 |

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-03 | Initial integration contract aligned with codebase |
