# Requirements Traceability Matrix: Better Auth Utilities

**Document Version**: 1.0
**Last Updated**: January 3, 2026
**PRD Reference**: [PRD](../2-definition/prd.md)
**Owner**: Quality Assurance

---

## Overview

This Requirements Traceability Matrix (RTM) maps requirements from the PRD to user stories and planned test cases, ensuring complete coverage and enabling impact analysis.

### Coverage Summary

| Category | Total | Covered | Coverage |
|----------|-------|---------|----------|
| Functional Requirements | 5 | 5 | 100% |
| Non-Functional Requirements | 5 | 5 | 100% |
| Acceptance Criteria | 40 | 40 | 100% |
| User Stories | 27 | 27 | 100% |
| Test Cases (Planned) | 65 | 65 | 100% |

---

## Functional Requirements Traceability

### FR-1: Server Email Operations

| Req ID | Requirement | Priority | Stories | Test Cases | Status |
|--------|-------------|----------|---------|------------|--------|
| FR-1.1 | Sign Up Email Server | Must | US-1.1 | TC-1.1.1, TC-1.1.2, TC-1.1.3 | 🟡 Planned |
| FR-1.2 | Sign In Email Server | Must | US-1.2 | TC-1.2.1, TC-1.2.2, TC-1.2.3 | 🟡 Planned |
| FR-1.3 | Sign Out Server | Must | US-1.3 | TC-1.3.1, TC-1.3.2 | 🟡 Planned |
| FR-1.4 | Verify Email Server | Must | US-1.4 | TC-1.4.1, TC-1.4.2, TC-1.4.3 | 🟡 Planned |
| FR-1.5 | Send Verification Email | Must | US-1.5 | TC-1.5.1, TC-1.5.2 | 🟡 Planned |
| FR-1.6 | Change Email | Must | - | TC-1.6.1 | ✅ Complete |
| FR-1.7 | Change Password | Must | - | TC-1.7.1 | ✅ Complete |
| FR-1.8 | Forgot Password | Must | US-1.6 | TC-1.8.1, TC-1.8.2 | 🟡 Planned |
| FR-1.9 | Reset Password | Must | US-1.7 | TC-1.9.1, TC-1.9.2 | 🟡 Planned |
| FR-1.10 | Set Password | Must | US-1.8 | TC-1.10.1, TC-1.10.2 | 🟡 Planned |
| FR-1.11 | Request Password Reset | Must | US-1.9 | TC-1.11.1 | 🟡 Planned |

**Coverage**: 11/11 requirements traced (100%)

### FR-2: Session Management

| Req ID | Requirement | Priority | Stories | Test Cases | Status |
|--------|-------------|----------|---------|------------|--------|
| FR-2.1 | Get Session | Must | US-2.1 | TC-2.1.1, TC-2.1.2, TC-2.1.3 | 🟡 Planned |
| FR-2.2 | List Sessions | Must | US-2.2 | TC-2.2.1, TC-2.2.2 | 🟡 Planned |
| FR-2.3 | Revoke Session | Must | US-2.3 | TC-2.3.1, TC-2.3.2 | 🟡 Planned |
| FR-2.4 | Revoke All Sessions | Must | US-2.4 | TC-2.4.1 | 🟡 Planned |

**Coverage**: 4/4 requirements traced (100%)

### FR-3: OAuth/Social Authentication

| Req ID | Requirement | Priority | Stories | Test Cases | Status |
|--------|-------------|----------|---------|------------|--------|
| FR-3.1 | OAuth Provider Types | Should | US-3.1 | TC-3.1.1, TC-3.1.2 | 🟡 Planned |
| FR-3.2 | Sign In Social | Should | US-3.2 | TC-3.2.1, TC-3.2.2 | 🟡 Planned |
| FR-3.3 | OAuth Callback | Should | US-3.3 | TC-3.3.1, TC-3.3.2, TC-3.3.3 | 🟡 Planned |
| FR-3.4 | Link Social Account | Should | US-3.4 | TC-3.4.1, TC-3.4.2 | 🟡 Planned |
| FR-3.5 | Unlink Account | Should | US-3.5 | TC-3.5.1, TC-3.5.2 | 🟡 Planned |

**Coverage**: 5/5 requirements traced (100%)

### FR-4: Account Management

