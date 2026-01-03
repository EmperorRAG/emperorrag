# Unit Tests: Better Auth Utilities Phase 1

## Test Coverage Goals

| Metric | Target | Current |
|--------|--------|---------|
| Statement | >80% | 0% |
| Branch | >75% | 0% |
| Function | >80% | 0% |
| Line | >80% | 0% |

---

## Test Environment

- **Framework**: Vitest with @effect/vitest
- **Assertion Library**: Vitest expect + Effect assertions
- **Mocking**: Vitest vi.fn() + setupServerTestEnvironment
- **Coverage Tool**: V8 via Vitest

---

## Test Suites

### OAuth Domain (E-001)

#### US-001: signInSocialServerController

##### Happy Path Tests

| Test | Description | Priority |
|------|-------------|----------|
| should decode valid SignInSocialServerParams | Validate Schema decode | P0 |
| should return redirect URL for valid provider | Controller success path | P0 |
| should pass headers to service | Headers propagation | P0 |

##### Edge Cases

| Test | Description | Priority |
|------|-------------|----------|
| should handle empty callbackURL | Optional field handling | P1 |
| should handle disableRedirect true | Alternate response shape | P1 |

##### Error Cases

| Test | Description | Priority |
|------|-------------|----------|
| should return InputError for missing provider | Validation failure | P0 |
| should return ApiError for invalid provider | SDK error mapping | P0 |

#### US-002: callbackOAuthServerController

##### Happy Path Tests

| Test | Description | Priority |
|------|-------------|----------|
| should decode CallbackOAuthServerParams | Schema validation | P0 |
| should return user and session for valid code | Success path | P0 |

##### Edge Cases

| Test | Description | Priority |
|------|-------------|----------|
| should handle error callback from provider | Provider error | P1 |
| should handle missing state | Optional field | P1 |

##### Error Cases

| Test | Description | Priority |
|------|-------------|----------|
| should return InputError for invalid params | Validation | P0 |
| should return ApiError for invalid code | SDK error | P0 |

#### US-003: linkSocialAccountServerController

##### Happy Path Tests

| Test | Description | Priority |
|------|-------------|----------|
| should decode LinkSocialAccountServerParams | Schema validation | P0 |
| should return link URL for authenticated user | Success path | P0 |

##### Error Cases

| Test | Description | Priority |
|------|-------------|----------|
| should return InputError for missing provider | Validation | P0 |
| should return ApiError for unauthenticated | SDK error | P0 |

---

### Session Domain (E-002)

#### US-004: getSessionServerController

##### Happy Path Tests

| Test | Description | Priority |
|------|-------------|----------|
| should decode GetSessionServerParams (empty body) | Schema | P0 |
| should return session for authenticated user | Success | P0 |

##### Edge Cases

| Test | Description | Priority |
|------|-------------|----------|
| should return null for no session | No auth | P1 |

#### US-005: listSessionsServerController

##### Happy Path Tests

| Test | Description | Priority |
|------|-------------|----------|
| should return array of sessions | Success | P0 |

##### Edge Cases

| Test | Description | Priority |
|------|-------------|----------|
| should return empty array if no sessions | Empty result | P1 |

#### US-006: refreshTokenServerController

##### Happy Path Tests

| Test | Description | Priority |
|------|-------------|----------|
| should return refreshed session | Success | P0 |

##### Error Cases

| Test | Description | Priority |
|------|-------------|----------|
| should return ApiError for expired token | SDK error | P0 |

#### US-007: getAccessTokenServerController

##### Happy Path Tests

| Test | Description | Priority |
|------|-------------|----------|
| should return access token | Success | P0 |

##### Error Cases

| Test | Description | Priority |
|------|-------------|----------|
| should return ApiError for no session | SDK error | P0 |

#### US-008: revokeSessionServerController

##### Happy Path Tests

| Test | Description | Priority |
|------|-------------|----------|
| should revoke by token | Token path | P0 |
| should revoke by id | ID path | P0 |

##### Error Cases

| Test | Description | Priority |
|------|-------------|----------|
| should return ApiError for invalid session | SDK error | P0 |

#### US-009: revokeSessionsServerController

##### Happy Path Tests

| Test | Description | Priority |
|------|-------------|----------|
| should revoke all sessions | Success | P0 |

#### US-010: revokeOtherSessionsServerController

##### Happy Path Tests

| Test | Description | Priority |
|------|-------------|----------|
| should keep current, revoke others | Success | P0 |

---

### Account Domain (E-003)

#### US-011: accountInfoServerController

##### Happy Path Tests

| Test | Description | Priority |
|------|-------------|----------|
| should return account info | Success | P0 |

#### US-012: listUserAccountsServerController

##### Happy Path Tests

| Test | Description | Priority |
|------|-------------|----------|
| should return array of accounts | Success | P0 |

##### Edge Cases

