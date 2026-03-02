# Initiative Requirements Document: Email Server Operations

## Overview

- **Initiative Name**: Email Server Operations
- **Initiative ID**: I-002
- **Initiative Owner**: Backend Engineer
- **Sponsor**: Tech Lead
- **Last Updated**: 2026-03-02
- **Status**: Draft

### Problem Statement

Better Auth SDK uses traditional async/await patterns with thrown exceptions, making it incompatible with Effect-TS typed error channels, composable pipelines, and dependency injection patterns. There are currently no Effect-TS wrappers for email authentication operations, and no foundational infrastructure (error hierarchy, configuration layers, server layers, validation schemas, pipeline utilities, or test harness) exists to support building them. Developers must write custom boilerplate to bridge email authentication workflows into Effect pipelines, resulting in duplicated effort, inconsistent error handling, and untestable code.

### Strategic Alignment

This initiative aligns with the following Product Vision pillars:

- **Pillar 5 — Comprehensive Coverage**: Specifically the email operations capability (sign-up, sign-in, sign-out, verify, password reset/change), which is the largest and most commonly used authentication domain.
- **Pillar 4 — Controller-Service Architecture**: Each email operation follows a consistent controller-service pattern with clear separation of concerns.
- **Pillar 1 — Type-Safe Error Handling**: The foundational tagged error hierarchy enables exhaustive pattern matching and typed recovery strategies across all domains.
- **Pillar 2 — Schema-Validated Inputs**: Command and field schemas provide compile-time and runtime validation for every authentication operation.
- **Pillar 3 — Dependency Injection via Context/Layer**: Configuration and server layers provide composable, testable architecture.

This initiative maps to Roadmap Theme T-001 (Documentation and Server Coverage) and is a P0 priority. Email is the first and largest server domain; completing it establishes the foundational infrastructure and the repeatable pattern required by all subsequent domain initiatives (I-003 through I-006). It is also a prerequisite for client-side email parity (I-009) and integration testing (I-013) in Q2.

- [Product Vision](../vision/v0-product-vision.md)
- [Product Roadmap](../roadmap/v0-product-roadmap.md)

---

## Goals & Success Criteria

### Business Objectives

- Build the foundational infrastructure (errors, configuration, server layers, schemas, pipeline utilities, test environment) required by all server domain initiatives
- Deliver type-safe Effect-TS wrappers for all 11 email authentication operations on top of that foundation
- Establish the controller-service-types pattern as the repeatable blueprint for remaining server domains (OAuth, Session, Account, User)
- Enable downstream consumer adoption by providing the most commonly used authentication domain first

### Initiative-Level Success Metrics

| Metric | Current | Target | Measurement Method |
|--------|---------|--------|-------------------|
| Foundation layers implemented | 0/2 | 2/2 | Config Layer and Server Layer operational |
| Tagged error classes implemented | 0/5 | 5/5 | Count of tagged error classes |
| Pipeline utilities implemented | 0/4 | 4/4 | Count of pipeline utility modules |
| Command schemas defined | 0/29 | 29/29 | Count of validated command schemas |
| Field schema categories defined | 0/11 | 11/11 | Count of field schema modules |
| Test environment helper operational | No | Yes | Can bootstrap test auth server |
| Email operations implemented | 0/11 | 11/11 | Count of operations with controller, service, and types |
| Unit test coverage (email module) | 0% | ≥80% | Vitest coverage report |
| TSDoc coverage (all I-002 exports) | 0% | ≥80% | TSDoc audit |
| Server Domain Coverage contribution | 0/5 | 1/5 | Roadmap metric increment |

### Key Results

- Foundation infrastructure is reusable by I-003 through I-006 without modification
- All 11 email operations pass schema validation and return tagged errors
- Email domain module is importable by monorepo consumers
- Pattern established for remaining four server domains

---

## User & Stakeholder Context

### Target User Segments

- **Effect-TS Developer** (Primary): Needs composable email authentication workflows without boilerplate wrappers. Expects typed error channels, schema-validated inputs, and Layer-based dependency injection.
- **NestJS Backend Engineer** (Secondary): Needs reliable email authentication primitives with clear error contracts for the microservice layer.
- **Monorepo Consumer**: Needs documented, tested email utilities with a stable API surface that can be imported into other workspace projects.

### End-to-End User Journey

A developer imports an email operation module, calls the controller with a Schema-validated input, receives a typed result through Effect's error channel, handles tagged errors via pattern matching, and composes the result into a larger Effect pipeline. The configuration and server layers are provided through Effect's Context/Layer system, enabling test isolation and environment-specific wiring.

### Stakeholder Map

