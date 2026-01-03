# Acceptance Criteria: Better Auth Utilities

**Document Version**: 1.0
**Last Updated**: January 3, 2026
**PRD Reference**: [PRD](./prd.md)
**Owner**: Product Manager

---

## Overview

This document defines testable acceptance criteria for the Better Auth Utilities Q2 2026 initiative. Criteria are organized by functional requirement and written in Given-When-Then format.

---

## FR-1: Server Email Operations

### AC-1.1: Sign Up Email (Server)

```gherkin
Feature: Server-side email sign up

Scenario: Successful user registration
  Given the AuthServerTag is provided via Layer
  And a valid SignUpEmailInput with email "test@example.com" and password "SecurePass123!"
  When the signUpEmailServer operation is invoked
  Then the operation returns Effect.succeed with user data
  And the user data includes id, email, and createdAt fields
  And an Effect span "signUpEmailServer" is recorded

Scenario: Registration with existing email
  Given the AuthServerTag is provided via Layer
  And a user with email "existing@example.com" already exists
  When the signUpEmailServer operation is invoked with email "existing@example.com"
  Then the operation returns Effect.fail with ApiError
  And the error has tag "ApiError"
  And the error message indicates email already exists

Scenario: Registration with invalid password
  Given the AuthServerTag is provided via Layer
  And a SignUpEmailInput with password shorter than minimum length
  When the signUpEmailServer operation is invoked
  Then the operation returns Effect.fail with InputError
  And the error has tag "InputError"
  And the error message indicates password policy violation
```

### AC-1.2: Sign In Email (Server)

```gherkin
Feature: Server-side email sign in

Scenario: Successful authentication
  Given the AuthServerTag is provided via Layer
  And a registered user with email "user@example.com" and password "ValidPass123!"
  When the signInEmailServer operation is invoked with correct credentials
  Then the operation returns Effect.succeed with session data
  And the session data includes token and expiresAt fields

Scenario: Authentication with wrong password
  Given the AuthServerTag is provided via Layer
  And a registered user with email "user@example.com"
  When the signInEmailServer operation is invoked with incorrect password
  Then the operation returns Effect.fail with SessionError
  And the error has tag "SessionError"

Scenario: Authentication with unregistered email
  Given the AuthServerTag is provided via Layer
  When the signInEmailServer operation is invoked with email "unknown@example.com"
  Then the operation returns Effect.fail with SessionError
```

### AC-1.3: Verify Email (Server)

```gherkin
Feature: Server-side email verification

Scenario: Successful email verification
  Given the AuthServerTag is provided via Layer
  And a user with pending email verification
  And a valid verification token
  When the verifyEmailServer operation is invoked with the token
  Then the operation returns Effect.succeed
  And the user's emailVerified field is set to true

Scenario: Verification with expired token
  Given the AuthServerTag is provided via Layer
  And an expired verification token
  When the verifyEmailServer operation is invoked
  Then the operation returns Effect.fail with ApiError
  And the error indicates token expiration

Scenario: Verification with invalid token
  Given the AuthServerTag is provided via Layer
  When the verifyEmailServer operation is invoked with "invalid-token"
  Then the operation returns Effect.fail with InputError
```

### AC-1.4: Change Password (Server)

```gherkin
Feature: Server-side password change

Scenario: Successful password change
  Given the AuthServerTag is provided via Layer
  And an authenticated user session
  And valid ChangePasswordInput with current and new passwords
  When the changePasswordServer operation is invoked
  Then the operation returns Effect.succeed
  And subsequent sign-in with old password fails
  And subsequent sign-in with new password succeeds

Scenario: Change with incorrect current password
  Given the AuthServerTag is provided via Layer
  And an authenticated user session
  When changePasswordServer is invoked with wrong current password
  Then the operation returns Effect.fail with SessionError

Scenario: New password violates policy
  Given the AuthServerTag is provided via Layer
  And an authenticated user session
  When changePasswordServer is invoked with new password "weak"
  Then the operation returns Effect.fail with InputError
  And the error references password policy
```

### AC-1.5: Reset Password Flow (Server)

```gherkin
Feature: Server-side password reset

Scenario: Request password reset
  Given the AuthServerTag is provided via Layer
  And a registered user with email "user@example.com"
  When requestPasswordResetServer is invoked with email "user@example.com"
  Then the operation returns Effect.succeed
  And a reset token is generated (side effect)

Scenario: Complete password reset with valid token
  Given the AuthServerTag is provided via Layer
  And a valid password reset token
  When resetPasswordServer is invoked with token and new password
  Then the operation returns Effect.succeed
  And subsequent sign-in with new password succeeds

Scenario: Reset with expired token
  Given the AuthServerTag is provided via Layer
  And an expired password reset token
  When resetPasswordServer is invoked
  Then the operation returns Effect.fail with ApiError
```

---

## FR-2: Session Management Operations

### AC-2.1: Get Session

