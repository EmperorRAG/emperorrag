# Product Requirements Document: Better Auth Utilities

**Document Version**: 1.0
**Last Updated**: January 3, 2026
**Owner**: Product Manager
**Status**: Draft

---

## Overview

### Feature/Initiative Name

Better Auth Utilities - Server Integration & OAuth Support (Q2 2026)

### Problem Statement

TypeScript developers using Effect-TS need type-safe authentication utilities that integrate with Better Auth. While client-side operations are implemented, server-side operations and OAuth/social authentication lack the same level of Effect-TS integration, preventing teams from building complete authentication workflows with consistent patterns.

### Strategic Alignment and Business Case

This initiative aligns with strategic pillars defined in the [Product Vision](../1-discovery/product-vision.md):

- **Layered Architecture**: Injectable AuthServer service via Effect Layer
- **Comprehensive Coverage**: Full parity between client and server operations
- **Pipeline Composition**: Consistent patterns for OAuth flows

**Business Value**:

- Enables full-stack Effect-TS authentication workflows
- Reduces boilerplate in consuming applications (NestJS microservice)
- Positions library for NPM publication with complete feature set

---

## Goals & Success Metrics

### Primary Goals

1. Complete server-side operation coverage with Effect-TS patterns
2. Implement OAuth/social authentication with type-safe providers
3. Enhance test infrastructure for reliable CI/CD
4. Achieve production-ready quality for internal consumption

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Server Operation Coverage | 100% of email auth operations | Operations implemented / Total Better Auth email operations |
| OAuth Provider Coverage | 3+ providers (Google, GitHub, Discord) | Providers with typed commands |
| Test Coverage | >90% line coverage | Vitest coverage report |
| Type Safety | 0 `any` in public API | TypeScript strict mode compilation |
| Integration Test Pass Rate | 100% | CI pipeline results |

---

## User & Stakeholder Context

### Target Users

**Primary: Effect-TS Backend Developer**

- Building NestJS/Express services with Effect-TS
- Needs server-side auth operations (verify tokens, manage sessions)
- Wants injectable services via Layer composition

**Secondary: Full-Stack Effect-TS Developer**

- Building Next.js/SvelteKit apps with Effect-TS
- Needs OAuth flows with type-safe callbacks
- Wants consistent error handling across client/server

### User Journey

```
Developer wants to verify email on server →
  1. Imports verifyEmailServer from better-auth-utilities
  2. Provides AuthServerTag via Layer
  3. Calls Effect pipeline with typed input
  4. Handles typed errors exhaustively
  5. Receives typed success response
```

### Stakeholder Needs

| Stakeholder | Need | Priority |
|-------------|------|----------|
| NestJS Microservice | Consume server operations | High |
| Library Consumers | Complete API coverage | High |
| QA/Testing | Reliable test infrastructure | Medium |
| DevOps | CI/CD integration | Medium |

---

## Requirements

### Functional Requirements

#### FR-1: Server Email Operations (Must Have)

Complete Effect-wrapped server operations for email authentication:

| Operation | Command Schema | Service | Controller |
|-----------|---------------|---------|------------|
| Sign Up Email | ✅ Exists | Implement | Implement |
| Sign In Email | ✅ Exists | Implement | Implement |
| Sign Out | ✅ Exists | Implement | Implement |
| Verify Email | ✅ Exists | ✅ Exists | Implement |
| Send Verification Email | ✅ Exists | Implement | Implement |
| Change Email | ✅ Exists | ✅ Exists | ✅ Exists |
| Change Password | ✅ Exists | ✅ Exists | ✅ Exists |
| Forgot Password | ✅ Exists | ✅ Exists | Implement |
| Reset Password | ✅ Exists | Implement | Implement |
| Set Password | ✅ Exists | Implement | Implement |
| Request Password Reset | ✅ Exists | Implement | Implement |

#### FR-2: Session Management Operations (Must Have)

Server-side session operations:

| Operation | Status | Description |
|-----------|--------|-------------|
| Get Session | Implement | Retrieve session by token |
| List Sessions | Implement | List all sessions for user |
| Revoke Session | Implement | Invalidate specific session |
| Revoke All Sessions | Implement | Invalidate all user sessions |

#### FR-3: OAuth/Social Authentication (Should Have)

Type-safe social provider integration:

| Operation | Description |
|-----------|-------------|
| Sign In Social | Initiate OAuth flow with typed provider |
| Callback OAuth | Handle OAuth callback with typed response |
| Link Social Account | Connect social provider to existing account |
| Unlink Account | Remove social provider from account |

**Supported Providers (typed identifiers)**:

- Google
- GitHub
- Discord
- Apple (future)
- Microsoft (future)

#### FR-4: Account Management (Should Have)

User account operations:

| Operation | Description |
|-----------|-------------|
| Get Account Info | Retrieve current user info |
| Update User | Update user profile fields |
| Delete User | Delete user account |
| List User Accounts | List linked accounts for user |

