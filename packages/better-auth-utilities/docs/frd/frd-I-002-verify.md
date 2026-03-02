# Feature Requirements Document: Email Verification

## Overview

- **Feature Name**: Email Verification
- **Parent Initiative**: [I-002: Email Server Operations](../ird/ird-I-002.md)
- **Feature Owner**: Backend Engineer
- **Last Updated**: 2026-03-02
- **Status**: Draft

### Problem Statement

Better Auth SDK provides async/await methods for email verification (verifying a token and sending a verification email) that throw untyped exceptions and accept plain JavaScript objects. Without Effect-TS wrappers, developers cannot compose email verification workflows into typed Effect pipelines, validate inputs at the boundary, or handle errors through typed error channels. The two operations also differ in how they interact with the SDK — verify-email passes parameters via the SDK's query interface while send-verification-email passes them via body — requiring operation-specific service implementations that correctly map inputs to the SDK's expected parameter shapes.

---

## Goals & Success Metrics

### Feature Objectives

- Deliver two email verification operations (verify-email, send-verification-email) following the controller-service-types pattern defined in ADR-001
- Provide schema-validated input boundaries in controllers that produce typed InputError on validation failure
- Provide typed API error mapping in services that produce typed ApiError on SDK failure
- Enable test isolation without real email transport by leveraging the Better Auth emailVerification config callback as the email delivery extension point

### Feature-Level Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Email verification operations implemented | 2/2 | Count of operations with controller, service, and types files |
| Controller-service-types trios complete | 2/2 | Each operation has all three implementation files |
| Test suites passing | 2/2 | Controller spec, service spec, and types spec per operation |
| Effect.withSpan annotations | 4/4 | Both controller and service annotated per operation |

---

## User Context

### Target User Segment(s)

- **Effect-TS Developer**: Needs composable email verification operations that integrate with Effect's pipe, flatMap, and error channel patterns; expects typed errors and schema-validated inputs for both token verification and verification email triggering
- **NestJS Backend Engineer**: Needs reliable email verification primitives with clear input contracts and structured error metadata for microservice endpoint mapping; expects the verification flow to work without managing email transport directly
- **Monorepo Consumer**: Needs documented, tested email verification utilities with predictable behavior that can be imported and composed into larger Effect programs handling user onboarding flows

### User Journey for This Feature

A developer triggers an email verification flow through one of two paths. In the first path, the developer calls the send-verification-email controller with a user's email address; the controller validates the input, the service calls the SDK to trigger email delivery via the configured email callback, and the consuming application handles the actual email transport through the Better Auth emailVerification config callback. In the second path, a user clicks the verification link containing a token; the developer calls the verify-email controller with the token; the controller validates the input, the service passes the token to the SDK's verifyEmail method via the query parameter, and the SDK confirms or rejects the verification. Both paths produce typed errors (InputError for validation failures, ApiError for SDK failures) through Effect's error channel.

### User Scenarios / Use Cases

| Scenario | Description | Expected Outcome |
|----------|-------------|-----------------|
| Valid token verification | Developer provides a valid verification token captured from the email callback | VerifyEmailServerParams decode succeeds, service passes token via SDK query parameter, verification succeeds (may redirect with 302 when callbackURL is provided) |
| Invalid or expired token | Developer provides a token that has expired or does not exist | SDK rejects the token, service maps the failure to ApiError with descriptive message |
| Verify-email with malformed input | Developer provides input that fails schema validation | Controller decode fails, InputError produced with formatted parse failure message before SDK is called |
| Valid send-verification-email | Developer provides a registered user's email address | SendVerificationEmailServerParams decode succeeds, service calls SDK sendVerificationEmail, email delivery is triggered via the configured callback |
| Send-verification-email with invalid email format | Developer provides a malformed email string | Controller decode fails at EmailSchema validation, InputError produced |
| Send-verification-email with non-existent email | Developer provides an email that is not registered | SDK may succeed silently for security (no information leakage about registered emails) or produce an error; either outcome is valid |
| Test environment with no-op email mock | Test author configures the email callback as a no-op function or a token-capturing function | Operations execute against in-memory server; verify-email tests capture tokens via the callback; send-verification-email tests use a no-op to avoid real email transport |