| Role | Name | Key Concerns | Decision Authority |
|------|------|--------------|-------------------|
| Product Manager | TBD | Scope, priority, timeline alignment | Scope approval |
| Tech Lead | TBD | Architecture, reusability across domains, quality | Architecture approval |
| Backend Engineer | TBD | Implementation feasibility, test coverage, patterns | Implementation decisions |

---

## Initiative Scope

### Features / Capabilities In Scope

Each item below becomes a separate Feature Requirements Document (FRD). Features are organized into two phases: Phase A establishes domain-agnostic infrastructure, and Phase B delivers email-specific operations on top of that infrastructure.

#### Phase A: Infrastructure Foundation

Phase A features are cross-cutting — they serve all five server domains (I-002 through I-006), but ownership lives in I-002 since it is the first domain initiative and no separate infrastructure initiative exists. Infrastructure must not contain email-specific logic; it must be designed for reuse by all subsequent domain initiatives.

| # | Feature Cluster | Components | Future FRD |
|---|----------------|------------|------------|
| 1 | Tagged Error Hierarchy | Five Effect tagged error classes (InputError, ApiError, SessionError, DataMissingError, DependenciesError) with structured metadata including status codes, causes, and messages | frd-I-002-errors.md |
| 2 | Configuration and Server Layers | BetterAuthOptions Schema with FastCheck arbitraries, BetterAuthOptionsLive Config Layer, AuthServerLive Server Layer — composable Effect Layer stack from configuration through server instance | frd-I-002-layers.md |
| 3 | Schema Foundation | 29 command schemas across all domains plus 11 field schema categories (accounts, emails, images, names, params, passwords, sessions, transport, urls, users, verifications) — tagged parameter classes with decode and encode capabilities | frd-I-002-schemas.md |
| 4 | Pipeline Utilities | Four composable error transformation utilities (handle-api-error, handle-input-error, map-api-error, map-input-error) for controller pipelines | frd-I-002-pipeline.md |

#### Phase B: Email Operations

Phase B features depend on Phase A infrastructure being complete. Each operation requires three artefacts: a controller (input validation and error mapping), a service (Effect operation against the auth server), and types (input/output type definitions).

| # | Feature Cluster | Operations | Future FRD |
|---|----------------|------------|------------|
| 5 | Email Authentication | sign-up-email, sign-in-email, sign-out-email | frd-I-002-auth.md |
| 6 | Email Verification | verify-email, send-verification-email | frd-I-002-verify.md |
| 7 | Password Management | change-password, reset-password, request-password-reset, set-password, forgot-password | frd-I-002-password.md |
| 8 | Email Change | change-email | frd-I-002-email-change.md |

### Out of Scope

- Client-side email operations (deferred to I-009)
- OAuth domain operations (I-003)
- Session domain operations (I-004)
- Account domain operations (I-005)
- User domain operations (I-006)
- UI components (this is a backend/SDK library)
- Database adapters (passed through to Better Auth)
- Rate limiting and abuse protection (configured in Better Auth directly)
- Code templates (developer tooling, not a runtime deliverable)

### Future Considerations / Deferred Capabilities

- Client-side email parity (I-009, Q2 2026)
- Integration test suite for email operations (I-013, Q2 2026)
- Property-based testing of email and infrastructure schemas (I-014, Q2 2026)
- Code templates may warrant a separate developer-experience initiative if formalized

---

## Non-Functional Requirements (Initiative-Wide)

These baselines apply to all features within this initiative, both infrastructure and email operations.

| Category | Requirement |
|----------|-------------|
| Performance | Operations must complete within Better Auth SDK response time plus no more than 50ms overhead for Schema validation and error mapping |
| Security | No secrets logged; passwords never appear in error metadata; all inputs validated before reaching the SDK |
| Testability | Each operation and infrastructure component testable in isolation via Layer-based dependency injection; test environment helper provides auth server mock |
| Type Safety | Zero escape-hatch types; all inputs and outputs use Effect Schema; all errors are tagged |
| Compatibility | Compatible with Effect-TS core and schema packages at pinned versions; Better Auth SDK at pinned version |
| Documentation | All public exports have TSDoc comments; each operation documented with usage example in JSDoc |

---

## Constraints

### Technical Constraints

- Must follow Controller-Service-Types architecture per ADR-001
- Must use Effect tagged error pattern for all error classes
- Must consume AuthServerLive Layer for dependency injection
- Must use existing command schemas and field schemas for input validation
- Infrastructure must be designed for reuse — layers, errors, schemas, and pipeline utilities must not contain email-specific logic; email-specific behavior belongs only in Phase B features

### Business Constraints

- Q1 2026 deadline (Milestone M-002: All Server Domains Complete by 2026-02-28)
- Email domain is P0 priority alongside I-003 through I-006
- Infrastructure delivery is on the critical path — any delay cascades to all five server domain initiatives

### Organizational Constraints

