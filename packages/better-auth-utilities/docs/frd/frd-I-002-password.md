# Feature Requirements Document: Password Management

## Overview

- **Feature Name**: Password Management
- **Parent Initiative**: [I-002: Email Server Operations](../ird/ird-I-002.md)
- **Feature Owner**: Backend Engineer
- **Last Updated**: 2026-03-02
- **Status**: Draft

### Problem Statement

Better Auth SDK provides async/await methods for password management (changing, resetting, setting, and recovering passwords) that throw untyped exceptions and accept plain JavaScript objects. Without Effect-TS wrappers, developers cannot compose password management workflows into typed Effect pipelines, validate inputs at the boundary via command schemas, or handle errors through typed error channels. The password management domain is particularly complex because it includes a multi-step password reset flow — forgot-password initiates the flow by triggering a reset email, forget-password-callback validates the token from the email link, and reset-password completes the flow with a new password — requiring stateless operations connected only by an externally-delivered token. Each consumer would need to write custom boilerplate to bridge these workflows into Effect programs, resulting in duplicated effort, inconsistent error handling, and no separation between input validation and SDK interaction.

---

## Goals & Success Metrics

### Feature Objectives

- Deliver five password management operations (change-password, forgot-password, forget-password-callback, reset-password, set-password) following the controller-service-types pattern defined in ADR-001
- Provide schema-validated input boundaries in controllers that produce typed InputError on validation failure, with configurable password length policies (minLength 1 for current passwords, minLength 8 for new passwords)
- Provide typed API error mapping in services that produce typed ApiError on SDK failure
- Enable test isolation by resolving the auth server exclusively through Effect Context via AuthServerTag, capturing reset tokens via the sendResetPassword config callback for multi-step flow testing

### Feature-Level Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Password management operations implemented | 5/5 | Count of operations with controller, service, and types files |
| Controller-service-types trios complete | 5/5 | Each operation has all three implementation files |
| Test suites passing | 5/5 | Controller spec, service spec, and types spec per operation |
| Effect.withSpan annotations | 10/10 | Both controller and service annotated per operation |

---

## User Context

### Target User Segment(s)

- **Effect-TS Developer**: Needs composable password management operations that integrate with Effect's pipe, flatMap, and error channel patterns; expects typed errors, schema-validated inputs with configurable password policies, and support for multi-step flows without manual SDK boilerplate
- **NestJS Backend Engineer**: Needs reliable password management primitives with clear input contracts and structured error metadata for microservice endpoint mapping; expects the multi-step reset flow to work through token-based coordination without shared state
- **Monorepo Consumer**: Needs documented, tested password management utilities with predictable behavior that can be imported and composed into larger Effect programs handling account security workflows

### User Journey for This Feature

A developer manages passwords through one of two paths. In the first path, an authenticated user changes their password directly — the developer calls the change-password controller with the current password, new password, and session headers; the controller validates inputs, the service calls the SDK, and the password is updated. In the second path, an unauthenticated user recovers their account through a multi-step reset flow — the developer calls the forgot-password controller with the user's email; the SDK triggers the sendResetPassword config callback which delivers a token via email; the user clicks the email link and the developer calls forget-password-callback with the token to validate it; finally the developer calls reset-password with the validated token and new password to complete the reset. A fifth operation, set-password, allows accounts without a password (such as OAuth-originated accounts) to establish email/password credentials. All operations produce typed errors (InputError for validation failures, ApiError for SDK failures) through Effect's error channel.

### User Scenarios / Use Cases

