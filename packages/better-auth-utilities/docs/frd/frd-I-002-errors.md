# Feature Requirements Document: Tagged Error Hierarchy

## Overview

- **Feature Name**: Tagged Error Hierarchy
- **Parent Initiative**: [I-002: Email Server Operations](../ird/ird-I-002.md)
- **Feature Owner**: Backend Engineer
- **Last Updated**: 2026-03-02
- **Status**: Draft

### Problem Statement

Better Auth SDK throws untyped JavaScript exceptions when operations fail. Effect-TS requires typed error channels for composable pipelines, exhaustive pattern matching, and structured error recovery. Without a tagged error hierarchy, every operation must implement its own ad hoc error handling, leading to inconsistent error shapes, lost metadata (HTTP status codes, causes), and inability to perform exhaustive pattern matching across error types.

---

## Goals & Success Metrics

### Feature Objectives

- Provide five tagged error classes that form the complete error vocabulary for all authentication operations across all server domains
- Enable exhaustive pattern matching via discriminated union tags so that consumers can handle each error type differently at compile time
- Carry structured metadata (messages, causes, HTTP status codes) for error introspection, logging, and HTTP response mapping

### Feature-Level Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Tagged error classes defined | 5/5 | Count of TaggedError subclasses in the errors directory |
| Error classes with decode and encode | 5/5 | Static methods present on each class |
| Downstream operations consuming errors | All controller and service pairs across all domains | Usage audit after domain initiatives complete |

---

## User Context

### Target User Segment(s)

- **Effect-TS Developer**: Needs typed errors for pattern matching in Effect pipelines; expects compile-time narrowing via discriminated union tags
- **NestJS Backend Engineer**: Needs structured error metadata (HTTP status codes, messages) for mapping errors to HTTP responses in the microservice layer
- **Monorepo Consumer**: Needs predictable, documented error shapes for building error boundaries and recovery strategies in consuming applications

### User Journey for This Feature

A developer calls an authentication operation. The operation fails. The error lands in Effect's typed error channel as a tagged error instance. The developer pattern-matches on the error's tag to handle each error type differently — for example, an InputError triggers a 400 response, an ApiError propagates the SDK's HTTP status code, and a SessionError redirects the user to a login flow. The developer achieves exhaustive handling with compile-time verification that all error types are covered.

### User Scenarios / Use Cases

| Scenario | Description | Expected Outcome |
|----------|-------------|-----------------|
| Input validation failure | A controller receives malformed input that fails Schema decoding | An InputError is produced with a formatted parse failure message and the original parse error as cause |
| Better Auth SDK API failure | A service calls the Better Auth SDK and the SDK throws an APIError with an HTTP status code | An ApiError is produced with the SDK's message, HTTP status code, and the original error as cause |
| Session-related failure | A session operation encounters a session-specific error condition | A SessionError is produced with a descriptive message and optional cause |
| Required data missing | An operation expects data that is not present in the response or context | A DataMissingError is produced with a message describing what data is absent |
| Dependency unavailable | An operation cannot access a required dependency (e.g., auth server not reachable) | A DependenciesError is produced with a message identifying the unavailable dependency |

---

## Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-001 | Define InputError as a TaggedError with tag InputError, required message (string), and optional cause (unknown) | Must-Have | Used by controllers for validation failures |
| FR-002 | Define ApiError as a TaggedError with tag ApiError, required message (string), optional status (number), and optional cause (unknown) | Must-Have | Only error class with an HTTP status field |
| FR-003 | Define SessionError as a TaggedError with tag SessionError, required message (string), and optional cause (unknown) | Must-Have | Used by session domain operations (I-004) |
| FR-004 | Define DataMissingError as a TaggedError with tag DataMissingError, required message (string), and optional cause (unknown) | Must-Have | Used when expected data is absent |
| FR-005 | Define DependenciesError as a TaggedError with tag DependenciesError, required message (string), and optional cause (unknown) | Must-Have | Used when a required dependency is unavailable |
| FR-006 | Each error class must extend Effect Schema TaggedError for runtime and compile-time type safety | Must-Have | Provides the discriminated union tag mechanism |
| FR-007 | Each error class must provide static decode and encode methods for serialization and deserialization | Must-Have | Enables round-tripping errors through boundaries |
| FR-008 | The tag field on each error must enable exhaustive pattern matching via Effect Match | Must-Have | Compile-time verification of error handling completeness |
| FR-009 | ApiError status must carry the HTTP status code from Better Auth SDK APIError when available | Must-Have | Enables downstream HTTP response mapping |
| FR-010 | Error classes must not contain domain-specific logic | Must-Have | Errors are infrastructure shared across all domains |
| FR-011 | Each error class must reside in its own file under the errors directory | Should-Have | One file per error for discoverability and isolation |
| FR-012 | Error classes must be importable by pipeline utilities and operation controllers and services via relative paths | Must-Have | Internal implementation details, not package-exported |

