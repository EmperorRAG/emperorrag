# Feature Requirements Document: Email Authentication

## Overview

- **Feature Name**: Email Authentication
- **Parent Initiative**: [I-002: Email Server Operations](../ird/ird-I-002.md)
- **Feature Owner**: Backend Engineer
- **Last Updated**: 2026-03-02
- **Status**: Draft

### Problem Statement

Better Auth SDK provides async/await email authentication methods (sign-up, sign-in, sign-out) that throw untyped exceptions and accept plain JavaScript objects. Without Effect-TS wrappers, developers cannot compose these operations into typed Effect pipelines, validate inputs at the boundary via command schemas, or handle errors through typed error channels. Each consumer would need to write custom boilerplate to bridge email authentication workflows into Effect programs, resulting in duplicated effort, inconsistent error handling, and no separation between input validation and SDK interaction.

---

## Goals & Success Metrics

### Feature Objectives

- Deliver three email authentication operations (sign-up, sign-in, sign-out) following the controller-service-types pattern defined in ADR-001
- Provide schema-validated input boundaries in controllers that produce typed InputError on validation failure
- Provide typed API error mapping in services that produce typed ApiError on SDK failure with preserved HTTP status codes
- Enable test isolation by resolving the auth server exclusively through Effect Context via AuthServerTag

### Feature-Level Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Email authentication operations implemented | 3/3 | Count of operations with controller, service, and types files |
| Controller-service-types trios complete | 3/3 | Each operation has all three implementation files |
| Test suites passing | 3/3 | Controller spec, service spec, and types spec per operation |
| Effect.withSpan annotations | 6/6 | Both controller and service annotated per operation |

---

## User Context

### Target User Segment(s)

- **Effect-TS Developer**: Needs composable email authentication operations that integrate with Effect's pipe, flatMap, and error channel patterns; expects typed errors and schema-validated inputs without manual SDK boilerplate
- **NestJS Backend Engineer**: Needs reliable email authentication primitives with clear input contracts and structured error metadata (HTTP status codes, messages) for microservice endpoint mapping
- **Monorepo Consumer**: Needs documented, tested email authentication utilities with predictable behavior that can be imported and composed into larger Effect programs

### User Journey for This Feature

A developer calls an email authentication controller with raw input. The controller decodes the input through the operation's ServerParams schema, validating all fields against their field schema definitions. If decoding fails, the controller produces an InputError with a formatted parse failure message. If decoding succeeds, the controller delegates to the service via Effect.flatMap. The service resolves the auth server from Effect Context via AuthServerTag, calls the appropriate Better Auth SDK method via Effect.tryPromise, and maps any SDK failure to an ApiError with preserved metadata. The typed result or tagged error flows through Effect's error channel for downstream pattern matching and recovery.

### User Scenarios / Use Cases

| Scenario | Description | Expected Outcome |
|----------|-------------|-----------------|
| Valid sign-up | Developer provides valid email, password, and name for account creation | SignUpEmailServerParams decode succeeds, service calls SDK signUpEmail, returns user data with email confirmation |
| Sign-up with invalid email | Developer provides a malformed email string for sign-up | Controller decode fails at EmailSchema validation, InputError produced with formatted parse failure message |
| Sign-up with duplicate email | Developer attempts to register an email that already exists | SDK throws APIError with 409 status, service maps it to ApiError with status code and message preserved |
| Valid sign-in | Developer provides correct email and password credentials | SignInEmailServerParams decode succeeds, service calls SDK signInEmail, returns session/token data |
| Sign-in with wrong password | Developer provides incorrect password for an existing account | SDK throws error with "Invalid email or password" message, service maps it to ApiError |
| Sign-in with malformed input | Developer provides input that fails schema validation | Controller decode fails, InputError produced before SDK is ever called |
| Valid sign-out | Developer provides session headers for an authenticated user | SignOutEmailServerParams decode succeeds, service calls SDK signOut with headers, session is terminated |
| Sign-out without session headers | Developer calls sign-out without providing session identification | SDK fails with "Failed to get session" error, service maps it to ApiError |
| Sign-out with empty input | Developer calls sign-out with no body (no body field required) | Decode succeeds since SignOutEmailServerParams has no body field, service proceeds with default empty headers |
| Test environment isolation | Test author bootstraps in-memory server and provides AuthServerTag directly | Operations run against the test server without production layers, enabling isolated unit testing |