| Scenario | Description | Expected Outcome |
|----------|-------------|-----------------|
| Valid change-password | Authenticated user provides correct current password and a new password meeting minimum length | ChangePasswordServerParams decode succeeds, service calls SDK changePassword, password is updated |
| Change-password with wrong current password | Authenticated user provides incorrect current password | SDK rejects the request, service maps the failure to ApiError |
| Valid forgot-password | Developer provides a registered email to initiate password reset | ForgetPasswordServerParams decode succeeds, service calls SDK forgetPassword, SDK triggers the sendResetPassword config callback with a token delivered via email |
| Forgot-password with non-existent email | Developer provides an unregistered email | SDK may succeed silently for security (no information leakage about registered emails) or produce an error; either outcome is valid |
| Valid forget-password-callback | Developer provides a valid token from the reset email link | ForgetPasswordCallbackServerParams decode succeeds, service calls SDK forgetPasswordCallback, token is validated |
| Forget-password-callback with invalid token | Developer provides an expired or malformed token | SDK rejects the token, service maps the failure to ApiError |
| Valid reset-password with token | Developer provides a valid token and new password meeting minimum length | ResetPasswordServerParams decode succeeds, service calls SDK resetPassword, password is reset |
| Reset-password with invalid token | Developer provides an expired or consumed token | SDK rejects the token, service maps the failure to ApiError |
| Valid set-password for passwordless account | Developer provides a new password for an account that has no email/password credentials | SetPasswordServerParams decode succeeds, service calls SDK setPassword, password is established |
| Set-password without authenticated session | Developer calls set-password without providing session headers | SDK fails with unauthorized error, service maps it to ApiError |

---

## Functional Requirements

### Change Password Operation

| ID | EARS Type | Requirement | Priority | Notes |
|----|-----------|-------------|----------|-------|
| FR-001 | U | The system shall define changePasswordServerController as a function that accepts unknown input | Must-Have | Primary entry point for password change |
| FR-002 | E | When the controller receives input, the system shall decode it through ChangePasswordServerParams via Schema.decodeUnknown | Must-Have | Schema boundary validation |
| FR-003 | UB | If schema decode fails, the system shall map the decode failure to InputError via mapInputError | Must-Have | Typed error for validation failures |
| FR-004 | E | When decode succeeds, the system shall delegate the typed params to changePasswordServerService via Effect.flatMap | Must-Have | Controller-to-service handoff |
| FR-005 | U | The system shall annotate the changePasswordServerController Effect pipeline with Effect.withSpan | Must-Have | Observability span for the controller |
| FR-006 | U | The system shall define changePasswordServerService as a function that accepts typed ChangePasswordServerParams | Must-Have | SDK interaction layer for password change |
| FR-007 | E | When the service executes, the system shall resolve AuthServerTag from Effect Context | Must-Have | Dependency injection for the auth server |
| FR-008 | E | When the auth server is resolved, the system shall call authServer.api.changePassword via Effect.tryPromise | Must-Have | SDK call for password change |
| FR-009 | UB | If the SDK call fails, the system shall map the failure to ApiError via mapApiError | Must-Have | Typed error for SDK failures |
| FR-010 | U | The system shall annotate the changePasswordServerService Effect pipeline with Effect.withSpan | Must-Have | Observability span for the service |
| FR-011 | U | The system shall define ChangePasswordServerParams as a TaggedClass Schema with required body (ChangePasswordCommand), optional headers (Headers instance), optional asResponse (boolean), optional returnHeaders (boolean), plus static decode and encode methods | Must-Have | Input contract for change-password |
| FR-012 | E | When building the SDK call payload, the system shall extract .value from both branded password fields (currentPassword and newPassword) | Must-Have | Branded value extraction |
| FR-013 | E | When the optional plain boolean revokeOtherSessions is present, the system shall conditionally spread it into the SDK call payload | Must-Have | Optional field handling |
| FR-014 | U | The system shall compose the change-password command schema from two PasswordSchema instances with different policies (currentPassword with minLength 1, newPassword with minLength 8) and an optional plain boolean revokeOtherSessions | Must-Have | Schema composition defined in frd-I-002-schemas.md; listed here for traceability |

### Forgot Password Operation

