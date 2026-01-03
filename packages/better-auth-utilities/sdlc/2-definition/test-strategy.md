# Test Strategy: Better Auth Utilities

## Document Info

- **Version**: 1.0
- **Author**: QA Lead
- **Approved By**: Tech Lead
- **Last Updated**: 2026-01-03
- **PRD Reference**: [Product Requirements Document](prd.md)
- **Acceptance Criteria**: [Acceptance Criteria](acceptance-criteria.md)

---

## Purpose

Define the overall testing approach, methodologies, and standards for the Better Auth Utilities library. This strategy ensures comprehensive quality validation across all Effect-TS authentication utilities while maintaining the functional programming paradigms and type safety guarantees that define the library.

---

## Scope

### In Scope

- All server operations (Email, OAuth, Session, Account, User domains)
- Command schema validation
- Error handling pipelines
- Layer and dependency injection
- Type safety verification
- Public API surface

### Out of Scope

- Client-side operations (Phase 2)
- Integration tests against real Better Auth server (Phase 2)
- Performance benchmarking (Phase 3)
- Security penetration testing (Phase 3)

---

## Testing Objectives

1. Ensure functional correctness of all Effect-wrapped operations
2. Validate type safety through TypeScript compilation
3. Verify error handling produces correctly typed tagged errors
4. Confirm Schema validation catches invalid inputs
5. Ensure Layer composition works correctly
6. Maintain regression stability across refactors

---

## Test Levels

### Unit Testing

| Aspect | Standard |
|--------|----------|
| **Responsibility** | Backend Developers |
| **Coverage Target** | ≥80% line coverage |
| **Framework** | Vitest with @effect/vitest |
| **Execution** | Pre-commit, CI pipeline |

**Focus Areas:**

- Controller functions (input validation, service orchestration)
- Service functions (Effect-wrapped API calls)
- Schema encode/decode
- Error mapping utilities

### Integration Testing

| Aspect | Standard |
|--------|----------|
| **Responsibility** | Backend Developers |
| **Scope** | Layer composition, cross-module interactions |
| **Framework** | Vitest with @effect/vitest |
| **Execution** | CI pipeline, PR merge |

**Focus Areas:**

- AuthServerLive ← BetterAuthOptionsLive composition
- Controller → Service → AuthServer flow
- Error propagation through pipelines

### Type Testing

| Aspect | Standard |
|--------|----------|
| **Responsibility** | Backend Developers |
| **Scope** | TypeScript type inference and constraints |
| **Framework** | TypeScript compiler (tsc) |
| **Execution** | Build process, CI pipeline |

**Focus Areas:**

- Effect type parameters (Success, Error, Requirements)
- Schema inference matches runtime types
- No `any` leakage in public API

### System Testing

| Aspect | Standard |
|--------|----------|
| **Responsibility** | QA / Backend Developers |
| **Scope** | Full operation flows with mock auth server |
| **Framework** | Vitest with @effect/vitest |
| **Execution** | CI pipeline, pre-release |

**Focus Areas:**

- Complete auth flows (sign-up → sign-in → session → sign-out)
- Multi-operation pipelines
- Error recovery scenarios

### Acceptance Testing

| Aspect | Standard |
|--------|----------|
| **Responsibility** | QA / Product |
| **Scope** | Business requirements validation |
| **Method** | Automated via Gherkin scenarios |
| **Execution** | Pre-release |

**Focus Areas:**

- Acceptance criteria scenarios pass
- API contracts match documentation
- Error messages are developer-friendly

### Property-Based Testing (Phase 2)

| Aspect | Standard |
|--------|----------|
| **Responsibility** | Backend Developers / QA |
| **Scope** | Schema validation, edge case discovery |
| **Framework** | fast-check with @effect/schema arbitraries |
| **Execution** | CI pipeline (longer runs) |

**Focus Areas:**

- Command schema roundtrip (encode → decode)
- Error schema serialization
- Boundary value exploration

---

## Test Types

