# Requirements Traceability Matrix: Better Auth Utilities Epic E-001

## Overview

- **Project**: Better Auth Utilities
- **Version**: Epic E-001 (Q1 2026)
- **Owner**: QA Lead
- **Last Updated**: 2026-01-03
- **PRD Reference**: [Product Requirements Document](../prd/prd-E-001.md)
- **Acceptance Criteria**: [Acceptance Criteria](../acceptance-criteria/acceptance-criteria-E-001.md)
- **Test Strategy**: [Test Strategy](../testing/test-strategy-E-001.md)

---

## Summary

| Status | Count | Percentage |
|--------|-------|------------|
| ⬜ Not Started | 10 | 100% |
| 🟡 In Progress | 0 | 0% |
| ✅ Verified | 0 | 0% |
| **Total** | 10 | 100% |

> **Note**: This RTM is initialized at the Planning stage. Statuses will be updated as Design, Build, and Test stages complete.

---

## Traceability Matrix

### Functional Requirements

| Req ID | Requirement | Priority | Feature | User Stories | Test Cases | Status |
|--------|-------------|----------|---------|--------------|------------|--------|
| FR-001 | Implement OAuth server operations (sign-in-social, callback-oauth, link-social-account) | Must-Have | F-002 | US-001, US-002, US-003 | TC-OAuth-* | ⬜ Not Started |
| FR-002 | Implement Session server operations (get-session, list-sessions, revoke-session, revoke-sessions, revoke-other-sessions, refresh-token, get-access-token) | Must-Have | F-003 | US-004, US-005, US-006, US-007, US-008, US-009, US-010 | TC-Session-* | ⬜ Not Started |
| FR-003 | Implement Account server operations (account-info, list-user-accounts, unlink-account) | Must-Have | F-004 | US-011, US-012, US-013 | TC-Account-* | ⬜ Not Started |
| FR-004 | Implement User server operations (update-user, delete-user, delete-user-callback) | Must-Have | F-005 | US-014, US-015, US-016 | TC-User-* | ⬜ Not Started |
| FR-005 | Each operation must have controller (input validation) and service (API call) layers | Must-Have | F-002, F-003, F-004, F-005 | US-001–US-016 | TC-Architecture-* | ⬜ Not Started |
| FR-006 | Each operation must return typed `Effect<Success, Error, Dependencies>` | Must-Have | F-002, F-003, F-004, F-005 | US-001–US-016 | TC-TypeSafety-* | ⬜ Not Started |
| FR-007 | All operations must support optional `headers`, `asResponse`, `returnHeaders` params | Should-Have | F-002, F-003, F-004, F-005 | US-001–US-016 | TC-Params-* | ⬜ Not Started |
| FR-008 | Add TSDoc documentation to all public exports | Should-Have | F-006 | US-017, US-018 | TC-Docs-* | ⬜ Not Started |
| FR-009 | Create barrel exports (index.ts) for each domain | Should-Have | F-002, F-003, F-004, F-005 | US-001–US-016 | TC-Exports-* | ⬜ Not Started |
| FR-010 | Add `@pure` annotations to service functions | Nice-to-Have | F-006 | US-018 | TC-Annotations-* | ⬜ Not Started |

### Non-Functional Requirements

| Req ID | Requirement | Category | Feature | User Stories | Test Cases | Status |
|--------|-------------|----------|---------|--------------|------------|--------|
| NFR-001 | Operations should add minimal overhead (<5ms) beyond Better Auth API calls | Performance | F-007 | US-019–US-022 | TC-Perf-* | ⬜ Not Started |
| NFR-002 | No secrets/credentials logged or exposed in error messages | Security | All | US-001–US-016 | TC-Security-* | ⬜ Not Started |
| NFR-003 | Stateless design; no shared mutable state between operations | Scalability | All | US-001–US-016 | TC-Stateless-* | ⬜ Not Started |
| NFR-004 | All operations must be testable with mocked `AuthServerTag` | Testability | F-007 | US-019–US-022 | TC-Mock-* | ⬜ Not Started |
| NFR-005 | Must work with Better Auth SDK >=1.0.0, Effect >=3.0.0 | Compatibility | All | All | TC-Compat-* | ⬜ Not Started |

---

## Requirement to User Story Mapping

### FR-001: OAuth Server Operations

| User Story | Description | Acceptance Criteria | Status |
|------------|-------------|---------------------|--------|
| US-001 | Sign-In Social Operation | AC Scenario 1 | ⬜ Not Started |
| US-002 | OAuth Callback Operation | AC Scenario 2 | ⬜ Not Started |
| US-003 | Link Social Account Operation | AC Scenario 1 (extended) | ⬜ Not Started |