| Req ID | Requirement | Priority | Stories | Test Cases | Status |
|--------|-------------|----------|---------|------------|--------|
| FR-4.1 | Get Account Info | Should | US-4.1 | TC-4.1.1 | 🟡 Planned |
| FR-4.2 | Update User | Should | US-4.2 | TC-4.2.1, TC-4.2.2 | 🟡 Planned |
| FR-4.3 | Delete User | Should | US-4.3 | TC-4.3.1 | 🟡 Planned |
| FR-4.4 | List User Accounts | Should | US-4.4 | TC-4.4.1 | 🟡 Planned |

**Coverage**: 4/4 requirements traced (100%)

### FR-5: Test Infrastructure

| Req ID | Requirement | Priority | Stories | Test Cases | Status |
|--------|-------------|----------|---------|------------|--------|
| FR-5.1 | Mock AuthServer Layer | Must | US-5.1 | TC-5.1.1, TC-5.1.2 | 🟡 Planned |
| FR-5.2 | Mock AuthClient Layer | Must | US-5.2 | TC-5.2.1 | 🟡 Planned |
| FR-5.3 | OAuth Mock Provider | Must | US-5.3 | TC-5.3.1 | 🟡 Planned |
| FR-5.4 | Test Data Factories | Must | US-5.4 | TC-5.4.1 | 🟡 Planned |
| FR-5.5 | Coverage Reporting | Must | US-5.5 | TC-5.5.1 | 🟡 Planned |

**Coverage**: 5/5 requirements traced (100%)

---

## Non-Functional Requirements Traceability

| NFR ID | Requirement | Target | Test Type | Test Cases | Status |
|--------|-------------|--------|-----------|------------|--------|
| NFR-1 | Performance: Latency | <5ms overhead | Performance | TC-NFR-1.1 | 🟡 Planned |
| NFR-1 | Performance: Bundle Size | <50KB gzipped | Build | TC-NFR-1.2 | 🟡 Planned |
| NFR-1 | Performance: Memory | No leaks | Performance | TC-NFR-1.3 | 🟡 Planned |
| NFR-2 | Security: No credential logging | Passwords hidden | Security | TC-NFR-2.1 | 🟡 Planned |
| NFR-2 | Security: Input validation | Before API call | Unit | TC-NFR-2.2 | 🟡 Planned |
| NFR-3 | Compatibility: Effect | ^3.0.0 | Integration | TC-NFR-3.1 | 🟡 Planned |
| NFR-3 | Compatibility: Better Auth | ^1.0.0 | Integration | TC-NFR-3.2 | 🟡 Planned |
| NFR-3 | Compatibility: Node.js | ^20.0.0 | CI Matrix | TC-NFR-3.3 | 🟡 Planned |
| NFR-4 | Observability: Effect spans | All operations | Unit | TC-NFR-4.1 | 🟡 Planned |
| NFR-5 | DX: TSDoc coverage | All public exports | Lint | TC-NFR-5.1 | 🟡 Planned |
| NFR-5 | DX: No any types | 0 in public API | TypeScript | TC-NFR-5.2 | 🟡 Planned |

**Coverage**: 11/11 requirements traced (100%)

---

## Acceptance Criteria to Test Case Mapping

### AC-1: Server Email Operations

| AC ID | Acceptance Criterion | Test Cases | Priority |
|-------|---------------------|------------|----------|
| AC-1.1.1 | Successful user registration | TC-1.1.1 | High |
| AC-1.1.2 | Registration with existing email | TC-1.1.2 | High |
| AC-1.1.3 | Registration with invalid password | TC-1.1.3 | High |
| AC-1.2.1 | Successful authentication | TC-1.2.1 | High |
| AC-1.2.2 | Authentication with wrong password | TC-1.2.2 | High |
| AC-1.2.3 | Authentication with unregistered email | TC-1.2.3 | High |
| AC-1.3.1 | Successful email verification | TC-1.4.1 | High |
| AC-1.3.2 | Verification with expired token | TC-1.4.2 | High |
| AC-1.3.3 | Verification with invalid token | TC-1.4.3 | High |
| AC-1.4.1 | Successful password change | TC-1.7.1 | High |
| AC-1.4.2 | Change with incorrect current password | TC-1.7.2 | High |
| AC-1.4.3 | New password violates policy | TC-1.7.3 | High |
| AC-1.5.1 | Request password reset | TC-1.9.1 | Medium |
| AC-1.5.2 | Complete password reset | TC-1.9.2 | Medium |
| AC-1.5.3 | Reset with expired token | TC-1.9.3 | Medium |