| Type | Priority | Approach | Automation |
|------|----------|----------|------------|
| Functional (Unit) | P0 | Effect-based assertions | 100% |
| Type Safety | P0 | TypeScript compilation | 100% |
| Schema Validation | P0 | Vitest + Effect/Schema | 100% |
| Error Handling | P0 | Typed error assertions | 100% |
| Layer Composition | P1 | Effect.provide testing | 100% |
| Property-Based | P2 | FastCheck generators | 100% |
| Documentation | P2 | TSDoc validation | Automated |

---

## Test Environment Strategy

| Environment | Purpose | Data | Access |
|-------------|---------|------|--------|
| Local | Unit/Integration tests | In-memory SQLite via setupServerTestEnvironment | Developers |
| CI (GitHub Actions) | Automated tests | In-memory SQLite via setupServerTestEnvironment | Automated |
| Integration (Phase 2) | E2E flows | Persistent test database | QA/Developers |

### Test Setup Utility

The package provides `setupServerTestEnvironment` which:

1. Creates an in-memory SQLite database
2. Initializes a real Better Auth server instance
3. Runs database migrations
4. Starts an HTTP server on a random port
5. Returns `authServer` for use in tests
6. Provides `cleanup()` for teardown

```typescript
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";

describe("Server Operation", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("should perform operation", () =>
    Effect.gen(function*() {
      const { authServer } = env;
      // ... test with real auth server
    }));
});
```

### Mock Strategy (for isolated unit tests)

For tests that don't need full server behavior, mock `AuthServerTag`:

```typescript
import { Effect, Layer } from "effect";
import { AuthServerTag } from "../server.layer";

const MockAuthServer = Layer.succeed(AuthServerTag, {
  api: {
    signUpEmail: vi.fn().mockResolvedValue({ user: mockUser, session: mockSession }),
  }
} as unknown as AuthServerType);
```

---

## Test Data Management

### Principles

- Use synthetic data for all tests
- No real credentials or PII in test fixtures
- Data fixtures versioned with test code
- Factory patterns for dynamic test data generation

### Data Sources

| Type | Source | Management |
|------|--------|------------|
| Unit test | Inline fixtures | Co-located with tests |
| Schema test | FastCheck generators | In schema.arb.ts files |
| Integration | Seed fixtures | Version controlled |

### Test Data Factories

```typescript
// Example: Email command factory
const makeSignUpEmailCommand = (overrides?: Partial<SignUpEmailCommandParams>) =>
  new SignUpEmailCommand({
    email: { value: "test@example.com" },
    password: { value: "SecurePassword123" },
    name: { value: "Test User" },
    ...overrides,
  });
```

---

## Automation Strategy

### Automation Pyramid

```
        /\
       /  \     Integration (10%)
      /----\
     /      \   Type Safety (20%)
    /--------\
   /          \ Unit Tests (70%)
  /------------\
```

### Automation Criteria

- **Automate**: All functional tests, schema validation, type checking
- **Manual**: Exploratory testing of new Better Auth SDK versions

### Tools

| Purpose | Tool |
|---------|------|
| Unit Testing | Vitest |
| Effect Assertions | @effect/vitest |
| Coverage | Vitest V8 provider |
| Type Checking | TypeScript (tsc --build) |
| Schema Testing | Effect/Schema decode/encode |
| Property Testing | fast-check (Phase 2) |
| CI/CD | GitHub Actions |

---

## Defect Management

### Severity Levels

| Level | Definition | SLA |
|-------|------------|-----|
| Critical | Type unsafety, data corruption, security issue | 4 hours |
| High | Operation returns wrong error type, layer breaks | 24 hours |
| Medium | Edge case not handled, documentation mismatch | 1 week |
| Low | Minor issue, cosmetic | Next sprint |

### Defect Workflow

1. **Report** → Issue created with reproduction steps
2. **Triage** → Severity assigned, owner identified
3. **Fix** → PR with fix and new test
4. **Verify** → Test confirms fix
5. **Close** → Merged to main

---

## Metrics and Reporting

### Key Metrics

| Metric | Target | Frequency |
|--------|--------|-----------|
| Line Coverage | ≥80% | Per build |
| Branch Coverage | ≥70% | Per build |
| Test Pass Rate | 100% | Per run |
| Type Errors | 0 | Per build |
| Any Type Count | 0 | Per PR |

