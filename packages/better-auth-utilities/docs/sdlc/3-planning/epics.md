# Epics: Better Auth Utilities Phase 1

## Overview

- **PRD Reference**: [Product Requirements Document](../2-definition/prd.md)
- **Vision Reference**: [Product Vision](../1-discovery/product-vision.md)
- **Roadmap Reference**: [Product Roadmap](../1-discovery/product-roadmap.md)
- **Owner**: Product Manager
- **Last Updated**: 2026-01-03

---

## Epic Summary

| Epic ID | Title | Priority | Size | Status | Stories |
|---------|-------|----------|------|--------|---------|
| E-001 | OAuth Server Operations | P0 | M | ⬜ Not Started | 3 |
| E-002 | Session Server Operations | P0 | L | ⬜ Not Started | 7 |
| E-003 | Account Server Operations | P0 | M | ⬜ Not Started | 3 |
| E-004 | User Server Operations | P0 | S | ⬜ Not Started | 3 |
| E-005 | API Documentation | P1 | M | ⬜ Not Started | 2 |
| E-006 | Unit Test Coverage | P1 | L | ⬜ Not Started | 4 |

**Size Legend**: XS (<1 day), S (1-2 days), M (3-5 days), L (1-2 weeks), XL (2+ weeks)

---

# Epic E-001: OAuth Server Operations

## Epic Summary

### Business Objective

Implement Effect-wrapped server operations for OAuth authentication flows, enabling TypeScript developers to compose social sign-in, callback handling, and account linking within Effect pipelines with typed errors and dependency injection.

### Strategic Alignment

Supports P1.2 (OAuth Server Operations) from the roadmap. Essential for applications requiring social authentication (GitHub, Google, etc.) with Effect-TS integration.

---

## Scope

### In Scope

- sign-in-social: Initiate OAuth flow with provider redirect
- callback-oauth: Handle OAuth callback and create session
- link-social-account: Link additional OAuth provider to existing user

### Out of Scope

- Client-side OAuth operations (Phase 2)
- Additional OAuth provider configuration
- OAuth token refresh (covered in Session epic)

---

## Success Metrics

| Metric | Current State | Target | Measurement Method |
|--------|---------------|--------|-------------------|
| OAuth Operations Implemented | 0/3 | 3/3 | Count controller/service pairs |
| Test Coverage | 0% | ≥80% | Vitest coverage report |
| TSDoc Coverage | 0% | 100% | TSDoc validation |

---

## User Stories

### Must Have (P0)

| Story ID | Title | Points | Status |
|----------|-------|--------|--------|
| US-001 | Sign-In Social Operation | 3 | ⬜ Not Started |
| US-002 | OAuth Callback Operation | 5 | ⬜ Not Started |
| US-003 | Link Social Account Operation | 3 | ⬜ Not Started |

---

## Dependencies

### Internal Dependencies

| Dependency | Owner | Impact | Status |
|------------|-------|--------|--------|
| SignInSocialCommand schema | Internal | Required for input validation | ✅ Complete |
| CallbackOAuthCommand schema | Internal | Required for input validation | ✅ Complete |
| LinkSocialAccountCommand schema | Internal | Required for input validation | ✅ Complete |
| AuthServerTag/AuthServerLive | Internal | Required for API access | ✅ Complete |
| mapApiError utility | Internal | Required for error handling | ✅ Complete |

### External Dependencies

| Dependency | Owner | Impact | Status |
|------------|-------|--------|--------|
| Better Auth SDK socialProviders | better-auth team | OAuth provider support | ✅ Available |

---

## Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Implementation Complete | 2026-02-15 | ⬜ Not Started |
| Tests Complete | 2026-02-20 | ⬜ Not Started |
| Documentation Complete | 2026-02-25 | ⬜ Not Started |

---

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| OAuth provider-specific edge cases | Medium | Medium | Test with multiple providers (GitHub, Google) |
| Callback URL validation complexity | Low | Low | Follow Email domain patterns |

---

## Stakeholders

| Role | Name | Responsibility |
|------|------|----------------|
| Product Owner | Product Manager | Acceptance, prioritization |
| Tech Lead | Tech Lead | Architecture review, code review |
| Backend Developer | Backend Engineer | Implementation, testing |

---

# Epic E-002: Session Server Operations

## Epic Summary

### Business Objective

Implement Effect-wrapped server operations for session management, enabling TypeScript developers to retrieve, list, refresh, and revoke sessions within Effect pipelines with full type safety.

### Strategic Alignment

Supports P1.3 (Session Server Operations) from the roadmap. Critical for any application requiring session management, token refresh, and secure logout functionality.