---

## Non-Functional Requirements (Feature-Specific)

These targets are specific to this feature and must meet or exceed the initiative-wide baselines defined in the parent IRD.

| Category | Requirement |
|----------|-------------|
| Type Safety | Zero escape-hatch types; all fields defined via Effect Schema; errors are compile-time narrowable via tag |
| Performance | Error construction must add negligible overhead with no async operations and no I/O |
| Testability | Each error class can be instantiated and decoded/encoded in isolation without server or database dependencies |
| Compatibility | Must be compatible with Effect Schema TaggedError from the pinned Effect-TS version |
| Reusability | Must be consumed without modification by all five server domains (Email, OAuth, Session, Account, User) and future client-side operations |

---

## Scope

### In Scope

- Five tagged error class definitions (InputError, ApiError, SessionError, DataMissingError, DependenciesError)
- Static decode and encode methods on each class
- Structured metadata fields (message, cause, and status on ApiError)
- File organization under the errors directory with one file per error class

### Out of Scope

- Pipeline utilities that consume these errors (covered by frd-I-002-pipeline.md)
- Error handling within controllers and services (covered by operation-specific FRDs)
- Error serialization for HTTP responses (application-level concern)
- Error logging infrastructure (application-level concern)
- Package-level exports for error classes (they are internal implementation details consumed via relative imports)
- Barrel or index file for the errors directory (not part of the current architecture)

---

## Constraints & Dependencies

### Technical Constraints

- Must use Effect Schema TaggedError as the base class for all error classes
- Must follow the tag naming convention where the tag matches the class name
- Each error class must be in its own file with no barrel file aggregation
- ApiError is the only error class that carries an HTTP status field; the other four share the same shape (message required, cause optional)

### Dependencies

| Dependency | Type | Owner | Status |
|------------|------|-------|--------|
| Effect-TS core and schema packages | External library | Effect team | Pinned version available |

---

## Acceptance Criteria Outline

- [ ] All five error classes defined with correct tag values (InputError, ApiError, SessionError, DataMissingError, DependenciesError)
- [ ] Each class extends Effect Schema TaggedError
- [ ] Each class has static decode and encode methods
- [ ] ApiError includes optional status (number) field for HTTP status codes
- [ ] All four non-ApiError classes share the same shape: required message (string) and optional cause (unknown)
- [ ] No domain-specific logic in any error class
- [ ] Error classes can be instantiated with a message string and optional cause
- [ ] Errors are usable in Effect Match pipelines for exhaustive pattern matching on the tag field
- [ ] Each error class resides in its own file under the errors directory

*Detailed acceptance criteria are maintained in a separate [Acceptance Criteria document](link).*

---

## User Stories

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| US-001 | As a controller, I need to produce an InputError when schema validation fails so that callers can identify bad input | Must-Have | Not Started |
| US-002 | As a service, I need to produce an ApiError with HTTP status when the Better Auth SDK call fails so that callers can propagate the status code | Must-Have | Not Started |
| US-003 | As a session operation, I need a SessionError to indicate session-specific failures so that callers can distinguish them from input or API errors | Must-Have | Not Started |
| US-004 | As an operation, I need a DataMissingError when expected data is absent so that callers can handle missing-data scenarios distinctly | Must-Have | Not Started |
| US-005 | As an operation, I need a DependenciesError when a required dependency is unavailable so that callers can diagnose infrastructure issues | Must-Have | Not Started |
| US-006 | As a developer, I need to pattern-match on error tag values so that I can implement exhaustive error handling with compile-time safety | Must-Have | Not Started |

---

## Open Questions

| Question | Owner | Due Date | Resolution |
|----------|-------|----------|------------|
| — | — | — | No open questions at this time |

---

## Related Documentation

- [Parent IRD: I-002 Email Server Operations](../ird/ird-I-002.md)
- [ADR-001: Controller-Service Architecture](../adr/adr-001-controller-service-architecture.md)
- FRD: Pipeline Utilities (../frd/frd-I-002-pipeline.md) — to be created

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | Pending |
| Tech Lead | | | Pending |
