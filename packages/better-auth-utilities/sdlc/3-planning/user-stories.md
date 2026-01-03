# User Stories: Better Auth Utilities Phase 1

## Overview

- **Epics Reference**: [Epics](epics.md)
- **PRD Reference**: [Product Requirements Document](../2-definition/prd.md)
- **Acceptance Criteria**: [Acceptance Criteria](../2-definition/acceptance-criteria.md)
- **Owner**: Product Manager
- **Last Updated**: 2026-01-03

---

## Story Summary

| Story ID | Epic | Title | Priority | Points | Status |
|----------|------|-------|----------|--------|--------|
| US-001 | E-001 | Sign-In Social Operation | P0 | 3 | ⬜ Not Started |
| US-002 | E-001 | OAuth Callback Operation | P0 | 5 | ⬜ Not Started |
| US-003 | E-001 | Link Social Account Operation | P0 | 3 | ⬜ Not Started |
| US-004 | E-002 | Get Session Operation | P0 | 3 | ⬜ Not Started |
| US-005 | E-002 | List Sessions Operation | P0 | 3 | ⬜ Not Started |
| US-006 | E-002 | Refresh Token Operation | P0 | 3 | ⬜ Not Started |
| US-007 | E-002 | Get Access Token Operation | P0 | 2 | ⬜ Not Started |
| US-008 | E-002 | Revoke Session Operation | P0 | 3 | ⬜ Not Started |
| US-009 | E-002 | Revoke All Sessions Operation | P0 | 3 | ⬜ Not Started |
| US-010 | E-002 | Revoke Other Sessions Operation | P0 | 3 | ⬜ Not Started |
| US-011 | E-003 | Account Info Operation | P0 | 2 | ⬜ Not Started |
| US-012 | E-003 | List User Accounts Operation | P0 | 3 | ⬜ Not Started |
| US-013 | E-003 | Unlink Account Operation | P0 | 3 | ⬜ Not Started |
| US-014 | E-004 | Update User Operation | P0 | 3 | ⬜ Not Started |
| US-015 | E-004 | Delete User Operation | P0 | 5 | ⬜ Not Started |
| US-016 | E-004 | Delete User Callback Operation | P0 | 3 | ⬜ Not Started |
| US-017 | E-005 | Controller TSDoc Documentation | P1 | 5 | ⬜ Not Started |
| US-018 | E-005 | Service and Error TSDoc Documentation | P1 | 5 | ⬜ Not Started |
| US-019 | E-006 | OAuth Domain Tests | P1 | 5 | ⬜ Not Started |
| US-020 | E-006 | Session Domain Tests | P1 | 8 | ⬜ Not Started |
| US-021 | E-006 | Account Domain Tests | P1 | 5 | ⬜ Not Started |
| US-022 | E-006 | User Domain Tests | P1 | 5 | ⬜ Not Started |

**Total Story Points**: 79

---

# US-001: Sign-In Social Operation

## Story Statement

**As an** Effect-TS developer,
**I want** to initiate OAuth sign-in flows using Effect patterns,
**So that** I can compose social authentication with typed errors and dependency injection.

---

## Description

### Background Context

The `sign-in-social` operation initiates an OAuth flow by redirecting users to the OAuth provider's authorization endpoint. This is the entry point for social authentication.

### User Journey Context

This is the first step in the OAuth authentication flow. After calling this operation, the user is redirected to the provider (e.g., GitHub), then returns via the callback endpoint.

### Design References

- Command Schema: `src/lib/schema/commands/sign-in-social/SignInSocial.command.ts`
- Email domain pattern: `src/lib/server/core/email/sign-up-email/`

---

## Acceptance Criteria

### Scenario 1: Successful OAuth initiation

```gherkin
Given the AuthServerLive layer is provided
And a valid SignInSocialCommand with provider "github"
When signInSocialServerController is called with the command
Then an Effect resolving to the OAuth redirect URL is returned
And the redirect URL contains the provider authorization endpoint
```

