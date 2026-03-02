# Feature Requirements Document: Pipeline Utilities

## Overview

- **Feature Name**: Pipeline Utilities
- **Parent Initiative**: [I-002: Email Server Operations](../ird/ird-I-002.md)
- **Feature Owner**: Backend Engineer
- **Last Updated**: 2026-03-02
- **Status**: Draft

### Problem Statement

Better Auth SDK throws untyped JavaScript exceptions when operations fail, and Effect Schema decode produces parse errors that are not directly compatible with Effect's typed error channel pattern. Without composable error transformation utilities, every controller and service would need to implement its own ad hoc error mapping logic — extracting HTTP status codes from SDK errors, formatting parse failure messages, preserving error causes, and wrapping results into typed Effect failures. This leads to duplicated boilerplate, inconsistent error metadata, and lost information (status codes, original causes) that downstream consumers need for error handling, logging, and HTTP response mapping.

---

## Goals & Success Metrics

### Feature Objectives

- Provide two map utilities that transform raw unknown errors into typed tagged error instances (ApiError and InputError) with structured metadata preservation
- Provide two handle utilities that wrap entire Effects with error mapping for consumers who prefer the wrapping composition style over inline catchAll
- Establish a reusable, domain-agnostic error transformation pattern that all five server domain initiatives consume without modification

### Feature-Level Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Pipeline utility modules defined | 4/4 | Count of utility modules under the pipeline directory |
| Companion types files defined | 4/4 | Count of types files under the pipeline directory |
| Map utilities with three-branch Match pattern | 2/2 | Audit of mapApiError and mapInputError implementations |
| Downstream operations consuming pipeline utilities | All controller and service pairs across all domains | Usage audit after domain initiatives complete |

---

## User Context

### Target User Segment(s)

- **Effect-TS Developer**: Needs composable error transformations that integrate with Effect's catchAll and pipe patterns; expects typed error channels with no information loss from raw SDK exceptions or schema parse failures
- **NestJS Backend Engineer**: Needs HTTP status codes preserved from SDK errors for response mapping in the microservice layer; expects structured error metadata without manual extraction logic in every service
- **Monorepo Consumer**: Needs predictable error transformation behavior across all authentication operations; expects consistent error shapes regardless of which domain operation produced the failure

### User Journey for This Feature

A controller receives raw input and decodes it through a command schema via Schema.decodeUnknown. If decoding fails, the controller passes the parse error through mapInputError, which formats the failure message via TreeFormatter, wraps it in an InputError with the original error as cause, and returns an Effect.fail. If decoding succeeds, the typed command flows to the service layer. The service calls the Better Auth SDK via Effect.tryPromise. If the SDK call fails, the service passes the error through mapApiError, which unwraps any UnknownException wrapper, pattern-matches on the error type to extract message and HTTP status code, wraps it in an ApiError with the original error as cause, and returns an Effect.fail. The typed errors then flow through Effect's error channel for downstream pattern matching and recovery.

### User Scenarios / Use Cases

| Scenario | Description | Expected Outcome |
|----------|-------------|-----------------|
| SDK APIError with status code | A service calls the Better Auth SDK and the SDK throws an APIError with an HTTP status code and message | mapApiError extracts the message and status code, produces an ApiError with status, message, and the original APIError as cause |
| Generic Error from SDK | A service calls the Better Auth SDK and a standard JavaScript Error is thrown | mapApiError extracts the message from the Error, produces an ApiError with the message and the original Error as cause, with no status field |
| Unknown non-Error thrown value | A service call results in a thrown value that is not an Error instance | mapApiError produces an ApiError with a default message and the unknown value as cause |
| Schema parse failure | A controller decodes raw input through a command schema and the input is invalid | mapInputError detects the ParseError, formats a human-readable message via TreeFormatter, produces an InputError with the formatted message and the parse error as cause |
| Effect wrapping via handle utility | A consumer prefers wrapping an entire Effect with error mapping rather than using inline catchAll | handleApiError or handleInputError wraps the Effect, delegating to the corresponding map utility for all error transformation logic |

---

## Functional Requirements

### Map Utilities

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-001 | Define mapApiError as a function that accepts an unknown error, pattern-matches via Match.value on three branches (Better Auth SDK APIError instance, generic Error instance, fallback), and returns an Effect.fail with a typed ApiError | Must-Have | Primary error transformation for service-layer SDK failures |
| FR-002 | Define mapInputError as a function that accepts an unknown error, pattern-matches via Match.value on three branches (ParseResult.isParseError, generic Error instance, fallback), and returns an Effect.fail with a typed InputError | Must-Have | Primary error transformation for controller-layer validation failures |
| FR-003 | mapApiError must extract the HTTP status code from Better Auth SDK APIError instances and carry it in the ApiError status field | Must-Have | Preserves SDK status for downstream HTTP response mapping |
| FR-004 | mapApiError must unwrap UnknownException wrappers injected by Effect.tryPromise to access the original thrown error before pattern matching | Must-Have | Effect.tryPromise wraps errors in UnknownException; the real error is inside |
| FR-005 | mapInputError must use ParseResult.TreeFormatter.formatErrorSync to produce human-readable parse failure messages from Schema validation errors | Must-Have | TreeFormatter provides structured, readable error descriptions |
| FR-006 | Both map utilities must carry the original error as the cause field on the produced error instance for debugging and error chain tracing | Must-Have | Enables full error chain inspection without information loss |