```gherkin
Feature: Server-side session retrieval

Scenario: Get valid session
  Given the AuthServerTag is provided via Layer
  And a valid session token
  When getSessionServer is invoked with the token
  Then the operation returns Effect.succeed with Session
  And Session includes id, userId, expiresAt fields

Scenario: Get expired session
  Given the AuthServerTag is provided via Layer
  And an expired session token
  When getSessionServer is invoked
  Then the operation returns Effect.fail with SessionError
  And error indicates session expired

Scenario: Get non-existent session
  Given the AuthServerTag is provided via Layer
  When getSessionServer is invoked with "non-existent-token"
  Then the operation returns Effect.fail with SessionError
```

### AC-2.2: List Sessions

```gherkin
Feature: Server-side session listing

Scenario: List all user sessions
  Given the AuthServerTag is provided via Layer
  And an authenticated user with 3 active sessions
  When listSessionsServer is invoked
  Then the operation returns Effect.succeed with Session[]
  And the array contains 3 session objects

Scenario: List sessions for user with no sessions
  Given the AuthServerTag is provided via Layer
  And an authenticated user with no sessions
  When listSessionsServer is invoked
  Then the operation returns Effect.succeed with empty array
```

### AC-2.3: Revoke Session

```gherkin
Feature: Server-side session revocation

Scenario: Revoke specific session
  Given the AuthServerTag is provided via Layer
  And an authenticated user with session "session-123"
  When revokeSessionServer is invoked with sessionId "session-123"
  Then the operation returns Effect.succeed
  And subsequent getSession with "session-123" returns SessionError

Scenario: Revoke all sessions
  Given the AuthServerTag is provided via Layer
  And an authenticated user with 3 active sessions
  When revokeAllSessionsServer is invoked
  Then the operation returns Effect.succeed
  And all user sessions are invalidated
```

---

## FR-3: OAuth/Social Authentication

### AC-3.1: Sign In Social

```gherkin
Feature: Social authentication initiation

Scenario: Initiate Google OAuth
  Given the AuthServerTag is provided via Layer
  And Google OAuth is configured
  When signInSocialServer is invoked with provider "google"
  Then the operation returns Effect.succeed with OAuthUrl
  And OAuthUrl is a valid Google authorization URL

Scenario: Initiate with unsupported provider
  Given the AuthServerTag is provided via Layer
  When signInSocialServer is invoked with provider "unsupported"
  Then TypeScript compilation fails (type safety)
  # Note: This is compile-time enforcement, not runtime

Scenario: Initiate with unconfigured provider
  Given the AuthServerTag is provided via Layer
  And GitHub OAuth is NOT configured
  When signInSocialServer is invoked with provider "github"
  Then the operation returns Effect.fail with DependencyError
```

### AC-3.2: OAuth Callback

```gherkin
Feature: OAuth callback handling

Scenario: Successful OAuth callback
  Given the AuthServerTag is provided via Layer
  And a valid OAuth callback with code and state
  When callbackOAuthServer is invoked
  Then the operation returns Effect.succeed with OAuthResult
  And OAuthResult includes user, session, and provider info

Scenario: Callback with invalid state
  Given the AuthServerTag is provided via Layer
  And an OAuth callback with mismatched state
  When callbackOAuthServer is invoked
  Then the operation returns Effect.fail with ApiError
  And error indicates CSRF validation failure

Scenario: Callback with denied access
  Given the AuthServerTag is provided via Layer
  And an OAuth callback with error "access_denied"
  When callbackOAuthServer is invoked
  Then the operation returns Effect.fail with ApiError
  And error indicates user denied access
```

### AC-3.3: Link/Unlink Account

```gherkin
Feature: Social account linking

Scenario: Link new social account
  Given the AuthServerTag is provided via Layer
  And an authenticated user without GitHub linked
  And valid GitHub OAuth tokens
  When linkSocialAccountServer is invoked with provider "github"
  Then the operation returns Effect.succeed
  And user's linked accounts include GitHub

Scenario: Link already linked provider
  Given the AuthServerTag is provided via Layer
  And an authenticated user with GitHub already linked
  When linkSocialAccountServer is invoked with provider "github"
  Then the operation returns Effect.fail with ApiError
  And error indicates account already linked

Scenario: Unlink social account
  Given the AuthServerTag is provided via Layer
  And an authenticated user with GitHub linked
  And user has password authentication enabled
  When unlinkAccountServer is invoked with provider "github"
  Then the operation returns Effect.succeed
  And user's linked accounts no longer include GitHub

Scenario: Unlink last authentication method
  Given the AuthServerTag is provided via Layer
  And an authenticated user with only GitHub authentication
  When unlinkAccountServer is invoked with provider "github"
  Then the operation returns Effect.fail with ApiError
  And error indicates cannot remove last auth method
```

---

## FR-4: Account Management

### AC-4.1: Get Account Info

