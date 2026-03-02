# Feature Requirements Document: Email Change

## Overview

- **Feature Name**: Email Change
- **Parent Initiative**: [I-002: Email Server Operations](../ird/ird-I-002.md)
- **Feature Owner**: Backend Engineer
- **Last Updated**: 2026-03-02
- **Status**: Draft

### Problem Statement

Better Auth SDK provides an async/await method for changing a user's email address that throws untyped exceptions and accepts plain JavaScript objects. Without an Effect-TS wrapper, developers cannot validate email-change inputs at the boundary through command schemas, handle failures through typed error channels, or compose email-change into larger account-management pipelines. The operation also requires explicit runtime enablement via the server configuration flag (user.changeEmail.enabled), adding a pre-condition that consumers must satisfy before the SDK method becomes available. Each consumer would need to write custom boilerplate to bridge the SDK call into an Effect program, resulting in duplicated effort, inconsistent error handling, and no separation between input validation and SDK interaction.

---

## Goals & Success Metrics

### Feature Objectives

- Deliver one email change operation (change-email) following the controller-service-types pattern defined in ADR-001
- Provide schema-validated input boundaries in the controller that produce typed InputError on validation failure, using branded EmailSchema for the required newEmail field and branded UrlSchema for the optional callbackURL field
- Provide typed API error mapping in the service that produces typed ApiError on SDK failure
- Enable test isolation by resolving the auth server exclusively through Effect Context via AuthServerTag, with runtime config enablement (user.changeEmail.enabled) required in the test server setup

### Feature-Level Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Email change operations implemented | 1/1 | Count of operations with controller, service, and types files |
| Controller-service-types trios complete | 1/1 | The operation has all three implementation files |
| Test suites passing | 1/1 | Controller spec, service spec, and types spec for the operation |
| Effect.withSpan annotations | 2/2 | Both controller and service annotated |

---

## User Context

### Target User Segment(s)

- **Effect-TS Developer**: Needs a composable email change operation that integrates with Effect's pipe, flatMap, and error channel patterns; expects typed errors and schema-validated inputs with branded Email and Url types for boundary safety
- **NestJS Backend Engineer**: Needs a reliable email change primitive with a clear input contract and structured error metadata for microservice endpoint mapping; expects the operation to enforce authentication via session headers and respect the server-level feature flag
- **Monorepo Consumer**: Needs a documented, tested email change utility with predictable behavior that can be imported and composed into larger Effect programs handling account settings workflows

### User Journey for This Feature

A developer changes a user's email address by calling the change-email controller with the new email, optional callback URL, and session headers from the authenticated user. The controller validates the input through ChangeEmailServerParams using Schema.decodeUnknown, producing InputError if the new email fails EmailSchema validation or the callback URL fails UrlSchema validation. On successful decode, the controller delegates to the service, which resolves AuthServerTag from Effect Context, extracts .value from the branded newEmail field and conditionally spreads .value from the optional branded callbackURL field, then calls authServer.api.changeEmail via Effect.tryPromise. The SDK may trigger a verification email to the new address (controlled by the callbackURL parameter); on failure the service maps the error to ApiError via mapApiError. The consuming application decides how to handle the verification email delivery through the Better Auth email callback configuration.

### User Scenarios / Use Cases

| Scenario | Description | Expected Outcome |
|----------|-------------|-----------------|
| Valid change-email with new email | Authenticated user provides a valid new email address with session headers | ChangeEmailServerParams decode succeeds, service calls SDK changeEmail, email change is initiated |
| Valid change-email with callbackURL | Authenticated user provides a new email and a callback URL for post-verification redirect | ChangeEmailServerParams decode succeeds, service extracts .value from both branded fields, SDK receives the callbackURL for redirect after email verification |
| Change-email with duplicate email | Authenticated user provides an email address already registered to another account | SDK rejects the request, service maps the failure to ApiError |
| Change-email without session headers | Developer calls change-email without providing authentication headers | SDK fails with unauthorized error, service maps it to ApiError |
| Change-email with invalid email format | Developer provides a malformed email string that fails EmailSchema validation | Controller decode fails, InputError produced with formatted parse failure message before SDK is called |
| Change-email when feature not enabled | Server configuration does not have user.changeEmail.enabled set to true | SDK rejects the request at the API level, service maps the failure to ApiError |

---

## Functional Requirements

### Change Email Operation