---

## Functional Requirements

### Verify Email Operation

| ID | EARS Type | Requirement | Priority | Notes |
|----|-----------|-------------|----------|-------|
| FR-001 | U | The system shall define verifyEmailServerController as a function that accepts unknown input | Must-Have | Primary entry point for email verification |
| FR-002 | E | When the controller receives input, the system shall decode it through VerifyEmailServerParams via Schema.decodeUnknown | Must-Have | Schema boundary validation |
| FR-003 | UB | If schema decode fails, the system shall map the decode failure to InputError via mapInputError | Must-Have | Typed error for validation failures |
| FR-004 | E | When decode succeeds, the system shall delegate the typed params to verifyEmailServerService via Effect.flatMap | Must-Have | Controller-to-service handoff |
| FR-005 | U | The system shall annotate the verifyEmailServerController Effect pipeline with Effect.withSpan | Must-Have | Observability span for the controller |
| FR-006 | U | The system shall define verifyEmailServerService as a function that accepts typed VerifyEmailServerParams | Must-Have | SDK interaction layer for token verification |
| FR-007 | E | When the service executes, the system shall resolve AuthServerTag from Effect Context | Must-Have | Dependency injection for the auth server |
| FR-008 | E | When the auth server is resolved, the system shall call authServer.api.verifyEmail via Effect.tryPromise | Must-Have | SDK call for email verification |
| FR-009 | UB | If the SDK call fails, the system shall map the failure to ApiError via mapApiError | Must-Have | Typed error for SDK failures |
| FR-010 | U | The system shall annotate the verifyEmailServerService Effect pipeline with Effect.withSpan | Must-Have | Observability span for the service |
| FR-011 | U | The system shall define VerifyEmailServerParams as a TaggedClass Schema with required body (VerifyEmailCommand), optional headers (Headers instance), optional asResponse (boolean), optional returnHeaders (boolean), plus static decode and encode methods | Must-Have | Input contract for verify-email |
| FR-012 | E | When building the SDK call payload, the system shall pass token and callbackURL via the SDK's query parameter (not body) | Must-Have | SDK API surface requirement unique to this operation |
| FR-013 | U | The system shall pass token as a plain string (not a branded value object), since verification tokens are opaque system-generated values | Must-Have | Token is Schema.String, not a branded field schema |
| FR-014 | E | When the optional branded callbackURL field (UrlSchema) is present, the system shall extract .value using conditional spread | Must-Have | Branded value extraction for SDK compatibility |
| FR-015 | U | The system shall compose the verify-email command schema (VerifyEmailCommand) from a plain Schema.String for token and an optional UrlSchema for callbackURL | Must-Have | Schema composition defined in frd-I-002-schemas.md; listed here for traceability |

### Send Verification Email Operation