### Scenario 2: Invalid provider

```gherkin
Given the AuthServerLive layer is provided
And a SignInSocialCommand with unsupported provider "unknown"
When signInSocialServerController is called with the command
Then an Effect failing with ApiError is returned
And the error contains status code 400
```

---

## Edge Cases

| Edge Case | Expected Behavior |
|-----------|-------------------|
| Empty provider string | InputError with validation message |
| Null provider | InputError with required field message |
| Provider not configured in auth server | ApiError with 400 status |

---

## Technical Notes

- Follow Email domain controller/service pattern
- Use `SignInSocialCommand` schema for input validation
- Map Better Auth API errors via `mapApiError`
- Support optional `callbackURL` override

---

## Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| SignInSocialCommand schema | Required | ✅ Complete |
| AuthServerTag | Required | ✅ Complete |
| mapApiError utility | Required | ✅ Complete |

---

## Definition of Done

- [ ] Controller created: `signInSocialServerController`
- [ ] Service created: `signInSocialServerService`
- [ ] Types created: `SignInSocialServerParams`
- [ ] Unit tests for controller (≥80% coverage)
- [ ] Unit tests for service (≥80% coverage)
- [ ] TSDoc documentation complete
- [ ] Barrel export added

---

# US-002: OAuth Callback Operation

## Story Statement

**As an** Effect-TS developer,
**I want** to handle OAuth callbacks with typed Effects,
**So that** I can safely complete social authentication flows with proper error handling.

---

## Description

### Background Context

The `callback-oauth` operation processes the authorization code returned by the OAuth provider, exchanges it for tokens, and creates a user session.

### User Journey Context

This is called after the user authorizes with the OAuth provider. It completes the OAuth flow and establishes the authenticated session.

---

## Acceptance Criteria

### Scenario 1: Successful callback processing

```gherkin
Given the AuthServerLive layer is provided
And a valid CallbackOAuthCommand with authorization code
When callbackOAuthServerController is called with the command
Then an Effect resolving to user and session data is returned
And the session contains valid tokens
```

### Scenario 2: Invalid authorization code

```gherkin
Given the AuthServerLive layer is provided
And a CallbackOAuthCommand with expired/invalid code
When callbackOAuthServerController is called with the command
Then an Effect failing with ApiError is returned
And the error contains status code 401 or 400
```

---

## Edge Cases

| Edge Case | Expected Behavior |
|-----------|-------------------|
| Expired authorization code | ApiError with 401 status |
| CSRF state mismatch | ApiError with 403 status |
| Missing code parameter | InputError with required field message |
| Provider returned error | ApiError with provider error message |

---

## Technical Notes

- Handle CSRF state verification
- Extract code and state from callback URL parameters
- Support optional redirect after successful auth

---

## Definition of Done

- [ ] Controller created: `callbackOAuthServerController`
- [ ] Service created: `callbackOAuthServerService`
- [ ] Types created: `CallbackOAuthServerParams`
- [ ] Unit tests (≥80% coverage)
- [ ] TSDoc documentation complete

---

# US-003: Link Social Account Operation

## Story Statement

**As an** Effect-TS developer,
**I want** to link additional OAuth providers to existing users,
**So that** users can authenticate with multiple social accounts.

---

## Acceptance Criteria

### Scenario 1: Successful account linking

```gherkin
Given the AuthServerLive layer is provided
And an authenticated user session
And a valid LinkSocialAccountCommand with provider "google"
When linkSocialAccountServerController is called with the command
Then an Effect resolving to success is returned
And the user has the new provider linked
```

### Scenario 2: Provider already linked

```gherkin
Given the AuthServerLive layer is provided
And a user with GitHub already linked
When linkSocialAccountServerController is called for GitHub again
Then an Effect failing with ApiError is returned
And the error indicates account already linked
```

---

## Definition of Done