### FR-002: Session Server Operations

| User Story | Description | Acceptance Criteria | Status |
|------------|-------------|---------------------|--------|
| US-004 | Get Session Operation | AC Scenario 3 | ⬜ Not Started |
| US-005 | List Sessions Operation | AC Scenario 3 (extended) | ⬜ Not Started |
| US-006 | Refresh Token Operation | AC Scenario 3 (extended) | ⬜ Not Started |
| US-007 | Get Access Token Operation | AC Scenario 3 (extended) | ⬜ Not Started |
| US-008 | Revoke Session Operation | AC Scenario 4 | ⬜ Not Started |
| US-009 | Revoke All Sessions Operation | AC Scenario 4 | ⬜ Not Started |
| US-010 | Revoke Other Sessions Operation | AC Scenario 4 | ⬜ Not Started |

### FR-003: Account Server Operations

| User Story | Description | Acceptance Criteria | Status |
|------------|-------------|---------------------|--------|
| US-011 | Account Info Operation | AC Scenario 5 | ⬜ Not Started |
| US-012 | List User Accounts Operation | AC Scenario 5 | ⬜ Not Started |
| US-013 | Unlink Account Operation | AC Scenario 5 | ⬜ Not Started |

### FR-004: User Server Operations

| User Story | Description | Acceptance Criteria | Status |
|------------|-------------|---------------------|--------|
| US-014 | Update User Operation | AC Scenario 6 | ⬜ Not Started |
| US-015 | Delete User Operation | AC Scenario 6 | ⬜ Not Started |
| US-016 | Delete User Callback Operation | AC Scenario 6 (extended) | ⬜ Not Started |

### FR-008: API Documentation

| User Story | Description | Acceptance Criteria | Status |
|------------|-------------|---------------------|--------|
| US-017 | Controller TSDoc Documentation | TSDoc coverage | ⬜ Not Started |
| US-018 | Service and Error TSDoc Documentation | TSDoc coverage | ⬜ Not Started |

### Test Coverage (FR-005, FR-006, NFR-004)

| User Story | Description | Coverage Target | Status |
|------------|-------------|-----------------|--------|
| US-019 | OAuth Domain Tests | ≥80% | ⬜ Not Started |
| US-020 | Session Domain Tests | ≥80% | ⬜ Not Started |
| US-021 | Account Domain Tests | ≥80% | ⬜ Not Started |
| US-022 | User Domain Tests | ≥80% | ⬜ Not Started |

---

## Feature to Requirement Mapping

| Feature ID | Feature Title | Requirements Covered | User Stories | Priority |
|------------|---------------|---------------------|--------------|----------|
| F-002 | OAuth Server Operations | FR-001, FR-005, FR-006, FR-007, FR-009 | US-001, US-002, US-003 | P0 |
| F-003 | Session Server Operations | FR-002, FR-005, FR-006, FR-007, FR-009 | US-004–US-010 | P0 |
| F-004 | Account Server Operations | FR-003, FR-005, FR-006, FR-007, FR-009 | US-011, US-012, US-013 | P0 |
| F-005 | User Server Operations | FR-004, FR-005, FR-006, FR-007, FR-009 | US-014, US-015, US-016 | P0 |
| F-006 | API Documentation | FR-008, FR-010 | US-017, US-018 | P1 |
| F-007 | Unit Test Coverage | NFR-001, NFR-004 | US-019–US-022 | P1 |

---

## Test Case Planning

### Planned Test Cases by Domain

| Domain | Test Case ID Pattern | Coverage Area | Count |
|--------|---------------------|---------------|-------|
| OAuth | TC-OAuth-001 through TC-OAuth-010 | sign-in-social, callback-oauth, link-social-account | ~10 |
| Session | TC-Session-001 through TC-Session-020 | All 7 session operations | ~20 |
| Account | TC-Account-001 through TC-Account-010 | account-info, list-user-accounts, unlink-account | ~10 |
| User | TC-User-001 through TC-User-010 | update-user, delete-user, delete-user-callback | ~10 |
| Type Safety | TC-TypeSafety-001 through TC-TypeSafety-010 | Effect type parameters, error types | ~10 |
| Schema | TC-Schema-001 through TC-Schema-030 | Command encode/decode for all 29 schemas | ~30 |
| **Total** | | | ~90 |

### Acceptance Criteria to Test Case Mapping

