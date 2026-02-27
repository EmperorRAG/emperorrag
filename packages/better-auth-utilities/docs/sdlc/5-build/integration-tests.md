# Integration Tests: Better Auth Utilities Phase 1

## Test Environment

| Component | Configuration |
|-----------|---------------|
| Database | In-memory SQLite via Better Auth |
| External APIs | Real Better Auth SDK (test mode) |
| Authentication | Test session cookies |
| Environment | setupServerTestEnvironment |

---

## Test Suites

### OAuth Domain (E-001)

#### signInSocial → callbackOAuth Flow

##### Success Scenarios

| Test | Flow | Expected |
|------|------|----------|
| should complete sign-in-social → callback | OAuth flow | User + Session created |
| should link social account for authenticated user | Link flow | Redirect URL returned |

##### Error Scenarios

| Test | Flow | Expected |
|------|------|----------|
| should handle provider error in callback | Error callback | ApiError with details |
| should reject link for unauthenticated | No session | ApiError 401 |

### Session Domain (E-002)

#### Session Lifecycle Flow

##### Success Scenarios

| Test | Flow | Expected |
|------|------|----------|
| should get session after sign-up | Sign-up → Get Session | User + Session |
| should list all sessions | Sign-up → List | Session array |
| should refresh token | Sign-up → Refresh | New session |
| should revoke specific session | Sign-up → Revoke | Success true |
| should revoke all sessions | Sign-up → Revoke All | Success true |
| should revoke other sessions | Sign-up → Revoke Others | Current kept |

##### Error Scenarios

| Test | Flow | Expected |
|------|------|----------|
| should return null for no session | No auth | Null result |
| should fail refresh for expired | Expired → Refresh | ApiError 401 |

### Account Domain (E-003)

#### Account Management Flow

##### Success Scenarios

| Test | Flow | Expected |
|------|------|----------|
| should get account info | Sign-up → Info | Account data |
| should list user accounts | Sign-up → List | Account array |
| should unlink provider | Link → Unlink | Success true |

##### Error Scenarios

| Test | Flow | Expected |
|------|------|----------|
| should fail unlink for nonexistent | Unlink invalid | ApiError 404 |

### User Domain (E-004)

#### User Profile Flow

##### Success Scenarios

| Test | Flow | Expected |
|------|------|----------|
| should update user name | Sign-up → Update | Updated user |
| should update user image | Sign-up → Update | Updated user |
| should delete user with password | Sign-up → Delete | Success true |
| should complete delete callback | Delete → Callback | Success true |

##### Error Scenarios

| Test | Flow | Expected |
|------|------|----------|
| should fail delete with wrong password | Wrong pass | ApiError 401 |
| should fail callback with invalid token | Invalid token | ApiError 400 |

---

## Setup Requirements

- Better Auth server instance via setupServerTestEnvironment
- In-memory SQLite database (auto-created)
- AuthServerTag layer for Effect DI
- Session cookies from sign-up/sign-in

---

## Integration Test Patterns

### Full Flow Pattern

```typescript
import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { signInSocialServerController } from "./signInSocial.controller";

describe("OAuth Integration", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment({
      serverConfig: {
        socialProviders: {
          github: {
            clientId: "test-client-id",
            clientSecret: "test-client-secret",
          },
        },
      },
    });
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("should initiate OAuth flow", () =>
    Effect.gen(function*() {
      const result = yield* signInSocialServerController({
        _tag: "SignInSocialServerParams",
        body: {
          _tag: "SignInSocialCommand",
          provider: "github",
          disableRedirect: true,
        },
      }).pipe(Effect.provide(env.layer));

      expect(result.url).toBeDefined();
      expect(result.redirect).toBe(false);
    }));
});
```

### Session Lifecycle Pattern

```typescript
describe("Session Integration", () => {
  it.effect("should manage complete session lifecycle", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // 1. Create session via sign-up
      const signUpRes = yield* Effect.tryPromise(() =>
        authServer.api.signUpEmail({
          body: { email: "test@example.com", password: "pass123", name: "Test" },
          asResponse: true,
        })
      );

      const cookie = signUpRes.headers.get("set-cookie");
      const headers = new Headers();
      if (cookie) headers.append("cookie", cookie);

      // 2. Get session
      const sessionResult = yield* getSessionServerController({
        _tag: "GetSessionServerParams",
        body: { _tag: "GetSessionCommand" },
        headers,
      }).pipe(Effect.provide(env.layer));

      expect(sessionResult).not.toBeNull();
      expect(sessionResult?.user?.email).toBe("test@example.com");

      // 3. List sessions
      const sessionsResult = yield* listSessionsServerController({
        _tag: "ListSessionsServerParams",
        body: { _tag: "ListSessionsCommand" },
        headers,
      }).pipe(Effect.provide(env.layer));

      expect(Array.isArray(sessionsResult)).toBe(true);
      expect(sessionsResult.length).toBeGreaterThanOrEqual(1);

      // 4. Revoke other sessions
      const revokeResult = yield* revokeOtherSessionsServerController({
        _tag: "RevokeOtherSessionsServerParams",
        body: { _tag: "RevokeOtherSessionsCommand" },
        headers,
      }).pipe(Effect.provide(env.layer));

      expect(revokeResult.success).toBe(true);
    }));
});
```

### Error Propagation Pattern

```typescript
describe("Error Handling Integration", () => {
  it.effect("should return InputError for invalid schema", () =>
    Effect.gen(function*() {
      const result = yield* signInSocialServerController({
        _tag: "SignInSocialServerParams",
        body: {
          _tag: "SignInSocialCommand",
          // Missing required 'provider' field
        },
      }).pipe(
        Effect.provide(env.layer),
        Effect.either,
      );

      expect(result._tag).toBe("Left");
      if (result._tag === "Left") {
        expect(result.left._tag).toBe("InputError");
      }
    }));

  it.effect("should propagate ApiError from SDK", () =>
    Effect.gen(function*() {
      const result = yield* unlinkAccountServerController({
        _tag: "UnlinkAccountServerParams",
        body: {
          _tag: "UnlinkAccountCommand",
          providerId: "nonexistent-provider",
        },
        // No auth headers
      }).pipe(
        Effect.provide(env.layer),
        Effect.either,
      );

      expect(result._tag).toBe("Left");
      if (result._tag === "Left") {
        expect(result.left._tag).toBe("ApiError");
      }
    }));
});
```

---

## Test Data Fixtures

```typescript
// Test user data
const testUser = {
  email: "integration-test@example.com",
  password: "testPassword123",
  name: "Integration Test User",
};

// Helper to create authenticated session
async function createAuthenticatedSession(authServer: AuthServer) {
  const signUpRes = await authServer.api.signUpEmail({
    body: testUser,
    asResponse: true,
  });

  const cookie = signUpRes.headers.get("set-cookie");
  const headers = new Headers();
  if (cookie) headers.append("cookie", cookie);

  return { headers, user: signUpRes.body };
}
```

---

## Running Integration Tests

```bash
# All integration tests
npx nx test better-auth-utilities -- --run src/lib/server

# Specific domain
npx nx test better-auth-utilities -- --run src/lib/server/core/oauth

# Verbose output
npx nx test better-auth-utilities -- --reporter=verbose
```

---

## Quality Criteria

- [x] Tests isolated from production data
- [x] Proper setup/teardown for test data
- [x] External services properly mocked (Better Auth in test mode)
- [ ] Both success and error scenarios covered
- [ ] Authentication/authorization tested
- [ ] Response schemas validated