- [ ] Controller created: `linkSocialAccountServerController`
- [ ] Service created: `linkSocialAccountServerService`
- [ ] Types created: `LinkSocialAccountServerParams`
- [ ] Unit tests (≥80% coverage)
- [ ] TSDoc documentation complete

---

# US-004: Get Session Operation

## Story Statement

**As an** Effect-TS developer,
**I want** to retrieve the current session from request headers,
**So that** I can verify authentication state in my Effect pipelines.

---

## Acceptance Criteria

### Scenario 1: Valid session present

```gherkin
Given the AuthServerLive layer is provided
And request headers contain valid session cookie
When getSessionServerController is called with headers
Then an Effect resolving to session data is returned
And the session contains user information
```

### Scenario 2: No session present

```gherkin
Given the AuthServerLive layer is provided
And request headers contain no session cookie
When getSessionServerController is called with headers
Then an Effect resolving to null is returned
```

---

## Edge Cases

| Edge Case | Expected Behavior |
|-----------|-------------------|
| Expired session cookie | null or SessionError |
| Malformed session cookie | null or SessionError |
| Valid cookie, deleted session | null or SessionError |

---

## Definition of Done

- [ ] Controller created: `getSessionServerController`
- [ ] Service created: `getSessionServerService`
- [ ] Types created: `GetSessionServerParams`
- [ ] Unit tests (≥80% coverage)
- [ ] TSDoc documentation complete

---

# US-005: List Sessions Operation

## Story Statement

**As an** Effect-TS developer,
**I want** to list all active sessions for a user,
**So that** users can see their active sessions across devices.

---

## Acceptance Criteria

### Scenario 1: User has active sessions

```gherkin
Given the AuthServerLive layer is provided
And an authenticated user with multiple sessions
When listSessionsServerController is called with headers
Then an Effect resolving to an array of sessions is returned
And each session contains device/browser info
```

### Scenario 2: No active sessions

```gherkin
Given the AuthServerLive layer is provided
And an authenticated user with no other sessions
When listSessionsServerController is called with headers
Then an Effect resolving to an empty array is returned
```

---

## Definition of Done

- [ ] Controller created: `listSessionsServerController`
- [ ] Service created: `listSessionsServerService`
- [ ] Types created: `ListSessionsServerParams`
- [ ] Unit tests (≥80% coverage)
- [ ] TSDoc documentation complete

---

# US-006: Refresh Token Operation

## Story Statement

**As an** Effect-TS developer,
**I want** to refresh access tokens,
**So that** users maintain their sessions without re-authentication.

---

## Acceptance Criteria

### Scenario 1: Successful token refresh

```gherkin
Given the AuthServerLive layer is provided
And a valid refresh token
When refreshTokenServerController is called
Then an Effect resolving to new tokens is returned
And the access token is refreshed
```

### Scenario 2: Expired refresh token

```gherkin
Given the AuthServerLive layer is provided
And an expired refresh token
When refreshTokenServerController is called
Then an Effect failing with ApiError is returned
And the error contains status code 401
```

---

## Definition of Done

- [ ] Controller created: `refreshTokenServerController`
- [ ] Service created: `refreshTokenServerService`
- [ ] Types created: `RefreshTokenServerParams`
- [ ] Unit tests (≥80% coverage)
- [ ] TSDoc documentation complete

---

# US-007: Get Access Token Operation

## Story Statement

**As an** Effect-TS developer,
**I want** to retrieve the current access token,
**So that** I can use it for authenticated API calls.

---

## Acceptance Criteria

### Scenario 1: Valid session with token

```gherkin
Given the AuthServerLive layer is provided
And an authenticated session
When getAccessTokenServerController is called with headers
Then an Effect resolving to the access token is returned
```

---

## Definition of Done

- [ ] Controller created: `getAccessTokenServerController`
- [ ] Service created: `getAccessTokenServerService`
- [ ] Types created: `GetAccessTokenServerParams`
- [ ] Unit tests (≥80% coverage)
- [ ] TSDoc documentation complete