| Test | Description | Priority |
|------|-------------|----------|
| should return empty array if no linked | Empty | P1 |

#### US-013: unlinkAccountServerController

##### Happy Path Tests

| Test | Description | Priority |
|------|-------------|----------|
| should unlink provider | Success | P0 |

##### Error Cases

| Test | Description | Priority |
|------|-------------|----------|
| should return InputError for missing providerId | Validation | P0 |
| should return ApiError for last account | SDK error | P0 |

---

### User Domain (E-004)

#### US-014: updateUserServerController

##### Happy Path Tests

| Test | Description | Priority |
|------|-------------|----------|
| should update name | Success | P0 |
| should update image | Success | P0 |

##### Edge Cases

| Test | Description | Priority |
|------|-------------|----------|
| should handle additionalFields | Custom fields | P1 |

#### US-015: deleteUserServerController

##### Happy Path Tests

| Test | Description | Priority |
|------|-------------|----------|
| should delete with password | Success | P0 |
| should return callback token | Callback path | P0 |

##### Error Cases

| Test | Description | Priority |
|------|-------------|----------|
| should return ApiError for wrong password | SDK error | P0 |

#### US-016: deleteUserCallbackServerController

##### Happy Path Tests

| Test | Description | Priority |
|------|-------------|----------|
| should complete deletion | Success | P0 |

##### Error Cases

| Test | Description | Priority |
|------|-------------|----------|
| should return InputError for missing token | Validation | P0 |
| should return ApiError for invalid token | SDK error | P0 |

---

## Test Patterns

### Effect-TS Test Pattern

```typescript
import { describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Cause from "effect/Cause";
import * as Option from "effect/Option";

describe("{operation}ServerController", () => {
  it.effect("should succeed with valid input", () =>
    Effect.gen(function*() {
      const result = yield* {operation}ServerController(validInput).pipe(
        Effect.provide(env.layer),
      );
      expect(result).toBeDefined();
    }));

  it.effect("should fail with InputError for invalid input", () =>
    Effect.gen(function*() {
      const exit = yield* {operation}ServerController(invalidInput).pipe(
        Effect.provide(env.layer),
        Effect.exit,
      );
      expect(Exit.isFailure(exit)).toBe(true);
      if (Exit.isFailure(exit)) {
        const failure = Cause.failureOption(exit.cause);
        expect(Option.isSome(failure)).toBe(true);
        if (Option.isSome(failure)) {
          expect(failure.value._tag).toBe("InputError");
        }
      }
    }));
});
```

### Schema Test Pattern

```typescript
describe("{Operation}ServerParams", () => {
  it.effect("should decode valid input", () =>
    Effect.gen(function*() {
      const decoded = yield* Schema.decode({Operation}ServerParams)(validRaw);
      expect(decoded).toBeInstanceOf({Operation}ServerParams);
    }));

  it.effect("should encode to expected structure", () =>
    Effect.gen(function*() {
      const params = new {Operation}ServerParams(validConstructor);
      const encoded = yield* Schema.encode({Operation}ServerParams)(params);
      expect(encoded._tag).toBe("{Operation}ServerParams");
    }));
});
```

### Service Test Pattern

```typescript
describe("{operation}ServerService", () => {
  it.effect("should call authServer.api.{method}", () =>
    Effect.gen(function*() {
      const params = Schema.decodeSync({Operation}ServerParams)(validRaw);
      const result = yield* {operation}ServerService(params).pipe(
        Effect.provide(env.layer),
      );
      expect(result).toBeDefined();
    }));
});
```

---

## Mocking Strategy

### AuthServerTag Mock

```typescript
import { Layer } from "effect";
import { AuthServerTag } from "../../../server.layer";

const mockAuthServer = {
  api: {
    signInSocial: vi.fn().mockResolvedValue({ url: "...", redirect: true }),
    callbackOAuth: vi.fn().mockResolvedValue({ user: {}, session: {} }),
    // ... other methods
  },
};

const MockAuthServerLive = Layer.succeed(AuthServerTag, mockAuthServer);
```

### Setup Test Environment

```typescript
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";

let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

beforeAll(async () => {
  env = await setupServerTestEnvironment({
    serverConfig: { /* domain config */ },
  });
});

afterAll(async () => {
  await env.cleanup();
});
```

---

## Running Tests

```bash
# All tests
npx nx test better-auth-utilities

# With coverage
npx nx test better-auth-utilities -- --coverage

# Specific domain
npx nx test better-auth-utilities -- --run src/lib/server/core/oauth

# Watch mode
npx nx test better-auth-utilities -- --watch
```

---

## Quality Criteria

- [x] Tests follow AAA pattern (Arrange-Act-Assert)
- [x] Each test has single responsibility
- [ ] Mocks properly reset between tests
- [ ] Edge cases covered
- [ ] Error scenarios tested
- [ ] Test names describe behavior
