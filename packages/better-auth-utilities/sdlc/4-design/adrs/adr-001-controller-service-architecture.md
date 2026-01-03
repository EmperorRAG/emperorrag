# ADR-001: Controller-Service Architecture Pattern

**Status:** Accepted

**Date:** 2026-01-03

**Deciders:** Tech Lead, Backend Engineer

---

## Context

We need to implement 16 server-side operations for the Better Auth Utilities library. The existing Email domain (11 operations) provides a reference implementation. We must decide whether to:

1. Follow the established Controller-Service pattern exactly
2. Simplify to a single-layer approach
3. Create a different abstraction

### Forces at Play

- **Consistency**: The library already has 11 operations following Controller-Service pattern
- **Testability**: Unit tests need to isolate validation from API calls
- **Maintainability**: Developers expect predictable structure across domains
- **Bundle Size**: More files means more overhead (but tree-shaking helps)
- **Onboarding**: New contributors should understand patterns quickly
- **Effect-TS Idioms**: Pattern should align with Effect-TS conventions

---

## Decision Drivers

1. **Consistency with existing codebase** - Email domain sets the precedent
2. **Separation of concerns** - Validation logic separate from API integration
3. **Testability** - Each layer testable in isolation
4. **Traceability** - Effect.withSpan at each layer enables debugging
5. **Type safety** - Schema validation at controller boundary

---

## Considered Options

### Option 1: Controller-Service Pattern (Current)

**Description:**
Each operation has three files:
- `*.controller.ts` - Input validation, error mapping, delegation
- `*.service.ts` - Better Auth API call, response transformation
- `*.types.ts` - ServerParams schema definition

**Pros:**
- ✅ Consistent with existing 11 Email operations
- ✅ Clear separation of validation and API concerns
- ✅ Each layer independently testable
- ✅ Effect.withSpan at each level for tracing
- ✅ Type-safe boundaries with Schema validation

**Cons:**
- ❌ More files per operation (6 including tests)
- ❌ Slight overhead for simple pass-through operations
- ❌ Requires understanding multiple abstractions

### Option 2: Single-Function Pattern

**Description:**
Combine controller and service into a single function per operation.

**Pros:**
- ✅ Fewer files (2 per operation)
- ✅ Simpler mental model
- ✅ Less boilerplate

**Cons:**
- ❌ Inconsistent with existing Email domain
- ❌ Mixed concerns (validation + API)
- ❌ Harder to test validation separately
- ❌ Single span loses granularity

### Option 3: Class-Based Controllers

**Description:**
Use Effect-TS class patterns with methods for each operation.

**Pros:**
- ✅ Familiar to OOP developers
- ✅ Groups related operations
- ✅ Easier to share state/dependencies

**Cons:**
- ❌ Diverges from functional Effect-TS patterns
- ❌ Inconsistent with existing implementation
- ❌ Harder to tree-shake
- ❌ More complex DI setup

---

## Decision

**We will follow Option 1: Controller-Service Pattern** for all 16 new operations.

### Rationale

1. **Precedent**: The Email domain establishes this pattern with 11 working operations. Deviating would create inconsistency.

2. **Testability**: Separating validation (controller) from API calls (service) allows:
   - Controller tests with invalid inputs (no API mocking needed)
   - Service tests with mocked AuthServerTag
   - Integration tests with real Better Auth server

3. **Traceability**: Dual `Effect.withSpan` calls provide:
   ```typescript
   // Controller span wraps entire operation
   Effect.withSpan("signInSocialServerController")
   
   // Service span isolates API call
   Effect.withSpan("signInSocialServerService")
   ```

4. **Error Clarity**: Each layer maps errors appropriately:
   - Controller: `mapInputError` for validation failures
   - Service: `mapApiError` for API failures

5. **Functional Purity**: Services are annotated `@pure` with clear input→output contracts.

---

## Consequences

### Positive

1. **Predictable structure** - All operations follow the same pattern
2. **Comprehensive testing** - 6 test files per domain area
3. **Clear debugging** - Span traces show exactly where failures occur
4. **Easy onboarding** - One pattern to learn, applies everywhere
5. **Refactor safety** - Changes to validation don't affect API logic

### Negative

1. **More files** - 96 files for 16 operations (vs. 32 for single-function)
2. **Boilerplate** - Each operation requires similar structure
3. **Initial overhead** - Slightly more setup time per operation

### Risks

| Risk | Mitigation |
|------|------------|
| Inconsistent implementation | Code review checklist ensures pattern adherence |
| Copy-paste errors | Use Email operations as templates |
| Test coverage gaps | Coverage gates at 80% per file (per PRD) |