---

## Functional Requirements

### Sign-Up Email Operation

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-001 | Define signUpEmailServerController as a function that accepts unknown input, decodes through SignUpEmailServerParams via Schema.decodeUnknown, maps decode failures via mapInputError, delegates to signUpEmailServerService via Effect.flatMap, and annotates with Effect.withSpan | Must-Have | Primary entry point for email sign-up |
| FR-002 | Define signUpEmailServerService as a function that accepts typed SignUpEmailServerParams, resolves AuthServerTag from Effect Context, calls authServer.api.signUpEmail via Effect.tryPromise, maps SDK failures via mapApiError, and annotates with Effect.withSpan | Must-Have | SDK interaction layer for sign-up |
| FR-003 | Define SignUpEmailServerParams as a TaggedClass Schema with required body (SignUpEmailCommand), optional headers (Headers instance), optional asResponse (boolean), optional returnHeaders (boolean), plus static decode and encode methods | Must-Have | Input contract for sign-up |
| FR-004 | The sign-up service must extract .value from branded value object fields (email, password, name, image, callbackURL) to produce plain strings for the SDK call | Must-Have | Branded types require explicit value extraction |
| FR-005 | The sign-up service must conditionally spread optional fields (image, callbackURL, additionalFields, headers, asResponse, returnHeaders) only when present | Must-Have | SDK does not accept undefined values for optional parameters |
| FR-006 | The sign-up command schema (SignUpEmailCommand) composes EmailSchema, PasswordSchema, NameSchema, and optionally ImageSchema, UrlSchema, and an additionalFields record | Must-Have | Schema composition is defined in frd-I-002-schemas.md; listed here for traceability |

### Sign-In Email Operation

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-007 | Define signInEmailServerController as a function that accepts unknown input, decodes through SignInEmailServerParams via Schema.decodeUnknown, maps decode failures via mapInputError, delegates to signInEmailServerService via Effect.flatMap, and annotates with Effect.withSpan | Must-Have | Primary entry point for email sign-in |
| FR-008 | Define signInEmailServerService as a function that accepts typed SignInEmailServerParams, resolves AuthServerTag from Effect Context, calls authServer.api.signInEmail via Effect.tryPromise, maps SDK failures via mapApiError, and annotates with Effect.withSpan | Must-Have | SDK interaction layer for sign-in |
| FR-009 | Define SignInEmailServerParams as a TaggedClass Schema with required body (SignInEmailCommand), optional headers (Headers instance), optional asResponse (boolean), optional returnHeaders (boolean), plus static decode and encode methods | Must-Have | Input contract for sign-in |
| FR-010 | The sign-in service must pass rememberMe as a plain boolean (not a branded value object) since it is a simple flag, not domain data | Must-Have | Intentional deviation from the value object pattern for simple flags |
| FR-011 | The sign-in command schema (SignInEmailCommand) composes EmailSchema, PasswordSchema, optionally UrlSchema, and a plain rememberMe boolean | Must-Have | Schema composition is defined in frd-I-002-schemas.md; listed here for traceability |
| FR-012 | The sign-in operation must produce an ApiError with a descriptive message when the SDK rejects invalid credentials | Must-Have | Common failure mode: "Invalid email or password" |

