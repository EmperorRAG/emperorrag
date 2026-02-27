# Technical Design Document: Better Auth Utilities Phase 1

## Document Info

- **Feature**: Server Operations for OAuth, Session, Account, User Domains
- **Version**: 1.0
- **Author**: Tech Lead
- **Reviewers**: Backend Engineer, QA Lead
- **Last Updated**: 2026-01-03
- **Status**: Draft

---

## Overview

### Feature/System Name

Better Auth Utilities - Phase 1: Server Operations Implementation

### Problem Statement and Goals

The Better Auth SDK uses traditional async/await patterns with thrown exceptions, making it incompatible with Effect-TS's typed error channels, composable pipelines, and dependency injection patterns. Currently, only the Email domain (11 operations) has full controller/service implementation. This TDD defines the technical approach for implementing the remaining 16 operations across OAuth, Session, Account, and User domains.

**Goals:**
1. Implement 16 server operations following the established Email domain pattern
2. Maintain consistent architecture across all domains
3. Achieve ≥80% test coverage (per PRD)
4. Provide complete TSDoc documentation

### Link to PRD and Related Documents

- [Product Requirements Document](../2-definition/prd.md)
- [Product Vision](../1-discovery/product-vision.md)
- [Product Roadmap](../1-discovery/product-roadmap.md)
- [User Stories](../3-planning/user-stories.md)
- [Epics](../3-planning/epics.md)
- [Acceptance Criteria](../2-definition/acceptance-criteria.md)
- [Test Strategy](../2-definition/test-strategy.md)

---

## Context

### Current System State

The `better-auth-utilities` library already has:

1. **Core Infrastructure (Complete)**
   - `AuthServerTag` / `AuthServerLive` - Better Auth server DI
   - `BetterAuthOptionsTag` / `BetterAuthOptionsLive` - Configuration DI
   - `AuthLive` - Composed layer stack

2. **Error Types (Complete)**
   - `InputError` - Schema validation failures (`message`, `cause?`)
   - `ApiError` - Better Auth API failures (`message`, `status?`, `cause?`)
   - `SessionError` - Session-related failures (`message`, `cause?`)
   - `DataMissingError` - Missing data errors (`message`, `cause?`)
   - `DependenciesError` - Layer/DI failures (`message`, `cause?`)

3. **Pipeline Utilities (Complete)**
   - `mapInputError` - Transforms Schema decode errors to InputError
   - `mapApiError` - Transforms API errors to ApiError
   - `handleInputError` / `handleApiError` - Error recovery

4. **Command Schemas (Complete - 30 total)**
   - All command schemas exist with decode/encode static methods
   - Located in `src/lib/schema/commands/`
   - Value object wrappers: `UrlSchema`, `NameSchema`, `ImageSchema`, `PasswordSchema`

5. **Email Domain (Complete - 11 operations)**
   - Full controller/service/types implementation
   - Reference pattern for new implementations

6. **Pending Domains (16 operations)**
   - OAuth (E-001): 3 operations (US-001, US-002, US-003)
   - Session (E-002): 7 operations (US-004 through US-010)
   - Account (E-003): 3 operations (US-011, US-012, US-013)
   - User (E-004): 3 operations (US-014, US-015, US-016)

### Relevant Existing Components

