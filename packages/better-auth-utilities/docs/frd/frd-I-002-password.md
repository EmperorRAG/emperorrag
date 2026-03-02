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

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-001 | Define changePasswordServerController as a function that accepts unknown input, decodes through ChangePasswordServerParams via Schema.decodeUnknown, maps decode failures via mapInputError, delegates to changePasswordServerService via Effect.flatMap, and annotates with Effect.withSpan | Must-Have | Primary entry point for password change |
| FR-002 | Define changePasswordServerService as a function that accepts typed ChangePasswordServerParams, resolves AuthServerTag from Effect Context, calls authServer.api.changePassword via Effect.tryPromise, maps SDK failures via mapApiError, and annotates with Effect.withSpan | Must-Have | SDK interaction layer for password change |
| FR-003 | Define ChangePasswordServerParams as a TaggedClass Schema with required body (ChangePasswordCommand), optional headers (Headers instance), optional asResponse (boolean), optional returnHeaders (boolean), plus static decode and encode methods | Must-Have | Input contract for change-password |
| FR-004 | The change-password service must extract .value from both branded password fields (currentPassword and newPassword) and conditionally spread the plain boolean revokeOtherSessions only when present | Must-Have | Branded value extraction and optional field handling |
| FR-005 | The change-password command schema composes two PasswordSchema instances with different policies (currentPassword with minLength 1, newPassword with minLength 8) and an optional plain boolean revokeOtherSessions | Must-Have | Schema composition defined in frd-I-002-schemas.md; listed here for traceability |

### Forgot Password Operation

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-006 | Define forgetPasswordServerController as a function that accepts unknown input, decodes through ForgetPasswordServerParams via Schema.decodeUnknown, maps decode failures via mapInputError, delegates to forgetPasswordServerService via Effect.flatMap, and annotates with Effect.withSpan | Must-Have | Primary entry point for initiating password reset |
| FR-007 | Define forgetPasswordServerService as a function that accepts typed ForgetPasswordServerParams, resolves AuthServerTag from Effect Context, calls authServer.api.forgetPassword via Effect.tryPromise, extracts .value from branded email and optional redirectTo URL, maps SDK failures via mapApiError, and annotates with Effect.withSpan | Must-Have | SDK interaction layer for password reset initiation |
| FR-008 | Define ForgetPasswordServerParams as a TaggedClass Schema with required body (ForgetPasswordCommand), optional headers (Headers instance), optional asResponse (boolean), optional returnHeaders (boolean), plus static decode and encode methods | Must-Have | Input contract for forgot-password |
| FR-009 | The forgot-password service must pass email and redirectTo via the SDK body parameter, extracting .value from branded EmailSchema and optional UrlSchema instances | Must-Have | Branded value extraction for SDK compatibility |
| FR-010 | The forgot-password operation initiates the multi-step password reset flow; the SDK triggers the sendResetPassword config callback with a token that is delivered to the user via email; no token is returned to the caller | Must-Have | Token is externally delivered, not returned in the response |

### Forget Password Callback Operation

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-011 | Define forgetPasswordCallbackServerController as a function that accepts unknown input, decodes through ForgetPasswordCallbackServerParams via Schema.decodeUnknown, maps decode failures via mapInputError, delegates to forgetPasswordCallbackServerService via Effect.flatMap, and annotates with Effect.withSpan | Must-Have | Primary entry point for token validation in the reset flow |
| FR-012 | Define forgetPasswordCallbackServerService as a function that accepts typed ForgetPasswordCallbackServerParams, resolves AuthServerTag from Effect Context, calls authServer.api.forgetPasswordCallback via Effect.tryPromise, passes token as a plain string, maps SDK failures via mapApiError, and annotates with Effect.withSpan | Must-Have | SDK interaction layer for reset token validation |
| FR-013 | Define ForgetPasswordCallbackServerParams as a TaggedClass Schema with required body (ForgetPasswordCallbackCommand), optional headers (Headers instance), optional asResponse (boolean), optional returnHeaders (boolean), plus static decode and encode methods | Must-Have | Input contract for forget-password-callback |
| FR-014 | The forget-password-callback token is a plain Schema.String (not a branded value object), since tokens are opaque system-generated values that do not require domain-level validation or transformation | Must-Have | Consistent with token handling in verify-email and reset-password |
| FR-015 | The forget-password-callback command schema contains only a token field (plain Schema.String), making it the minimal command in the password management cluster | Must-Have | Schema composition defined in frd-I-002-schemas.md; listed here for traceability |

### Reset Password Operation

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-016 | Define resetPasswordServerController as a function that accepts unknown input, decodes through ResetPasswordServerParams via Schema.decodeUnknown, maps decode failures via mapInputError, delegates to resetPasswordServerService via Effect.flatMap, and annotates with Effect.withSpan | Must-Have | Primary entry point for completing password reset |
| FR-017 | Define resetPasswordServerService as a function that accepts typed ResetPasswordServerParams, resolves AuthServerTag from Effect Context, calls authServer.api.resetPassword via Effect.tryPromise, extracts .value from branded newPassword and passes token as plain string, maps SDK failures via mapApiError, and annotates with Effect.withSpan | Must-Have | SDK interaction layer for completing password reset |
| FR-018 | Define ResetPasswordServerParams as a TaggedClass Schema with required body (ResetPasswordCommand), optional headers (Headers instance), optional asResponse (boolean), optional returnHeaders (boolean), plus static decode and encode methods | Must-Have | Input contract for reset-password |
| FR-019 | The reset-password service must pass token as a plain string and extract .value from the branded newPassword field (PasswordSchema) for the SDK call | Must-Have | Mixed branded and plain field handling |
| FR-020 | The reset-password operation completes the multi-step password reset flow by consuming the token generated in the forgot-password step; the token connects the steps externally via email delivery, not through shared in-memory state | Must-Have | Stateless multi-step flow design |