| ID | EARS Type | Requirement | Priority | Notes |
|----|-----------|-------------|----------|-------|
| FR-015 | U | The system shall define forgetPasswordServerController as a function that accepts unknown input | Must-Have | Primary entry point for initiating password reset |
| FR-016 | E | When the controller receives input, the system shall decode it through ForgetPasswordServerParams via Schema.decodeUnknown | Must-Have | Schema boundary validation |
| FR-017 | UB | If schema decode fails, the system shall map the decode failure to InputError via mapInputError | Must-Have | Typed error for validation failures |
| FR-018 | E | When decode succeeds, the system shall delegate the typed params to forgetPasswordServerService via Effect.flatMap | Must-Have | Controller-to-service handoff |
| FR-019 | U | The system shall annotate the forgetPasswordServerController Effect pipeline with Effect.withSpan | Must-Have | Observability span for the controller |
| FR-020 | U | The system shall define forgetPasswordServerService as a function that accepts typed ForgetPasswordServerParams | Must-Have | SDK interaction layer for password reset initiation |
| FR-021 | E | When the service executes, the system shall resolve AuthServerTag from Effect Context | Must-Have | Dependency injection for the auth server |
| FR-022 | E | When the auth server is resolved, the system shall call authServer.api.forgetPassword via Effect.tryPromise | Must-Have | SDK call for password reset initiation |
| FR-023 | UB | If the SDK call fails, the system shall map the failure to ApiError via mapApiError | Must-Have | Typed error for SDK failures |
| FR-024 | U | The system shall annotate the forgetPasswordServerService Effect pipeline with Effect.withSpan | Must-Have | Observability span for the service |
| FR-025 | U | The system shall define ForgetPasswordServerParams as a TaggedClass Schema with required body (ForgetPasswordCommand), optional headers (Headers instance), optional asResponse (boolean), optional returnHeaders (boolean), plus static decode and encode methods | Must-Have | Input contract for forgot-password |
| FR-026 | E | When building the SDK call payload, the system shall pass email and redirectTo via the SDK body parameter, extracting .value from branded EmailSchema and optional UrlSchema instances | Must-Have | Branded value extraction for SDK compatibility |
| FR-027 | U | The system shall not return a token to the caller from the forgot-password operation; the SDK triggers the sendResetPassword config callback with a token that is delivered to the user via email | Must-Have | Token is externally delivered, not returned in the response |

### Forget Password Callback Operation

| ID | EARS Type | Requirement | Priority | Notes |
|----|-----------|-------------|----------|-------|
| FR-028 | U | The system shall define forgetPasswordCallbackServerController as a function that accepts unknown input | Must-Have | Primary entry point for token validation in the reset flow |
| FR-029 | E | When the controller receives input, the system shall decode it through ForgetPasswordCallbackServerParams via Schema.decodeUnknown | Must-Have | Schema boundary validation |
| FR-030 | UB | If schema decode fails, the system shall map the decode failure to InputError via mapInputError | Must-Have | Typed error for validation failures |
| FR-031 | E | When decode succeeds, the system shall delegate the typed params to forgetPasswordCallbackServerService via Effect.flatMap | Must-Have | Controller-to-service handoff |
| FR-032 | U | The system shall annotate the forgetPasswordCallbackServerController Effect pipeline with Effect.withSpan | Must-Have | Observability span for the controller |
| FR-033 | U | The system shall define forgetPasswordCallbackServerService as a function that accepts typed ForgetPasswordCallbackServerParams | Must-Have | SDK interaction layer for reset token validation |
| FR-034 | E | When the service executes, the system shall resolve AuthServerTag from Effect Context | Must-Have | Dependency injection for the auth server |
| FR-035 | E | When the auth server is resolved, the system shall call authServer.api.forgetPasswordCallback via Effect.tryPromise, passing token as a plain string | Must-Have | SDK call for reset token validation |
| FR-036 | UB | If the SDK call fails, the system shall map the failure to ApiError via mapApiError | Must-Have | Typed error for SDK failures |
| FR-037 | U | The system shall annotate the forgetPasswordCallbackServerService Effect pipeline with Effect.withSpan | Must-Have | Observability span for the service |
| FR-038 | U | The system shall define ForgetPasswordCallbackServerParams as a TaggedClass Schema with required body (ForgetPasswordCallbackCommand), optional headers (Headers instance), optional asResponse (boolean), optional returnHeaders (boolean), plus static decode and encode methods | Must-Have | Input contract for forget-password-callback |
| FR-039 | U | The system shall treat the forget-password-callback token as a plain Schema.String (not a branded value object), since tokens are opaque system-generated values | Must-Have | Consistent with token handling in verify-email and reset-password |
| FR-040 | U | The system shall compose the forget-password-callback command schema with only a token field (plain Schema.String), making it the minimal command in the password management cluster | Must-Have | Schema composition defined in frd-I-002-schemas.md; listed here for traceability |