---

## Scope

### In Scope

- get-session: Retrieve current session from headers
- list-sessions: List all sessions for authenticated user
- refresh-token: Refresh access token
- get-access-token: Get current access token
- revoke-session: Revoke specific session by ID
- revoke-sessions: Revoke all sessions for user
- revoke-other-sessions: Revoke all sessions except current

### Out of Scope

- Session caching layer (Phase 3)
- Session metadata extension (pending open question resolution)

---

## Success Metrics

| Metric | Current State | Target | Measurement Method |
|--------|---------------|--------|-------------------|
| Session Operations Implemented | 0/7 | 7/7 | Count controller/service pairs |
| Test Coverage | 0% | ≥80% | Vitest coverage report |
| TSDoc Coverage | 0% | 100% | TSDoc validation |

---

## User Stories

### Must Have (P0)

| Story ID | Title | Points | Status |
|----------|-------|--------|--------|
| US-004 | Get Session Operation | 3 | ⬜ Not Started |
| US-005 | List Sessions Operation | 3 | ⬜ Not Started |
| US-006 | Refresh Token Operation | 3 | ⬜ Not Started |
| US-007 | Get Access Token Operation | 2 | ⬜ Not Started |
| US-008 | Revoke Session Operation | 3 | ⬜ Not Started |
| US-009 | Revoke All Sessions Operation | 3 | ⬜ Not Started |
| US-010 | Revoke Other Sessions Operation | 3 | ⬜ Not Started |

---

## Dependencies

### Internal Dependencies

| Dependency | Owner | Impact | Status |
|------------|-------|--------|--------|
| GetSessionCommand schema | Internal | Required for input validation | ✅ Complete |
| ListSessionsCommand schema | Internal | Required for input validation | ✅ Complete |
| RefreshTokenCommand schema | Internal | Required for input validation | ✅ Complete |
| GetAccessTokenCommand schema | Internal | Required for input validation | ✅ Complete |
| RevokeSessionCommand schema | Internal | Required for input validation | ✅ Complete |
| RevokeSessionsCommand schema | Internal | Required for input validation | ✅ Complete |
| RevokeOtherSessionsCommand schema | Internal | Required for input validation | ✅ Complete |
| SessionError class | Internal | Required for session-specific errors | ✅ Complete |

---

## Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Implementation Complete | 2026-02-20 | ⬜ Not Started |
| Tests Complete | 2026-02-25 | ⬜ Not Started |
| Documentation Complete | 2026-02-28 | ⬜ Not Started |

---

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Token expiry edge cases | Medium | Medium | Comprehensive expiry testing |
| Session state consistency | Low | High | Transactional revocation patterns |

---

# Epic E-003: Account Server Operations

## Epic Summary

### Business Objective

Implement Effect-wrapped server operations for account management, enabling TypeScript developers to query account info, list linked providers, and unlink social accounts within Effect pipelines.

### Strategic Alignment

Supports P1.4 (Account Server Operations) from the roadmap. Required for multi-provider authentication scenarios where users link multiple social accounts.

---

## Scope

### In Scope

- account-info: Get current user's account information
- list-user-accounts: List all linked accounts/providers
- unlink-account: Unlink a social provider from user

### Out of Scope

- Account merging logic
- Primary account switching

---

## Success Metrics

| Metric | Current State | Target | Measurement Method |
|--------|---------------|--------|-------------------|
| Account Operations Implemented | 0/3 | 3/3 | Count controller/service pairs |
| Test Coverage | 0% | ≥80% | Vitest coverage report |
| TSDoc Coverage | 0% | 100% | TSDoc validation |

---

## User Stories

### Must Have (P0)

| Story ID | Title | Points | Status |
|----------|-------|--------|--------|
| US-011 | Account Info Operation | 2 | ⬜ Not Started |
| US-012 | List User Accounts Operation | 3 | ⬜ Not Started |
| US-013 | Unlink Account Operation | 3 | ⬜ Not Started |

---

## Dependencies

### Internal Dependencies

| Dependency | Owner | Impact | Status |
|------------|-------|--------|--------|
| AccountInfoCommand schema | Internal | Required for input validation | ✅ Complete |
| ListUserAccountsCommand schema | Internal | Required for input validation | ✅ Complete |
| UnlinkAccountCommand schema | Internal | Required for input validation | ✅ Complete |

---

## Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Implementation Complete | 2026-02-10 | ⬜ Not Started |
| Tests Complete | 2026-02-15 | ⬜ Not Started |
| Documentation Complete | 2026-02-18 | ⬜ Not Started |

---

# Epic E-004: User Server Operations

## Epic Summary