| ID | EARS Type | Requirement | Priority | Notes |
|----|-----------|-------------|----------|-------|
| FR-001 | U | The system shall define changeEmailServerController as a function that accepts unknown input | Must-Have | Primary entry point for email change |
| FR-002 | E | When the controller receives input, the system shall decode it through ChangeEmailServerParams via Schema.decodeUnknown | Must-Have | Schema boundary validation |
| FR-003 | UB | If schema decode fails, the system shall map the decode failure to InputError via mapInputError | Must-Have | Typed error for validation failures |
| FR-004 | E | When decode succeeds, the system shall delegate the typed params to changeEmailServerService via Effect.flatMap | Must-Have | Controller-to-service handoff |
| FR-005 | U | The system shall annotate the changeEmailServerController Effect pipeline with Effect.withSpan | Must-Have | Observability span for the controller |
| FR-006 | U | The system shall define changeEmailServerService as a function that accepts typed ChangeEmailServerParams | Must-Have | SDK interaction layer for email change |
| FR-007 | E | When the service executes, the system shall resolve AuthServerTag from Effect Context | Must-Have | Dependency injection for the auth server |
| FR-008 | E | When the auth server is resolved, the system shall call authServer.api.changeEmail via Effect.tryPromise | Must-Have | SDK call for email change |
| FR-009 | UB | If the SDK call fails, the system shall map the failure to ApiError via mapApiError | Must-Have | Typed error for SDK failures |
| FR-010 | U | The system shall annotate the changeEmailServerService Effect pipeline with Effect.withSpan | Must-Have | Observability span for the service |
| FR-011 | U | The system shall define ChangeEmailServerParams as a TaggedClass Schema with required body (ChangeEmailCommand), optional headers (Headers instance), optional asResponse (boolean), optional returnHeaders (boolean), plus static decode and encode methods | Must-Have | Input contract for change-email |
| FR-012 | E | When building the SDK call payload, the system shall extract .value from the branded newEmail field (EmailSchema) | Must-Have | Branded value extraction for SDK compatibility |
| FR-013 | E | When the optional branded callbackURL field (UrlSchema) is present, the system shall conditionally spread .value from it into the SDK call payload | Must-Have | Optional branded value extraction |
| FR-014 | U | The system shall compose the change-email command schema from EmailSchema (required newEmail) and optional UrlSchema (callbackURL) — both branded value objects requiring .value extraction at the service boundary | Must-Have | Schema composition defined in frd-I-002-schemas.md; listed here for traceability |

### Cross-Cutting Requirements

| ID | EARS Type | Requirement | Priority | Notes |
|----|-----------|-------------|----------|-------|
| FR-015 | U | The system shall follow the controller-service-types three-file pattern per ADR-001 for the operation | Must-Have | Architectural consistency with all other operations |
| FR-016 | U | The system shall place the operation in its own directory under the email directory, with a barrel file re-exporting controller and service | Must-Have | One directory per operation for discoverability and isolation |
| FR-017 | UB | If schema decode fails, the controller shall produce InputError (via mapInputError) | Must-Have | Typed error channel — validation failures |
| FR-018 | UB | If the SDK call fails, the service shall produce ApiError (via mapApiError) | Must-Have | Typed error channel — SDK failures |
| FR-019 | U | The service shall resolve the auth server exclusively through AuthServerTag from Effect Context, never constructing or importing the server directly | Must-Have | Dependency injection via Effect Context for testability |
| FR-020 | U | The system shall annotate both controller and service with Effect.withSpan for observability and debugging traceability | Must-Have | Dual spans per ADR-001 |

---

## Non-Functional Requirements (Feature-Specific)

These targets are specific to this feature and must meet or exceed the initiative-wide baselines defined in the parent IRD.

| ID | Category | EARS Type | Requirement | Priority |
|----|----------|-----------|-------------|----------|
| NFR-001 | Type Safety | U | The system shall use branded Email type for the newEmail field | Must-Have |
| NFR-002 | Type Safety | U | The system shall use branded Url type for the optional callbackURL field | Must-Have |
| NFR-003 | Type Safety | U | The system shall place tagged errors in the Effect error channel | Must-Have |
| NFR-004 | Type Safety | U | The system shall not use escape-hatch types in the email change operation | Must-Have |
| NFR-005 | Performance | U | The system shall complete the operation within Better Auth SDK response time plus no more than 50 ms overhead for Schema decode/encode and Effect pipeline composition | Must-Have |
| NFR-006 | Testability | U | The system shall support testing in isolation via in-memory test environment | Must-Have |
| NFR-007 | Testability | S | While the test server is configured, the system shall require user.changeEmail.enabled set to true | Must-Have |
| NFR-008 | Testability | U | The system shall require test setup to sign up a user and capture session headers before invoking change-email | Must-Have |
| NFR-009 | Compatibility | U | The system shall be compatible with the Better Auth SDK changeEmail method at the pinned version | Must-Have |
| NFR-010 | Compatibility | S | While the server is running, the system shall require the runtime feature flag user.changeEmail.enabled to be true | Must-Have |
| NFR-011 | Documentation | U | The system shall include TSDoc comments with pure annotation and description on controller and service exports | Must-Have |
| NFR-012 | Observability | U | The system shall include Effect.withSpan annotations on both controller and service functions for distributed tracing support | Must-Have |

