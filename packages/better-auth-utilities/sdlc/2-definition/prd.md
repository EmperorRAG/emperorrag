# Product Requirements Document: Better Auth Utilities

## Overview

### Feature/Initiative Name

Better Auth Utilities - Phase 1: Server Operations & Documentation

### Vision Reference

See [Product Vision](../1-discovery/product-vision.md) for the complete vision statement, strategic pillars, and success metrics.

### Problem Statement

The Better Auth SDK uses traditional async/await patterns with thrown exceptions, making it incompatible with Effect-TS's typed error channels, composable pipelines, and dependency injection patterns. Developers building Effect-TS applications must write custom wrappers to bridge these paradigms, leading to duplicated effort, inconsistent patterns, and untested code.

Currently, only the Email domain (11 operations) has full controller/service implementation. The OAuth, Session, Account, and User domains have command schemas defined but lack the Effect-wrapped service layer needed for production use.

### Strategic Alignment

This initiative directly supports the annual theme of establishing Better Auth Utilities as the standard Effect-TS authentication library for the Emperorrag ecosystem. Completing Phase 1 will:

- Enable consistent auth patterns across NestJS microservice and Next.js frontend
- Reduce boilerplate and maintenance burden for consuming applications
- Demonstrate the library's value proposition for broader adoption

### Roadmap Reference

This PRD covers the following initiatives from the [Product Roadmap](../1-discovery/product-roadmap.md):

| Initiative ID | Description |
|---------------|-------------|
| P1.1 | Complete SDLC Documentation |
| P1.2 | OAuth Server Operations |
| P1.3 | Session Server Operations |
| P1.4 | Account Server Operations |
| P1.5 | User Server Operations |
| P1.6 | API Documentation |
| P1.7 | Unit Test Coverage |

---

## Goals & Success Metrics

### Primary Goals

1. Complete server-side operation coverage across all 5 domains (Email, OAuth, Session, Account, User)
2. Establish comprehensive SDLC documentation for the package
3. Achieve production-quality test coverage (≥80%)
4. Provide complete API documentation via TSDoc

### Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Server Operations Coverage | 100% of 29 command schemas have controller/service | Count implemented vs. total |
| Unit Test Coverage | ≥80% line coverage | Vitest coverage report |
| Documentation Completeness | All public exports have TSDoc | TSDoc validation in CI |
| Type Safety | Zero `any` types in public API | TypeScript strict mode + lint |
| Build Success | Clean build with no warnings | `nx build better-auth-utilities` |

---

## User & Stakeholder Context

### Target Users

- **Effect-TS Developers**: TypeScript developers using Effect for type-safe FP who need composable authentication utilities
- **NestJS Backend Engineers**: Developers in the Emperorrag ecosystem needing reliable auth primitives with clear error contracts
- **Monorepo Consumers**: Developers using shared packages who expect documented, tested utilities with stable APIs

### User Journey

1. Developer adds `@emperorrag/better-auth-utilities` dependency
2. Developer configures `BetterAuthOptionsLive` layer with their auth options
3. Developer imports server operations (e.g., `signUpEmailController`)
4. Developer composes operations with Effect pipelines (`pipe`, `Effect.gen`)
5. Developer handles typed errors using exhaustive pattern matching
6. Developer runs effects with provided layers (`Effect.runPromise(program.pipe(Effect.provide(AuthLive)))`)

### Stakeholder Needs

| Stakeholder | Key Concerns |
|-------------|--------------|
| Tech Lead | Maintainable architecture, type safety, testability |
| Backend Engineers | Clear APIs, comprehensive error types, good DX |
| QA | Testable operations, documented edge cases |
| Product | Feature completeness, ecosystem integration |

---

## Requirements

### Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-001 | Implement OAuth server operations (sign-in-social, callback-oauth, link-social-account) | Must-Have | 3 operations |
| FR-002 | Implement Session server operations (get-session, list-sessions, revoke-session, revoke-sessions, revoke-other-sessions, refresh-token, get-access-token) | Must-Have | 7 operations |
| FR-003 | Implement Account server operations (account-info, list-user-accounts, unlink-account) | Must-Have | 3 operations |
| FR-004 | Implement User server operations (update-user, delete-user, delete-user-callback) | Must-Have | 3 operations |
| FR-005 | Each operation must have controller (input validation) and service (API call) layers | Must-Have | Follow Email domain pattern |
| FR-006 | Each operation must return typed `Effect<Success, Error, Dependencies>` | Must-Have | Type-safe error channel |
| FR-007 | All operations must support optional `headers`, `asResponse`, `returnHeaders` params | Should-Have | Consistency with Email domain |
| FR-008 | Add TSDoc documentation to all public exports | Should-Have | Developer experience |
| FR-009 | Create barrel exports (index.ts) for each domain | Should-Have | Clean import paths |
| FR-010 | Add `@pure` annotations to service functions | Nice-to-Have | FP documentation convention |

### Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Operations should add minimal overhead (<5ms) beyond Better Auth API calls |
| Security | No secrets/credentials logged or exposed in error messages |
| Scalability | Stateless design; no shared mutable state between operations |
| Accessibility | N/A (library, not UI) |
| Testability | All operations must be testable with mocked `AuthServerTag` |
| Compatibility | Must work with Better Auth SDK >=1.0.0, Effect >=3.0.0 |

---

## Scope

### In Scope

- Server-side operations for OAuth, Session, Account, User domains
- Controller layer (input validation via command schemas)
- Service layer (Effect-wrapped API calls)
- Type definitions (params, response types)
- Unit tests for controllers and services
- TSDoc documentation
- Barrel exports

### Out of Scope

- Client-side operations (Phase 2)
- Multi-factor authentication support (Phase 3)
- OAuth provider expansion (Phase 3)
- Integration tests against real auth server (Phase 2)
- npm publication (Phase 4)
- NestJS/Next.js integration guides (Phase 4)

### Future Considerations

- Property-based testing with FastCheck generators
- Session caching layer with Effect-based cache
- Audit logging for auth events
- Migration guide from raw Better Auth SDK

---

## Constraints & Dependencies

### Technical Constraints

- Must follow existing architecture patterns established in Email domain
- Must use Effect Schema for input validation (no Zod, io-ts)
- Must use `Schema.TaggedError` for all error types
- Must use Context/Layer for dependency injection
- Must maintain tree-shakeable exports

### Business Constraints

- Q1 2026 timeline for Phase 1 completion
- Limited to existing tagged error types (no new error classes unless needed)
- Must not introduce breaking changes to existing Email domain API

### Dependencies

| Dependency | Owner | Status |
|------------|-------|--------|
| Better Auth SDK | better-auth team | ✅ Integrated |
| Effect-TS | Effect team | ✅ Integrated |
| Command Schemas (all 29) | Internal | ✅ Complete |
| AuthServerTag / AuthServerLive | Internal | ✅ Complete |
| BetterAuthOptionsTag / Layer | Internal | ✅ Complete |
| Pipeline utilities (mapApiError, etc.) | Internal | ✅ Complete |

---

## Acceptance Criteria Outline

- [ ] All 29 command schemas have corresponding controller/service implementations
- [ ] All operations return typed `Effect<Success, ApiError | InputError | SessionError, AuthServerTag>`
- [ ] All operations have unit tests with ≥80% coverage
- [ ] All public exports have TSDoc documentation
- [ ] Build passes with zero TypeScript errors/warnings (`nx build better-auth-utilities`)
- [ ] Each domain has barrel export (index.ts)
- [ ] Service functions are annotated with `@pure` JSDoc tag
- [ ] All 5 tagged error types used appropriately (InputError, ApiError, SessionError, DataMissingError, DependenciesError)

---

## Open Questions

| Question | Owner | Due Date | Resolution |
|----------|-------|----------|------------|
| Should OAuth callback operations support custom redirect logic? | Tech Lead | 2026-01-15 | Pending |
| Should session operations support session metadata extension? | Backend Engineer | 2026-01-20 | Pending |
| Is there a need for bulk session revocation operation? | Product Manager | 2026-01-20 | Pending |
| Should delete-user operation support soft delete option? | Tech Lead | 2026-01-15 | Pending |

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | | | ⬜ Pending |
| Tech Lead | | | ⬜ Pending |
| Backend Engineer | | | ⬜ Pending |

---

## Change Log

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-01-03 | 1.0 | Product Manager | Initial PRD creation |