```gherkin
Feature: Account information retrieval

Scenario: Get current user info
  Given the AuthServerTag is provided via Layer
  And an authenticated user session
  When getAccountInfoServer is invoked
  Then the operation returns Effect.succeed with User
  And User includes id, email, name, image, emailVerified fields
```

### AC-4.2: Update User

```gherkin
Feature: User profile update

Scenario: Update user name
  Given the AuthServerTag is provided via Layer
  And an authenticated user session
  When updateUserServer is invoked with { name: "New Name" }
  Then the operation returns Effect.succeed with updated User
  And User.name equals "New Name"

Scenario: Update with invalid data
  Given the AuthServerTag is provided via Layer
  And an authenticated user session
  When updateUserServer is invoked with invalid email format
  Then the operation returns Effect.fail with InputError
```

### AC-4.3: Delete User

```gherkin
Feature: User account deletion

Scenario: Delete user account
  Given the AuthServerTag is provided via Layer
  And an authenticated user session
  When deleteUserServer is invoked
  Then the operation returns Effect.succeed
  And subsequent sign-in attempts fail
  And user data is removed from database
```

---

## FR-5: Test Infrastructure

### AC-5.1: Mock Layers

```gherkin
Feature: Mock layers for testing

Scenario: Unit test with mock AuthServer
  Given a test using AuthServerMock layer
  When an auth operation is invoked
  Then the operation uses mock implementation
  And no real HTTP calls are made

Scenario: Mock layer returns configured response
  Given a test using AuthServerMock layer
  And mock is configured to return specific user
  When getAccountInfoServer is invoked
  Then the operation returns the configured mock user
```

### AC-5.2: Server Test Environment

```gherkin
Feature: Integration test environment

Scenario: Setup test environment
  Given setupServerTestEnvironment is called
  Then an in-memory SQLite database is created
  And Better Auth migrations are applied
  And a test HTTP server is started
  And authServer, authClient, and baseURL are returned

Scenario: Cleanup test environment
  Given a running test environment
  When the test completes
  Then the HTTP server is closed
  And database connections are released
```

### AC-5.3: Effect Test Harness

```gherkin
Feature: Vitest Effect integration

Scenario: Run Effect in test
  Given an Effect<number, never, never> returning 42
  When run(effect) is called in a test
  Then the Promise resolves with 42

Scenario: Assert Effect failure
  Given an Effect that fails with MyError
  When runExit(effect) is called
  Then Exit.isFailure returns true
  And the cause contains MyError

Scenario: Use testEffect helper
  Given testEffect("name", myEffect) is used
  Then a Vitest it() block is created
  And the effect is run to completion
```

---

## Edge Cases and Error Scenarios

### Input Validation Edge Cases

| Scenario | Input | Expected Error |
|----------|-------|----------------|
| Empty email | `""` | InputError: Email required |
| Invalid email format | `"not-an-email"` | InputError: Invalid email format |
| Password too short | `"abc"` | InputError: Password below minimum length |
| Password too long | 256+ chars | InputError: Password exceeds maximum length |
| Null input | `null` | InputError: Input required |
| Missing required field | `{ email: "test@test.com" }` | InputError: Password required |

### Concurrent Operation Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Simultaneous sign-up with same email | One succeeds, one fails with ApiError |
| Session revoked during operation | Operation fails with SessionError |
| Password changed during sign-in | Sign-in with old password fails |

### Network/Dependency Edge Cases

| Scenario | Expected Error |
|----------|----------------|
| AuthServer Layer not provided | DependencyError |
| Database connection lost | ApiError with cause |
| OAuth provider unreachable | ApiError with timeout cause |

---

## Non-Functional Criteria

### Performance

```gherkin
Scenario: Operation latency overhead
  Given a direct Better Auth SDK call takes X ms
  When the equivalent Effect-wrapped operation is called
  Then the total time is less than X + 5 ms

Scenario: No memory leaks
  Given a long-running server process
  When 10,000 auth operations are performed
  Then heap memory remains stable (within 10% variance)
```

### Security

```gherkin
Scenario: Credentials not logged
  Given Effect logging is enabled
  When a sign-in operation fails
  Then the error log does not contain the password
  And the error log does not contain full session tokens

Scenario: Input validation before API call
  Given malformed input
  When any server operation is invoked
  Then InputError is returned
  And no API call is made to Better Auth
```

### Observability

```gherkin
Scenario: Effect spans recorded
  Given Effect tracing is enabled
  When signUpEmailServer is invoked
  Then a span "signUpEmailServer" is recorded
  And span includes operation result status
```

---

## Quality Gate Checklist

- [x] All functional requirements have testable criteria
- [x] Happy path scenarios documented
- [x] Error scenarios documented
- [x] Edge cases identified
- [x] Non-functional requirements have criteria
- [x] Given-When-Then format used consistently
- [x] QA review completed
- [x] Tech Lead feasibility confirmed

---

*Previous: [PRD](./prd.md)*
*Next: [Test Strategy](./test-strategy.md)*