- Single backend engineer is primary implementer across all five server domains
- Infrastructure and email operations compete for the same engineer's time within Q1

---

## Dependencies

### Cross-Team Dependencies

| Dependency | Team | Impact | Status |
|------------|------|--------|--------|
| None | — | Email operations are self-contained within better-auth-utilities | — |

### External Dependencies

| Dependency | Owner | Impact | Mitigation |
|------------|-------|--------|------------|
| Better Auth SDK | better-auth team | Core functionality — all operations wrap SDK calls | Pin version, monitor releases, maintain test matrix |
| Effect-TS (core and schema packages) | Effect team | Type system, runtime, Schema validation | Follow release notes, test upgrades |
| Vitest with Effect testing extensions | Vitest team | Testing infrastructure | Standard tooling, low risk |
| Vite | Vite team | Build system (library mode) | Standard tooling, low risk |

### Platform / Infrastructure Dependencies

- Nx build system (Vite library mode integration)
- Vitest test runner
- TypeScript 5.x compiler (strict mode)

### Downstream Dependents

The following initiatives depend on I-002 deliverables:

| Initiative | Depends On | Relationship |
|------------|------------|-------------|
| I-003: OAuth Server Operations | Phase A infrastructure (errors, layers, schemas, pipeline) | Consumes infrastructure |
| I-004: Session Server Operations | Phase A infrastructure | Consumes infrastructure |
| I-005: Account Server Operations | Phase A infrastructure | Consumes infrastructure |
| I-006: User Server Operations | Phase A infrastructure | Consumes infrastructure |
| I-008: Unit Test Coverage | Phase A test environment and Phase B email operations | Coverage target includes email |
| I-009: Client Email Operations | Phase B email operations stable | Client-side parity |
| I-013: Integration Test Suite | All server domains complete (I-002 through I-006) | End-to-end testing |

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| Better Auth SDK email API breaking changes | Medium | High | Pin version, monitor releases, maintain test matrix | Backend Engineer |
| Infrastructure design does not generalize to non-email domains | Medium | High | Review schema, layer, and pipeline design against OAuth and Session domain requirements before finalizing | Tech Lead |
| Controller-service pattern does not scale to complex email flows (e.g., multi-step password reset) | Low | Medium | Validate pattern with forgot-password and request-password-reset chain early | Tech Lead |
| Schema validation rejects valid edge-case inputs | Medium | Medium | Manual edge-case tests in Q1; property-based testing deferred to I-014 | Backend Engineer |
| Single-engineer bottleneck delays Q1 delivery | Medium | High | Prioritize email domain first (largest), use established patterns to accelerate remaining domains | Product Manager |
| Test environment helper insufficient for email-specific scenarios | Low | Medium | Extend test environment helper if needed; file issue early | Backend Engineer |
| Command schema coverage is incomplete (29 schemas may miss edge cases) | Low | Medium | Cross-reference Better Auth SDK API surface; add missing schemas incrementally | Backend Engineer |

---

## Open Questions

| Question | Owner | Due Date | Resolution |
|----------|-------|----------|------------|
| Should infrastructure features (errors, layers, schemas, pipeline) be versioned independently from email operations? | Tech Lead | 2026-03-10 | Pending |
| Should all 29 command schemas ship with I-002, or only email-related schemas with remaining schemas delivered by their respective domain initiatives? | Product Manager | 2026-03-10 | Pending |
| Should forgot-password and request-password-reset share a single FRD or remain in the Password Management cluster? | Product Manager | 2026-03-15 | Pending |
| Does send-verification-email require server-side email transport configuration in the test environment? | Backend Engineer | 2026-03-10 | Pending |
| Should each operation's types be re-exported from a top-level email barrel, or only from individual operation modules? | Tech Lead | 2026-03-10 | Pending |

---

## Related Documentation

- [Product Vision](../vision/v0-product-vision.md)
- [Product Roadmap](../roadmap/v0-product-roadmap.md)
- [ADR-001: Controller-Service Architecture](../adr/adr-001-controller-service-architecture.md)
- FRD: Tagged Error Hierarchy (../frd/frd-I-002-errors.md) — to be created
- FRD: Configuration and Server Layers (../frd/frd-I-002-layers.md) — to be created
- FRD: Schema Foundation (../frd/frd-I-002-schemas.md) — to be created
- FRD: Pipeline Utilities (../frd/frd-I-002-pipeline.md) — to be created
- FRD: Email Authentication (../frd/frd-I-002-auth.md) — to be created
- FRD: Email Verification (../frd/frd-I-002-verify.md) — to be created
- FRD: Password Management (../frd/frd-I-002-password.md) — to be created
- FRD: Email Change (../frd/frd-I-002-email-change.md) — to be created

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Sponsor | | | Pending |
| Product Manager | | | Pending |
| Tech Lead | | | Pending |
