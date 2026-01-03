# User Stories: Better Auth Utilities

**Document Version**: 1.0
**Last Updated**: January 3, 2026
**Epic Reference**: [Epics](./epics.md)
**Owner**: Product Manager

---

## Story Index

### EPIC-1: Server Email Operations (29 points)

- [US-1.1](#us-11-sign-up-email-server) Sign Up Email Server (5 pts)
- [US-1.2](#us-12-sign-in-email-server) Sign In Email Server (5 pts)
- [US-1.3](#us-13-sign-out-server) Sign Out Server (3 pts)
- [US-1.4](#us-14-verify-email-controller) Verify Email Controller (3 pts)
- [US-1.5](#us-15-send-verification-email) Send Verification Email (3 pts)
- [US-1.6](#us-16-forgot-password-controller) Forgot Password Controller (2 pts)
- [US-1.7](#us-17-reset-password-server) Reset Password Server (3 pts)
- [US-1.8](#us-18-set-password-server) Set Password Server (3 pts)
- [US-1.9](#us-19-request-password-reset-controller) Request Password Reset Controller (2 pts)

### EPIC-2: Session Management (12 points)

- [US-2.1](#us-21-get-session-server) Get Session Server (3 pts)
- [US-2.2](#us-22-list-sessions-server) List Sessions Server (3 pts)
- [US-2.3](#us-23-revoke-session-server) Revoke Session Server (3 pts)
- [US-2.4](#us-24-revoke-all-sessions-server) Revoke All Sessions Server (3 pts)

### EPIC-3: OAuth/Social Authentication (21 points)

- [US-3.1](#us-31-oauth-provider-types) OAuth Provider Types (3 pts)
- [US-3.2](#us-32-sign-in-social-server) Sign In Social Server (5 pts)
- [US-3.3](#us-33-oauth-callback-server) OAuth Callback Server (5 pts)
- [US-3.4](#us-34-link-social-account-server) Link Social Account Server (5 pts)
- [US-3.5](#us-35-unlink-account-server) Unlink Account Server (3 pts)

### EPIC-4: Account Management (16 points)

- [US-4.1](#us-41-get-account-info-server) Get Account Info Server (3 pts)
- [US-4.2](#us-42-update-user-server) Update User Server (5 pts)
- [US-4.3](#us-43-delete-user-server) Delete User Server (5 pts)
- [US-4.4](#us-44-list-user-accounts-server) List User Accounts Server (3 pts)

### EPIC-5: Test Infrastructure (20 points)

- [US-5.1](#us-51-mock-authserver-layer) Mock AuthServer Layer (5 pts)
- [US-5.2](#us-52-mock-authclient-layer) Mock AuthClient Layer (5 pts)
- [US-5.3](#us-53-oauth-mock-provider) OAuth Mock Provider (5 pts)
- [US-5.4](#us-54-test-data-factories) Test Data Factories (3 pts)
- [US-5.5](#us-55-coverage-reporting-setup) Coverage Reporting Setup (2 pts)

---

## EPIC-1: Server Email Operations

### US-1.1: Sign Up Email Server

**Story ID**: US-1.1
**Epic**: EPIC-1
**Priority**: High
**Points**: 5

#### Story Statement

As an **Effect-TS backend developer**,
I want to **use a signUpEmailServer operation that returns a typed Effect**,
So that **I can create user accounts on the server with proper error handling and schema validation**.

#### Description

Implement the server-side sign-up operation that:

- Accepts `SignUpEmailInput` (email, password, name)
- Validates input against Schema
- Calls Better Auth `api.signUpEmail`
- Returns `Effect<SignUpResult, InputError | ApiError, AuthServerTag>`
- Wraps operation in Effect span

**Design Reference**: [AC-1.1](../2-definition/acceptance-criteria.md#ac-11-sign-up-email-server)

#### Acceptance Criteria

- [ ] **Given** AuthServerTag is provided via Layer
      **When** signUpEmailServer is called with valid input
      **Then** returns Effect.succeed with user and session data

- [ ] **Given** AuthServerTag is provided via Layer
      **When** signUpEmailServer is called with existing email
      **Then** returns Effect.fail with ApiError

- [ ] **Given** AuthServerTag is provided via Layer
      **When** signUpEmailServer is called with invalid password
      **Then** returns Effect.fail with InputError

- [ ] **Given** any signUpEmailServer call
      **Then** Effect span "signUpEmailServer" is recorded

#### Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty email | InputError: Email required |
| Invalid email format | InputError: Invalid email format |
| Password below minimum | InputError: Password policy violation |
| Password above maximum | InputError: Password policy violation |
| Concurrent same email | One succeeds, one fails ApiError |

#### Technical Notes

- Reuse existing `SignUpEmail.command.ts` schema
- Follow pattern from `changePassword.controller.ts`
- Use `mapApiError` for SDK error transformation
- Add to server exports index

#### Dependencies

- `SignUpEmailInput` schema (exists)
- `AuthServerTag` (exists)
- `mapApiError` pipeline stage (exists)

#### Definition of Done

- [ ] Service implemented with typed Effect signature
- [ ] Controller orchestrates validation → service → response
- [ ] Unit tests cover happy path and all error cases
- [ ] Integration test with in-memory SQLite
- [ ] TSDoc on public exports
- [ ] Exported from package index

---

### US-1.2: Sign In Email Server

**Story ID**: US-1.2
**Epic**: EPIC-1
**Priority**: High
**Points**: 5

#### Story Statement

As an **Effect-TS backend developer**,
I want to **use a signInEmailServer operation that authenticates users and returns a session**,
So that **I can implement login functionality on the server with type-safe session handling**.

#### Description

Implement the server-side sign-in operation that:

- Accepts `SignInEmailInput` (email, password)
- Validates credentials via Better Auth
- Returns `Effect<SignInResult, InputError | SessionError | ApiError, AuthServerTag>`
- Creates and returns session token

**Design Reference**: [AC-1.2](../2-definition/acceptance-criteria.md#ac-12-sign-in-email-server)

#### Acceptance Criteria

- [ ] **Given** valid credentials
      **When** signInEmailServer is called
      **Then** returns Effect.succeed with session (token, expiresAt)

- [ ] **Given** wrong password
      **When** signInEmailServer is called
      **Then** returns Effect.fail with SessionError

- [ ] **Given** unregistered email
      **When** signInEmailServer is called
      **Then** returns Effect.fail with SessionError

#### Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Email case sensitivity | Case-insensitive matching |
| Locked account | SessionError with specific message |
| Unverified email (if required) | SessionError or ApiError |

#### Technical Notes

- Session token should be included in result
- Consider returning user info with session
- Match existing client `SignInEmail` patterns

#### Definition of Done

- [ ] Service implemented with typed Effect signature
- [ ] Controller orchestrates flow
- [ ] Tests cover all credential scenarios
- [ ] Integration test creates session

---

### US-1.3: Sign Out Server

**Story ID**: US-1.3
**Epic**: EPIC-1
**Priority**: High
**Points**: 3

#### Story Statement

As an **Effect-TS backend developer**,
I want to **use a signOutServer operation that invalidates the current session**,
So that **I can implement logout functionality that properly cleans up sessions**.

#### Acceptance Criteria

- [ ] **Given** a valid session token
      **When** signOutServer is called
      **Then** returns Effect.succeed (void)
      **And** session is invalidated

- [ ] **Given** an invalid/expired session
      **When** signOutServer is called
      **Then** returns Effect.succeed (idempotent)

#### Technical Notes

- Should accept session token or header context
- Idempotent operation (no error on already-signed-out)

#### Definition of Done

- [ ] Service invalidates session
- [ ] Unit tests verify session cleanup
- [ ] Integration test confirms session unusable after signout

---

### US-1.4: Verify Email Controller

**Story ID**: US-1.4
**Epic**: EPIC-1
**Priority**: High
**Points**: 3

#### Story Statement

As an **Effect-TS backend developer**,
I want to **use a verifyEmailServer operation that validates email verification tokens**,
So that **I can complete email verification flows on the server**.

#### Acceptance Criteria

- [ ] **Given** a valid verification token
      **When** verifyEmailServer is called
      **Then** returns Effect.succeed
      **And** user.emailVerified is true

- [ ] **Given** an expired token
      **When** verifyEmailServer is called
      **Then** returns Effect.fail with ApiError

- [ ] **Given** an invalid token
      **When** verifyEmailServer is called
      **Then** returns Effect.fail with InputError

#### Technical Notes

- Service exists, need controller wrapper
- Follow existing controller patterns

#### Definition of Done

- [ ] Controller wraps existing service
- [ ] Tests cover token validation scenarios
- [ ] Exported from package

---

### US-1.5: Send Verification Email

**Story ID**: US-1.5
**Epic**: EPIC-1
**Priority**: Medium
**Points**: 3

#### Story Statement

As an **Effect-TS backend developer**,
I want to **trigger verification email sending from the server**,
So that **I can resend verification emails when users request them**.

#### Acceptance Criteria

- [ ] **Given** an authenticated user with unverified email
      **When** sendVerificationEmailServer is called
      **Then** returns Effect.succeed
      **And** verification email is queued

- [ ] **Given** a user with verified email
      **When** sendVerificationEmailServer is called
      **Then** returns Effect.succeed (no-op or info response)

#### Definition of Done

- [ ] Service triggers email via Better Auth
- [ ] Tests mock email sending
- [ ] Rate limiting documented (application concern)

---

### US-1.6: Forgot Password Controller

**Story ID**: US-1.6
**Epic**: EPIC-1
**Priority**: Medium
**Points**: 2

#### Story Statement

As an **Effect-TS backend developer**,
I want to **initiate password reset flows from the server**,
So that **users can recover their accounts**.

#### Acceptance Criteria

- [ ] **Given** a registered email
      **When** forgotPasswordServer is called
      **Then** returns Effect.succeed
      **And** reset email is sent

- [ ] **Given** an unregistered email
      **When** forgotPasswordServer is called
      **Then** returns Effect.succeed (security: no email enumeration)

#### Technical Notes

- Service exists, need controller
- Must not reveal email existence

#### Definition of Done

- [ ] Controller wraps service
- [ ] Security: no email enumeration
- [ ] Tests verify both registered/unregistered cases

---

### US-1.7: Reset Password Server

**Story ID**: US-1.7
**Epic**: EPIC-1
**Priority**: Medium
**Points**: 3

#### Story Statement

As an **Effect-TS backend developer**,
I want to **complete password reset with a token**,
So that **users can set new passwords after forgot password flow**.

#### Acceptance Criteria

- [ ] **Given** a valid reset token and new password
      **When** resetPasswordServer is called
      **Then** returns Effect.succeed
      **And** user can sign in with new password

- [ ] **Given** an expired reset token
      **When** resetPasswordServer is called
      **Then** returns Effect.fail with ApiError

#### Definition of Done

- [ ] Service and controller implemented
- [ ] Integration test completes full forgot→reset flow

---

### US-1.8: Set Password Server

**Story ID**: US-1.8
**Epic**: EPIC-1
**Priority**: Medium
**Points**: 3

#### Story Statement

As an **Effect-TS backend developer**,
I want to **set a password for OAuth-only users**,
So that **users who signed up via social login can add password authentication**.

#### Acceptance Criteria

- [ ] **Given** an OAuth-only user
      **When** setPasswordServer is called with valid password
      **Then** returns Effect.succeed
      **And** user can sign in with email/password

- [ ] **Given** a user with existing password
      **When** setPasswordServer is called
      **Then** returns Effect.fail with ApiError

#### Definition of Done

- [ ] Service validates user has no password
- [ ] Password policy enforced
- [ ] Tests cover OAuth→password scenarios

---

### US-1.9: Request Password Reset Controller

**Story ID**: US-1.9
**Epic**: EPIC-1
**Priority**: Medium
**Points**: 2

#### Story Statement

As an **Effect-TS backend developer**,
I want to **request password reset via a typed server operation**,
So that **I can integrate password reset into server workflows**.

#### Acceptance Criteria

- [ ] **Given** valid email input
      **When** requestPasswordResetServer is called
      **Then** returns Effect.succeed
      **And** reset token is generated

#### Technical Notes

- May be alias/wrapper for forgotPasswordServer
- Follow security practices (no email enumeration)

#### Definition of Done

- [ ] Controller implemented
- [ ] Security behavior documented

---

## EPIC-2: Session Management

### US-2.1: Get Session Server

**Story ID**: US-2.1
**Epic**: EPIC-2
**Priority**: High
**Points**: 3

#### Story Statement

As an **Effect-TS backend developer**,
I want to **retrieve session details by token**,
So that **I can validate sessions and get user context in server handlers**.

#### Acceptance Criteria

- [ ] **Given** a valid session token
      **When** getSessionServer is called
      **Then** returns Effect.succeed with Session (id, userId, expiresAt)

- [ ] **Given** an expired session token
      **When** getSessionServer is called
      **Then** returns Effect.fail with SessionError

- [ ] **Given** an invalid token
      **When** getSessionServer is called
      **Then** returns Effect.fail with SessionError

#### Definition of Done

- [ ] Service returns typed Session
- [ ] Tests cover all token states
- [ ] Exported from package

---

### US-2.2: List Sessions Server

**Story ID**: US-2.2
**Epic**: EPIC-2
**Priority**: High
**Points**: 3

#### Story Statement

As an **Effect-TS backend developer**,
I want to **list all active sessions for a user**,
So that **users can see their active sessions and manage them**.

#### Acceptance Criteria

- [ ] **Given** an authenticated user with 3 sessions
      **When** listSessionsServer is called
      **Then** returns Effect.succeed with Session[] of length 3

- [ ] **Given** a user with no sessions
      **When** listSessionsServer is called
      **Then** returns Effect.succeed with empty array

#### Definition of Done

- [ ] Returns array of Session objects
- [ ] Tests verify correct session count
- [ ] Includes device/metadata if available

---

### US-2.3: Revoke Session Server

**Story ID**: US-2.3
**Epic**: EPIC-2
**Priority**: High
**Points**: 3

#### Story Statement

As an **Effect-TS backend developer**,
I want to **revoke a specific session by ID**,
So that **users can invalidate individual sessions (logout other devices)**.

#### Acceptance Criteria

- [ ] **Given** a valid session ID
      **When** revokeSessionServer is called
      **Then** returns Effect.succeed
      **And** session is invalidated

- [ ] **Given** an invalid session ID
      **When** revokeSessionServer is called
      **Then** returns Effect.succeed (idempotent)

#### Definition of Done

- [ ] Service invalidates specific session
- [ ] Tests confirm revoked session is unusable
- [ ] Authorization: user can only revoke own sessions

---

### US-2.4: Revoke All Sessions Server

**Story ID**: US-2.4
**Epic**: EPIC-2
**Priority**: Medium
**Points**: 3

#### Story Statement

As an **Effect-TS backend developer**,
I want to **revoke all sessions for a user**,
So that **users can "logout everywhere" for security**.

#### Acceptance Criteria

- [ ] **Given** a user with multiple sessions
      **When** revokeAllSessionsServer is called
      **Then** returns Effect.succeed
      **And** all sessions are invalidated

#### Definition of Done

- [ ] Batch revocation implemented
- [ ] Tests verify all sessions invalidated
- [ ] Consider keeping current session option

---

## EPIC-3: OAuth/Social Authentication

### US-3.1: OAuth Provider Types

**Story ID**: US-3.1
**Epic**: EPIC-3
**Priority**: High
**Points**: 3

#### Story Statement

As an **Effect-TS developer**,
I want to **have typed OAuth provider identifiers**,
So that **I get compile-time validation when specifying providers**.

#### Acceptance Criteria

- [ ] `OAuthProvider` type includes "google" | "github" | "discord"
- [ ] Provider type is used in all OAuth operations
- [ ] Invalid provider strings cause TypeScript errors

#### Definition of Done

- [ ] Type definitions exported
- [ ] Used across all OAuth operations
- [ ] Documentation includes provider list

---

### US-3.2: Sign In Social Server

**Story ID**: US-3.2
**Epic**: EPIC-3
**Priority**: High
**Points**: 5

#### Story Statement

As an **Effect-TS backend developer**,
I want to **initiate OAuth flows with a typed provider parameter**,
So that **I can redirect users to the correct OAuth provider**.

#### Acceptance Criteria

- [ ] **Given** provider "google" and configured OAuth
      **When** signInSocialServer is called
      **Then** returns Effect.succeed with authorization URL

- [ ] **Given** unconfigured provider
      **When** signInSocialServer is called
      **Then** returns Effect.fail with DependencyError

#### Definition of Done

- [ ] Returns authorization URL for redirect
- [ ] Provider is typed, not string
- [ ] Tests mock OAuth URLs

---

### US-3.3: OAuth Callback Server

**Story ID**: US-3.3
**Epic**: EPIC-3
**Priority**: High
**Points**: 5

#### Story Statement

As an **Effect-TS backend developer**,
I want to **handle OAuth callback with typed response**,
So that **I can complete OAuth flows and create/link users**.

#### Acceptance Criteria

- [ ] **Given** valid callback code and state
      **When** callbackOAuthServer is called
      **Then** returns Effect.succeed with user and session

- [ ] **Given** invalid state (CSRF)
      **When** callbackOAuthServer is called
      **Then** returns Effect.fail with ApiError

- [ ] **Given** access denied by user
      **When** callbackOAuthServer is called
      **Then** returns Effect.fail with ApiError

#### Definition of Done

- [ ] Handles success and error callbacks
- [ ] Creates or links user account
- [ ] Tests cover CSRF and denial scenarios

---

### US-3.4: Link Social Account Server

**Story ID**: US-3.4
**Epic**: EPIC-3
**Priority**: Medium
**Points**: 5

#### Story Statement

As an **Effect-TS backend developer**,
I want to **link a social provider to an existing user account**,
So that **users can add additional login methods**.

#### Acceptance Criteria

- [ ] **Given** authenticated user without GitHub linked
      **When** linkSocialAccountServer is called with "github"
      **Then** returns Effect.succeed
      **And** user has GitHub in linked accounts

- [ ] **Given** already linked provider
      **When** linkSocialAccountServer is called
      **Then** returns Effect.fail with ApiError

#### Definition of Done

- [ ] Initiates link flow
- [ ] Prevents duplicate links
- [ ] Tests verify account linking

---

### US-3.5: Unlink Account Server

**Story ID**: US-3.5
**Epic**: EPIC-3
**Priority**: Medium
**Points**: 3

#### Story Statement

As an **Effect-TS backend developer**,
I want to **unlink a social provider from a user account**,
So that **users can remove login methods they no longer want**.

#### Acceptance Criteria

- [ ] **Given** user with GitHub linked and password auth
      **When** unlinkAccountServer is called with "github"
      **Then** returns Effect.succeed
      **And** GitHub is removed from linked accounts

- [ ] **Given** user with only social auth (no password)
      **When** unlinkAccountServer is called for last provider
      **Then** returns Effect.fail with ApiError

#### Definition of Done

- [ ] Prevents removing last auth method
- [ ] Tests verify safety check
- [ ] Integration test covers unlink flow

---

## EPIC-4: Account Management

### US-4.1: Get Account Info Server

**Story ID**: US-4.1
**Epic**: EPIC-4
**Priority**: High
**Points**: 3

#### Story Statement

As an **Effect-TS backend developer**,
I want to **retrieve current user information**,
So that **I can display user profiles and make authorization decisions**.

#### Acceptance Criteria

- [ ] **Given** an authenticated session
      **When** getAccountInfoServer is called
      **Then** returns Effect.succeed with User (id, email, name, image, emailVerified)

#### Definition of Done

- [ ] Returns full user profile
- [ ] Tests verify all fields present
- [ ] Exported from package

---

### US-4.2: Update User Server

**Story ID**: US-4.2
**Epic**: EPIC-4
**Priority**: High
**Points**: 5

#### Story Statement

As an **Effect-TS backend developer**,
I want to **update user profile fields**,
So that **users can change their name, image, and other profile data**.

#### Acceptance Criteria

- [ ] **Given** authenticated user
      **When** updateUserServer is called with { name: "New Name" }
      **Then** returns Effect.succeed with updated User

- [ ] **Given** invalid update data
      **When** updateUserServer is called
      **Then** returns Effect.fail with InputError

#### Definition of Done

- [ ] Partial updates supported
- [ ] Schema validation on input
- [ ] Tests cover various field updates

---

### US-4.3: Delete User Server

**Story ID**: US-4.3
**Epic**: EPIC-4
**Priority**: Medium
**Points**: 5

#### Story Statement

As an **Effect-TS backend developer**,
I want to **delete a user account**,
So that **users can exercise their right to be forgotten**.

#### Acceptance Criteria

- [ ] **Given** authenticated user
      **When** deleteUserServer is called
      **Then** returns Effect.succeed
      **And** user cannot sign in
      **And** user data is removed

#### Definition of Done

- [ ] Handles cascade (sessions, accounts)
- [ ] Tests verify complete removal
- [ ] Consider soft delete vs hard delete

---

### US-4.4: List User Accounts Server

**Story ID**: US-4.4
**Epic**: EPIC-4
**Priority**: Medium
**Points**: 3

#### Story Statement

As an **Effect-TS backend developer**,
I want to **list linked accounts for a user**,
So that **users can see their connected login methods**.

#### Acceptance Criteria

- [ ] **Given** user with email + GitHub linked
      **When** listUserAccountsServer is called
      **Then** returns Effect.succeed with Account[] including both

#### Definition of Done

- [ ] Returns all linked providers
- [ ] Includes account metadata
- [ ] Tests verify linked accounts

---

## EPIC-5: Test Infrastructure

### US-5.1: Mock AuthServer Layer

**Story ID**: US-5.1
**Epic**: EPIC-5
**Priority**: High
**Points**: 5

#### Story Statement

As a **test developer**,
I want to **use a mock AuthServer layer in unit tests**,
So that **I can test auth operations without a real server**.

#### Acceptance Criteria

- [ ] `AuthServerMock` Layer provides mock server instance
- [ ] Mock can be configured with expected responses
- [ ] No HTTP calls made when using mock
- [ ] Mock supports all server operations

#### Definition of Done

- [ ] Layer.succeed or Layer.effect pattern
- [ ] Configuration API for mock responses
- [ ] Documentation with examples
- [ ] Used in at least 5 test files

---

### US-5.2: Mock AuthClient Layer

**Story ID**: US-5.2
**Epic**: EPIC-5
**Priority**: High
**Points**: 5

#### Story Statement

As a **test developer**,
I want to **use a mock AuthClient layer in unit tests**,
So that **I can test client operations without network calls**.

#### Acceptance Criteria

- [ ] `AuthClientMock` Layer provides mock client instance
- [ ] Mock can be configured with expected responses
- [ ] No network calls made when using mock

#### Definition of Done

- [ ] Matches AuthServer mock patterns
- [ ] Examples in documentation

---

### US-5.3: OAuth Mock Provider

**Story ID**: US-5.3
**Epic**: EPIC-5
**Priority**: Medium
**Points**: 5

#### Story Statement

As a **test developer**,
I want to **mock OAuth provider responses**,
So that **I can test OAuth flows without real provider integration**.

#### Acceptance Criteria

- [ ] Mock OAuth callback responses available
- [ ] Mock user profiles for each provider
- [ ] Error scenarios can be simulated

#### Definition of Done

- [ ] Mock responses match real provider formats
- [ ] Supports Google, GitHub, Discord
- [ ] Error simulation documented

---

### US-5.4: Test Data Factories

**Story ID**: US-5.4
**Epic**: EPIC-5
**Priority**: Medium
**Points**: 3

#### Story Statement

As a **test developer**,
I want to **use factory functions for test data**,
So that **I can create consistent test data across test files**.

#### Acceptance Criteria

- [ ] `testUser()` returns unique user data
- [ ] `testSession()` returns valid session mock
- [ ] `testOAuthCallback()` returns valid callback data

#### Definition of Done

- [ ] Factories return typed test data
- [ ] Unique identifiers per invocation
- [ ] Exported from test utilities

---

### US-5.5: Coverage Reporting Setup

**Story ID**: US-5.5
**Epic**: EPIC-5
**Priority**: Low
**Points**: 2

#### Story Statement

As a **developer**,
I want to **see code coverage reports in CI**,
So that **I can track test coverage over time**.

#### Acceptance Criteria

- [ ] `nx test better-auth-utilities --coverage` generates report
- [ ] Coverage thresholds configured (90% lines)
- [ ] CI fails if coverage drops below threshold

#### Definition of Done

- [ ] Vitest coverage configured
- [ ] CI workflow includes coverage step
- [ ] Coverage badges in README

---

## Quality Gate Checklist

- [x] All stories have clear user intent (As a... I want... So that...)
- [x] All stories have testable acceptance criteria
- [x] All stories are estimable (story points assigned)
- [x] Edge cases documented where applicable
- [x] Technical notes provide implementation guidance
- [x] Definition of Done checklist on each story
- [x] Stories linked to parent epic and acceptance criteria

---

*Previous: [Epics](./epics.md)*
*Next: [RTM](./rtm.md)*
