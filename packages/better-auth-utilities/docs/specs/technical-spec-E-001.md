# Technical Specification: Better Auth Utilities Epic E-001

## Metadata

- **Version**: 1.0
- **Author**: Backend Developer
- **Status**: Draft
- **Date**: 2026-01-03

---

## Purpose

Define detailed implementation requirements and constraints for 16 server operations across OAuth, Session, Account, and User domains, following the established Controller-Service-Types pattern.

---

## Scope

### In Scope

- Implementation specifications for 16 server operations
- Interface contracts (input/output)
- Error handling specifications
- Effect-TS patterns and templates
- User Story traceability (US-001 through US-016)

### Out of Scope

- Client-side operations (Epic E-002)
- Database schema changes (managed by Better Auth SDK)
- OAuth provider configuration
- Session storage implementation

---

## Requirements

### Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-001 | Implement OAuth server operations (sign-in-social, callback-oauth, link-social-account) | P0 | US-001, US-002, US-003 |
| FR-002 | Implement Session server operations (get-session, list-sessions, revoke-session, revoke-sessions, revoke-other-sessions, refresh-token, get-access-token) | P0 | US-004–US-010 |
| FR-003 | Implement Account server operations (account-info, list-user-accounts, unlink-account) | P0 | US-011, US-012, US-013 |
| FR-004 | Implement User server operations (update-user, delete-user, delete-user-callback) | P0 | US-014, US-015, US-016 |
| FR-005 | Each operation must have controller (input validation) and service (API call) layers | P0 | ADR-001 |
| FR-006 | Each operation must return typed `Effect<Success, Error, Dependencies>` | P0 | Type safety |
| FR-007 | All operations must support optional `headers`, `asResponse`, `returnHeaders` params | P1 | Consistency with Email domain |
| FR-008 | Add TSDoc documentation to all public exports | P1 | Developer experience |
| FR-009 | Create barrel exports (index.ts) for each domain | P1 | Clean import paths |
| FR-010 | Add `@pure` annotations to service functions | P2 | FP documentation convention |

### Non-Functional Requirements

| ID | Category | Requirement | Target |
|----|----------|-------------|--------|
| NFR-001 | Performance | Operations add minimal overhead beyond Better Auth API calls | <5ms |
| NFR-002 | Security | No secrets/credentials logged or exposed in error messages | 100% |
| NFR-003 | Scalability | Stateless design; no shared mutable state between operations | 100% |
| NFR-004 | Testability | All operations must be testable with mocked `AuthServerTag` | 100% |
| NFR-005 | Compatibility | Must work with Better Auth SDK >=1.0.0, Effect >=3.0.0 | Pass |

---

## Technical Details

### Technology Stack

- **Runtime**: Node.js 20.x LTS
- **Framework**: Effect-TS >=3.0.0
- **External SDK**: better-auth >=1.0.0
- **Test Framework**: Vitest with @effect/vitest
- **Build Tool**: Vite

### Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `headers` | `Headers` | undefined | Native Headers object for session |
| `asResponse` | `boolean` | undefined | Return full Response object |
| `returnHeaders` | `boolean` | undefined | Include response headers |

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| None | - | Configuration via Layer injection |

---

## Interface Specifications

### Input Interface (ServerParams Pattern)

```typescript
class {Operation}ServerParams extends Schema.TaggedClass<{Operation}ServerParams>()(
  "{Operation}ServerParams",
  {
    body: {Operation}Command,
    headers: Schema.optional(Schema.instanceOf(Headers)),
    asResponse: Schema.optional(Schema.Boolean),
    returnHeaders: Schema.optional(Schema.Boolean),
  },
) {}
```

### Output Interface (Effect Pattern)

```typescript
type OperationController = (input: unknown) =>
  Effect.Effect<Response, InputError | ApiError, AuthServerTag>
```

### Error Codes

| Code | Name | Description | Resolution |
|------|------|-------------|------------|
| InputError | Validation failure | Schema decode failed | Fix input data |
| ApiError | SDK failure | Better Auth threw error | Check SDK docs |
| SessionError | Session failure | Session invalid/expired | Re-authenticate |

---

## Constraints

### Technical Constraints

- Must use `Schema.instanceOf(Headers)` for headers validation
- Must extract `.value` from value object wrappers
- Must use `pipe` for Effect composition
- Must use `Effect.withSpan` for tracing

### Business Constraints

- Follow existing Email domain patterns exactly
- No breaking changes to existing API
- Maintain backward compatibility

---

## Dependencies

### Internal Dependencies

| Dependency | Purpose |
|------------|---------|
| `AuthServerTag` | DI for Better Auth server instance |
| `mapInputError` | Transform Schema errors to InputError |
| `mapApiError` | Transform SDK errors to ApiError |
| `InputError` | Validation error type |
| `ApiError` | API error type |
| Command schemas | Input validation per operation |
| Value schemas | UrlSchema, NameSchema, ImageSchema, PasswordSchema |

