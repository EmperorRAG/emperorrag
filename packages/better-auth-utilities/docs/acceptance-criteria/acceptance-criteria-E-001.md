# Acceptance Criteria: Better Auth Utilities Epic E-001

## Story Reference

- **Story ID**: BAU-E-001
- **Story Title**: Complete Server Operations & Documentation
- **Epic**: Better Auth Utilities Epic E-001
- **PRD Reference**: [Product Requirements Document](../prd/prd-E-001.md)
- **Vision Reference**: [Product Vision](../vision/product-vision.md)

---

## Functional Criteria

### Scenario 1: OAuth Sign-In Social Operation (AC-001)

```gherkin
Feature: OAuth Sign-In Social
  As an Effect-TS developer
  I want to initiate OAuth sign-in flows with typed Effects
  So that I can compose social authentication with my Effect pipelines

  @AC-001.1
  Scenario: Successful OAuth sign-in initiation
    Given the AuthServerLive layer is provided
    And a valid SignInSocialCommand with provider "github"
    When signInSocialServerController is called with the command
    Then an Effect resolving to the OAuth redirect URL is returned
    And the redirect URL contains the provider authorization endpoint

  @AC-001.2
  Scenario: Invalid provider specified
    Given the AuthServerLive layer is provided
    And a SignInSocialCommand with unsupported provider "unknown"
    When signInSocialServerController is called with the command
    Then an Effect failing with ApiError is returned
    And the error contains status code 400
```

### Scenario 2: OAuth Callback Operation (AC-002)

```gherkin
Feature: OAuth Callback
  As an Effect-TS developer
  I want to handle OAuth callbacks with typed errors
  So that I can safely complete social authentication flows

  @AC-002.1
  Scenario: Successful OAuth callback processing
    Given the AuthServerLive layer is provided
    And a valid CallbackOAuthCommand with authorization code
    When callbackOAuthServerController is called with the command
    Then an Effect resolving to user and session data is returned
    And the session contains valid tokens

  @AC-002.2
  Scenario: Invalid or expired authorization code
    Given the AuthServerLive layer is provided
    And a CallbackOAuthCommand with expired code
    When callbackOAuthServerController is called with the command
    Then an Effect failing with ApiError is returned
    And the error contains status code 401 or 400
```

### Scenario 3: Link Social Account Operation (AC-003)

```gherkin
Feature: Link Social Account
  As an Effect-TS developer
  I want to link and unlink social provider accounts with typed Effects
  So that I can compose multi-provider identity management in my pipelines

  @AC-003.1
  Scenario: Link social account for authenticated user
    Given the AuthServerLive layer is provided
    And request headers contain valid session
    And a valid LinkSocialAccountCommand with provider "github"
    When linkSocialAccountServerController is called with the command
    Then an Effect resolving to the linked account details is returned
    And the account is associated with the current user

  @AC-003.2
  Scenario: Link social account without authentication
    Given the AuthServerLive layer is provided
    And request headers contain no session cookie
    And a LinkSocialAccountCommand with provider "github"
    When linkSocialAccountServerController is called with the command
    Then an Effect failing with ApiError is returned
    And the error contains status code 401
```

### Scenario 4: Session Get Operation (AC-004)

```gherkin
Feature: Get Session
  As an Effect-TS developer
  I want to retrieve session data with typed Effects
  So that I can verify authentication state in my pipelines

  @AC-004.1
  Scenario: Retrieve valid session
    Given the AuthServerLive layer is provided
    And request headers contain valid session cookie
    When getSessionServerController is called with headers
    Then an Effect resolving to session data is returned
    And the session contains user information

  @AC-004.2
  Scenario: No session present
    Given the AuthServerLive layer is provided
    And request headers contain no session cookie
    When getSessionServerController is called with headers
    Then an Effect resolving to null/undefined is returned
    Or an Effect failing with SessionError is returned
```

### Scenario 5: Session Operations (AC-005)

```gherkin
Feature: Session Operations
  As an Effect-TS developer
  I want to list sessions, refresh tokens, and get access tokens with typed Effects
  So that I can implement comprehensive session management in my pipelines

  @AC-005.1
  Scenario: List all active sessions
    Given the AuthServerLive layer is provided
    And request headers contain valid session
    When listSessionsServerController is called with headers
    Then an Effect resolving to a list of active sessions is returned
    And each session contains ID, device info, and last active timestamp

  @AC-005.2
  Scenario: Refresh a valid token
    Given the AuthServerLive layer is provided
    And a valid RefreshTokenCommand with a non-expired refresh token
    When refreshTokenServerController is called with the command
    Then an Effect resolving to new access and refresh tokens is returned
    And the previous refresh token is invalidated

  @AC-005.3
  Scenario: Refresh an expired token
    Given the AuthServerLive layer is provided
    And a RefreshTokenCommand with an expired refresh token
    When refreshTokenServerController is called with the command
    Then an Effect failing with ApiError is returned
    And the error contains status code 401

  @AC-005.4
  Scenario: Get access token from session
    Given the AuthServerLive layer is provided
    And request headers contain valid session
    When getAccessTokenServerController is called with headers
    Then an Effect resolving to a valid access token is returned
    And the token contains appropriate claims and expiration
```

### Scenario 6: Session Revocation Operations (AC-006)