---

## Implementation Guidelines

### Controller Template (from `signUpEmail.controller.ts`)

```typescript
import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Schema from "effect/Schema";
import { mapInputError } from "../../../../pipeline/map-input-error/mapInputError";
import { {operation}ServerService } from "./{operation}.service";
import { {Operation}ServerParams } from "./{operation}.types";

/**
 * Controller for handling {operation} requests.
 *
 * This function takes an unknown input, validates it against the `{Operation}ServerParams` schema,
 * and then delegates the processing to the `{operation}ServerService`.
 *
 * @param input - The input data for the {operation} request.
 * @returns An Effect that resolves to the result of the {operation} service.
 */
export const {operation}ServerController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown({Operation}ServerParams),
    Effect.catchAll(mapInputError),
    Effect.flatMap({operation}ServerService),
    Effect.withSpan("{operation}ServerController"),
  );
```

### Service Template (from `signUpEmail.service.ts`)

```typescript
import * as Effect from "effect/Effect";
import { mapApiError } from "../../../../pipeline/map-api-error/mapApiError";
import { AuthServerTag } from "../../../server.layer";
import type { {Operation}ServerParams } from "./{operation}.types";

/**
 * Server service for {operation}.
 * Calls Better Auth API with validated params.
 * @pure
 */
export const {operation}ServerService = (params: {Operation}ServerParams) =>
  Effect.flatMap(AuthServerTag, (authServer) =>
    Effect.tryPromise(() =>
      authServer.api.{betterAuthMethod}({
        body: {
          // Extract values from Schema wrappers
          ...params.body,
        },
        ...(params.headers ? { headers: params.headers } : {}),
        ...(params.asResponse !== undefined ? { asResponse: params.asResponse } : {}),
        ...(params.returnHeaders !== undefined ? { returnHeaders: params.returnHeaders } : {}),
      }),
    ).pipe(
      Effect.catchAll(mapApiError),
      Effect.withSpan("{operation}ServerService"),
    ),
  );
```

### Types Template (from `signUpEmail.types.ts`)

```typescript
import { pipe } from "effect/Function";
import * as Schema from "effect/Schema";
import { {Operation}Command } from "../../../../schema/commands/{operation}/{Operation}.command";

/**
 * Represents the parameters for the {operation} server operation.
 */
export class {Operation}ServerParams extends Schema.TaggedClass<{Operation}ServerParams>()(
  "{Operation}ServerParams",
  {
    body: {Operation}Command,
    headers: Schema.optional(Schema.instanceOf(Headers)),  // Native Headers object
    asResponse: Schema.optional(Schema.Boolean),
    returnHeaders: Schema.optional(Schema.Boolean),
  },
) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown({Operation}ServerParams));
  }

  static encode(value: {Operation}ServerParams) {
    return pipe(value, Schema.encode({Operation}ServerParams));
  }
}
```

---

## Traceability

| User Story | Operation | Files Created |
|------------|-----------|---------------|
| US-001 | signInSocial | controller, service, types + specs |
| US-002 | callbackOAuth | controller, service, types + specs |
| US-003 | linkSocialAccount | controller, service, types + specs |
| US-004 | getSession | controller, service, types + specs |
| US-005 | listSessions | controller, service, types + specs |
| US-006 | refreshToken | controller, service, types + specs |
| US-007 | getAccessToken | controller, service, types + specs |
| US-008 | revokeSession | controller, service, types + specs |
| US-009 | revokeSessions | controller, service, types + specs |
| US-010 | revokeOtherSessions | controller, service, types + specs |
| US-011 | accountInfo | controller, service, types + specs |
| US-012 | listUserAccounts | controller, service, types + specs |
| US-013 | unlinkAccount | controller, service, types + specs |
| US-014 | updateUser | controller, service, types + specs |
| US-015 | deleteUser | controller, service, types + specs |
| US-016 | deleteUserCallback | controller, service, types + specs |

---

## Related Decisions

- **TDD**: [Technical Design Document](../technical-design-doc.md)
- **API Contract**: [API Contract](../api-contract.md)

---

## References

- [Effect-TS Context and Layer](https://effect.website/docs/requirements-management/services)
- [Better Auth API Reference](https://www.better-auth.com/docs/api-reference)
- Email domain reference: `src/lib/server/core/email/`
- PRD: [Product Requirements Document](../../2-definition/prd.md)
- Acceptance Criteria: [Acceptance Criteria](../../2-definition/acceptance-criteria.md)
