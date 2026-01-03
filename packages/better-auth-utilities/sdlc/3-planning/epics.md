# Epic Definitions: Better Auth Utilities

**Document Version**: 1.0
**Last Updated**: January 3, 2026
**PRD Reference**: [PRD](../2-definition/prd.md)
**Owner**: Product Manager
**Sprint Context**: Q2 2026 (Server Integration & OAuth)

---

## Epic Overview

| Epic ID | Title | Priority | Size | Status |
|---------|-------|----------|------|--------|
| EPIC-1 | Server Email Operations | P1 - Must Have | L | Ready |
| EPIC-2 | Session Management | P1 - Must Have | M | Ready |
| EPIC-3 | OAuth/Social Authentication | P2 - Should Have | L | Ready |
| EPIC-4 | Account Management | P2 - Should Have | M | Ready |
| EPIC-5 | Test Infrastructure | P1 - Must Have | M | Ready |

---

## EPIC-1: Server Email Operations

### Overview

**Title**: Server Email Operations
**ID**: EPIC-1
**Parent PRD**: [FR-1: Server Email Operations](../2-definition/prd.md#fr-1-server-email-operations-must-have)
**Epic Owner**: Backend Software Developer
**Stakeholders**: Tech Lead, NestJS Microservice Team

### Value Statement

**User Problem**: Effect-TS developers cannot perform server-side email authentication operations with type-safe patterns. Existing implementations require manual error handling and lack Effect integration.

**User Value**: Developers can implement complete email authentication flows on the server with full type safety, schema validation, and composable error handling.

**Business Value**: Enables the NestJS microservice to consume type-safe server operations, reducing boilerplate and improving reliability.

### Scope

**Included**:

- Sign Up Email server operation (service + controller)
- Sign In Email server operation (service + controller)
- Sign Out server operation (service + controller)
- Verify Email server operation (controller - service exists)
- Send Verification Email server operation
- Change Email (complete - exists)
- Change Password (complete - exists)
- Forgot Password (controller)
- Reset Password server operation
- Set Password server operation
- Request Password Reset (controller)

**Excluded**:

- Client-side operations (already complete)
- Email sending infrastructure (Better Auth handles)
- Custom email templates

**Assumptions**:

- Better Auth SDK email operations are stable
- Existing error types are sufficient
- Pipeline patterns from client can be adapted

### Success Criteria

| Criterion | Metric | Target |
|-----------|--------|--------|
| Operation Coverage | Operations implemented | 11/11 (100%) |
| Type Safety | TypeScript strict errors | 0 errors |
| Test Coverage | Line coverage | >90% |
| Integration | NestJS microservice validates | Approved |

### Dependencies

| Dependency | Type | Epic/External | Status |
|------------|------|---------------|--------|
| AuthServerTag Layer | Technical | Exists | ✅ Complete |
| Error Type Hierarchy | Technical | Exists | ✅ Complete |
| Command Schemas | Technical | Exists | ✅ Complete |
| EPIC-5 Test Infrastructure | Epic | EPIC-5 | Parallel |

### Story Breakdown

| Story ID | Title | Points | Priority |
|----------|-------|--------|----------|
| US-1.1 | Sign Up Email Server | 5 | High |
| US-1.2 | Sign In Email Server | 5 | High |
| US-1.3 | Sign Out Server | 3 | High |
| US-1.4 | Verify Email Controller | 3 | High |
| US-1.5 | Send Verification Email | 3 | Medium |
| US-1.6 | Forgot Password Controller | 2 | Medium |
| US-1.7 | Reset Password Server | 3 | Medium |
| US-1.8 | Set Password Server | 3 | Medium |
| US-1.9 | Request Password Reset Controller | 2 | Medium |

**Total Story Points**: 29

### Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Better Auth API changes | Low | High | Pin version, test against SDK |
| Schema mismatch with SDK | Medium | Medium | Validate schemas against actual responses |
| Complex error mapping | Medium | Low | Reuse existing mapApiError patterns |

---

## EPIC-2: Session Management

### Overview

**Title**: Session Management
**ID**: EPIC-2
**Parent PRD**: [FR-2: Session Management Operations](../2-definition/prd.md#fr-2-session-management-operations-must-have)
**Epic Owner**: Backend Software Developer
**Stakeholders**: Tech Lead, NestJS Microservice Team

### Value Statement

**User Problem**: Developers need to manage user sessions server-side (retrieve, list, revoke) but lack Effect-wrapped operations with proper typing.

**User Value**: Complete session lifecycle management with type-safe operations, enabling secure session handling in server applications.

**Business Value**: Enables session management features in NestJS microservice without custom implementation.

### Scope

**Included**:

- Get Session by token
- List Sessions for user
- Revoke specific Session
- Revoke All Sessions for user
- Session-related error types

**Excluded**:

- Session storage implementation (Better Auth)
- Custom session policies
- Session analytics

**Assumptions**:

- Session data is accessible via Better Auth API
- Session token format is stable

### Success Criteria

| Criterion | Metric | Target |
|-----------|--------|--------|
| Operation Coverage | Operations implemented | 4/4 (100%) |
| Type Safety | TypeScript strict errors | 0 errors |
| Test Coverage | Line coverage | >90% |

### Dependencies

| Dependency | Type | Epic/External | Status |
|------------|------|---------------|--------|
| EPIC-1 Sign In | Epic | EPIC-1 | Parallel |
| SessionError type | Technical | Exists | ✅ Complete |
| AuthServerTag | Technical | Exists | ✅ Complete |

### Story Breakdown

| Story ID | Title | Points | Priority |
|----------|-------|--------|----------|
| US-2.1 | Get Session Server | 3 | High |
| US-2.2 | List Sessions Server | 3 | High |
| US-2.3 | Revoke Session Server | 3 | High |
| US-2.4 | Revoke All Sessions Server | 3 | Medium |

**Total Story Points**: 12

### Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Session token format changes | Low | Medium | Abstract token handling |
| Race conditions in revocation | Medium | Low | Document eventual consistency |

---

## EPIC-3: OAuth/Social Authentication

### Overview

**Title**: OAuth/Social Authentication
**ID**: EPIC-3
**Parent PRD**: [FR-3: OAuth/Social Authentication](../2-definition/prd.md#fr-3-oauthsocial-authentication-should-have)
**Epic Owner**: Backend Software Engineer
**Stakeholders**: Tech Lead, Product Manager

### Value Statement

**User Problem**: OAuth flows require handling multiple providers with different response formats. Current SDK usage requires manual type handling and error mapping.

**User Value**: Type-safe OAuth operations with compile-time provider validation, consistent error handling across all providers, and proper callback handling.

**Business Value**: Enables social login features in consuming applications with reduced integration effort.

### Scope

**Included**:

- Sign In Social (initiate OAuth flow)
- Callback OAuth (handle redirect)
- Link Social Account (add provider to existing user)
- Unlink Account (remove provider)
- Typed provider identifiers (Google, GitHub, Discord)

**Excluded**:

- Provider configuration (application concern)
- Custom OAuth providers
- Token refresh handling (Better Auth core)

**Assumptions**:

- OAuth providers return consistent data structures
- Better Auth handles OAuth state management

### Success Criteria

| Criterion | Metric | Target |
|-----------|--------|--------|
| Provider Coverage | Providers with types | 3+ (Google, GitHub, Discord) |
| Operation Coverage | Operations implemented | 4/4 (100%) |
| Type Safety | Provider parameter compile-time checked | Yes |

### Dependencies

| Dependency | Type | Epic/External | Status |
|------------|------|---------------|--------|
| EPIC-1 Core Auth | Epic | EPIC-1 | Before |
| EPIC-2 Sessions | Epic | EPIC-2 | Before |
| OAuth provider configs | External | App config | Required |

### Story Breakdown

| Story ID | Title | Points | Priority |
|----------|-------|--------|----------|
| US-3.1 | OAuth Provider Types | 3 | High |
| US-3.2 | Sign In Social Server | 5 | High |
| US-3.3 | OAuth Callback Server | 5 | High |
| US-3.4 | Link Social Account Server | 5 | Medium |
| US-3.5 | Unlink Account Server | 3 | Medium |

**Total Story Points**: 21

### Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Provider-specific edge cases | High | Medium | Test each provider separately |
| OAuth state mismatch | Medium | High | Validate state in callback |
| Scope/permission differences | Medium | Low | Document provider-specific scopes |

---

## EPIC-4: Account Management

### Overview

**Title**: Account Management
**ID**: EPIC-4
**Parent PRD**: [FR-4: Account Management](../2-definition/prd.md#fr-4-account-management-should-have)
**Epic Owner**: Backend Software Developer
**Stakeholders**: Tech Lead

### Value Statement

**User Problem**: Developers need to manage user accounts (profile updates, deletion) with Effect-TS patterns but lack typed server operations.

**User Value**: Complete account lifecycle management with type-safe operations, enabling profile management in server applications.

**Business Value**: Enables user self-service features in consuming applications.

### Scope

**Included**:

- Get Account Info (current user)
- Update User (profile fields)
- Delete User (account removal)
- List User Accounts (linked providers)

**Excluded**:

- Admin user management (future)
- User search/query
- User import/export

**Assumptions**:

- User profile fields are standardized
- Account deletion is soft delete (Better Auth handles)

### Success Criteria

| Criterion | Metric | Target |
|-----------|--------|--------|
| Operation Coverage | Operations implemented | 4/4 (100%) |
| Type Safety | TypeScript strict errors | 0 errors |
| Test Coverage | Line coverage | >90% |

### Dependencies

| Dependency | Type | Epic/External | Status |
|------------|------|---------------|--------|
| EPIC-1 Auth Operations | Epic | EPIC-1 | Before |
| EPIC-2 Sessions | Epic | EPIC-2 | Before |
| User Schema | Technical | Exists | ✅ Complete |

### Story Breakdown

| Story ID | Title | Points | Priority |
|----------|-------|--------|----------|
| US-4.1 | Get Account Info Server | 3 | High |
| US-4.2 | Update User Server | 5 | High |
| US-4.3 | Delete User Server | 5 | Medium |
| US-4.4 | List User Accounts Server | 3 | Medium |

**Total Story Points**: 16

### Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Delete cascade complexity | Medium | Medium | Rely on Better Auth cascade |
| Profile field validation | Low | Low | Use existing Schema patterns |

---

## EPIC-5: Test Infrastructure

### Overview

**Title**: Test Infrastructure
**ID**: EPIC-5
**Parent PRD**: [FR-5: Test Infrastructure](../2-definition/prd.md#fr-5-test-infrastructure-must-have)
**Epic Owner**: Backend Software Engineer
**Stakeholders**: Tech Lead, All Developers

### Value Statement

**User Problem**: Testing Effect-based auth operations requires complex setup. Developers need mock layers and test helpers to write unit and integration tests efficiently.

**User Value**: Easy-to-use testing utilities that enable fast, reliable tests for auth operations without real server dependencies.

**Business Value**: Faster development cycles, higher code quality, and reliable CI/CD pipelines.

### Scope

**Included**:

- Mock AuthServer Layer
- Mock AuthClient Layer
- Enhanced Server Test Environment
- Effect Test Helpers (run, runExit, testEffect)
- Test data factories

**Excluded**:

- E2E testing against real providers
- Performance/load testing infrastructure
- Visual testing

**Assumptions**:

- Vitest is the test runner
- Effect test patterns are established

### Success Criteria

| Criterion | Metric | Target |
|-----------|--------|--------|
| Mock Coverage | Mock layers available | 2/2 |
| Test Reliability | Flaky test rate | <1% |
| Setup Time | Test suite init | <5s |

### Dependencies

| Dependency | Type | Epic/External | Status |
|------------|------|---------------|--------|
| Effect Test Harness | Technical | Exists | ✅ Complete |
| Server Test Environment | Technical | Exists | ✅ Complete |
| Vitest | External | Package | ✅ Installed |

### Story Breakdown

| Story ID | Title | Points | Priority |
|----------|-------|--------|----------|
| US-5.1 | Mock AuthServer Layer | 5 | High |
| US-5.2 | Mock AuthClient Layer | 5 | High |
| US-5.3 | OAuth Mock Provider | 5 | Medium |
| US-5.4 | Test Data Factories | 3 | Medium |
| US-5.5 | Coverage Reporting Setup | 2 | Low |

**Total Story Points**: 20

### Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Mock divergence from real API | Medium | High | Generate mocks from types |
| Async test isolation | Medium | Medium | Use Effect scoping |
| CI timeout | Low | Low | Parallelize test suites |

---

## Epic Sequencing

```
Week 1-2: EPIC-5 (Test Infrastructure) ─┬─> Week 3-4: EPIC-1 (Server Email)
                                        │
Week 1-2: EPIC-5 (Test Infrastructure) ─┴─> Week 3-4: EPIC-2 (Session Mgmt)
                                                           │
                                                           ▼
                                              Week 5-6: EPIC-3 (OAuth)
                                                           │
                                                           ▼
                                              Week 7-8: EPIC-4 (Account Mgmt)
```

### Sprint Allocation (2-week sprints)

| Sprint | Epics | Story Points |
|--------|-------|--------------|
| Sprint 1 (Jan 13-24) | EPIC-5 | 20 |
| Sprint 2 (Jan 27 - Feb 7) | EPIC-1 (partial), EPIC-2 | 25 |
| Sprint 3 (Feb 10-21) | EPIC-1 (complete) | 16 |
| Sprint 4 (Feb 24 - Mar 7) | EPIC-3 | 21 |
| Sprint 5 (Mar 10-21) | EPIC-4 | 16 |

**Total Story Points**: 98

---

## Quality Gate Checklist

- [x] Epics sized with story point totals
- [x] Epics ordered by priority and dependencies
- [x] Success criteria defined for each epic
- [x] Dependencies captured and status tracked
- [x] Stories identified with point estimates
- [x] Technical feasibility validated with Tech Lead
- [x] Sprint allocation planned

---

*Previous: [Test Strategy](../2-definition/test-strategy.md)*
*Next: [User Stories](./user-stories.md)*