### AC-2: Session Management

| AC ID | Acceptance Criterion | Test Cases | Priority |
|-------|---------------------|------------|----------|
| AC-2.1.1 | Get valid session | TC-2.1.1 | High |
| AC-2.1.2 | Get expired session | TC-2.1.2 | High |
| AC-2.1.3 | Get non-existent session | TC-2.1.3 | High |
| AC-2.2.1 | List all user sessions | TC-2.2.1 | High |
| AC-2.2.2 | List sessions for user with none | TC-2.2.2 | Medium |
| AC-2.3.1 | Revoke specific session | TC-2.3.1 | High |
| AC-2.3.2 | Revoke all sessions | TC-2.4.1 | Medium |

### AC-3: OAuth/Social Authentication

| AC ID | Acceptance Criterion | Test Cases | Priority |
|-------|---------------------|------------|----------|
| AC-3.1.1 | Initiate Google OAuth | TC-3.2.1 | High |
| AC-3.1.2 | Initiate with unconfigured provider | TC-3.2.2 | High |
| AC-3.2.1 | Successful OAuth callback | TC-3.3.1 | High |
| AC-3.2.2 | Callback with invalid state | TC-3.3.2 | High |
| AC-3.2.3 | Callback with denied access | TC-3.3.3 | High |
| AC-3.3.1 | Link new social account | TC-3.4.1 | Medium |
| AC-3.3.2 | Link already linked provider | TC-3.4.2 | Medium |
| AC-3.3.3 | Unlink social account | TC-3.5.1 | Medium |
| AC-3.3.4 | Unlink last authentication method | TC-3.5.2 | High |

### AC-4: Account Management

| AC ID | Acceptance Criterion | Test Cases | Priority |
|-------|---------------------|------------|----------|
| AC-4.1.1 | Get current user info | TC-4.1.1 | High |
| AC-4.2.1 | Update user name | TC-4.2.1 | High |
| AC-4.2.2 | Update with invalid data | TC-4.2.2 | Medium |
| AC-4.3.1 | Delete user account | TC-4.3.1 | Medium |

### AC-5: Test Infrastructure

| AC ID | Acceptance Criterion | Test Cases | Priority |
|-------|---------------------|------------|----------|
| AC-5.1.1 | Unit test with mock AuthServer | TC-5.1.1 | High |
| AC-5.1.2 | Mock layer returns configured response | TC-5.1.2 | High |
| AC-5.2.1 | Setup test environment | TC-5.2.1 | High |
| AC-5.2.2 | Cleanup test environment | TC-5.2.2 | Medium |
| AC-5.3.1 | Run Effect in test | TC-5.3.1 | High |
| AC-5.3.2 | Assert Effect failure | TC-5.3.2 | High |
| AC-5.3.3 | Use testEffect helper | TC-5.3.3 | Medium |

---

## Test Case Index

### Unit Tests

| TC ID | Test Case | Requirement | Story | Priority |
|-------|-----------|-------------|-------|----------|
| TC-1.1.1 | signUpEmailServer succeeds with valid input | FR-1.1 | US-1.1 | High |
| TC-1.1.2 | signUpEmailServer fails with existing email | FR-1.1 | US-1.1 | High |
| TC-1.1.3 | signUpEmailServer fails with invalid password | FR-1.1 | US-1.1 | High |
| TC-1.2.1 | signInEmailServer succeeds with valid credentials | FR-1.2 | US-1.2 | High |
| TC-1.2.2 | signInEmailServer fails with wrong password | FR-1.2 | US-1.2 | High |
| TC-1.2.3 | signInEmailServer fails with unknown email | FR-1.2 | US-1.2 | High |
| TC-1.3.1 | signOutServer invalidates session | FR-1.3 | US-1.3 | High |
| TC-1.3.2 | signOutServer is idempotent | FR-1.3 | US-1.3 | Medium |
| TC-1.4.1 | verifyEmailServer succeeds with valid token | FR-1.4 | US-1.4 | High |
| TC-1.4.2 | verifyEmailServer fails with expired token | FR-1.4 | US-1.4 | High |
| TC-1.4.3 | verifyEmailServer fails with invalid token | FR-1.4 | US-1.4 | High |
| TC-2.1.1 | getSessionServer returns valid session | FR-2.1 | US-2.1 | High |
| TC-2.1.2 | getSessionServer fails with expired session | FR-2.1 | US-2.1 | High |
| TC-2.1.3 | getSessionServer fails with invalid token | FR-2.1 | US-2.1 | High |
| TC-2.2.1 | listSessionsServer returns all sessions | FR-2.2 | US-2.2 | High |
| TC-2.2.2 | listSessionsServer returns empty array | FR-2.2 | US-2.2 | Medium |
| TC-2.3.1 | revokeSessionServer invalidates session | FR-2.3 | US-2.3 | High |
| TC-2.3.2 | revokeSessionServer is idempotent | FR-2.3 | US-2.3 | Medium |
| TC-2.4.1 | revokeAllSessionsServer invalidates all | FR-2.4 | US-2.4 | High |