```gherkin
Feature: Session Revocation
  As an Effect-TS developer
  I want to revoke sessions with typed Effects
  So that I can implement secure logout and session management

  @AC-006.1
  Scenario: Revoke specific session by ID
    Given the AuthServerLive layer is provided
    And a valid RevokeSessionCommand with session ID
    When revokeSessionServerController is called with the command
    Then an Effect resolving to success confirmation is returned
    And the specified session is invalidated

  @AC-006.2
  Scenario: Revoke all sessions for user
    Given the AuthServerLive layer is provided
    And a valid RevokeSessionsCommand
    When revokeSessionsServerController is called with headers
    Then an Effect resolving to success confirmation is returned
    And all user sessions are invalidated

  @AC-006.3
  Scenario: Revoke other sessions (keep current)
    Given the AuthServerLive layer is provided
    And request headers contain valid session
    When revokeOtherSessionsServerController is called with headers
    Then an Effect resolving to success confirmation is returned
    And all sessions except current are invalidated
```

### Scenario 7: Account Operations (AC-007)

```gherkin
Feature: Account Management
  As an Effect-TS developer
  I want to manage linked accounts with typed Effects
  So that I can handle multi-provider authentication

  @AC-007.1
  Scenario: Get account info
    Given the AuthServerLive layer is provided
    And request headers contain valid session
    When accountInfoServerController is called with headers
    Then an Effect resolving to account details is returned
    And the account contains provider and metadata

  @AC-007.2
  Scenario: List all linked accounts
    Given the AuthServerLive layer is provided
    And request headers contain valid session
    When listUserAccountsController is called with headers
    Then an Effect resolving to list of accounts is returned
    And each account contains provider information

  @AC-007.3
  Scenario: Unlink social account
    Given the AuthServerLive layer is provided
    And a valid UnlinkAccountCommand with provider ID
    When unlinkAccountController is called with the command
    Then an Effect resolving to success confirmation is returned
    And the specified account is unlinked
```

### Scenario 8: User Operations (AC-008)

```gherkin
Feature: User Management
  As an Effect-TS developer
  I want to manage user profiles with typed Effects
  So that I can implement user settings and account deletion

  @AC-008.1
  Scenario: Update user profile
    Given the AuthServerLive layer is provided
    And a valid UpdateUserCommand with name and image
    When updateUserServerController is called with the command
    Then an Effect resolving to updated user data is returned
    And the user profile reflects the changes

  @AC-008.2
  Scenario: Delete user account
    Given the AuthServerLive layer is provided
    And a valid DeleteUserCommand
    When deleteUserServerController is called with the command
    Then an Effect resolving to deletion confirmation is returned
    And the user and associated data are removed
```

---

## Non-Functional Criteria

### Performance

- [ ] Operations add <5ms overhead beyond Better Auth API call latency
- [ ] No synchronous blocking operations in Effect pipelines
- [ ] Memory footprint per operation <1KB additional allocation

### Security

- [ ] No credentials or tokens logged in error messages
- [ ] Sensitive fields (password, tokens) never appear in error cause chain
- [ ] Session IDs are treated as sensitive data

### Type Safety

- [ ] All operations return `Effect<Success, Error, AuthServerTag>`
- [ ] Error types are exhaustively matchable (tagged union)
- [ ] No `any` types in public API surface
- [ ] TypeScript strict mode passes

### Testability

- [ ] All controllers testable with mocked AuthServerTag
- [ ] All services testable with mocked authServer.api
- [ ] Test utilities allow Effect-based assertions

### Accessibility

- [ ] N/A (library, not UI component)

### Compatibility

- [ ] Effect-TS >=3.0.0 compatibility
- [ ] Better Auth SDK >=1.0.0 compatibility
- [ ] Node.js 20.x LTS support
- [ ] TypeScript 5.x strict mode

---

## Edge Cases

| Input/Condition | Expected Behavior |
|-----------------|-------------------|
| Empty session ID for revocation | InputError with validation message |
| Null provider for OAuth sign-in | InputError with required field message |
| Already unlinked account | ApiError with 404 status |
| Delete user with active sessions | Sessions revoked before user deletion |
| Update user with invalid image URL | InputError with URL validation failure |
| OAuth callback with CSRF mismatch | ApiError with 403 status |
| Expired refresh token | ApiError with 401 status |
| List sessions with no sessions | Empty array result, not error |

---

## Validation Rules

| Field/Input | Rule | Error Message |
|-------------|------|---------------|
| provider (OAuth) | Non-empty string, supported provider | "Provider is required and must be supported" |
| sessionId | Valid session ID format | "Invalid session ID format" |
| callbackURL | Valid URL format | "Callback URL must be a valid URL" |
| name (user update) | Non-empty string, max 255 chars | "Name must be between 1 and 255 characters" |
| image (user update) | Valid URL format or undefined | "Image must be a valid URL" |
| code (OAuth callback) | Non-empty string | "Authorization code is required" |

---

## Dependencies

- AuthServerLive layer must be configured with valid Better Auth options
- Command schemas must be stable (no schema changes during Epic E-001)
- Pipeline utilities (mapApiError, handleApiError) must be available
- Existing tagged error types (ApiError, InputError) must be sufficient

---

## Notes

### Architecture Pattern

Each operation follows the established Email domain pattern:

```
operation/
├── operation.controller.ts    # Validates input, calls service
├── operation.service.ts       # Wraps Better Auth API in Effect
├── operation.types.ts         # TypeScript type definitions
├── operation.controller.spec.ts
├── operation.service.spec.ts
└── operation.types.spec.ts
```

### Error Handling Convention

- Input validation failures → `InputError`
- Better Auth API errors → `ApiError` (via mapApiError)
- Missing session/auth → `SessionError` or `ApiError` with 401
- Missing expected data → `DataMissingError`
- Layer/dependency injection failures → `DependenciesError`

### Layer Composition

```typescript
const program = signInSocialController(command);
const result = Effect.runPromise(
  program.pipe(Effect.provide(AuthLive))
);
```

---

## Change Log

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-01-03 | 1.0 | Product Manager | Initial acceptance criteria creation |