---

# US-008: Revoke Session Operation

## Story Statement

**As an** Effect-TS developer,
**I want** to revoke a specific session by ID,
**So that** users can log out individual devices.

---

## Acceptance Criteria

### Scenario 1: Successful session revocation

```gherkin
Given the AuthServerLive layer is provided
And a valid session ID
When revokeSessionServerController is called with the session ID
Then an Effect resolving to success is returned
And the session is invalidated
```

### Scenario 2: Invalid session ID

```gherkin
Given the AuthServerLive layer is provided
And a non-existent session ID
When revokeSessionServerController is called
Then an Effect failing with ApiError is returned
And the error contains status code 404
```

---

## Edge Cases

| Edge Case | Expected Behavior |
|-----------|-------------------|
| Empty session ID | InputError with validation message |
| Already revoked session | Success (idempotent) or ApiError 404 |

---

## Definition of Done

- [ ] Controller created: `revokeSessionServerController`
- [ ] Service created: `revokeSessionServerService`
- [ ] Types created: `RevokeSessionServerParams`
- [ ] Unit tests (≥80% coverage)
- [ ] TSDoc documentation complete

---

# US-009: Revoke All Sessions Operation

## Story Statement

**As an** Effect-TS developer,
**I want** to revoke all sessions for a user,
**So that** users can perform a complete logout across all devices.

---

## Acceptance Criteria

### Scenario 1: Successful bulk revocation

```gherkin
Given the AuthServerLive layer is provided
And an authenticated user with multiple sessions
When revokeSessionsServerController is called with headers
Then an Effect resolving to success is returned
And all user sessions are invalidated
```

---

## Definition of Done

- [ ] Controller created: `revokeSessionsServerController`
- [ ] Service created: `revokeSessionsServerService`
- [ ] Types created: `RevokeSessionsServerParams`
- [ ] Unit tests (≥80% coverage)
- [ ] TSDoc documentation complete

---

# US-010: Revoke Other Sessions Operation

## Story Statement

**As an** Effect-TS developer,
**I want** to revoke all sessions except the current one,
**So that** users can secure their account while staying logged in.

---

## Acceptance Criteria

### Scenario 1: Successful selective revocation

```gherkin
Given the AuthServerLive layer is provided
And an authenticated user with multiple sessions
When revokeOtherSessionsServerController is called with current session headers
Then an Effect resolving to success is returned
And all sessions except the current one are invalidated
And the current session remains valid
```

---

## Definition of Done

- [ ] Controller created: `revokeOtherSessionsServerController`
- [ ] Service created: `revokeOtherSessionsServerService`
- [ ] Types created: `RevokeOtherSessionsServerParams`
- [ ] Unit tests (≥80% coverage)
- [ ] TSDoc documentation complete

---

# US-011: Account Info Operation

## Story Statement

**As an** Effect-TS developer,
**I want** to retrieve account information for the current user,
**So that** I can display account details and linked providers.

---

## Acceptance Criteria

### Scenario 1: Successful account info retrieval

```gherkin
Given the AuthServerLive layer is provided
And an authenticated user session
When accountInfoServerController is called with headers
Then an Effect resolving to account details is returned
And the account contains provider and metadata
```

---

## Definition of Done

- [ ] Controller created: `accountInfoServerController`
- [ ] Service created: `accountInfoServerService`
- [ ] Types created: `AccountInfoServerParams`
- [ ] Unit tests (≥80% coverage)
- [ ] TSDoc documentation complete

---

# US-012: List User Accounts Operation

## Story Statement

**As an** Effect-TS developer,
**I want** to list all linked accounts for a user,
**So that** users can see which social providers are connected.

---

## Acceptance Criteria

### Scenario 1: User has linked accounts

```gherkin
Given the AuthServerLive layer is provided
And a user with GitHub and Google linked
When listUserAccountsServerController is called with headers
Then an Effect resolving to a list of accounts is returned
And each account contains provider information
```

