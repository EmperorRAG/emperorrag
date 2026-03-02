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

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-001 | Define changeEmailServerController as a function that accepts unknown input, decodes through ChangeEmailServerParams via Schema.decodeUnknown, maps decode failures via mapInputError, delegates to changeEmailServerService via Effect.flatMap, and annotates with Effect.withSpan | Must-Have | Primary entry point for email change |
| FR-002 | Define changeEmailServerService as a function that accepts typed ChangeEmailServerParams, resolves AuthServerTag from Effect Context, calls authServer.api.changeEmail via Effect.tryPromise, maps SDK failures via mapApiError, and annotates with Effect.withSpan | Must-Have | SDK interaction layer for email change |
| FR-003 | Define ChangeEmailServerParams as a TaggedClass Schema with required body (ChangeEmailCommand), optional headers (Headers instance), optional asResponse (boolean), optional returnHeaders (boolean), plus static decode and encode methods | Must-Have | Input contract for change-email |
| FR-004 | The change-email service must extract .value from the branded newEmail field (EmailSchema) and conditionally spread .value from the optional branded callbackURL field (UrlSchema) only when present | Must-Have | Branded value extraction for SDK compatibility |
| FR-005 | The change-email command schema composes EmailSchema (required newEmail) and optional UrlSchema (callbackURL) — both branded value objects requiring .value extraction at the service boundary | Must-Have | Schema composition defined in frd-I-002-schemas.md; listed here for traceability |

### Cross-Cutting Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-006 | The operation must follow the controller-service-types three-file pattern per ADR-001 | Must-Have | Architectural consistency with all other operations |
| FR-007 | The operation must reside in its own directory under the email directory, with a barrel file re-exporting controller and service | Must-Have | One directory per operation for discoverability and isolation |
| FR-008 | The controller must produce InputError (via mapInputError) when schema decode fails and ApiError (via service and mapApiError) when the SDK call fails | Must-Have | Typed error channel with two distinct error types |
| FR-009 | The service must resolve the auth server exclusively through AuthServerTag from Effect Context, never constructing or importing the server directly | Must-Have | Dependency injection via Effect Context for testability |
| FR-010 | The operation must annotate both controller and service with Effect.withSpan for observability and debugging traceability | Must-Have | Dual spans per ADR-001 |

---

## Non-Functional Requirements (Feature-Specific)

These targets are specific to this feature and must meet or exceed the initiative-wide baselines defined in the parent IRD.

| Category | Requirement |
|----------|-------------|
| Type Safety | Branded Email type for newEmail, branded Url type for optional callbackURL; tagged errors in the error channel; zero escape-hatch types |
| Performance | Operation must complete within Better Auth SDK response time plus no more than 50ms overhead for Schema decode/encode and Effect pipeline composition |
| Testability | Testable in isolation via in-memory test environment; test server must configure user.changeEmail.enabled to true; test setup requires signing up a user and capturing session headers before invoking change-email |
| Compatibility | Must be compatible with Better Auth SDK changeEmail method at the pinned version; requires runtime feature flag enablement (user.changeEmail.enabled) |
| Documentation | Controller and service exports must have TSDoc comments with pure annotation and description |
| Observability | Both controller and service functions must include Effect.withSpan annotations for distributed tracing support |

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

## Acceptance Criteria Outline

- [ ] Controller decodes raw input through ChangeEmailServerParams via Schema.decodeUnknown
- [ ] Controller maps decode failures to InputError via mapInputError
- [ ] Service resolves AuthServerTag from Effect Context
- [ ] Service calls authServer.api.changeEmail via Effect.tryPromise
- [ ] Service maps SDK failures to ApiError via mapApiError
- [ ] Service extracts .value from branded newEmail and conditionally spreads .value from optional branded callbackURL
- [ ] Both controller and service annotated with Effect.withSpan
- [ ] Operation has a controller spec, service spec, and types spec

*Detailed acceptance criteria are maintained in a separate [Acceptance Criteria document](link).*

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