### Reset Password Operation

| ID | EARS Type | Requirement | Priority | Notes |
|----|-----------|-------------|----------|-------|
| FR-041 | U | The system shall define resetPasswordServerController as a function that accepts unknown input | Must-Have | Primary entry point for completing password reset |
| FR-042 | E | When the controller receives input, the system shall decode it through ResetPasswordServerParams via Schema.decodeUnknown | Must-Have | Schema boundary validation |
| FR-043 | UB | If schema decode fails, the system shall map the decode failure to InputError via mapInputError | Must-Have | Typed error for validation failures |
| FR-044 | E | When decode succeeds, the system shall delegate the typed params to resetPasswordServerService via Effect.flatMap | Must-Have | Controller-to-service handoff |
| FR-045 | U | The system shall annotate the resetPasswordServerController Effect pipeline with Effect.withSpan | Must-Have | Observability span for the controller |
| FR-046 | U | The system shall define resetPasswordServerService as a function that accepts typed ResetPasswordServerParams | Must-Have | SDK interaction layer for completing password reset |
| FR-047 | E | When the service executes, the system shall resolve AuthServerTag from Effect Context | Must-Have | Dependency injection for the auth server |
| FR-048 | E | When the auth server is resolved, the system shall call authServer.api.resetPassword via Effect.tryPromise | Must-Have | SDK call for completing password reset |
| FR-049 | UB | If the SDK call fails, the system shall map the failure to ApiError via mapApiError | Must-Have | Typed error for SDK failures |
| FR-050 | U | The system shall annotate the resetPasswordServerService Effect pipeline with Effect.withSpan | Must-Have | Observability span for the service |
| FR-051 | U | The system shall define ResetPasswordServerParams as a TaggedClass Schema with required body (ResetPasswordCommand), optional headers (Headers instance), optional asResponse (boolean), optional returnHeaders (boolean), plus static decode and encode methods | Must-Have | Input contract for reset-password |
| FR-052 | E | When building the SDK call payload, the system shall pass token as a plain string and extract .value from the branded newPassword field (PasswordSchema) | Must-Have | Mixed branded and plain field handling |
| FR-053 | U | The system shall complete the multi-step password reset flow by consuming the token generated in the forgot-password step; the token connects the steps externally via email delivery, not through shared in-memory state | Must-Have | Stateless multi-step flow design |

### Set Password Operation

| ID | EARS Type | Requirement | Priority | Notes |
|----|-----------|-------------|----------|-------|
| FR-054 | U | The system shall define setPasswordServerController as a function that accepts unknown input | Must-Have | Primary entry point for establishing a password on passwordless accounts |
| FR-055 | E | When the controller receives input, the system shall decode it through SetPasswordServerParams via Schema.decodeUnknown | Must-Have | Schema boundary validation |
| FR-056 | UB | If schema decode fails, the system shall map the decode failure to InputError via mapInputError | Must-Have | Typed error for validation failures |
| FR-057 | E | When decode succeeds, the system shall delegate the typed params to setPasswordServerService via Effect.flatMap | Must-Have | Controller-to-service handoff |
| FR-058 | U | The system shall annotate the setPasswordServerController Effect pipeline with Effect.withSpan | Must-Have | Observability span for the controller |
| FR-059 | U | The system shall define setPasswordServerService as a function that accepts typed SetPasswordServerParams | Must-Have | SDK interaction layer for setting a password |
| FR-060 | E | When the service executes, the system shall resolve AuthServerTag from Effect Context | Must-Have | Dependency injection for the auth server |
| FR-061 | E | When the auth server is resolved, the system shall call authServer.api.setPassword via Effect.tryPromise | Must-Have | SDK call for setting a password |
| FR-062 | UB | If the SDK call fails, the system shall map the failure to ApiError via mapApiError | Must-Have | Typed error for SDK failures |
| FR-063 | U | The system shall annotate the setPasswordServerService Effect pipeline with Effect.withSpan | Must-Have | Observability span for the service |
| FR-064 | U | The system shall define SetPasswordServerParams as a TaggedClass Schema with required body (SetPasswordCommand), optional headers (Headers instance), optional asResponse (boolean), optional returnHeaders (boolean), plus static decode and encode methods | Must-Have | Input contract for set-password |
| FR-065 | E | When building the SDK call payload, the system shall extract .value from the branded newPassword field | Must-Have | Branded value extraction |
| FR-066 | E | When the optional branded currentPassword field is present, the system shall conditionally spread it into the SDK call payload, extracting .value | Must-Have | Optional branded field handling |
| FR-067 | U | The system shall compose the set-password command schema from two PasswordSchema instances with different policies (newPassword with minLength 8, currentPassword optional with minLength 1), following the same password policy split as change-password | Must-Have | Schema composition defined in frd-I-002-schemas.md; listed here for traceability |

