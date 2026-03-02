# Feature Requirements Document: Schema Foundation

## Overview

- **Feature Name**: Schema Foundation
- **Parent Initiative**: [I-002: Email Server Operations](../ird/ird-I-002.md)
- **Feature Owner**: Backend Engineer
- **Last Updated**: 2026-03-02
- **Status**: Draft

### Problem Statement

Better Auth SDK accepts untyped plain JavaScript objects as operation inputs with no compile-time or runtime contract enforcement. Without a Schema foundation, invalid inputs bypass validation and reach the SDK, resulting in untyped exceptions that cannot be caught in Effect's typed error channel. Each operation would need ad hoc input construction with no reuse of common field definitions (emails, passwords, names, URLs), leading to duplicated validation logic, inconsistent field semantics, and no guarantee that inputs conform to SDK expectations before execution.

---

## Goals & Success Metrics

### Feature Objectives

- Provide 11 field schema categories that define reusable, composable, validated field primitives for all email authentication operations
- Provide 11 email-specific command schemas that compose field schemas into operation-level input contracts with decode and encode capabilities
- Establish the tagged parameter class pattern with Schema-validated decode at the boundary and encode back to SDK-compatible plain objects

### Feature-Level Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Field schema categories defined | 11/11 | Count of field schema modules under the field-schemas directory |
| Email command schemas defined | 11/11 | Count of command schema modules for email operations |
| Schemas with decode and encode | 22/22 | Static methods present on all 11 field schemas and 11 command schemas |
| Field schema reuse rate | Every command schema references at least one field schema | Cross-reference audit of imports |

---

## User Context

### Target User Segment(s)

- **Effect-TS Developer**: Needs typed, composable input schemas for email operations; expects decode at the boundary to catch invalid inputs before SDK interaction and encode to produce SDK-compatible plain objects
- **NestJS Backend Engineer**: Needs validated command objects for microservice request handling; expects clear, structured input types for each email operation
- **Monorepo Consumer**: Needs predictable input shapes that are documented and consistent across all email operations

### User Journey for This Feature

A developer constructs an input object for an email operation. The input is decoded through the corresponding command schema at the controller boundary, validating all fields against their field schema definitions (email format, password constraints, name format, URL shape). If decoding succeeds, the developer receives a typed command instance. If decoding fails, an InputError is produced with a descriptive parse failure message. The typed command instance flows into the service layer, which encodes it back to a plain JavaScript object compatible with the Better Auth SDK call.

### User Scenarios / Use Cases

| Scenario | Description | Expected Outcome |
|----------|-------------|-----------------|
| Valid sign-up input | Developer provides valid email, password, and name for sign-up | SignUpEmailCommand decodes successfully, producing a typed instance with validated fields |
| Invalid email format | Developer provides a malformed email string | Decode fails at the EmailSchema level, producing a parse error that the controller maps to an InputError |
| Password below minimum length | Developer provides a password shorter than the configured minimum | Decode fails at the PasswordSchema level with a descriptive constraint violation message |
| Encode for SDK | Service layer needs to pass the typed command to the Better Auth SDK | Command encode produces a plain JavaScript object matching the SDK's expected input shape |
| Field schema reuse | Developer uses the same email field in sign-up, sign-in, and change-email commands | All three commands reference the shared EmailSchema, ensuring consistent email validation rules |

---

## Functional Requirements