| ID | EARS Type | Requirement | Priority | Notes |
|----|-----------|-------------|----------|-------|
| FR-016 | U | The system shall define sendVerificationEmailServerController as a function that accepts unknown input | Must-Have | Primary entry point for triggering verification email delivery |
| FR-017 | E | When the controller receives input, the system shall decode it through SendVerificationEmailServerParams via Schema.decodeUnknown | Must-Have | Schema boundary validation |
| FR-018 | UB | If schema decode fails, the system shall map the decode failure to InputError via mapInputError | Must-Have | Typed error for validation failures |
| FR-019 | E | When decode succeeds, the system shall delegate the typed params to sendVerificationEmailServerService via Effect.flatMap | Must-Have | Controller-to-service handoff |
| FR-020 | U | The system shall annotate the sendVerificationEmailServerController Effect pipeline with Effect.withSpan | Must-Have | Observability span for the controller |
| FR-021 | U | The system shall define sendVerificationEmailServerService as a function that accepts typed SendVerificationEmailServerParams | Must-Have | SDK interaction layer for sending verification email |
| FR-022 | E | When the service executes, the system shall resolve AuthServerTag from Effect Context | Must-Have | Dependency injection for the auth server |
| FR-023 | E | When the auth server is resolved, the system shall call authServer.api.sendVerificationEmail via Effect.tryPromise | Must-Have | SDK call for sending verification email |
| FR-024 | UB | If the SDK call fails, the system shall map the failure to ApiError via mapApiError | Must-Have | Typed error for SDK failures |
| FR-025 | U | The system shall annotate the sendVerificationEmailServerService Effect pipeline with Effect.withSpan | Must-Have | Observability span for the service |
| FR-026 | U | The system shall define SendVerificationEmailServerParams as a TaggedClass Schema with required body (SendVerificationEmailCommand), optional headers (Headers instance), optional asResponse (boolean), optional returnHeaders (boolean), plus static decode and encode methods | Must-Have | Input contract for send-verification-email |
| FR-027 | E | When building the SDK call payload, the system shall pass email and callbackURL via the SDK's body parameter (standard pattern), extracting .value from branded field schema instances | Must-Have | Standard body-based SDK parameter passing |
| FR-028 | U | The system shall compose the send-verification-email command schema (SendVerificationEmailCommand) from EmailSchema and optional UrlSchema | Must-Have | Schema composition defined in frd-I-002-schemas.md; listed here for traceability |
| FR-029 | U | The system shall not implement email transport; the Better Auth emailVerification.sendVerificationEmail config callback is the extension point for email delivery | Must-Have | Email transport is an application-level concern, not a library concern |

### Cross-Cutting Requirements

| ID | EARS Type | Requirement | Priority | Notes |
|----|-----------|-------------|----------|-------|
| FR-030 | U | The system shall follow the controller-service-types three-file pattern per ADR-001 for each operation | Must-Have | Architectural consistency across all operations |
| FR-031 | U | The system shall place each operation in its own directory under the email directory, with a barrel file re-exporting controller and service | Must-Have | One directory per operation for discoverability and isolation |
| FR-032 | UB | If schema decode fails, the controller shall produce InputError via mapInputError | Must-Have | Typed error channel — validation failures |
| FR-033 | UB | If the SDK call fails, the service shall produce ApiError via mapApiError | Must-Have | Typed error channel — SDK failures |
| FR-034 | U | The system shall resolve the auth server exclusively through AuthServerTag from Effect Context in services, never constructing or importing the server directly | Must-Have | Dependency injection via Effect Context for testability |
| FR-035 | U | The system shall annotate both controller and service with Effect.withSpan for both operations for observability and debugging traceability | Must-Have | Dual spans per ADR-001 |

---

## Non-Functional Requirements (Feature-Specific)

These targets are specific to this feature and must meet or exceed the initiative-wide baselines defined in the parent IRD.

| ID | Category | EARS Type | Requirement | Priority |
|----|----------|-----------|-------------|----------|
| NFR-001 | Type Safety | U | The system shall use branded types for email and URL fields | Must-Have |
| NFR-002 | Type Safety | U | The system shall use plain string for the verification token | Must-Have |
| NFR-003 | Type Safety | U | The system shall place tagged errors in the Effect error channel | Must-Have |
| NFR-004 | Type Safety | U | The system shall not use escape-hatch types in email verification operations | Must-Have |
| NFR-005 | Performance | U | The system shall complete operations within Better Auth SDK response time plus no more than 50 ms overhead for Schema decode/encode and Effect pipeline composition | Must-Have |
| NFR-006 | Testability | U | The system shall support testing each operation in isolation via in-memory test environment | Must-Have |
| NFR-007 | Testability | U | The system shall support capturing verification tokens via the emailVerification config callback in verify-email tests | Must-Have |
| NFR-008 | Testability | U | The system shall support send-verification-email tests using a no-op callback without real email transport | Must-Have |
| NFR-009 | Compatibility | U | The system shall be compatible with Better Auth SDK verifyEmail (query-based) method at the pinned version | Must-Have |
| NFR-010 | Compatibility | U | The system shall be compatible with Better Auth SDK sendVerificationEmail (body-based) method at the pinned version | Must-Have |
| NFR-011 | Documentation | U | The system shall include TSDoc comments with pure annotation and description on all controller and service exports | Must-Have |
| NFR-012 | Observability | U | The system shall include Effect.withSpan annotations on both controller and service functions for distributed tracing support | Must-Have |