### Cross-Cutting Requirements

| ID | EARS Type | Requirement | Priority | Notes |
|----|-----------|-------------|----------|-------|
| FR-068 | U | The system shall follow the controller-service-types three-file pattern per ADR-001 for each operation | Must-Have | Architectural consistency across all operations |
| FR-069 | U | The system shall place each operation in its own directory under the email directory, with a barrel file re-exporting controller and service | Must-Have | One directory per operation for discoverability and isolation |
| FR-070 | UB | If schema decode fails, the controller shall produce InputError via mapInputError | Must-Have | Typed error channel — validation failures |
| FR-071 | UB | If the SDK call fails, the service shall produce ApiError via mapApiError | Must-Have | Typed error channel — SDK failures |
| FR-072 | U | The system shall resolve the auth server exclusively through AuthServerTag from Effect Context in services, never constructing or importing the server directly | Must-Have | Dependency injection via Effect Context for testability |
| FR-073 | U | The system shall annotate both controller and service with Effect.withSpan for all five operations for observability and debugging traceability | Must-Have | Dual spans per ADR-001 |

---

## Non-Functional Requirements (Feature-Specific)

These targets are specific to this feature and must meet or exceed the initiative-wide baselines defined in the parent IRD.

| ID | Category | EARS Type | Requirement | Priority |
|----|----------|-----------|-------------|----------|
| NFR-001 | Type Safety | U | The system shall use branded Password types with configurable length policies | Must-Have |
| NFR-002 | Type Safety | U | The system shall use plain string for reset tokens | Must-Have |
| NFR-003 | Type Safety | U | The system shall place tagged errors in the Effect error channel | Must-Have |
| NFR-004 | Type Safety | U | The system shall not use escape-hatch types in password management operations | Must-Have |
| NFR-005 | Performance | U | The system shall complete operations within Better Auth SDK response time plus no more than 50 ms overhead for Schema decode/encode and Effect pipeline composition | Must-Have |
| NFR-006 | Testability | U | The system shall support testing each operation in isolation via in-memory test environment | Must-Have |
| NFR-007 | Testability | U | The system shall support multi-step reset flow testing by capturing tokens via the sendResetPassword config callback | Must-Have |
| NFR-008 | Testability | U | The system shall support set-password testing with a passwordless user fixture (e.g., OAuth-originated account) for full happy-path coverage | Must-Have |
| NFR-009 | Compatibility | U | The system shall be compatible with Better Auth SDK password methods (changePassword, forgetPassword, forgetPasswordCallback, resetPassword, setPassword) at the pinned version | Must-Have |
| NFR-010 | Documentation | U | The system shall include TSDoc comments with pure annotation and description on all controller and service exports | Must-Have |
| NFR-011 | Observability | U | The system shall include Effect.withSpan annotations on both controller and service functions for distributed tracing support | Must-Have |

---

## Scope

### In Scope