### Field Schemas

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-001 | Define EmailSchema as a tagged field schema for email addresses with string validation and transform from plain string to branded type | Must-Have | Value object pattern; reused by sign-up, sign-in, change-email, and forget-password commands |
| FR-002 | Define PasswordSchema as a factory function that returns a tagged field schema for passwords with configurable minimum and maximum length constraints | Must-Have | Factory pattern; minimum and maximum lengths are parameters, not hardcoded; reused by sign-up, sign-in, change-password, reset-password, and set-password commands |
| FR-003 | Define NameSchema as a tagged field schema for display names with string validation and transform from plain string to branded type | Must-Have | Value object pattern; reused by sign-up command |
| FR-004 | Define UrlSchema as a tagged field schema for URL strings with validation and transform from plain string to branded type | Must-Have | Value object pattern; reused by callback URL fields across commands |
| FR-005 | Define ImageSchema as a tagged field schema for image URL or reference strings with validation and transform from plain string to branded type | Must-Have | Value object pattern; reused by sign-up command for avatar/image fields |
| FR-006 | Define AccountSchema as a tagged field schema for account entity representations with fields for account identifiers and metadata | Must-Have | Entity pattern; structured schema without value object transform |
| FR-007 | Define SessionSchema as a tagged field schema for session entity representations with fields for session identifiers, tokens, and expiration metadata | Must-Have | Entity pattern; structured schema without value object transform |
| FR-008 | Define UserSchema as a tagged field schema for user entity representations with fields for user identifiers, email, name, and profile metadata | Must-Have | Entity pattern; structured schema without value object transform |
| FR-009 | Define VerificationSchema as a tagged field schema for email verification entity representations with fields for verification status and token metadata | Must-Have | Entity pattern; structured schema without value object transform |
| FR-010 | Define TransportCommandSchema as a tagged field schema for email transport context with tag TransportCommandCtx, containing email destination, subject, and sender metadata | Must-Have | Special pattern; tag differs from class name (TransportCommandCtx); used by send-verification-email command |
| FR-011 | Define composite parameter schemas (Params) as tagged field schemas that aggregate multiple identifiers and metadata fields used across commands for common parameter groupings | Must-Have | Composite pattern; reused by commands that share parameter shapes |

### Email Command Schemas

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-012 | Define SignUpEmailCommand as a tagged command schema for email sign-up with fields referencing EmailSchema, PasswordSchema, NameSchema, and ImageSchema | Must-Have | Composes four field schemas; primary registration entry point |
| FR-013 | Define SignInEmailCommand as a tagged command schema for email sign-in with fields referencing EmailSchema and PasswordSchema | Must-Have | Composes two field schemas; primary login entry point |
| FR-014 | Define SignOutCommand as a tagged command schema for sign-out with a session token field | Must-Have | Minimal schema; session token as required field |
| FR-015 | Define VerifyEmailCommand as a tagged command schema for email verification with a verification token field | Must-Have | Minimal schema; token-based verification |
| FR-016 | Define SendVerificationEmailCommand as a tagged command schema for triggering verification email delivery with fields referencing EmailSchema and TransportCommandSchema | Must-Have | Composes EmailSchema and TransportCommandSchema |
| FR-017 | Define ChangePasswordCommand as a tagged command schema for password change with fields for current password, new password, and session token, referencing PasswordSchema | Must-Have | Uses PasswordSchema for both current and new password fields |
| FR-018 | Define ResetPasswordCommand as a tagged command schema for password reset with fields for new password and reset token, referencing PasswordSchema | Must-Have | Token-based password reset; PasswordSchema for the new password field |
| FR-019 | Define SetPasswordCommand as a tagged command schema for initial password set with fields for new password and session token, referencing PasswordSchema | Must-Have | For accounts that do not yet have a password |
| FR-020 | Define ChangeEmailCommand as a tagged command schema for email change with fields for new email and session token, referencing EmailSchema | Must-Have | Uses EmailSchema for the new email field |
| FR-021 | Define ForgetPasswordCommand as a tagged command schema for initiating password reset with fields referencing EmailSchema and an optional redirect URL referencing UrlSchema | Must-Have | Triggers password reset flow; email identifies the account |
| FR-022 | Define ForgetPasswordCallbackCommand as a tagged command schema for completing password reset callback with fields for new password and reset token, referencing PasswordSchema | Must-Have | Callback step after forget-password; token plus new password |

### Cross-Cutting Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-023 | All field schemas and command schemas must extend Effect Schema TaggedClass for runtime and compile-time type safety with discriminated union tags | Must-Have | Consistent with tagged class pattern across the project |
| FR-024 | All field schemas and command schemas must provide static decode and encode methods | Must-Have | Decode validates input; encode produces SDK-compatible plain objects |
| FR-025 | Command schemas must reference field schemas via composition (not duplication) so that field validation logic is defined once and reused across multiple commands | Must-Have | Core reuse principle of the schema foundation |
| FR-026 | Each schema must reside in its own file, organized under field-schemas and command-schemas directories respectively, with no barrel or index file aggregation | Must-Have | One file per schema for discoverability and isolation |
| FR-027 | Schemas must not contain business logic, side effects, or dependencies on layers, services, or external state | Must-Have | Schemas are pure data definitions with validated construction |

---

## Non-Functional Requirements (Feature-Specific)

These targets are specific to this feature and must meet or exceed the initiative-wide baselines defined in the parent IRD.