### Reports

- **Per Build**: Vitest coverage summary, TypeScript compilation status
- **Per PR**: Coverage diff, new/removed tests
- **Per Release**: Full coverage report, test execution summary

---

## Test Patterns for Effect-TS

### Testing Effects with Real Server

```typescript
import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";

describe("signUpEmailController", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("should return user on valid input", () =>
    Effect.gen(function*() {
      const { authServer } = env;
      const result = yield* Effect.provideService(
        signUpEmailController(validCommand),
        AuthServerTag,
        authServer
      );
      expect(result.user.email).toBe("test@example.com");
    }));
});
```

### Testing Error Cases

```typescript
import * as Cause from "effect/Cause";
import * as Exit from "effect/Exit";
import * as Option from "effect/Option";
import { InputError } from "../../../../errors/input.error";

it.effect("should fail with InputError on invalid input", () =>
  Effect.gen(function*() {
    const { authServer } = env;
    const result = yield* Effect.exit(
      Effect.provideService(
        signUpEmailController(invalidCommand),
        AuthServerTag,
        authServer
      )
    );

    if (Exit.isSuccess(result)) {
      expect.fail("Expected failure");
    }

    const failureOption = Cause.failureOption(result.cause);
    expect(Option.isSome(failureOption)).toBe(true);
    expect(failureOption.value).toBeInstanceOf(InputError);
  }));
```

### Testing Schemas

```typescript
import { Schema } from "effect";

describe("SignUpEmailCommand", () => {
  it("should decode valid input", () => {
    const input = { email: "test@example.com", password: "secure123", name: "Test" };
    const result = Schema.decodeUnknownEither(SignUpEmailCommand)(input);
    expect(result._tag).toBe("Right");
  });

  it("should fail on invalid email", () => {
    const input = { email: "not-an-email", password: "secure123", name: "Test" };
    const result = Schema.decodeUnknownEither(SignUpEmailCommand)(input);
    expect(result._tag).toBe("Left");
  });
});
```

### Testing Layers

```typescript
import { Effect } from "effect";
import { AuthLive, AuthServerTag } from "../server/server.layer";

describe("AuthLive", () => {
  it.effect("should provide AuthServer from config", () =>
    Effect.gen(function* () {
      const server = yield* AuthServerTag;
      expect(server.api).toBeDefined();
    }).pipe(Effect.provide(AuthLive))
  );
});
```

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Better Auth API changes | Tests break on SDK upgrade | Pin version, monitor releases, add version matrix |
| Effect API changes | Type errors on Effect upgrade | Pin version, follow migration guides |
| Flaky async tests | False failures | Use Effect.runPromise correctly, avoid timeouts |
| Coverage gaps | Bugs in untested paths | Enforce coverage thresholds in CI |
| Mock drift | Mocks don't match real API | Validate mocks against SDK types |

---

## Roles and Responsibilities

| Role | Responsibilities |
|------|------------------|
| Tech Lead | Strategy approval, coverage targets, code review |
| Backend Developer | Unit tests, type tests, coverage maintenance |
| QA Lead | Test strategy, metrics reporting, defect tracking |
| DevOps | CI pipeline, test environment |

---

## Entry and Exit Criteria

### Entry Criteria (Start Testing)

- [ ] Code compiles without TypeScript errors
- [ ] All dependencies installed
- [ ] Mock AuthServer layer available
- [ ] Test fixtures defined

### Exit Criteria (Testing Complete)

- [ ] ≥80% line coverage achieved
- [ ] All tests passing (100% pass rate)
- [ ] Zero TypeScript errors
- [ ] Zero `any` types in public API
- [ ] Coverage report generated

---

## References

- [Effect Testing Guide](https://effect.website/docs/guides/testing)
- [Vitest Documentation](https://vitest.dev/)
- [@effect/vitest Package](https://github.com/Effect-TS/effect/tree/main/packages/vitest)
- [Better Auth SDK Documentation](https://www.better-auth.com/)

---

## Change Log

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-01-03 | 1.0 | QA Lead | Initial test strategy creation |