---

## Scope

### In Scope

- Two controller modules (verifyEmailServerController, sendVerificationEmailServerController)
- Two service modules (verifyEmailServerService, sendVerificationEmailServerService)
- Two types modules (VerifyEmailServerParams, SendVerificationEmailServerParams) as TaggedClass schemas with static decode and encode
- Two barrel files re-exporting controller and service per operation
- Query-based parameter passing for verify-email (token and callbackURL via SDK query parameter)
- Body-based parameter passing for send-verification-email (email and callbackURL via SDK body parameter)
- Plain string token handling in verify-email (no branded value object)
- Branded value extraction (.value) for email and URL fields
- Conditional optional field spreading for SDK compatibility
- Effect.withSpan annotations on all controllers and services
- Test suites (controller spec, service spec, types spec) for each operation

### Out of Scope

- Command schema definitions (covered by frd-I-002-schemas.md)
- Field schema definitions (covered by frd-I-002-schemas.md)
- Tagged error class definitions (covered by frd-I-002-errors.md)
- Pipeline utility definitions (covered by frd-I-002-pipeline.md)
- Configuration and server layer definitions (covered by frd-I-002-layers.md)
- Email transport implementation (application-level concern handled via Better Auth config callback)
- Test environment helper (infrastructure concern shared across all domain operations)
- Package-level exports for operation modules (internal implementation details consumed via relative imports)
- Email authentication operations — sign-up, sign-in, sign-out (covered by frd-I-002-auth.md)
- Password management and email change operations (covered by separate FRDs)

---

## Constraints & Dependencies

### Technical Constraints

- Must follow the controller-service-types three-file pattern per ADR-001
- Must use mapInputError in controllers and mapApiError in services (not ad hoc error handling)
- Must resolve AuthServerTag from Effect Context in services (not construct the server directly)
- verify-email must use the SDK's query parameter (not body) for token and callbackURL
- send-verification-email must use the SDK's body parameter for email and callbackURL
- Verification token must be plain Schema.String, not a branded value object
- send-verification-email must not implement email delivery; the SDK's emailVerification config callback is the extension point

### Dependencies

| Dependency | Type | Owner | Status |
|------------|------|-------|--------|
| Effect-TS core and schema packages | External library | Effect team | Pinned version available |
| Better Auth SDK (verifyEmail, sendVerificationEmail methods) | External library | better-auth team | Pinned version available |
| Tagged Error Hierarchy (frd-I-002-errors.md) | Internal feature | I-002 | InputError and ApiError must exist |
| Configuration and Server Layers (frd-I-002-layers.md) | Internal feature | I-002 | AuthServerTag must exist |
| Schema Foundation (frd-I-002-schemas.md) | Internal feature | I-002 | Command schemas and field schemas must exist |
| Pipeline Utilities (frd-I-002-pipeline.md) | Internal feature | I-002 | mapInputError and mapApiError must exist |

---

## User Stories

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| US-001 | As a developer, I need to verify a user's email with a token so that account email ownership is confirmed through a typed Effect pipeline | Must-Have | Not Started |
| US-002 | As a developer, I need to send a verification email so that users receive a verification token through the configured email callback | Must-Have | Not Started |
| US-003 | As a developer, I need validation to catch invalid tokens and malformed emails before SDK interaction so that errors are typed and descriptive in Effect's error channel | Must-Have | Not Started |
| US-004 | As a test author, I need to capture verification tokens via the email config callback and use a no-op mock for send so that verification flows are testable without real email transport | Must-Have | Not Started |

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
- [FRD: Password Management](frd-I-002-password.md)
- [FRD: Email Change](frd-I-002-email-change.md)

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | Pending |
| Tech Lead | | | Pending |