### External Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `effect` | >=3.0.0 | Effect-TS runtime |
| `better-auth` | >=1.0.0 | Authentication SDK |

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| `provider` | Non-empty string | "Provider is required" |
| `callbackURL` | Valid URL format | "Invalid URL format" |
| `token` (delete callback) | Required string | "Token is required" |
| `providerId` | Non-empty string | "Provider ID required" |

---

## Assumptions

- Better Auth SDK is properly configured by consumer
- Consumer provides BetterAuthOptionsLive layer
- Headers contain valid session cookies when required
- OAuth providers are configured in Better Auth options

---

## Operation Details

### OAuth Domain (F-002)

| Operation | Controller | Service | Command Fields |
|-----------|------------|---------|----------------|
| US-001 | signInSocialServerController | signInSocialServerService | provider, callbackURL?, errorCallbackURL?, newUserCallbackURL?, disableRedirect? |
| US-002 | callbackOAuthServerController | callbackOAuthServerService | state?, code?, error? |
| US-003 | linkSocialAccountServerController | linkSocialAccountServerService | provider, callbackURL? |

### Session Domain (F-003)

| Operation | Controller | Service | Command Fields |
|-----------|------------|---------|----------------|
| US-004 | getSessionServerController | getSessionServerService | {} (empty) |
| US-005 | listSessionsServerController | listSessionsServerService | {} (empty) |
| US-006 | refreshTokenServerController | refreshTokenServerService | {} (empty) |
| US-007 | getAccessTokenServerController | getAccessTokenServerService | {} (empty) |
| US-008 | revokeSessionServerController | revokeSessionServerService | token?, id? |
| US-009 | revokeSessionsServerController | revokeSessionsServerService | sessionToken?, sessionIds? |
| US-010 | revokeOtherSessionsServerController | revokeOtherSessionsServerService | {} (empty) |

### Account Domain (F-004)

| Operation | Controller | Service | Command Fields |
|-----------|------------|---------|----------------|
| US-011 | accountInfoServerController | accountInfoServerService | {} (empty) |
| US-012 | listUserAccountsServerController | listUserAccountsServerService | {} (empty) |
| US-013 | unlinkAccountServerController | unlinkAccountServerService | providerId |

### User Domain (F-005)

| Operation | Controller | Service | Command Fields |
|-----------|------------|---------|----------------|
| US-014 | updateUserServerController | updateUserServerService | name?, image?, additionalFields? |
| US-015 | deleteUserServerController | deleteUserServerService | password?, callbackURL? |
| US-016 | deleteUserCallbackServerController | deleteUserCallbackServerService | token (required) |

---

## Implementation Templates

### Controller Template

```typescript
import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Schema from "effect/Schema";
import { mapInputError } from "../../../../pipeline/map-input-error/mapInputError";
import { {operation}ServerService } from "./{operation}.service";
import { {Operation}ServerParams } from "./{operation}.types";

/**
 * Controller for handling {operation} requests.
 * @param input - The input data for the request.
 * @returns An Effect resolving to the operation result.
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

### Service Template

```typescript
import * as Effect from "effect/Effect";
import { mapApiError } from "../../../../pipeline/map-api-error/mapApiError";
import { AuthServerTag } from "../../../server.layer";
import type { {Operation}ServerParams } from "./{operation}.types";

/**
 * Service for {operation} operation.
 * @pure
 * @param params - The validated parameters.
 * @returns An Effect resolving to the API response.
 */
export const {operation}ServerService = (params: {Operation}ServerParams) =>
  Effect.flatMap(AuthServerTag, (authServer) =>
    Effect.tryPromise(() =>
      authServer.api.{sdkMethod}({
        body: {
          // Extract values from wrappers
        },
        ...(params.headers ? { headers: params.headers } : {}),
        ...(params.asResponse !== undefined ? { asResponse: params.asResponse } : {}),
        ...(params.returnHeaders !== undefined ? { returnHeaders: params.returnHeaders } : {}),
      })
    ).pipe(
      Effect.catchAll(mapApiError),
      Effect.withSpan("{operation}ServerService"),
    ));
```

### Types Template

```typescript
import { pipe } from "effect/Function";
import * as Schema from "effect/Schema";
import { {Operation}Command } from "../../../../schema/commands/{operation}/{Operation}.command";

/**
 * Parameters for the {operation} server operation.
 */
export class {Operation}ServerParams extends Schema.TaggedClass<{Operation}ServerParams>()(
  "{Operation}ServerParams",
  {
    body: {Operation}Command,
    headers: Schema.optional(Schema.instanceOf(Headers)),
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

## References

- [Technical Design Document](../design/technical-design-doc-E-001.md)
- [API Contract](../api/api-contract-E-001.md)
- [ADR-001: Controller-Service Architecture](../adr/adr-001-controller-service-architecture.md)
- [User Stories](../sdlc/3-planning/user-stories-E-001.md)
- [PRD](../prd/prd-E-001.md)