- Five controller modules (changePasswordServerController, forgetPasswordServerController, forgetPasswordCallbackServerController, resetPasswordServerController, setPasswordServerController)
- Five service modules (changePasswordServerService, forgetPasswordServerService, forgetPasswordCallbackServerService, resetPasswordServerService, setPasswordServerService)
- Five types modules (ChangePasswordServerParams, ForgetPasswordServerParams, ForgetPasswordCallbackServerParams, ResetPasswordServerParams, SetPasswordServerParams) as TaggedClass schemas with static decode and encode
- Five barrel files re-exporting controller and service per operation
- Branded password value extraction (.value) with configurable length policies (minLength 1 for current passwords, minLength 8 for new passwords)
- Plain string token passing for forget-password-callback and reset-password (no branded value object)
- Conditional optional field spreading (revokeOtherSessions, redirectTo, currentPassword, transport fields)
- Multi-step password reset flow coordination (forgot-password → forget-password-callback → reset-password) via externally-delivered tokens
- Effect.withSpan annotations on all controllers and services
- Test suites (controller spec, service spec, types spec) for each operation

### Out of Scope

- Command schema definitions (covered by frd-I-002-schemas.md)
- Field schema definitions (covered by frd-I-002-schemas.md)
- Tagged error class definitions (covered by frd-I-002-errors.md)
- Pipeline utility definitions (covered by frd-I-002-pipeline.md)
- Configuration and server layer definitions (covered by frd-I-002-layers.md)
- Email transport and sendResetPassword callback implementation (application-level concern)
- Test environment helper (infrastructure concern shared across all domain operations)
- Package-level exports for operation modules (internal implementation details consumed via relative imports)
- Email authentication operations — sign-up, sign-in, sign-out (covered by frd-I-002-auth.md)
- Email verification operations — verify-email, send-verification-email (covered by frd-I-002-verify.md)
- Email change operation (covered by frd-I-002-email-change.md)

---

## Constraints & Dependencies

### Technical Constraints

- Must follow the controller-service-types three-file pattern per ADR-001
- Must use mapInputError in controllers and mapApiError in services (not ad hoc error handling)
- Must resolve AuthServerTag from Effect Context in services (not construct the server directly)
- Password policies must use minLength 1 for current/existing passwords (accept any non-empty string) and minLength 8 for new passwords (enforce strength requirements)
- Reset tokens must be plain Schema.String, not branded value objects
- forgot-password does not return a token to the caller; the token is delivered via the sendResetPassword config callback
- change-password and set-password require authenticated session headers; forgot-password, forget-password-callback, and reset-password do not
- revokeOtherSessions (change-password) is a plain boolean, not a branded value object

### Dependencies

| Dependency | Type | Owner | Status |
|------------|------|-------|--------|
| Effect-TS core and schema packages | External library | Effect team | Pinned version available |
| Better Auth SDK (changePassword, forgetPassword, forgetPasswordCallback, resetPassword, setPassword methods) | External library | better-auth team | Pinned version available |
| Tagged Error Hierarchy (frd-I-002-errors.md) | Internal feature | I-002 | InputError and ApiError must exist |
| Configuration and Server Layers (frd-I-002-layers.md) | Internal feature | I-002 | AuthServerTag must exist |
| Schema Foundation (frd-I-002-schemas.md) | Internal feature | I-002 | Command schemas and field schemas must exist |
| Pipeline Utilities (frd-I-002-pipeline.md) | Internal feature | I-002 | mapInputError and mapApiError must exist |

---

## User Stories

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| US-001 | As a developer, I need to change a user's password with current password verification so that authenticated users can update their credentials through a typed Effect pipeline | Must-Have | Not Started |
| US-002 | As a developer, I need to initiate a password reset via forgot-password so that unauthenticated users can recover their accounts through an email-delivered token | Must-Have | Not Started |
| US-003 | As a developer, I need a forget-password-callback operation so that reset tokens from email links can be validated as a step in the multi-step password reset flow | Must-Have | Not Started |
| US-004 | As a developer, I need to reset a password with a valid token so that the multi-step password reset flow completes with a new password meeting strength requirements | Must-Have | Not Started |
| US-005 | As a developer, I need to set a password for accounts that do not yet have one so that OAuth-originated users can add email/password credentials | Must-Have | Not Started |
| US-006 | As a test author, I need to capture reset tokens via the sendResetPassword config callback so that multi-step password reset flows are testable without real email transport | Must-Have | Not Started |

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
- [FRD: Email Change](frd-I-002-email-change.md)

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | Pending |
| Tech Lead | | | Pending |