### Business Objective

Implement Effect-wrapped server operations for user profile management, enabling TypeScript developers to update user profiles and delete user accounts within Effect pipelines.

### Strategic Alignment

Supports P1.5 (User Server Operations) from the roadmap. Essential for user settings and GDPR-compliant account deletion.

---

## Scope

### In Scope

- update-user: Update user profile (name, image)
- delete-user: Delete user account
- delete-user-callback: Handle delete user callback/confirmation

### Out of Scope

- Soft delete (pending open question resolution)
- User data export (GDPR portability)

---

## Success Metrics

| Metric | Current State | Target | Measurement Method |
|--------|---------------|--------|-------------------|
| User Operations Implemented | 0/3 | 3/3 | Count controller/service pairs |
| Test Coverage | 0% | ≥80% | Vitest coverage report |
| TSDoc Coverage | 0% | 100% | TSDoc validation |

---

## User Stories

### Must Have (P0)

| Story ID | Title | Points | Status |
|----------|-------|--------|--------|
| US-014 | Update User Operation | 3 | ⬜ Not Started |
| US-015 | Delete User Operation | 5 | ⬜ Not Started |
| US-016 | Delete User Callback Operation | 3 | ⬜ Not Started |

---

## Dependencies

### Internal Dependencies

| Dependency | Owner | Impact | Status |
|------------|-------|--------|--------|
| UpdateUserCommand schema | Internal | Required for input validation | ✅ Complete |
| DeleteUserCommand schema | Internal | Required for input validation | ✅ Complete |
| DeleteUserCallbackCommand schema | Internal | Required for input validation | ✅ Complete |

---

## Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Implementation Complete | 2026-02-08 | ⬜ Not Started |
| Tests Complete | 2026-02-12 | ⬜ Not Started |
| Documentation Complete | 2026-02-15 | ⬜ Not Started |

---

# Epic E-005: API Documentation

## Epic Summary

### Business Objective

Provide comprehensive TSDoc documentation for all public exports, enabling developers to understand and use the library effectively through IDE intellisense and generated documentation.

### Strategic Alignment

Supports P1.6 (API Documentation) from the roadmap. Critical for developer experience and adoption.

---

## Scope

### In Scope

- TSDoc for all controller functions
- TSDoc for all service functions
- TSDoc for all error classes
- TSDoc for all schema classes
- Usage examples in JSDoc

### Out of Scope

- External documentation site
- Tutorial content
- Video guides

---

## Success Metrics

| Metric | Current State | Target | Measurement Method |
|--------|---------------|--------|-------------------|
| TSDoc Coverage | ~30% | 100% | TSDoc validation tool |
| Example Coverage | ~10% | 100% | Manual review |

---

## User Stories

### Should Have (P1)

| Story ID | Title | Points | Status |
|----------|-------|--------|--------|
| US-017 | Controller TSDoc Documentation | 5 | ⬜ Not Started |
| US-018 | Service and Error TSDoc Documentation | 5 | ⬜ Not Started |

---

## Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Documentation Complete | 2026-03-10 | ⬜ Not Started |

---

# Epic E-006: Unit Test Coverage

## Epic Summary

### Business Objective

Achieve ≥80% line coverage across all modules, ensuring reliability and enabling confident refactoring as the library evolves.

### Strategic Alignment

Supports P1.7 (Unit Test Coverage) from the roadmap. Required for production quality.

---

## Scope

### In Scope

- Controller unit tests
- Service unit tests
- Schema encode/decode tests
- Error handling tests
- Layer composition tests

### Out of Scope

- Integration tests against real auth server (Phase 2)
- Property-based testing (Phase 2)
- Performance benchmarks (Phase 3)

---

## Success Metrics

| Metric | Current State | Target | Measurement Method |
|--------|---------------|--------|-------------------|
| Line Coverage | ~40% | ≥80% | Vitest V8 coverage |
| Branch Coverage | ~30% | ≥70% | Vitest V8 coverage |
| Test Pass Rate | 100% | 100% | Vitest results |

---

## User Stories

### Should Have (P1)

| Story ID | Title | Points | Status |
|----------|-------|--------|--------|
| US-019 | OAuth Domain Tests | 5 | ⬜ Not Started |
| US-020 | Session Domain Tests | 8 | ⬜ Not Started |
| US-021 | Account Domain Tests | 5 | ⬜ Not Started |
| US-022 | User Domain Tests | 5 | ⬜ Not Started |

---

## Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Coverage Target Achieved | 2026-03-15 | ⬜ Not Started |

---

## Change Log

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-01-03 | 1.0 | Product Manager | Initial epic definitions |