| Category | Requirement |
|----------|-------------|
| Type Safety | All fields typed via Effect Schema; command instances carry branded types from field schemas; zero escape-hatch types |
| Performance | Schema decode and encode must add negligible overhead (sub-millisecond for typical inputs); no async operations or I/O |
| Testability | Each schema can be decoded and encoded in isolation without server, database, or layer dependencies |
| Compatibility | Schemas must produce plain JavaScript objects that the pinned Better Auth SDK version accepts without modification |
| Reusability | Field schemas consumed by multiple command schemas; command schemas consumed by operation controllers; pattern replicable for non-email domain schemas in I-003 through I-006 |

---

## Scope

### In Scope

- 11 field schema categories (EmailSchema, PasswordSchema, NameSchema, UrlSchema, ImageSchema, AccountSchema, SessionSchema, UserSchema, VerificationSchema, TransportCommandSchema, Params)
- 11 email command schemas (SignUpEmailCommand, SignInEmailCommand, SignOutCommand, VerifyEmailCommand, SendVerificationEmailCommand, ChangePasswordCommand, ResetPasswordCommand, SetPasswordCommand, ChangeEmailCommand, ForgetPasswordCommand, ForgetPasswordCallbackCommand)
- Static decode and encode methods on all schemas
- PasswordSchema as a factory function with configurable length constraints
- Value object transform pattern for emails, passwords, names, URLs, and images
- Entity pattern for accounts, sessions, users, and verifications
- TransportCommandCtx tag convention for TransportCommandSchema
- File organization under field-schemas and command-schemas directories

### Out of Scope

- Non-email command schemas (OAuth, Session, Account, User — delivered by I-003 through I-006)
- Types files that consume command schemas (covered by operation-specific FRDs)
- Pipeline utilities that process command instances (covered by frd-I-002-pipeline.md)
- Barrel or index files for schema directories (not part of the current architecture)
- Package-level exports for schema modules (they are internal implementation details consumed via relative imports)
- Property-based testing of schemas (deferred to I-014)
- FastCheck arbitraries for command schemas (deferred to I-014; only configuration schemas in frd-I-002-layers.md include arbitraries)

---

## Constraints & Dependencies

### Technical Constraints

- Must use Effect Schema TaggedClass as the base for all field schemas and command schemas
- Must follow the tag naming convention where the tag matches the class name, except TransportCommandSchema which uses tag TransportCommandCtx
- PasswordSchema must be a factory function accepting minimum and maximum length parameters, not a static schema with hardcoded constraints
- Value object field schemas (email, password, name, URL, image) must use Schema transform to produce branded types from plain strings
- Entity field schemas (account, session, user, verification) must use structured definitions without value object transforms
- Each schema must be in its own file with no barrel file aggregation
- Schemas must produce plain objects via encode that are directly passable to Better Auth SDK methods

### Dependencies

| Dependency | Type | Owner | Status |
|------------|------|-------|--------|
| Effect-TS core and schema packages | External library | Effect team | Pinned version available |
| Better Auth SDK (API input shapes for email operations) | External library | better-auth team | Pinned version available |
| Tagged Error Hierarchy (frd-I-002-errors.md) | Internal feature | I-002 | InputError consumed by controllers when decode fails |

---

## User Stories

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| US-001 | As a controller, I need to decode raw input through a command schema so that invalid inputs are caught before reaching the service layer | Must-Have | Not Started |
| US-002 | As a service, I need to encode a typed command instance back to a plain object so that I can pass it to the Better Auth SDK method | Must-Have | Not Started |
| US-003 | As a developer, I need field schemas for common fields like email and password so that validation logic is defined once and shared across commands | Must-Have | Not Started |
| US-004 | As a developer, I need the PasswordSchema to accept configurable length constraints so that different operations or deployments can enforce different password policies | Must-Have | Not Started |
| US-005 | As a developer building a new domain initiative, I need the schema foundation pattern to be replicable so that I can define command schemas for non-email operations following the same conventions | Should-Have | Not Started |

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
- [FRD: Pipeline Utilities](frd-I-002-pipeline.md)
- [FRD: Email Authentication](frd-I-002-auth.md)
- [FRD: Email Verification](frd-I-002-verify.md)
- [FRD: Password Management](frd-I-002-password.md)
- [FRD: Email Change](frd-I-002-email-change.md)

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | Pending |
| Tech Lead | | | Pending |