---

## Definition of Done

- [ ] Controller created: `listUserAccountsServerController`
- [ ] Service created: `listUserAccountsServerService`
- [ ] Types created: `ListUserAccountsServerParams`
- [ ] Unit tests (≥80% coverage)
- [ ] TSDoc documentation complete

---

# US-013: Unlink Account Operation

## Story Statement

**As an** Effect-TS developer,
**I want** to unlink a social provider from a user account,
**So that** users can disconnect social accounts they no longer use.

---

## Acceptance Criteria

### Scenario 1: Successful account unlinking

```gherkin
Given the AuthServerLive layer is provided
And a user with multiple linked providers
When unlinkAccountServerController is called with provider ID
Then an Effect resolving to success is returned
And the provider is unlinked
```

### Scenario 2: Cannot unlink last account

```gherkin
Given the AuthServerLive layer is provided
And a user with only one linked provider and no password
When unlinkAccountServerController is called
Then an Effect failing with ApiError is returned
And the error indicates cannot unlink last authentication method
```

---

## Edge Cases

| Edge Case | Expected Behavior |
|-----------|-------------------|
| Provider not linked | ApiError with 404 status |
| Last authentication method | ApiError preventing unlink |

---

## Definition of Done

- [ ] Controller created: `unlinkAccountServerController`
- [ ] Service created: `unlinkAccountServerService`
- [ ] Types created: `UnlinkAccountServerParams`
- [ ] Unit tests (≥80% coverage)
- [ ] TSDoc documentation complete

---

# US-014: Update User Operation

## Story Statement

**As an** Effect-TS developer,
**I want** to update user profile information,
**So that** users can change their name and profile image.

---

## Acceptance Criteria

### Scenario 1: Successful profile update

```gherkin
Given the AuthServerLive layer is provided
And a valid UpdateUserCommand with name and image
When updateUserServerController is called with the command
Then an Effect resolving to updated user data is returned
And the user profile reflects the changes
```

### Scenario 2: Invalid image URL

```gherkin
Given the AuthServerLive layer is provided
And an UpdateUserCommand with invalid image URL
When updateUserServerController is called
Then an Effect failing with InputError is returned
And the error indicates invalid URL format
```

---

## Edge Cases

| Edge Case | Expected Behavior |
|-----------|-------------------|
| Empty name | InputError with validation message |
| Name too long (>255 chars) | InputError with validation message |
| Invalid image URL format | InputError with URL validation failure |

---

## Definition of Done

- [ ] Controller created: `updateUserServerController`
- [ ] Service created: `updateUserServerService`
- [ ] Types created: `UpdateUserServerParams`
- [ ] Unit tests (≥80% coverage)
- [ ] TSDoc documentation complete

---

# US-015: Delete User Operation

## Story Statement

**As an** Effect-TS developer,
**I want** to delete a user account,
**So that** users can permanently remove their account and data.

---

## Acceptance Criteria

### Scenario 1: Successful user deletion

```gherkin
Given the AuthServerLive layer is provided
And a valid DeleteUserCommand
When deleteUserServerController is called with the command
Then an Effect resolving to deletion confirmation is returned
And the user and associated data are removed
```

---

## Edge Cases

| Edge Case | Expected Behavior |
|-----------|-------------------|
| Delete with active sessions | Sessions revoked before deletion |
| Non-existent user | ApiError with 404 status |

---

## Definition of Done

- [ ] Controller created: `deleteUserServerController`
- [ ] Service created: `deleteUserServerService`
- [ ] Types created: `DeleteUserServerParams`
- [ ] Unit tests (≥80% coverage)
- [ ] TSDoc documentation complete

---

# US-016: Delete User Callback Operation

## Story Statement

**As an** Effect-TS developer,
**I want** to handle delete user confirmation callbacks,
**So that** I can implement confirmed account deletion flows.

