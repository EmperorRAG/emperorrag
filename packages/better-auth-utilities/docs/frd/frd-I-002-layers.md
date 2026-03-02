# Feature Requirements Document: Configuration and Server Layers

## Overview

- **Feature Name**: Configuration and Server Layers
- **Parent Initiative**: [I-002: Email Server Operations](../ird/ird-I-002.md)
- **Feature Owner**: Backend Engineer
- **Last Updated**: 2026-03-02
- **Status**: Draft

### Problem Statement

Better Auth SDK requires an imperative configuration object passed to a constructor function. Without an Effect-TS integration layer, configuration cannot be validated at the boundary, injected through Effect's Context/Layer system, or tested in isolation. Operations would need to construct and configure the auth server inline, coupling business logic to infrastructure setup and preventing composable, testable architecture.

---

## Goals & Success Metrics

### Feature Objectives

- Provide a Schema-validated configuration model that catches invalid auth configuration at the boundary before runtime errors occur
- Deliver composable Effect Layers for configuration and server injection so that operations declare dependencies via Context Tags without knowing construction details
- Enable test isolation by allowing the server layer to be swapped with test-specific configuration without modifying operation code

### Feature-Level Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Schema sub-classes defined | 11/11 | Count of tagged schema classes composing the root BetterAuthOptions |
| Effect Context Tags defined | 2/2 | BetterAuthOptionsTag and AuthServerTag operational |
| Effect Layers defined | 3/3 | BetterAuthOptionsLive, AuthServerLive, and AuthLive (convenience composition) |
| Property-based test coverage | Schema round-trip validated | FastCheck arbitrary generates valid instances that pass decode then encode |

---

## User Context

### Target User Segment(s)

- **Effect-TS Developer**: Needs dependency injection for the auth server without imperative setup; expects composable layers that integrate with Effect's Context system
- **NestJS Backend Engineer**: Needs validated configuration and an injectable server instance for the microservice layer
- **Monorepo Consumer**: Needs composable layers to wire auth into their own Effect programs with a single Layer provision

### User Journey for This Feature

A developer defines auth configuration values. The configuration is decoded and validated through the BetterAuthOptions Schema at the boundary, catching invalid settings before the server starts. The validated configuration is provided via the BetterAuthOptionsLive Layer. The AuthServerLive Layer consumes the configuration from Effect Context, encodes it back to a plain object compatible with the Better Auth SDK, and constructs the server instance. Operations resolve the AuthServerTag from Effect Context to make SDK calls without any knowledge of how the server was constructed. In tests, the test environment helper constructs a test server directly with in-memory defaults and provides it via Effect.provideService, bypassing production layers for isolation.

### User Scenarios / Use Cases

| Scenario | Description | Expected Outcome |
|----------|-------------|-----------------|
| Valid configuration | Developer provides well-formed auth configuration values | Schema decode succeeds, layers compose, auth server is available via AuthServerTag |
| Invalid configuration | Developer provides malformed or invalid configuration values | Schema decode fails at the boundary with a descriptive validation error before server construction |
| Test environment | Test author needs an isolated auth server with in-memory database | Server constructed directly with test defaults and provided via AuthServerTag, bypassing production layers |
| Property-based testing | Test author generates random configuration instances | FastCheck arbitraries produce valid BetterAuthOptions instances that pass Schema round-trip validation |
| Consumer integration | Downstream application needs the full auth stack | AuthLive convenience layer provides the complete config-to-server stack in a single Layer provision |

---

## Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-001 | Define BetterAuthOptions as a root TaggedClass Schema composing 11 sub-schemas covering database, session, user, account, email and password, social providers, rate limiting, email verification, advanced settings, logger, and root-level fields (app name, base URL, base path, secret, trusted origins, plugins, API error handler) | Must-Have | All fields optional except where noted per sub-schema |
| FR-002 | Define DatabaseOptions as a TaggedClass Schema with optional dialect, type, casing, and provider fields using literal types for database engine variants | Must-Have | Sub-schema of BetterAuthOptions |
| FR-003 | Define SessionOptions as a TaggedClass Schema with optional model name, fields, expiration, update age, session refresh, database storage, cookie cache, and preservation settings | Must-Have | Cookie cache is a nested struct |
| FR-004 | Define UserOptions as a TaggedClass Schema with optional model name, fields, additional fields, change email, and delete user settings | Must-Have | Nested structs with function-typed callbacks |
| FR-005 | Define AccountOptions as a TaggedClass Schema with optional model name, fields, OAuth token encryption, account cookie, and account linking settings including trusted providers array | Must-Have | Sub-schema of BetterAuthOptions |
| FR-006 | Define EmailAndPasswordOptions as a TaggedClass Schema with optional enabled, sign-up disabled, email verification required, password length constraints, auto sign-in, reset password sender, token expiration, and password hash/verify function settings | Must-Have | Password hash and verify are function-typed |
| FR-007 | Define SocialProviderOptions as a TaggedClass Schema with required client ID and client secret fields, plus optional redirect URI and scope | Must-Have | Only sub-schema with required fields |
| FR-008 | Define RateLimitOptions as a TaggedClass Schema with optional enabled, window, max, custom rules, storage (literal type), and model name settings | Must-Have | Sub-schema of BetterAuthOptions |
| FR-009 | Define EmailVerificationOptions as a TaggedClass Schema with optional send verification email function, send on sign-up, send on sign-in, auto sign-in after verification, and expiration settings | Must-Have | Send verification email is function-typed |
| FR-010 | Define AdvancedOptions as a TaggedClass Schema with optional IP address, secure cookies, CSRF check disabled, cross sub-domain cookies, default cookie attributes, and cookie prefix settings | Must-Have | Multiple nested struct types |
| FR-011 | Define LoggerOptions as a TaggedClass Schema with optional disabled, colors disabled, level (literal type for error, warn, info, debug), and log function settings | Must-Have | Sub-schema of BetterAuthOptions |
| FR-012 | Each of the 11 sub-schemas must provide static decode and encode methods | Must-Have | Consistent with tagged class pattern across the project |
| FR-013 | All function-typed fields across all sub-schemas must include FastCheck arbitrary annotations to enable property-based testing | Must-Have | Enables round-trip validation of the entire schema |
| FR-014 | BetterAuthOptions must provide static decode and encode methods for full schema validation at the configuration boundary | Must-Have | Decode validates incoming config, encode returns plain object for SDK |
| FR-015 | Define BetterAuthOptionsTag as an Effect Context Tag typed to BetterAuthOptions | Must-Have | Dependency injection point for validated configuration |
| FR-016 | Define BetterAuthOptionsLive as an Effect Layer that constructs configuration, decodes it through the BetterAuthOptions Schema, and provides the validated result via BetterAuthOptionsTag | Must-Have | Config boundary with Schema validation |
| FR-017 | Define AuthServerTag as an Effect Context Tag typed to the Better Auth server instance | Must-Have | Dependency injection point for the server |
| FR-018 | Define AuthServerLive as an Effect Layer that resolves BetterAuthOptionsTag from Context, encodes the options back to a plain object, calls the Better Auth SDK constructor, and provides the resulting server via AuthServerTag | Must-Have | Depends on BetterAuthOptionsLive being provided |
| FR-019 | Define AuthLive as a convenience Layer that composes BetterAuthOptionsLive and AuthServerLive into a single self-contained Layer | Should-Have | Simplifies consumer usage to a single Layer provision |
| FR-020 | The Schema encode path must produce a plain JavaScript object compatible with the Better Auth SDK constructor function | Must-Have | SDK interop requirement |
| FR-021 | Configuration and layer modules must not contain domain-specific logic | Must-Have | Infrastructure shared across all domains |

---

## Non-Functional Requirements (Feature-Specific)

These targets are specific to this feature and must meet or exceed the initiative-wide baselines defined in the parent IRD.