### Set Password Operation

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-021 | Define setPasswordServerController as a function that accepts unknown input, decodes through SetPasswordServerParams via Schema.decodeUnknown, maps decode failures via mapInputError, delegates to setPasswordServerService via Effect.flatMap, and annotates with Effect.withSpan | Must-Have | Primary entry point for establishing a password on passwordless accounts |
| FR-022 | Define setPasswordServerService as a function that accepts typed SetPasswordServerParams, resolves AuthServerTag from Effect Context, calls authServer.api.setPassword via Effect.tryPromise, extracts .value from branded newPassword and optional branded currentPassword, maps SDK failures via mapApiError, and annotates with Effect.withSpan | Must-Have | SDK interaction layer for setting a password |
| FR-023 | Define SetPasswordServerParams as a TaggedClass Schema with required body (SetPasswordCommand), optional headers (Headers instance), optional asResponse (boolean), optional returnHeaders (boolean), plus static decode and encode methods | Must-Have | Input contract for set-password |
| FR-024 | The set-password service must conditionally spread the optional branded currentPassword field, extracting .value when present | Must-Have | Optional branded field handling |
| FR-025 | The set-password command schema composes two PasswordSchema instances with different policies (newPassword with minLength 8, currentPassword optional with minLength 1), following the same password policy split as change-password | Must-Have | Schema composition defined in frd-I-002-schemas.md; listed here for traceability |

### Cross-Cutting Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-026 | Each operation must follow the controller-service-types three-file pattern per ADR-001 | Must-Have | Architectural consistency across all operations |
| FR-027 | Each operation must reside in its own directory under the email directory, with a barrel file re-exporting controller and service | Must-Have | One directory per operation for discoverability and isolation |
| FR-028 | Controllers must produce InputError (via mapInputError) when schema decode fails and ApiError (via service and mapApiError) when the SDK call fails | Must-Have | Typed error channel with two distinct error types per operation |
| FR-029 | Services must resolve the auth server exclusively through AuthServerTag from Effect Context, never constructing or importing the server directly | Must-Have | Dependency injection via Effect Context for testability |
| FR-030 | All five operations must annotate both controller and service with Effect.withSpan for observability and debugging traceability | Must-Have | Dual spans per ADR-001 |

---

## Non-Functional Requirements (Feature-Specific)

These targets are specific to this feature and must meet or exceed the initiative-wide baselines defined in the parent IRD.

| Category | Requirement |
|----------|-------------|
| Type Safety | Branded Password types with configurable length policies; plain string for reset tokens; tagged errors in the error channel; zero escape-hatch types |
| Performance | Operations must complete within Better Auth SDK response time plus no more than 50ms overhead for Schema decode/encode and Effect pipeline composition |
| Testability | Each operation testable in isolation via in-memory test environment; multi-step reset flow testable by capturing tokens via the sendResetPassword config callback; set-password requires a passwordless user fixture (e.g., OAuth-originated account) for full happy-path testing |
| Compatibility | Must be compatible with Better Auth SDK password methods (changePassword, forgetPassword, forgetPasswordCallback, resetPassword, setPassword) at the pinned version |
| Documentation | All controller and service exports must have TSDoc comments with pure annotation and description |
| Observability | Both controller and service functions must include Effect.withSpan annotations for distributed tracing support |

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

## Acceptance Criteria Outline

- [ ] All five controllers decode raw input through their respective ServerParams schema via Schema.decodeUnknown
- [ ] All five controllers map decode failures to InputError via mapInputError
- [ ] All five services resolve AuthServerTag from Effect Context
- [ ] All five services call the correct SDK method (changePassword, forgetPassword, forgetPasswordCallback, resetPassword, setPassword)
- [ ] All five services map SDK failures to ApiError via mapApiError
- [ ] change-password service extracts .value from both currentPassword and newPassword, conditionally spreads revokeOtherSessions
- [ ] forgot-password service extracts .value from branded email and optional redirectTo
- [ ] forget-password-callback service passes token as a plain string (not branded)
- [ ] reset-password service passes token as a plain string and extracts .value from branded newPassword
- [ ] set-password service extracts .value from newPassword and conditionally spreads optional branded currentPassword
- [ ] Password policies enforce minLength 1 for current passwords and minLength 8 for new passwords
- [ ] All five operations annotated with Effect.withSpan on both controller and service
- [ ] Each operation has a controller spec, service spec, and types spec
- [ ] Each operation resides in its own directory under the email directory with a barrel export file

*Detailed acceptance criteria are maintained in a separate [Acceptance Criteria document](link).*

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
- FRD: Email Change (frd-I-002-email-change.md) — to be created

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | Pending |
| Tech Lead | | | Pending |