### Handle Utilities

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-007 | Define handleApiError as a generic function that accepts an Effect with any error type, applies Effect.catchAll with mapApiError, and returns an Effect with ApiError as the error type | Should-Have | Convenience wrapper for consumers who prefer the wrapping composition style |
| FR-008 | Define handleInputError as a generic function that accepts an Effect with unknown error type, applies Effect.catchAll with mapInputError, and returns an Effect with InputError as the error type | Should-Have | Convenience wrapper for consumers who prefer the wrapping composition style |
| FR-009 | Handle utilities must be generic, preserving the success type and requirements type of the input Effect while narrowing the error channel to the specific tagged error type | Must-Have | Generic type preservation ensures no type information is lost |
| FR-010 | Handle utilities must delegate entirely to the corresponding map utility with no independent error transformation logic | Must-Have | Single source of truth for error mapping behavior |

### Cross-Cutting Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-011 | Each utility must have a companion types file defining the function signature as a named interface | Must-Have | Consistent with the types-in-separate-files pattern across the project |
| FR-012 | Each utility must reside in its own directory under the pipeline directory, with no barrel or index file aggregation | Must-Have | One directory per utility for discoverability and isolation |
| FR-013 | Pipeline utilities must not contain domain-specific logic; they reference only ApiError, InputError, and the Better Auth SDK APIError class | Must-Have | Infrastructure shared across all five server domains |
| FR-014 | Pipeline utilities must not depend on Effect Layers, Context Tags, schemas, or any external state | Must-Have | Utilities are pure error transformations with no infrastructure dependencies beyond error classes |

---

## Non-Functional Requirements (Feature-Specific)

These targets are specific to this feature and must meet or exceed the initiative-wide baselines defined in the parent IRD.

| Category | Requirement |
|----------|-------------|
| Type Safety | Generic type parameters preserved across handle utilities; map utilities return correctly typed Effect failures; zero escape-hatch types |
| Performance | Error transformation must add negligible overhead with no async operations, no I/O, and no layer resolution |
| Testability | Each utility testable in isolation with constructed error instances; no server, database, layer, or schema dependencies required |
| Compatibility | Must be compatible with Effect.tryPromise UnknownException wrapping, Effect Schema ParseResult error types, and Better Auth SDK APIError class at pinned versions |
| Reusability | Must be consumed without modification by all five server domains (Email, OAuth, Session, Account, User) and future client-side operations |

---

## Scope

### In Scope

- Four pipeline utility modules (mapApiError, mapInputError, handleApiError, handleInputError)
- Four companion types files with named interface definitions for each utility's function signature
- UnknownException unwrapping in mapApiError for Effect.tryPromise compatibility
- Three-branch Match pattern (SDK-specific, generic Error, fallback) in both map utilities
- ParseResult.TreeFormatter.formatErrorSync usage in mapInputError for human-readable parse failure messages
- Original error preservation as cause field on all produced error instances
- File organization under the pipeline directory with one directory per utility

### Out of Scope

- Tagged error class definitions (covered by frd-I-002-errors.md)
- Command schemas and field schemas (covered by frd-I-002-schemas.md)
- Configuration and server layers (covered by frd-I-002-layers.md)
- Controllers and services that consume pipeline utilities (covered by operation-specific FRDs)
- Error serialization for HTTP responses (application-level concern)
- Error logging infrastructure (application-level concern)
- Package-level exports for pipeline utility modules (they are internal implementation details consumed via relative imports)
- Barrel or index file for the pipeline directory (not part of the current architecture)

---

## Constraints & Dependencies

### Technical Constraints

- Must use Effect Match.value for pattern matching in map utilities, not if/else or switch statements
- Must use Effect.catchAll in handle utilities, not catchTag or catchSome
- Must follow the functional programming pattern: const arrow exports, no mutation, no exceptions
- mapApiError must check for UnknownException wrapper (tag-based check) before pattern matching on the inner error
- Each utility must be in its own directory with a companion types file, with no barrel file aggregation

### Dependencies

| Dependency | Type | Owner | Status |
|------------|------|-------|--------|
| Effect-TS core, Match, and ParseResult packages | External library | Effect team | Pinned version available |
| Better Auth SDK APIError class | External library | better-auth team | Pinned version available |
| Tagged Error Hierarchy (frd-I-002-errors.md) | Internal feature | I-002 | ApiError and InputError must exist |

---

## User Stories

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| US-001 | As a controller, I need to transform schema validation errors into typed InputError instances so that invalid inputs produce structured, readable error messages in Effect's error channel | Must-Have | Not Started |
| US-002 | As a service, I need to transform Better Auth SDK errors into typed ApiError instances so that SDK failures carry structured metadata including HTTP status codes in Effect's error channel | Must-Have | Not Started |
| US-003 | As a developer, I need SDK HTTP status codes preserved through error transformation so that downstream HTTP response mapping uses the correct status code without re-inspecting the original error | Must-Have | Not Started |
| US-004 | As a developer building a new domain initiative, I need the pipeline utilities to be domain-agnostic so that I can reuse the same error transformation pattern for non-email operations without modification | Should-Have | Not Started |

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