---

## Scope

### In Scope

- One controller module (changeEmailServerController)
- One service module (changeEmailServerService)
- One types module (ChangeEmailServerParams) as a TaggedClass schema with static decode and encode
- One barrel file re-exporting controller and service
- Branded value extraction (.value) from required newEmail (EmailSchema) and optional callbackURL (UrlSchema)
- Conditional optional field spreading for callbackURL when present
- Effect.withSpan annotations on both controller and service
- Test suites (controller spec, service spec, types spec) for the operation

### Out of Scope

- Command schema definitions (covered by frd-I-002-schemas.md)
- Field schema definitions (covered by frd-I-002-schemas.md)
- Tagged error class definitions (covered by frd-I-002-errors.md)
- Pipeline utility definitions (covered by frd-I-002-pipeline.md)
- Configuration and server layer definitions (covered by frd-I-002-layers.md)
- Email transport and sendChangeEmailVerification callback implementation (application-level concern)
- Test environment helper (infrastructure concern shared across all domain operations)
- Package-level exports for operation modules (internal implementation details consumed via relative imports)
- Email authentication operations — sign-up, sign-in, sign-out (covered by frd-I-002-auth.md)
- Email verification operations — verify-email, send-verification-email (covered by frd-I-002-verify.md)
- Password management operations — change-password, forgot-password, forget-password-callback, reset-password, set-password (covered by frd-I-002-password.md)

---

## Constraints & Dependencies

### Technical Constraints

- Must follow the controller-service-types three-file pattern per ADR-001
- Must use mapInputError in the controller and mapApiError in the service (not ad hoc error handling)
- Must resolve AuthServerTag from Effect Context in the service (not construct the server directly)
- Requires authenticated session headers — the SDK rejects unauthenticated change-email requests
- Requires runtime feature flag enablement (user.changeEmail.enabled set to true in the Better Auth server configuration); the SDK rejects requests when the feature is not enabled
- Both body fields use branded value objects requiring .value extraction before passing to the SDK (newEmail via EmailSchema, callbackURL via UrlSchema)

### Dependencies

| Dependency | Type | Owner | Status |
|------------|------|-------|--------|
| Effect-TS core and schema packages | External library | Effect team | Pinned version available |
| Better Auth SDK (changeEmail method) | External library | better-auth team | Pinned version available |
| Tagged Error Hierarchy (frd-I-002-errors.md) | Internal feature | I-002 | InputError and ApiError must exist |
| Configuration and Server Layers (frd-I-002-layers.md) | Internal feature | I-002 | AuthServerTag must exist |
| Schema Foundation (frd-I-002-schemas.md) | Internal feature | I-002 | ChangeEmailCommand and field schemas must exist |
| Pipeline Utilities (frd-I-002-pipeline.md) | Internal feature | I-002 | mapInputError and mapApiError must exist |

---

## User Stories

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| US-001 | As a developer, I need to change a user's email address with an authenticated session so that account email updates flow through a typed Effect pipeline with branded input validation | Must-Have | Not Started |
| US-002 | As a developer, I need to provide an optional callbackURL for post-verification redirect so that the consuming application can control where the user lands after confirming their new email address | Should-Have | Not Started |
| US-003 | As a developer, I need typed InputError and ApiError in the error channel so that validation failures and SDK rejections (including missing auth, duplicate email, or disabled feature) are distinguishable and composable | Must-Have | Not Started |
| US-004 | As a test author, I need to verify change-email in isolation via AuthServerTag and user.changeEmail.enabled config so that tests run against an in-memory server without external dependencies | Must-Have | Not Started |

---

## Open Questions

| Question | Owner | Due Date | Resolution |
|----------|-------|----------|------------|
| — | — | — | No open questions at this time |

---

## Related Documentation

- [Parent IRD: I-002 Email Server Operations](../ird/ird-I-002.md)
- [ADR-001: Controller-Service Architecture](../adr/adr-001-controller-service-architecture.md)
- [FRD: Tagged Error Hierarchy](frd-I-002-errors.md)
- [FRD: Configuration and Server Layers](frd-I-002-layers.md)
- [FRD: Schema Foundation](frd-I-002-schemas.md)
- [FRD: Pipeline Utilities](frd-I-002-pipeline.md)
- [FRD: Email Authentication](frd-I-002-auth.md)
- [FRD: Email Verification](frd-I-002-verify.md)
- [FRD: Password Management](frd-I-002-password.md)

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | Pending |
| Tech Lead | | | Pending |
