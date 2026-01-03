# Technical Specification: Better Auth Utilities Phase 1

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

- Client-side operations (Phase 2)
- Database schema changes (managed by Better Auth SDK)
- OAuth provider configuration
- Session storage implementation

---

## Requirements

### Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-001 | Implement OAuth sign-in-social operation | P0 | US-001 |
| FR-002 | Implement OAuth callback operation | P0 | US-002 |
| FR-003 | Implement link social account operation | P0 | US-003 |
| FR-004 | Implement get session operation | P0 | US-004 |
| FR-005 | Implement list sessions operation | P0 | US-005 |
| FR-006 | Implement refresh token operation | P0 | US-006 |
| FR-007 | Implement get access token operation | P0 | US-007 |
| FR-008 | Implement revoke session operation | P0 | US-008 |
| FR-009 | Implement revoke all sessions operation | P0 | US-009 |
| FR-010 | Implement revoke other sessions operation | P0 | US-010 |
| FR-011 | Implement account info operation | P0 | US-011 |
| FR-012 | Implement list user accounts operation | P0 | US-012 |
| FR-013 | Implement unlink account operation | P0 | US-013 |
| FR-014 | Implement update user operation | P0 | US-014 |
| FR-015 | Implement delete user operation | P0 | US-015 |
| FR-016 | Implement delete user callback operation | P0 | US-016 |
| FR-017 | Each operation follows Controller-Service-Types pattern | P0 | ADR-001 |
| FR-018 | Each operation returns typed Effect | P0 | Type safety |

### Non-Functional Requirements

| ID | Category | Requirement | Target |
|----|----------|-------------|--------|
| NFR-001 | Performance | Operation overhead | <5ms |
| NFR-002 | Performance | Memory per operation | <1KB |
| NFR-003 | Security | No credentials in logs | 100% |
| NFR-004 | Security | Sensitive fields excluded from errors | 100% |
| NFR-005 | Testability | Line coverage | >=80% |
| NFR-006 | Type Safety | No any types | 100% |
| NFR-007 | Type Safety | TypeScript strict mode | Pass |

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

### OAuth Domain (E-001)

| Operation | Controller | Service | Command Fields |
|-----------|------------|---------|----------------|
| US-001 | signInSocialServerController | signInSocialServerService | provider, callbackURL?, errorCallbackURL?, newUserCallbackURL?, disableRedirect? |
| US-002 | callbackOAuthServerController | callbackOAuthServerService | state?, code?, error? |
| US-003 | linkSocialAccountServerController | linkSocialAccountServerService | provider, callbackURL? |

### Session Domain (E-002)

| Operation | Controller | Service | Command Fields |
|-----------|------------|---------|----------------|
| US-004 | getSessionServerController | getSessionServerService | {} (empty) |
| US-005 | listSessionsServerController | listSessionsServerService | {} (empty) |
| US-006 | refreshTokenServerController | refreshTokenServerService | {} (empty) |
| US-007 | getAccessTokenServerController | getAccessTokenServerService | {} (empty) |
| US-008 | revokeSessionServerController | revokeSessionServerService | token?, id? |
| US-009 | revokeSessionsServerController | revokeSessionsServerService | sessionToken?, sessionIds? |
| US-010 | revokeOtherSessionsServerController | revokeOtherSessionsServerService | {} (empty) |

### Account Domain (E-003)

| Operation | Controller | Service | Command Fields |
|-----------|------------|---------|----------------|
| US-011 | accountInfoServerController | accountInfoServerService | {} (empty) |
| US-012 | listUserAccountsServerController | listUserAccountsServerService | {} (empty) |
| US-013 | unlinkAccountServerController | unlinkAccountServerService | providerId |

### User Domain (E-004)

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

- [Technical Design Document](../4-design/technical-design-doc.md)
- [API Contract](../4-design/api-contract.md)
- [ADR-001: Controller-Service Architecture](../4-design/adrs/adr-001-controller-service-architecture.md)
- [User Stories](../3-planning/user-stories.md)
- [PRD](../2-definition/prd.md)
