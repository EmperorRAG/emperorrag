# Requirements Traceability Matrix: Better Auth Utilities Phase 1

## Overview

- **Project**: Better Auth Utilities
- **Version**: Phase 1 (Q1 2026)
- **Owner**: QA Lead
- **Last Updated**: 2026-01-03
- **PRD Reference**: [Product Requirements Document](../2-definition/prd.md)
- **Acceptance Criteria**: [Acceptance Criteria](../2-definition/acceptance-criteria.md)
- **Test Strategy**: [Test Strategy](../2-definition/test-strategy.md)

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

| Req ID | Requirement | Priority | Epic | User Stories | Test Cases | Status |
|--------|-------------|----------|------|--------------|------------|--------|
| FR-001 | Implement OAuth server operations (sign-in-social, callback-oauth, link-social-account) | Must-Have | E-001 | US-001, US-002, US-003 | TC-OAuth-* | ⬜ Not Started |
| FR-002 | Implement Session server operations (get-session, list-sessions, revoke-session, revoke-sessions, revoke-other-sessions, refresh-token, get-access-token) | Must-Have | E-002 | US-004, US-005, US-006, US-007, US-008, US-009, US-010 | TC-Session-* | ⬜ Not Started |
| FR-003 | Implement Account server operations (account-info, list-user-accounts, unlink-account) | Must-Have | E-003 | US-011, US-012, US-013 | TC-Account-* | ⬜ Not Started |
| FR-004 | Implement User server operations (update-user, delete-user, delete-user-callback) | Must-Have | E-004 | US-014, US-015, US-016 | TC-User-* | ⬜ Not Started |
| FR-005 | Each operation must have controller (input validation) and service (API call) layers | Must-Have | E-001, E-002, E-003, E-004 | US-001–US-016 | TC-Architecture-* | ⬜ Not Started |
| FR-006 | Each operation must return typed `Effect<Success, Error, Dependencies>` | Must-Have | E-001, E-002, E-003, E-004 | US-001–US-016 | TC-TypeSafety-* | ⬜ Not Started |
| FR-007 | All operations must support optional `headers`, `asResponse`, `returnHeaders` params | Should-Have | E-001, E-002, E-003, E-004 | US-001–US-016 | TC-Params-* | ⬜ Not Started |
| FR-008 | Add TSDoc documentation to all public exports | Should-Have | E-005 | US-017, US-018 | TC-Docs-* | ⬜ Not Started |
| FR-009 | Create barrel exports (index.ts) for each domain | Should-Have | E-001, E-002, E-003, E-004 | US-001–US-016 | TC-Exports-* | ⬜ Not Started |
| FR-010 | Add `@pure` annotations to service functions | Nice-to-Have | E-005 | US-018 | TC-Annotations-* | ⬜ Not Started |

### Non-Functional Requirements

| Req ID | Requirement | Category | Epic | User Stories | Test Cases | Status |
|--------|-------------|----------|------|--------------|------------|--------|
| NFR-001 | Operations should add minimal overhead (<5ms) beyond Better Auth API calls | Performance | E-006 | US-019–US-022 | TC-Perf-* | ⬜ Not Started |
| NFR-002 | No secrets/credentials logged or exposed in error messages | Security | All | US-001–US-016 | TC-Security-* | ⬜ Not Started |
| NFR-003 | Stateless design; no shared mutable state between operations | Scalability | All | US-001–US-016 | TC-Stateless-* | ⬜ Not Started |
| NFR-004 | All operations must be testable with mocked `AuthServerTag` | Testability | E-006 | US-019–US-022 | TC-Mock-* | ⬜ Not Started |
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

## Epic to Requirement Mapping

| Epic ID | Epic Title | Requirements Covered | User Stories | Priority |
|---------|------------|---------------------|--------------|----------|
| E-001 | OAuth Server Operations | FR-001, FR-005, FR-006, FR-007, FR-009 | US-001, US-002, US-003 | P0 |
| E-002 | Session Server Operations | FR-002, FR-005, FR-006, FR-007, FR-009 | US-004–US-010 | P0 |
| E-003 | Account Server Operations | FR-003, FR-005, FR-006, FR-007, FR-009 | US-011, US-012, US-013 | P0 |
| E-004 | User Server Operations | FR-004, FR-005, FR-006, FR-007, FR-009 | US-014, US-015, US-016 | P0 |
| E-005 | API Documentation | FR-008, FR-010 | US-017, US-018 | P1 |
| E-006 | Unit Test Coverage | NFR-001, NFR-004 | US-019–US-022 | P1 |

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
| GAP-001 | Integration tests deferred to Phase 2 | Medium | Risk accepted - unit tests cover core functionality | Tech Lead | ⬜ Accepted |
| GAP-002 | Property-based testing deferred to Phase 2 | Low | Risk accepted - edge cases covered in unit tests | QA Lead | ⬜ Accepted |
| GAP-003 | Performance benchmarking deferred to Phase 3 | Low | Risk accepted - <5ms overhead is architectural | Tech Lead | ⬜ Accepted |

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

## Definitions

| Status | Definition |
|--------|------------|
| ⬜ Not Started | Work has not begun on this item |
| 🟡 In Progress | Work is underway but not complete |
| ✅ Verified | Requirement fully implemented, tested, and verified |
| 🔴 Blocked | Work cannot proceed due to dependency or issue |

---

## Change History

| Date | Item | Change | Reason | Author |
|------|------|--------|--------|--------|
| 2026-01-03 | RTM | Initial creation | Planning stage complete | QA Lead |

---

## Related Documentation

- [Product Requirements Document](../2-definition/prd.md)
- [Acceptance Criteria](../2-definition/acceptance-criteria.md)
- [Test Strategy](../2-definition/test-strategy.md)
- [Epics](epics.md)
- [User Stories](user-stories.md)
- [Product Vision](../1-discovery/product-vision.md)
- [Product Roadmap](../1-discovery/product-roadmap.md)