#### FR-5: Test Infrastructure (Must Have)

Enhanced testing capabilities:

| Capability | Description |
|------------|-------------|
| Mock AuthServer Layer | Layer providing mock server for unit tests |
| Mock AuthClient Layer | Layer providing mock client for unit tests |
| Server Test Environment | In-memory SQLite setup for integration tests |
| Effect Test Helpers | `run`, `runExit`, `testEffect` utilities |

### Non-Functional Requirements

#### NFR-1: Performance

- Operation latency overhead: <5ms above raw Better Auth SDK
- Bundle size: <50KB gzipped for full library
- No memory leaks in long-running server processes

#### NFR-2: Security

- No credentials logged in error messages
- Token values redacted in Effect spans
- Input validation before any API calls
- No `eval` or dynamic code execution

#### NFR-3: Compatibility

- Effect-TS: ^3.0.0
- Better Auth: ^1.0.0
- TypeScript: ^5.0.0
- Node.js: ^20.0.0

#### NFR-4: Observability

- Effect spans for all operations
- Structured logging via Effect Logger
- Error cause chains preserved

#### NFR-5: Developer Experience

- Full TSDoc on public exports
- Autocomplete-friendly API design
- Consistent naming conventions
- Example code in documentation

---

## Scope

### In Scope

- Server-side email authentication operations
- Session management operations
- OAuth initiation and callback handling
- Account management operations
- Mock Layers for testing
- In-memory test environment setup
- Integration with existing error types
- Integration with existing pipeline patterns

### Out of Scope

- Framework-specific bindings (NestJS, Express, Next.js)
- UI components or React hooks
- Database adapters (use Better Auth's adapters)
- Custom authentication flows
- JWT/token encryption (Better Auth core)
- Rate limiting (application concern)
- Audit logging (application concern)

### Future Considerations

- Two-factor authentication (Q3)
- Admin operations (Q3)
- API key management (Q3)
- NPM publishing (Q3)

---

## Constraints & Dependencies

### Technical Constraints

- Must wrap Better Auth SDK, not reimplement
- Must follow existing error type hierarchy
- Must use Effect Schema for all inputs
- Must provide Layer-based dependency injection
- Must maintain backward compatibility with existing client utilities

### Business/Timeline Constraints

- Q2 2026 target for server integration
- NestJS microservice is primary internal consumer
- No dedicated QA resources (developer-driven testing)

### Dependencies

| Dependency | Type | Risk | Mitigation |
|------------|------|------|------------|
| `better-auth` ^1.x | External | Plugin API changes | Pin version, monitor releases |
| `effect` ^3.x | External | API stability | Follow Effect release cycle |
| `packages/utilities` | Internal | Breaking changes | Coordinate releases |
| NestJS Microservice | Consumer | Interface changes | Feedback loop |

---

## Acceptance Criteria Outline

### Server Operations

- [ ] All operations return `Effect<Result, TypedError, AuthServerTag>`
- [ ] Input validated via Schema before API call
- [ ] Errors mapped to tagged error types
- [ ] Effect spans wrap each operation

### OAuth Operations

- [ ] Provider parameter is typed enum, not string
- [ ] Callback response includes provider-specific fields
- [ ] Link/unlink operations maintain account integrity

### Test Infrastructure

- [ ] Mock Layers allow unit testing without server
- [ ] Integration tests use in-memory SQLite
- [ ] Test harness integrates with Vitest

### Quality

- [ ] >90% test coverage
- [ ] 0 TypeScript errors in strict mode
- [ ] All public exports have TSDoc

---

## Open Questions

| Question | Owner | Status | Decision |
|----------|-------|--------|----------|
| Should we support custom OAuth providers? | PM | Open | Defer to Later |
| What's the strategy for Better Auth plugin compatibility? | Tech Lead | Open | Document supported versions |
| Should mock layers be separate package? | Tech Lead | Open | Same package, tree-shakeable |
| How to handle async Layer initialization? | Backend Eng | Open | Use `Layer.effect` pattern |

---

## References

- [Product Vision](../1-discovery/product-vision.md)
- [Product Roadmap](../1-discovery/product-roadmap.md)
- [Better Auth Documentation](https://www.better-auth.com/)
- [Effect-TS Documentation](https://effect.website/)

---

## Quality Gate Checklist

- [x] Problem statement and business case defined
- [x] Goals and success metrics established
- [x] Functional requirements prioritized (Must/Should/Nice)
- [x] Non-functional requirements specified
- [x] Scope boundaries (in/out) documented
- [x] Constraints and dependencies identified
- [x] Open questions captured with owners
- [x] Technical feasibility reviewed with engineering
- [x] Stakeholders aligned on scope

---

*Previous: [Product Roadmap](../1-discovery/product-roadmap.md)*
*Next: [Acceptance Criteria](./acceptance-criteria.md)*