```
src/lib/
├── configs/                          # Configuration schemas
├── errors/                           # Tagged error types
│   ├── api.error.ts                  # ApiError
│   ├── input.error.ts                # InputError
│   ├── session.error.ts              # SessionError
│   ├── data-missing.error.ts         # DataMissingError
│   └── dependencies.error.ts         # DependenciesError
├── pipeline/                         # Error mapping utilities
│   ├── map-input-error/              # mapInputError
│   ├── map-api-error/                # mapApiError
│   ├── handle-input-error/           # handleInputError
│   └── handle-api-error/             # handleApiError
├── schema/
│   ├── commands/                     # 30 command schemas
│   │   ├── sign-in-social/           # SignInSocialCommand
│   │   ├── callback-oauth/           # CallbackOAuthCommand
│   │   ├── link-social-account/      # LinkSocialAccountCommand
│   │   ├── get-session/              # GetSessionCommand
│   │   ├── list-sessions/            # ListSessionsCommand
│   │   ├── refresh-token/            # RefreshTokenCommand
│   │   ├── get-access-token/         # GetAccessTokenCommand
│   │   ├── revoke-session/           # RevokeSessionCommand
│   │   ├── revoke-sessions/          # RevokeSessionsCommand
│   │   ├── revoke-other-sessions/    # RevokeOtherSessionsCommand
│   │   ├── account-info/             # AccountInfoCommand
│   │   ├── list-user-accounts/       # ListUserAccountsCommand
│   │   ├── unlink-account/           # UnlinkAccountCommand
│   │   ├── update-user/              # UpdateUserCommand
│   │   ├── delete-user/              # DeleteUserCommand
│   │   └── delete-user-callback/     # DeleteUserCallbackCommand
│   ├── urls/                         # UrlSchema value object
│   ├── names/                        # NameSchema value object
│   ├── images/                       # ImageSchema value object
│   └── passwords/                    # PasswordSchema value object
└── server/
    ├── server.layer.ts               # AuthServerTag, AuthServerLive, AuthLive
    └── core/
        └── email/                    # ✅ Reference implementation (11 ops)
            ├── sign-up-email/
            │   ├── signUpEmail.controller.ts
            │   ├── signUpEmail.controller.spec.ts
            │   ├── signUpEmail.service.ts
            │   ├── signUpEmail.service.spec.ts
            │   ├── signUpEmail.types.ts
            │   └── signUpEmail.types.spec.ts
            └── ...
```

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Consumer Application                         │
│                   (NestJS / Next.js / Effect-TS)                   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ Effect.provide(AuthLive)
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Better Auth Utilities                           │
├─────────────────────────────────────────────────────────────────────┤
│  Controllers                                                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐       │
│  │ signInSocial    │ │ getSession      │ │ updateUser      │       │
│  │ ServerController│ │ ServerController│ │ ServerController│  ...  │
│  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘       │
│           │                   │                   │                 │
│           │ Schema.decodeUnknown + mapInputError                    │
│           ▼                   ▼                   ▼                 │
│  Services                                                           │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐       │
│  │ signInSocial    │ │ getSession      │ │ updateUser      │       │
│  │ ServerService   │ │ ServerService   │ │ ServerService   │  ...  │
│  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘       │
│           │                   │                   │                 │
│           │ Effect.flatMap(AuthServerTag) + mapApiError             │
│           ▼                   ▼                   ▼                 │
├─────────────────────────────────────────────────────────────────────┤
│  Layers                                                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ AuthLive = Layer.provide(AuthServerLive, BetterAuthOptionsLive) │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ authServer.api.*
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Better Auth SDK                              │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          Database                                   │
│                   (SQLite / PostgreSQL / MySQL)                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Design

### Controller Layer

**Responsibility**: Input validation, error mapping, service delegation

**Pattern** (from `signUpEmail.controller.ts`):
```typescript
import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Schema from "effect/Schema";
import { mapInputError } from "../../../../pipeline/map-input-error/mapInputError";
import { {operation}ServerService } from "./{operation}.service";
import { {Operation}ServerParams } from "./{operation}.types";

export const {operation}ServerController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown({Operation}ServerParams),
    Effect.catchAll(mapInputError),
    Effect.flatMap({operation}ServerService),
    Effect.withSpan("{operation}ServerController"),
  );
```

**Interfaces**:
- Input: `unknown`
- Output: `Effect.Effect<Response, InputError | ApiError, AuthServerTag>`

### Service Layer

**Responsibility**: Better Auth API calls, response transformation

**Pattern** (from `signUpEmail.service.ts`):
```typescript
import * as Effect from "effect/Effect";
import { mapApiError } from "../../../../pipeline/map-api-error/mapApiError";
import { AuthServerTag } from "../../../server.layer";
import type { {Operation}ServerParams } from "./{operation}.types";

/**
 * @pure
 */
export const {operation}ServerService = (params: {Operation}ServerParams) =>
  Effect.flatMap(AuthServerTag, (authServer) =>
    Effect.tryPromise(() =>
      authServer.api.{betterAuthMethod}({
        body: { /* extract values from Schema wrappers */ },
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

### Types Layer

**Responsibility**: ServerParams schema definition

**Pattern** (from `signUpEmail.types.ts`):
```typescript
import { pipe } from "effect/Function";
import * as Schema from "effect/Schema";
import { {Operation}Command } from "../../../../schema/commands/{operation}/{Operation}.command";

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