### Sign-Out Email Operation

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-013 | Define signOutEmailServerController as a function that accepts unknown input, decodes through SignOutEmailServerParams via Schema.decodeUnknown, maps decode failures via mapInputError, delegates to signOutEmailServerService via Effect.flatMap, and annotates with Effect.withSpan | Must-Have | Primary entry point for sign-out |
| FR-014 | Define signOutEmailServerService as a function that accepts typed SignOutEmailServerParams, resolves AuthServerTag from Effect Context, calls authServer.api.signOut via Effect.tryPromise, maps SDK failures via mapApiError, and annotates with Effect.withSpan | Must-Have | SDK method is signOut, not signOutEmail |
| FR-015 | Define SignOutEmailServerParams as a TaggedClass Schema with optional headers (Headers instance), optional asResponse (boolean), optional returnHeaders (boolean), and no body field, plus static decode and encode methods | Must-Have | Sign-out requires no input body; session is identified via headers |
| FR-016 | The sign-out service must default headers to a new empty Headers instance when no headers are provided, since the SDK requires headers to identify the session | Must-Have | Ensures the SDK always receives a Headers object |
| FR-017 | The sign-out operation must call authServer.api.signOut (the domain-agnostic SDK method), not a hypothetical signOutEmail method | Must-Have | SDK API surface uses signOut for all session types |
| FR-018 | The sign-out operation must produce an ApiError when no valid session is identified from the provided headers | Must-Have | Common failure mode: "Failed to get session" |

### Cross-Cutting Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-019 | Each operation must follow the controller-service-types three-file pattern per ADR-001 | Must-Have | Architectural consistency across all operations |
| FR-020 | Each operation must reside in its own directory under the email directory, with a barrel file re-exporting controller and service | Must-Have | One directory per operation for discoverability and isolation |
| FR-021 | Controllers must produce InputError (via mapInputError) when schema decode fails and ApiError (via service and mapApiError) when the SDK call fails | Must-Have | Typed error channel with two distinct error types per operation |
| FR-022 | Services must resolve the auth server exclusively through AuthServerTag from Effect Context, never constructing or importing the server directly | Must-Have | Dependency injection via Effect Context for testability |
| FR-023 | All three operations must annotate both controller and service with Effect.withSpan for observability and debugging traceability | Must-Have | Dual spans per ADR-001 enable end-to-end trace correlation |
| FR-024 | Each operation must have a companion test suite (controller spec, service spec, types spec) verifiable against the test environment helper | Must-Have | Three spec files per operation per ADR-001 |

---

## Non-Functional Requirements (Feature-Specific)

These targets are specific to this feature and must meet or exceed the initiative-wide baselines defined in the parent IRD.

| Category | Requirement |
|----------|-------------|
| Type Safety | All inputs validated via Schema TaggedClass; branded value objects for domain fields (email, password, name); tagged errors in the error channel; zero escape-hatch types |
| Performance | Operations must complete within Better Auth SDK response time plus no more than 50ms overhead for Schema decode/encode and Effect pipeline composition |
| Testability | Each operation testable in isolation via in-memory test environment; services testable by providing AuthServerTag directly via Effect.provideService; no production layers or databases required |
| Compatibility | Must be compatible with Better Auth SDK email methods (signUpEmail, signInEmail, signOut) at the pinned version |
| Documentation | All controller and service exports must have TSDoc comments with pure annotation and description |
| Observability | Both controller and service functions must include Effect.withSpan annotations for distributed tracing support |

---

## Scope

### In Scope

- Three controller modules (signUpEmailServerController, signInEmailServerController, signOutEmailServerController)
- Three service modules (signUpEmailServerService, signInEmailServerService, signOutEmailServerService)
- Three types modules (SignUpEmailServerParams, SignInEmailServerParams, SignOutEmailServerParams) as TaggedClass schemas with static decode and encode
- Three barrel files re-exporting controller and service per operation
- Branded value extraction (.value) in services for domain field schemas
- Conditional optional field spreading in services for SDK compatibility
- Headers defaulting to empty Headers instance in sign-out service
- Effect.withSpan annotations on all controllers and services
- Test suites (controller spec, service spec, types spec) for each operation

### Out of Scope