| AC Scenario | Gherkin Feature | Planned Test Cases |
|-------------|-----------------|-------------------|
| Scenario 1 | OAuth Sign-In Social | TC-OAuth-001, TC-OAuth-002, TC-OAuth-003 |
| Scenario 2 | OAuth Callback | TC-OAuth-004, TC-OAuth-005, TC-OAuth-006 |
| Scenario 3 | Get Session | TC-Session-001, TC-Session-002, TC-Session-003 |
| Scenario 4 | Session Revocation | TC-Session-010 through TC-Session-015 |
| Scenario 5 | Account Management | TC-Account-001 through TC-Account-010 |
| Scenario 6 | User Management | TC-User-001 through TC-User-010 |

---

## Coverage Analysis

### By Priority

| Priority | Total Reqs | Mapped to Stories | Coverage |
|----------|------------|-------------------|----------|
| Must-Have | 6 | 6 | 100% |
| Should-Have | 3 | 3 | 100% |
| Nice-to-Have | 1 | 1 | 100% |
| **Total** | 10 | 10 | 100% |

### By Category

| Category | Total | Mapped to Stories | Test Cases Planned | Coverage |
|----------|-------|-------------------|-------------------|----------|
| OAuth Operations | 1 | 3 stories | ~10 | 100% |
| Session Operations | 1 | 7 stories | ~20 | 100% |
| Account Operations | 1 | 3 stories | ~10 | 100% |
| User Operations | 1 | 3 stories | ~10 | 100% |
| Architecture | 2 | All 16 ops | ~10 | 100% |
| Documentation | 2 | 2 stories | ~5 | 100% |
| Non-Functional | 5 | All | ~30 | 100% |

### Gap Analysis

| Gap ID | Description | Risk | Remediation | Owner | Status |
|--------|-------------|------|-------------|-------|--------|
| GAP-001 | Integration tests deferred to Epic E-002 | Medium | Risk accepted - unit tests cover core functionality | Tech Lead | ⬜ Accepted |
| GAP-002 | Property-based testing deferred to Epic E-002 | Low | Risk accepted - edge cases covered in unit tests | QA Lead | ⬜ Accepted |
| GAP-003 | Performance benchmarking deferred to Epic E-003 | Low | Risk accepted - <5ms overhead is architectural | Tech Lead | ⬜ Accepted |

---

## Existing Implementation Status

### Email Domain (Reference Implementation)

| Operation | Controller | Service | Tests | Status |
|-----------|------------|---------|-------|--------|
| sign-up-email | ✅ | ✅ | ✅ | ✅ Implemented |
| sign-in-email | ✅ | ✅ | ✅ | ✅ Implemented |
| sign-out-email | ✅ | ✅ | ✅ | ✅ Implemented |
| verify-email | ✅ | ✅ | ✅ | ✅ Implemented |
| send-verification-email | ✅ | ✅ | ✅ | ✅ Implemented |
| change-password | ✅ | ✅ | ✅ | ✅ Implemented |
| reset-password | ✅ | ✅ | ✅ | ✅ Implemented |
| request-password-reset | ✅ | ✅ | ✅ | ✅ Implemented |
| set-password | ✅ | ✅ | ✅ | ✅ Implemented |
| change-email | ✅ | ✅ | ✅ | ✅ Implemented |
| forgot-password | ✅ | ✅ | ✅ | ✅ Implemented |

### Command Schemas (All Domains)

| Domain | Schemas | Count | Status |
|--------|---------|-------|--------|
| Email | sign-up-email, sign-in-email, sign-out, verify-email, send-verification-email, change-password, reset-password, request-password-reset, set-password, change-email, forget-password | 11 | ✅ Complete |
| OAuth | sign-in-social, callback-oauth, link-social-account | 3 | ✅ Complete |
| Session | get-session, list-sessions, refresh-token, get-access-token, revoke-session, revoke-sessions, revoke-other-sessions | 7 | ✅ Complete |
| Account | account-info, list-user-accounts, unlink-account | 3 | ✅ Complete |
| User | update-user, delete-user, delete-user-callback | 3 | ✅ Complete |
| Password (additional) | forget-password-callback, request-password-reset-callback | 2 | ✅ Complete |
| **Total** | | 29 | ✅ Complete |

---

## Extended Traceability Matrix (Test Stage)

> Merged from RTM Update (2026-01-04). Extends the Planning stage RTM with design references, implementation mappings, and test case details.