## Data Flow

### Success Path

```
Consumer Input (unknown)
    │
    ▼
[Controller] Schema.decodeUnknown({Operation}ServerParams)
    │
    ▼
[Controller] Effect.flatMap({operation}ServerService)
    │
    ▼
[Service] Effect.flatMap(AuthServerTag)
    │
    ▼
[Service] Effect.tryPromise(() => authServer.api.{method}(...))
    │
    ▼
[Service] Effect.succeed(response)
    │
    ▼
Consumer receives Effect.Effect<Response, never, never>
```

### Error Path

```
Consumer Input (unknown)
    │
    ▼
[Controller] Schema.decodeUnknown fails
    │
    ▼
[Controller] Effect.catchAll(mapInputError)
    │
    ▼
Consumer receives Effect.Effect<never, InputError, never>

---OR---

[Service] authServer.api.{method} throws
    │
    ▼
[Service] Effect.catchAll(mapApiError)
    │
    ▼
Consumer receives Effect.Effect<never, ApiError, never>
```

---

## API Design

### Operations by Epic

#### E-001: OAuth Operations (US-001, US-002, US-003)

| Operation | Controller | Service | Better Auth Method |
|-----------|------------|---------|-------------------|
| Sign-In Social | signInSocialServerController | signInSocialServerService | api.signInSocial |
| Callback OAuth | callbackOAuthServerController | callbackOAuthServerService | api.callbackOAuth |
| Link Social Account | linkSocialAccountServerController | linkSocialAccountServerService | api.linkSocialAccount |

#### E-002: Session Operations (US-004 through US-010)

| Operation | Controller | Service | Better Auth Method |
|-----------|------------|---------|-------------------|
| Get Session | getSessionServerController | getSessionServerService | api.getSession |
| List Sessions | listSessionsServerController | listSessionsServerService | api.listSessions |
| Refresh Token | refreshTokenServerController | refreshTokenServerService | api.refreshToken |
| Get Access Token | getAccessTokenServerController | getAccessTokenServerService | api.getAccessToken |
| Revoke Session | revokeSessionServerController | revokeSessionServerService | api.revokeSession |
| Revoke Sessions | revokeSessionsServerController | revokeSessionsServerService | api.revokeSessions |
| Revoke Other Sessions | revokeOtherSessionsServerController | revokeOtherSessionsServerService | api.revokeOtherSessions |

#### E-003: Account Operations (US-011, US-012, US-013)

| Operation | Controller | Service | Better Auth Method |
|-----------|------------|---------|-------------------|
| Account Info | accountInfoServerController | accountInfoServerService | api.getAccountInfo |
| List User Accounts | listUserAccountsServerController | listUserAccountsServerService | api.listUserAccounts |
| Unlink Account | unlinkAccountServerController | unlinkAccountServerService | api.unlinkAccount |

#### E-004: User Operations (US-014, US-015, US-016)

| Operation | Controller | Service | Better Auth Method |
|-----------|------------|---------|-------------------|
| Update User | updateUserServerController | updateUserServerService | api.updateUser |
| Delete User | deleteUserServerController | deleteUserServerService | api.deleteUser |
| Delete User Callback | deleteUserCallbackServerController | deleteUserCallbackServerService | api.deleteUserCallback |

---

## Security Considerations

1. **No Token Storage**: Library never stores or caches tokens
2. **Native Headers**: Uses `Schema.instanceOf(Headers)` for type-safe header passing
3. **Sensitive Data Logging**: Error causes sanitized before logging
4. **Input Validation**: All inputs validated via Effect Schema before API calls
5. **Password Handling**: PasswordSchema wrappers ensure proper handling

---

## Testing Strategy