| Category | Requirement |
|----------|-------------|
| Type Safety | All configuration fields typed via Effect Schema; Context Tags carry correct types; zero escape-hatch types |
| Performance | Layer construction is a one-time initialization cost; Schema decode and encode overhead must be negligible relative to server startup time |
| Testability | Layers can be bypassed in tests via direct Effect.provideService with a test-constructed server; Schema supports property-based testing via FastCheck arbitraries |
| Compatibility | Schema must model all configuration options accepted by the pinned Better Auth SDK version |
| Reusability | Tags and layers consumed without modification by all five server domains (Email, OAuth, Session, Account, User) and future client-side operations |

---

## Scope

### In Scope

- 11 tagged sub-schema classes composing the root configuration
- Root BetterAuthOptions schema with static decode and encode methods
- FastCheck arbitrary annotations for all function-typed fields
- BetterAuthOptionsTag and AuthServerTag as Effect Context Tags
- BetterAuthOptionsLive, AuthServerLive, and AuthLive as Effect Layers
- Schema round-trip property (decode then encode produces SDK-compatible output)

### Out of Scope

- Test environment setup helper (operational test infrastructure, not part of the layer system)
- Database adapter selection (application-level concern passed through configuration)
- Production configuration values (environment-specific, not defined in the library)
- Pipeline utilities (covered by frd-I-002-pipeline.md)
- Package-level exports for layer modules (they are internal implementation details consumed via relative imports)

---

## Constraints & Dependencies

### Technical Constraints

- Must use Effect Schema TaggedClass for all sub-schemas
- Must use Effect Context Tag for dependency injection points
- AuthServerLive must depend on BetterAuthOptionsTag (not construct configuration internally)
- Encode must produce SDK-compatible plain JavaScript objects
- Configuration and layer modules must not contain email-specific or domain-specific logic

### Dependencies

| Dependency | Type | Owner | Status |
|------------|------|-------|--------|
| Effect-TS core, schema, Context, and Layer packages | External library | Effect team | Pinned version available |
| Better Auth SDK (constructor function and configuration types) | External library | better-auth team | Pinned version available |
| FastCheck (for arbitrary annotations on function-typed fields) | External library | Effect team | Pinned version available |

---

## Acceptance Criteria Outline

- [ ] All 11 sub-schema classes defined as TaggedClass with static decode and encode methods
- [ ] BetterAuthOptions root schema composes all 11 sub-schemas with correct field types
- [ ] SocialProviderOptions requires client ID and client secret fields
- [ ] All function-typed fields annotated with FastCheck arbitraries
- [ ] BetterAuthOptionsTag and AuthServerTag defined as Effect Context Tags with correct type parameters
- [ ] BetterAuthOptionsLive Layer constructs and decodes configuration, providing it via BetterAuthOptionsTag
- [ ] AuthServerLive Layer resolves config from Context, encodes to plain object, and constructs Better Auth server
- [ ] AuthLive convenience Layer composes config and server layers into a single self-contained Layer
- [ ] Schema round-trip property holds: decode then encode produces a valid SDK-compatible object
- [ ] Operations can resolve AuthServerTag from Effect Context without knowing layer construction details
- [ ] Test environment can bypass production layers via direct Effect.provideService with a test-constructed server

*Detailed acceptance criteria are maintained in a separate [Acceptance Criteria document](link).*

---

## User Stories

| Story ID | Title | Priority | Status |
|----------|-------|----------|--------|
| US-001 | As a developer, I need a validated configuration schema so that invalid auth configuration is caught before the server starts | Must-Have | Not Started |
| US-002 | As a service, I need to resolve the auth server from Effect Context so that I can make SDK calls without constructing the server myself | Must-Have | Not Started |
| US-003 | As a test author, I need to bypass production layers and provide a test-constructed server so that tests run in isolation against in-memory databases | Must-Have | Not Started |
| US-004 | As a consumer, I need a single convenience layer so that I can provide the full auth stack in one line | Should-Have | Not Started |
| US-005 | As a test author, I need FastCheck arbitraries for the config schema so that I can validate schema round-trip properties via property-based testing | Should-Have | Not Started |

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
- FRD: Pipeline Utilities (frd-I-002-pipeline.md) — to be created

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | Pending |
| Tech Lead | | | Pending |
