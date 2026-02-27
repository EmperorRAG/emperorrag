# Requirements Traceability Matrix Update: Better Auth Utilities Phase 1

## Metadata

- **Project**: Better Auth Utilities
- **Phase**: Phase 1 - Core Operations
- **Version**: 1.0
- **Last Updated**: 2026-01-04

---

## Executive Summary

This RTM update extends the Planning stage RTM with test case mappings for Phase 1 operations. All 10 functional requirements and 5 non-functional requirements are traced from design through implementation to verification.

---

## Traceability Matrix

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

## Coverage Analysis

### By Priority

| Priority | Total Reqs | Covered | Percentage |
|----------|------------|---------|------------|
| P0 | 14 | 14 | 100% |
| P1 | 1 | 1 | 100% |
| **Total** | **15** | **15** | **100%** |

### By Category

| Category | Requirements | Test Cases | Coverage |
|----------|--------------|------------|----------|
| OAuth | FR-001 | TC-001 to TC-006 | 6 TCs |
| Session | FR-002 | TC-007 to TC-015 | 9 TCs |
| Account | FR-003 | TC-016 to TC-019 | 4 TCs |
| User | FR-004 | TC-020 to TC-026 | 7 TCs |
| Architecture | FR-005 to FR-010, NFR-* | Pattern verification | All TCs |

---

## Detailed Requirement Tracking

### FR-001: OAuth Operations

**Description**: Implement signInSocial, callbackOAuth, and linkSocialAccount server controllers

**Design Reference**: [technical-design-document.md](../5-build/technical-design-document.md#21-oauth-domain)

**Implementation Status**: ⬜ Pending Phase 1

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

**Design Reference**: [technical-design-document.md](../5-build/technical-design-document.md#22-session-domain)

**Implementation Status**: ⬜ Pending Phase 1

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

**Design Reference**: [technical-design-document.md](../5-build/technical-design-document.md#23-account-domain)

**Implementation Status**: ⬜ Pending Phase 1

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

**Design Reference**: [technical-design-document.md](../5-build/technical-design-document.md#24-user-domain)

**Implementation Status**: ⬜ Pending Phase 1

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

## Gaps Identified

| Gap ID | Description | Impact | Remediation | Owner | Due Date |
|--------|-------------|--------|-------------|-------|----------|
| GAP-001 | OAuth/Session/Account/User domains not implemented | High | Phase 1 implementation | Backend Dev | Sprint 1 |
| GAP-002 | Integration tests require database setup | Medium | setupServerTestEnvironment | QA | Sprint 1 |
| GAP-003 | E2E tests depend on auth server mock | Medium | Add mock layer factory | Backend Dev | Sprint 1 |

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

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | ________________ | __________ | __________ |
| Tech Lead | ________________ | __________ | __________ |
| PM | ________________ | __________ | __________ |

---

## Definitions

| Term | Definition |
|------|------------|
| Covered | At least one test case exists |
| Verified | Test case executed and passed |
| Pending | Test case exists but not executed |
| Gap | Missing coverage requiring action |
| TDD | Technical Design Document |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-04 | QA Lead | Initial RTM update for Test stage |