- Command schema definitions (covered by frd-I-002-schemas.md)
- Field schema definitions (covered by frd-I-002-schemas.md)
- Tagged error class definitions (covered by frd-I-002-errors.md)
- Pipeline utility definitions (covered by frd-I-002-pipeline.md)
- Configuration and server layer definitions (covered by frd-I-002-layers.md)
- Test environment helper (infrastructure concern shared across all domain operations)
- Package-level exports for operation modules (internal implementation details consumed via relative imports)
- HTTP response mapping from ApiError status codes (application-level concern)
- Email verification, password management, and email change operations (covered by separate FRDs)

---

## Constraints & Dependencies

### Technical Constraints

- Must follow the controller-service-types three-file pattern per ADR-001
- Must use mapInputError in controllers and mapApiError in services (not ad hoc error handling)
- Must resolve AuthServerTag from Effect Context in services (not construct the server directly)
- Services must extract .value from branded field schema instances before passing values to SDK methods
- Sign-out must call authServer.api.signOut (the SDK's domain-agnostic method), not a hypothetical signOutEmail method
- SignOutEmailServerParams must not include a body field (sign-out requires no input body)

### Dependencies

| Dependency | Type | Owner | Status |
|------------|------|-------|--------|
| Effect-TS core and schema packages | External library | Effect team | Pinned version available |
| Better Auth SDK (signUpEmail, signInEmail, signOut methods) | External library | better-auth team | Pinned version available |
| Tagged Error Hierarchy (frd-I-002-errors.md) | Internal feature | I-002 | InputError and ApiError must exist |
| Configuration and Server Layers (frd-I-002-layers.md) | Internal feature | I-002 | AuthServerTag must exist |
| Schema Foundation (frd-I-002-schemas.md) | Internal feature | I-002 | Command schemas and field schemas must exist |
| Pipeline Utilities (frd-I-002-pipeline.md) | Internal feature | I-002 | mapInputError and mapApiError must exist |

---

## Acceptance Criteria Outline

- [ ] All three controllers decode raw input through their respective ServerParams schema via Schema.decodeUnknown
- [ ] All three controllers map decode failures to InputError via mapInputError
- [ ] All three services resolve AuthServerTag from Effect Context
- [ ] All three services call the correct SDK method (signUpEmail, signInEmail, signOut)
- [ ] All three services map SDK failures to ApiError via mapApiError
- [ ] Sign-up service extracts .value from branded fields (email, password, name) and conditionally spreads optional branded fields (image, callbackURL)
- [ ] Sign-in service extracts .value from email and password, passes rememberMe as a plain boolean
- [ ] Sign-out ServerParams has no body field; sign-out service defaults headers to an empty Headers instance when not provided
- [ ] All three operations annotated with Effect.withSpan on both controller and service
- [ ] Each operation has a controller spec, service spec, and types spec
- [ ] Each operation resides in its own directory under the email directory with a barrel export file
- [ ] No operation contains infrastructure logic (error definitions, layer construction, schema definitions)

*Detailed acceptance criteria are maintained in a separate [Acceptance Criteria document](link).*

---

## User Stories

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| US-001 | As a developer, I need to sign up users with email and password so that new accounts are created with schema-validated input and typed error handling | Must-Have | Not Started |
| US-002 | As a developer, I need to sign in users with email and password so that authenticated sessions are established with credential validation and typed error handling | Must-Have | Not Started |
| US-003 | As a developer, I need to sign out users so that their sessions are terminated with proper session identification via headers | Must-Have | Not Started |
| US-004 | As a developer, I need validation failures to produce typed InputError and SDK failures to produce typed ApiError so that I can distinguish input errors from API errors in Effect's error channel | Must-Have | Not Started |
| US-005 | As a test author, I need each operation testable against an in-memory server provided via AuthServerTag so that tests run in isolation without external dependencies | Must-Have | Not Started |

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
- FRD: Email Verification (frd-I-002-verify.md) — to be created
- FRD: Password Management (frd-I-002-password.md) — to be created
- FRD: Email Change (frd-I-002-email-change.md) — to be created

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | Pending |
| Tech Lead | | | Pending |