Per [Test Strategy](../2-definition/test-strategy.md):

### Unit Tests

- **Controller Tests**: Validate input parsing, error mapping
- **Service Tests**: Mock AuthServerTag, verify API call parameters
- **Types Tests**: Schema encode/decode validation

### Integration Tests

- **End-to-end**: Use `setupServerTestEnvironment()` with in-memory SQLite
- **Real Better Auth server** with test configuration

### Coverage Target

- ≥80% line coverage (per PRD)
- Framework: Vitest with @effect/vitest

---

## Implementation Plan

### Phase 1: OAuth Domain (E-001) - Week 1

| Task | User Story | Story Points | Priority |
|------|------------|--------------|----------|
| sign-in-social controller/service/types | US-001 | 3 | P0 |
| callback-oauth controller/service/types | US-002 | 5 | P0 |
| link-social-account controller/service/types | US-003 | 3 | P0 |
| OAuth domain tests | US-019 | 5 | P1 |

### Phase 2: Session Domain (E-002) - Week 2

| Task | User Story | Story Points | Priority |
|------|------------|--------------|----------|
| get-session controller/service/types | US-004 | 3 | P0 |
| list-sessions controller/service/types | US-005 | 3 | P0 |
| refresh-token controller/service/types | US-006 | 3 | P0 |
| get-access-token controller/service/types | US-007 | 2 | P0 |
| revoke-session controller/service/types | US-008 | 3 | P0 |
| revoke-sessions controller/service/types | US-009 | 3 | P0 |
| revoke-other-sessions controller/service/types | US-010 | 3 | P0 |
| Session domain tests | US-020 | 8 | P1 |

### Phase 3: Account Domain (E-003) - Week 3

| Task | User Story | Story Points | Priority |
|------|------------|--------------|----------|
| account-info controller/service/types | US-011 | 2 | P0 |
| list-user-accounts controller/service/types | US-012 | 3 | P0 |
| unlink-account controller/service/types | US-013 | 3 | P0 |
| Account domain tests | US-021 | 5 | P1 |

### Phase 4: User Domain (E-004) - Week 4

| Task | User Story | Story Points | Priority |
|------|------------|--------------|----------|
| update-user controller/service/types | US-014 | 3 | P0 |
| delete-user controller/service/types | US-015 | 5 | P0 |
| delete-user-callback controller/service/types | US-016 | 3 | P0 |
| User domain tests | US-022 | 5 | P1 |

### Phase 5: Documentation (E-005) - Week 4

| Task | User Story | Story Points | Priority |
|------|------------|--------------|----------|
| Controller TSDoc | US-017 | 5 | P1 |
| Service/Error TSDoc | US-018 | 5 | P1 |

---

## Rollout Approach

1. **Alpha**: Internal testing with NestJS microservice
2. **Beta**: Integration with Next.js frontend
3. **GA**: Publish to npm (Phase 1 complete)

### Feature Flags

Not applicable - library functionality.

### Rollback

Semantic versioning allows consumers to pin to previous version.

---

## Migration Plan

No migration required - new functionality extends existing library.

---

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Better Auth API changes | Medium | Low | Pin to 1.0.x, integration tests |
| Pattern inconsistency | High | Medium | Code review, templates, linting |
| Low test coverage | Medium | Low | Coverage gates in CI |
| Missing TSDoc | Low | Medium | TSDoc validation in build |

---

## Non-Functional Requirements

Per [PRD](../2-definition/prd.md) and [Acceptance Criteria](../2-definition/acceptance-criteria.md):

| Requirement | Target | Verification |
|-------------|--------|--------------|
| Operation overhead | <5ms beyond API call | Performance tests |
| Memory footprint | <1KB per operation | Memory profiling |
| No sync blocking | 100% async | Code review |
| TypeScript strict | Pass | CI build |
| Zero `any` types | Pass | TypeScript + lint |

---

## Related ADRs

- [ADR-001: Controller-Service Architecture Pattern](adrs/adr-001-controller-service-architecture.md)

---

## Changelog

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-01-03 | 1.0 | Tech Lead | Initial TDD aligned with codebase patterns |