| Req ID | Requirement | Priority | Design Ref | Implementation | Test Case(s) | Test Status | Verification |
|--------|-------------|----------|------------|----------------|--------------|-------------|--------------|
| FR-001 | OAuth Operations | P0 | TDD 2.1 | oauth/*.controller.ts | TC-001 to TC-006 | ⬜ Pending | Integration |
| FR-002 | Session Operations | P0 | TDD 2.2 | session/*.controller.ts | TC-007 to TC-015 | ⬜ Pending | Integration |
| FR-003 | Account Operations | P0 | TDD 2.3 | account/*.controller.ts | TC-016 to TC-019 | ⬜ Pending | Integration |
| FR-004 | User Operations | P0 | TDD 2.4 | user/*.controller.ts | TC-020 to TC-026 | ⬜ Pending | Integration |
| FR-005 | Controller-Service Pattern | P0 | TDD 3.0 | All controllers | All TCs | ⬜ Pending | Code Review |
| FR-006 | Typed Effect Returns | P0 | TDD 3.1 | All operations | All TCs | ⬜ Pending | Type Check |
| FR-007 | Headers Support | P0 | TDD 3.2 | Schema.instanceOf | TC-001, TC-005, TC-007 | ⬜ Pending | Unit |
| FR-008 | TSDoc Documentation | P1 | TDD 6.0 | *.ts | Manual | ⬜ Pending | Code Review |
| FR-009 | Barrel Exports | P1 | TDD 3.4 | index.ts | TC-Export-* | ⬜ Pending | Unit |
| FR-010 | @pure Annotations | P2 | TDD 5.3 | Service *.ts | Manual | ⬜ Pending | Code Review |
| NFR-001 | Effect.withSpan | P0 | TDD 5.1 | All controllers | TC-* (span verified) | ⬜ Pending | Trace Check |
| NFR-002 | 80% Coverage | P0 | Test Strategy | Vitest config | Coverage report | ⬜ Pending | Vitest |
| NFR-003 | Error Propagation | P0 | TDD 4.1 | Effect.catchTag | TC-002, TC-004 | ⬜ Pending | Unit |
| NFR-004 | Schema Validation | P0 | TDD 3.3 | Schema.decodeUnknown | All TCs | ⬜ Pending | Unit |
| NFR-005 | Dependency Injection | P0 | TDD 5.2 | Context.Tag | All TCs | ⬜ Pending | Integration |

---

## Detailed Requirement Tracking

### FR-001: OAuth Operations

**Description**: Implement signInSocial, callbackOAuth, and linkSocialAccount server controllers

**Design Reference**: Technical Design Document §2.1

**Implementation Status**: ⬜ Pending Epic E-001

**Source Files**:

- `src/lib/server/core/oauth/signInSocial/signInSocial.controller.ts`
- `src/lib/server/core/oauth/callbackOAuth/callbackOAuth.controller.ts`
- `src/lib/server/core/oauth/linkSocialAccount/linkSocialAccount.controller.ts`

**Test Cases**:

| TC ID | Description | Type |
|-------|-------------|------|
| TC-001 | Sign-In Social with Valid Provider | Functional |
| TC-002 | Sign-In Social with Missing Provider | Error |
| TC-003 | OAuth Callback with Valid Code | Functional |
| TC-004 | OAuth Callback with Provider Error | Error |
| TC-005 | Link Social Account for Auth User | Functional |
| TC-006 | Link Social Account without Auth | Error |

**Acceptance Criteria Mapping**:

- AC-001.1: Valid provider → TC-001
- AC-001.2: Missing provider → TC-002
- AC-002.1: Valid callback → TC-003
- AC-002.2: Error callback → TC-004
- AC-003.1: Link authenticated → TC-005
- AC-003.2: Link unauthenticated → TC-006

---

### FR-002: Session Operations

**Description**: Implement getSession, listSessions, refreshToken, getAccessToken, and revoke operations

**Design Reference**: Technical Design Document §2.2

**Implementation Status**: ⬜ Pending Epic E-001

**Source Files**:

- `src/lib/server/core/session/getSession/getSession.controller.ts`
- `src/lib/server/core/session/listSessions/listSessions.controller.ts`
- `src/lib/server/core/session/refreshToken/refreshToken.controller.ts`
- `src/lib/server/core/session/getAccessToken/getAccessToken.controller.ts`
- `src/lib/server/core/session/revokeSession/revokeSession.controller.ts`
- `src/lib/server/core/session/revokeSessions/revokeSessions.controller.ts`
- `src/lib/server/core/session/revokeOtherSessions/revokeOtherSessions.controller.ts`

**Test Cases**:

| TC ID | Description | Type |
|-------|-------------|------|
| TC-007 | Get Session for Auth User | Functional |
| TC-008 | Get Session without Auth | Edge Case |
| TC-009 | List Sessions | Functional |
| TC-010 | Refresh Token Valid | Functional |
| TC-011 | Refresh Token Expired | Error |
| TC-012 | Get Access Token | Functional |
| TC-013 | Revoke Specific Session | Functional |
| TC-014 | Revoke All Sessions | Functional |
| TC-015 | Revoke Other Sessions | Functional |

---

### FR-003: Account Operations

**Description**: Implement accountInfo, listUserAccounts, and unlinkAccount controllers

**Design Reference**: Technical Design Document §2.3

**Implementation Status**: ⬜ Pending Epic E-001

**Source Files**:

- `src/lib/server/core/account/accountInfo/accountInfo.controller.ts`
- `src/lib/server/core/account/listUserAccounts/listUserAccounts.controller.ts`
- `src/lib/server/core/account/unlinkAccount/unlinkAccount.controller.ts`

**Test Cases**:

| TC ID | Description | Type |
|-------|-------------|------|
| TC-016 | Get Account Info | Functional |
| TC-017 | List User Accounts | Functional |
| TC-018 | Unlink Account Successfully | Functional |
| TC-019 | Unlink Nonexistent Account | Error |

---

### FR-004: User Operations

**Description**: Implement updateUser, deleteUser, and deleteUserCallback controllers

**Design Reference**: Technical Design Document §2.4

**Implementation Status**: ⬜ Pending Epic E-001

**Source Files**:

- `src/lib/server/core/user/updateUser/updateUser.controller.ts`
- `src/lib/server/core/user/deleteUser/deleteUser.controller.ts`
- `src/lib/server/core/user/deleteUserCallback/deleteUserCallback.controller.ts`

**Test Cases**:

| TC ID | Description | Type |
|-------|-------------|------|
| TC-020 | Update User Name | Functional |
| TC-021 | Update User Image | Functional |
| TC-022 | Update User Invalid Name | Edge Case |
| TC-023 | Delete User Valid Password | Functional |
| TC-024 | Delete User Wrong Password | Error |
| TC-025 | Delete User Callback Valid | Functional |
| TC-026 | Delete User Callback Invalid | Error |

---

## Non-Functional Requirements Verification

| NFR ID | Requirement | Verification Method | Criteria | Status |
|--------|-------------|--------------------|---------:|--------|
| NFR-001 | Effect.withSpan | Code Review | All controllers use withSpan | ⬜ Pending |
| NFR-002 | 80% Coverage | Vitest Coverage | ≥80% line coverage | ⬜ Pending |
| NFR-003 | Error Propagation | Unit Tests | catchTag preserves types | ⬜ Pending |
| NFR-004 | Schema Validation | Unit Tests | decodeUnknown validates | ⬜ Pending |
| NFR-005 | Dependency Injection | Integration Tests | Layers provide deps | ⬜ Pending |

---

## Gaps Identified

| Gap ID | Description | Impact | Remediation | Owner | Due Date |
|--------|-------------|--------|-------------|-------|----------|
| GAP-001 | OAuth/Session/Account/User domains not implemented | High | Epic E-001 implementation | Backend Dev | Sprint 1 |
| GAP-002 | Integration tests require database setup | Medium | setupServerTestEnvironment | QA | Sprint 1 |
| GAP-003 | E2E tests depend on auth server mock | Medium | Add mock layer factory | Backend Dev | Sprint 1 |

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | ________________ | __________ | __________ |
| Tech Lead | ________________ | __________ | __________ |
| PM | ________________ | __________ | __________ |

---

## Definitions

| Status | Definition |
|--------|------------|
| ⬜ Not Started | Work has not begun on this item |
| 🟡 In Progress | Work is underway but not complete |
| ✅ Verified | Requirement fully implemented, tested, and verified |
| 🔴 Blocked | Work cannot proceed due to dependency or issue |
| ⬜ Pending | Test case exists but not executed |

| Term | Definition |
|------|------------|
| Covered | At least one test case exists |
| Verified | Test case executed and passed |
| Gap | Missing coverage requiring action |
| TDD | Technical Design Document |

---

## Change History

| Date | Item | Change | Reason | Author |
|------|------|--------|--------|--------|
| 2026-01-03 | RTM | Initial creation | Planning stage complete | QA Lead |
| 2026-01-04 | RTM | Merged RTM Update | Test stage traceability with design refs, implementation, and test cases | QA Lead |

---

## Related Documentation

- [Product Requirements Document](../prd/prd-E-001.md)
- [Acceptance Criteria](../acceptance-criteria/acceptance-criteria-E-001.md)
- [Test Strategy](../testing/test-strategy-E-001.md)
- [Features](../sdlc/3-planning/features-E-001.md)
- [User Stories](../sdlc/3-planning/user-stories-E-001.md)
- [Product Vision](../vision/product-vision.md)
- [Product Roadmap](../roadmap/product-roadmap.md)