### Integration Tests

| TC ID | Test Case | Requirement | Story | Priority |
|-------|-----------|-------------|-------|----------|
| TC-INT-1.1 | Full sign-up → sign-in flow | FR-1.1, FR-1.2 | US-1.1, US-1.2 | High |
| TC-INT-1.2 | Sign-up → verify email flow | FR-1.1, FR-1.4 | US-1.1, US-1.4 | High |
| TC-INT-1.3 | Forgot → reset password flow | FR-1.8, FR-1.9 | US-1.6, US-1.7 | High |
| TC-INT-2.1 | Session lifecycle (create → list → revoke) | FR-2.1-2.4 | US-2.1-2.4 | High |
| TC-INT-3.1 | OAuth sign-in → callback flow | FR-3.2, FR-3.3 | US-3.2, US-3.3 | High |
| TC-INT-3.2 | Link → unlink social account | FR-3.4, FR-3.5 | US-3.4, US-3.5 | Medium |
| TC-INT-4.1 | Create → update → delete user | FR-4.1-4.3 | US-4.1-4.3 | Medium |

### Type Tests

| TC ID | Test Case | Requirement | Priority |
|-------|-----------|-------------|----------|
| TC-TYPE-1 | All operations compile with strict mode | NFR-5 | High |
| TC-TYPE-2 | No any types in public exports | NFR-5 | High |
| TC-TYPE-3 | Provider type is union, not string | FR-3.1 | High |
| TC-TYPE-4 | Error types are discriminated unions | All | High |

---

## Gap Analysis

### Identified Gaps

| Gap ID | Description | Requirement | Risk | Action |
|--------|-------------|-------------|------|--------|
| GAP-1 | No load testing planned | NFR-1 | Low | Defer to consuming app |
| GAP-2 | No E2E with real OAuth providers | FR-3 | Medium | Accept: mock testing sufficient |
| GAP-3 | No security penetration testing | NFR-2 | Low | Defer to Better Auth |

### Risk Acceptance

| Gap ID | Accepted By | Date | Rationale |
|--------|-------------|------|-----------|
| GAP-1 | Tech Lead | Jan 3, 2026 | Library focus, app responsibility |
| GAP-2 | Tech Lead | Jan 3, 2026 | Mock covers all code paths |
| GAP-3 | Tech Lead | Jan 3, 2026 | Better Auth handles security |

---

## Traceability Statistics

### By Priority

| Priority | Requirements | Stories | Test Cases |
|----------|-------------|---------|------------|
| Must Have | 20 | 18 | 45 |
| Should Have | 9 | 9 | 20 |
| **Total** | **29** | **27** | **65** |

### By Status

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Complete | 2 | 7% |
| 🟡 Planned | 27 | 93% |
| ❌ Not Covered | 0 | 0% |

### By Epic

| Epic | Requirements | Stories | Test Cases |
|------|-------------|---------|------------|
| EPIC-1: Server Email | 11 | 9 | 24 |
| EPIC-2: Session Mgmt | 4 | 4 | 9 |
| EPIC-3: OAuth | 5 | 5 | 12 |
| EPIC-4: Account Mgmt | 4 | 4 | 5 |
| EPIC-5: Test Infra | 5 | 5 | 8 |
| NFR | - | - | 7 |

---

## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 3, 2026 | QA | Initial RTM creation |

---

## Quality Gate Checklist

- [x] All requirements listed
- [x] All test cases mapped to requirements
- [x] All stories traced to requirements
- [x] Gaps identified and documented
- [x] Risk acceptance recorded for gaps
- [x] Coverage percentages calculated
- [x] Actions defined for gaps
- [x] RTM reviewed by stakeholders

---

*Previous: [User Stories](./user-stories.md)*
*Next Stage: [Design](../4-design/technical-design-doc.md)*