---

## Acceptance Criteria

### Scenario 1: Successful callback handling

```gherkin
Given the AuthServerLive layer is provided
And a valid DeleteUserCallbackCommand with confirmation token
When deleteUserCallbackServerController is called
Then an Effect resolving to success is returned
And the deletion is confirmed
```

---

## Definition of Done

- [ ] Controller created: `deleteUserCallbackServerController`
- [ ] Service created: `deleteUserCallbackServerService`
- [ ] Types created: `DeleteUserCallbackServerParams`
- [ ] Unit tests (≥80% coverage)
- [ ] TSDoc documentation complete

---

# US-017: Controller TSDoc Documentation

## Story Statement

**As a** developer using Better Auth Utilities,
**I want** comprehensive TSDoc documentation on all controllers,
**So that** I can understand the API through IDE intellisense.

---

## Acceptance Criteria

### Scenario 1: Documentation quality

```gherkin
Given all controller functions
When documentation is reviewed
Then each controller has:
  - Function description
  - @param documentation for all parameters
  - @returns documentation
  - @example with usage code
  - @pure annotation where applicable
```

---

## Definition of Done

- [ ] All 16 new controllers documented
- [ ] All 11 existing Email controllers reviewed
- [ ] Examples included for each controller
- [ ] Documentation validated in IDE

---

# US-018: Service and Error TSDoc Documentation

## Story Statement

**As a** developer using Better Auth Utilities,
**I want** comprehensive TSDoc documentation on services and errors,
**So that** I understand error types and service behavior.

---

## Definition of Done

- [ ] All service functions documented with @pure
- [ ] All 5 error classes documented with examples
- [ ] Error recovery patterns documented
- [ ] Schema classes documented

---

# US-019: OAuth Domain Tests

## Story Statement

**As a** maintainer of Better Auth Utilities,
**I want** comprehensive unit tests for OAuth domain,
**So that** I can confidently refactor and extend OAuth operations.

---

## Definition of Done

- [ ] signInSocialServerController tests (≥80% coverage)
- [ ] signInSocialServerService tests (≥80% coverage)
- [ ] callbackOAuthServerController tests (≥80% coverage)
- [ ] callbackOAuthServerService tests (≥80% coverage)
- [ ] linkSocialAccountServerController tests (≥80% coverage)
- [ ] linkSocialAccountServerService tests (≥80% coverage)
- [ ] Error path tests included

---

# US-020: Session Domain Tests

## Story Statement

**As a** maintainer of Better Auth Utilities,
**I want** comprehensive unit tests for Session domain,
**So that** I can confidently refactor and extend session operations.

---

## Definition of Done

- [ ] All 7 session controllers tested (≥80% coverage)
- [ ] All 7 session services tested (≥80% coverage)
- [ ] Token expiry edge cases tested
- [ ] Session revocation scenarios tested

---

# US-021: Account Domain Tests

## Story Statement

**As a** maintainer of Better Auth Utilities,
**I want** comprehensive unit tests for Account domain,
**So that** I can confidently refactor and extend account operations.

---

## Definition of Done

- [ ] accountInfoServerController tests (≥80% coverage)
- [ ] listUserAccountsServerController tests (≥80% coverage)
- [ ] unlinkAccountServerController tests (≥80% coverage)
- [ ] All services tested (≥80% coverage)

---

# US-022: User Domain Tests

## Story Statement

**As a** maintainer of Better Auth Utilities,
**I want** comprehensive unit tests for User domain,
**So that** I can confidently refactor and extend user operations.

---

## Definition of Done

- [ ] updateUserServerController tests (≥80% coverage)
- [ ] deleteUserServerController tests (≥80% coverage)
- [ ] deleteUserCallbackServerController tests (≥80% coverage)
- [ ] All services tested (≥80% coverage)
- [ ] Validation edge cases tested

---

## Change Log

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-01-03 | 1.0 | Product Manager | Initial user stories |
