# Test Cases: Better Auth Utilities Phase 1

## Metadata

- **Story ID**: US-001 through US-016
- **Author**: QA Lead
- **Version**: 1.0
- **Last Updated**: 2026-01-04

---

## Test Suite: OAuth Domain (E-001)

### TC-001: Sign-In Social with Valid Provider

**Priority**: P0
**Type**: Functional
**User Story**: US-001

**Preconditions**:
- AuthServerTag layer available
- GitHub provider configured in BetterAuthOptions

**Test Data**:
| Variable | Value |
|----------|-------|
| provider | "github" |
| disableRedirect | true |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create SignInSocialServerParams with provider="github" | Params created with _tag |
| 2 | Call signInSocialServerController | Effect returned |
| 3 | Provide AuthServerTag layer | Effect executes |
| 4 | Verify response | url defined, redirect=false |

**Expected Result**:
Effect succeeds with `{ url: string, redirect: false }`

**Postconditions**:
- No state changes (OAuth not completed yet)
- Effect can be safely discarded

---

### TC-002: Sign-In Social with Missing Provider

**Priority**: P0
**Type**: Error Handling
**User Story**: US-001

**Preconditions**:
- AuthServerTag layer available

**Test Data**:
| Variable | Value |
|----------|-------|
| body | { _tag: "SignInSocialCommand" } |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create params without provider field | Params incomplete |
| 2 | Call signInSocialServerController | Effect returned |
| 3 | Provide layer and run | Effect fails |
| 4 | Check error type | InputError with validation message |

**Expected Result**:
Effect fails with `InputError { _tag: "InputError", message: "..." }`

**Postconditions**:
- No session created
- No external API calls made

---

### TC-003: OAuth Callback with Valid Code

**Priority**: P0
**Type**: Functional
**User Story**: US-002

**Preconditions**:
- OAuth flow initiated via sign-in-social
- Valid authorization code available from provider

**Test Data**:
| Variable | Value |
|----------|-------|
| code | "valid-auth-code" |
| state | "csrf-state" |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create CallbackOAuthServerParams | Params with code and state |
| 2 | Call callbackOAuthServerController | Effect returned |
| 3 | Provide layer and run | Effect executes |
| 4 | Verify response | user and session returned |

**Expected Result**:
Effect succeeds with `{ user: User, session: Session }`

**Postconditions**:
- User created or retrieved in database
- Session created with valid token
- Session cookie can be extracted from response headers

---

### TC-004: OAuth Callback with Provider Error

**Priority**: P0
**Type**: Error Handling
**User Story**: US-002

**Preconditions**:
- OAuth flow initiated
- Provider returns error in callback

**Test Data**:
| Variable | Value |
|----------|-------|
| error | "access_denied" |
| state | "csrf-state" |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create params with error field | Params indicate error |
| 2 | Call controller | Effect returned |
| 3 | Provide layer and run | Effect fails |
| 4 | Check error | ApiError with provider message |

**Expected Result**:
Effect fails with `ApiError { _tag: "ApiError", message: "...", status: 401 }`

**Postconditions**:
- No user created
- No session created

---

### TC-005: Link Social Account for Authenticated User

**Priority**: P0
**Type**: Functional
**User Story**: US-003

**Preconditions**:
- User authenticated (session cookie in headers)
- Google provider configured

**Test Data**:
| Variable | Value |
|----------|-------|
| provider | "google" |
| headers | Headers with session cookie |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create LinkSocialAccountServerParams | Params with headers |
| 2 | Call controller | Effect returned |
| 3 | Provide layer and run | Effect executes |
| 4 | Verify response | redirect URL returned |

**Expected Result**:
Effect succeeds with OAuth redirect URL for linking

**Postconditions**:
- Account linking initiated
- Awaiting OAuth callback to complete

---

### TC-006: Link Social Account without Authentication

**Priority**: P0
**Type**: Error Handling
**User Story**: US-003

**Preconditions**:
- No session cookie in headers

**Test Data**:
| Variable | Value |
|----------|-------|
| provider | "google" |
| headers | new Headers() |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create params without session | Empty headers |
| 2 | Call controller | Effect returned |
| 3 | Provide layer and run | Effect fails |
| 4 | Check error | ApiError 401 |

**Expected Result**:
Effect fails with `ApiError { _tag: "ApiError", status: 401 }`

**Postconditions**:
- No account linked
- No state changes

---

## Test Suite: Session Domain (E-002)

### TC-007: Get Session for Authenticated User

**Priority**: P0
**Type**: Functional
**User Story**: US-004

**Preconditions**:
- User signed up with valid session

**Test Data**:
| Variable | Value |
|----------|-------|
| headers | Headers with session cookie |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Sign up user and capture cookie | Session established |
| 2 | Create GetSessionServerParams with headers | Params with auth |
| 3 | Call getSessionServerController | Effect returned |
| 4 | Verify response | user and session objects |

**Expected Result**:
Effect succeeds with `{ user: User, session: Session }`

**Postconditions**:
- Session remains valid
- No state changes

---

### TC-008: Get Session without Authentication

**Priority**: P0
**Type**: Edge Case
**User Story**: US-004

**Preconditions**:
- No session cookie

**Test Data**:
| Variable | Value |
|----------|-------|
| headers | new Headers() |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create params with empty headers | No auth |
| 2 | Call controller | Effect returned |
| 3 | Run effect | Effect succeeds |
| 4 | Check result | null returned |

**Expected Result**:
Effect succeeds with `null` (no session exists)

**Postconditions**:
- No error thrown
- No state changes

---

### TC-009: List Sessions for Authenticated User

**Priority**: P0
**Type**: Functional
**User Story**: US-005

**Preconditions**:
- User with one or more sessions

**Test Data**:
| Variable | Value |
|----------|-------|
| headers | Headers with session cookie |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create session | Session exists |
| 2 | Call listSessionsServerController | Effect returned |
| 3 | Run with layer | Effect executes |
| 4 | Verify response | Array of sessions |

**Expected Result**:
Effect succeeds with `Session[]` containing current sessions

**Postconditions**:
- Sessions remain valid
- No state changes

---

### TC-010: Refresh Token for Valid Session

**Priority**: P0
**Type**: Functional
**User Story**: US-006

**Preconditions**:
- Valid session exists

**Test Data**:
| Variable | Value |
|----------|-------|
| headers | Headers with session cookie |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create params with session | Valid session |
| 2 | Call refreshTokenServerController | Effect returned |
| 3 | Run effect | Effect executes |
| 4 | Verify response | New session token |

**Expected Result**:
Effect succeeds with refreshed session data

**Postconditions**:
- Session token updated
- Previous token may be invalidated

---

### TC-011: Refresh Token for Expired Session

**Priority**: P0
**Type**: Error Handling
**User Story**: US-006

**Preconditions**:
- Session has expired

**Test Data**:
| Variable | Value |
|----------|-------|
| headers | Headers with expired cookie |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create params with expired session | Expired auth |
| 2 | Call controller | Effect returned |
| 3 | Run effect | Effect fails |
| 4 | Check error | ApiError 401 |

**Expected Result**:
Effect fails with `ApiError { status: 401 }`

**Postconditions**:
- No new session created
- Expired session remains expired

---

### TC-012: Get Access Token

**Priority**: P0
**Type**: Functional
**User Story**: US-007

**Preconditions**:
- Valid session exists

**Test Data**:
| Variable | Value |
|----------|-------|
| headers | Headers with session cookie |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create GetAccessTokenServerParams | Params with headers |
| 2 | Call controller | Effect returned |
| 3 | Run effect | Effect executes |
| 4 | Verify response | accessToken returned |

**Expected Result**:
Effect succeeds with `{ accessToken: string }`

**Postconditions**:
- Access token can be used for subsequent requests
- Session remains valid

---

### TC-013: Revoke Specific Session by ID

**Priority**: P0
**Type**: Functional
**User Story**: US-008

**Preconditions**:
- Multiple sessions exist
- Target session ID known

**Test Data**:
| Variable | Value |
|----------|-------|
| id | "session-id-to-revoke" |
| headers | Headers with session cookie |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create params with session ID | Target specified |
| 2 | Call revokeSessionServerController | Effect returned |
| 3 | Run effect | Effect executes |
| 4 | Verify response | success: true |
| 5 | Verify session removed | Session no longer in list |

**Expected Result**:
Effect succeeds with `{ success: true }`

**Postconditions**:
- Target session deleted from database
- Other sessions remain valid
- Current session may be invalidated if self-revoke

---

### TC-014: Revoke All Sessions

**Priority**: P0
**Type**: Functional
**User Story**: US-009

**Preconditions**:
- Multiple sessions exist

**Test Data**:
| Variable | Value |
|----------|-------|
| headers | Headers with session cookie |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create multiple sessions | Sessions exist |
| 2 | Call revokeSessionsServerController | Effect returned |
| 3 | Run effect | Effect executes |
| 4 | Verify response | success: true |
| 5 | Verify all revoked | All sessions invalidated |

**Expected Result**:
Effect succeeds with `{ success: true }`

**Postconditions**:
- All sessions for user deleted
- User must re-authenticate

---

### TC-015: Revoke Other Sessions (Keep Current)

**Priority**: P0
**Type**: Functional
**User Story**: US-010

**Preconditions**:
- Multiple sessions exist for user

**Test Data**:
| Variable | Value |
|----------|-------|
| headers | Headers with current session |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create 3 sessions | Multiple sessions |
| 2 | Call revokeOtherSessionsServerController | Effect returned |
| 3 | Run effect | Effect executes |
| 4 | Verify current session | Still valid |
| 5 | Verify other sessions | Revoked |

**Expected Result**:
Effect succeeds, current session preserved, others revoked

**Postconditions**:
- Current session remains valid
- Other sessions deleted

---

## Test Suite: Account Domain (E-003)

### TC-016: Get Account Info

**Priority**: P0
**Type**: Functional
**User Story**: US-011

**Preconditions**:
- User authenticated

**Test Data**:
| Variable | Value |
|----------|-------|
| headers | Headers with session cookie |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create AccountInfoServerParams | Params with headers |
| 2 | Call accountInfoServerController | Effect returned |
| 3 | Run effect | Effect executes |
| 4 | Verify response | Account info object |

**Expected Result**:
Effect succeeds with account information

**Postconditions**:
- No state changes
- Read-only operation

---

### TC-017: List User Accounts

**Priority**: P0
**Type**: Functional
**User Story**: US-012

**Preconditions**:
- User with one or more linked accounts

**Test Data**:
| Variable | Value |
|----------|-------|
| headers | Headers with session cookie |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Link OAuth provider | Account linked |
| 2 | Call listUserAccountsServerController | Effect returned |
| 3 | Run effect | Effect executes |
| 4 | Verify response | Array of accounts |

**Expected Result**:
Effect succeeds with `Account[]`

**Postconditions**:
- No state changes
- Read-only operation

---

### TC-018: Unlink Account Successfully

**Priority**: P0
**Type**: Functional
**User Story**: US-013

**Preconditions**:
- User has linked OAuth account
- User has password (can still login after unlink)

**Test Data**:
| Variable | Value |
|----------|-------|
| providerId | "github" |
| headers | Headers with session cookie |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Verify account exists | Account linked |
| 2 | Call unlinkAccountServerController | Effect returned |
| 3 | Run effect | Effect executes |
| 4 | Verify response | success: true |
| 5 | Verify unlinked | Account no longer in list |

**Expected Result**:
Effect succeeds with `{ success: true }`

**Postconditions**:
- Account record deleted
- User can no longer sign in with that provider
- User can still sign in via other methods

---

### TC-019: Unlink Nonexistent Account

**Priority**: P0
**Type**: Error Handling
**User Story**: US-013

**Preconditions**:
- Provider not linked to user

**Test Data**:
| Variable | Value |
|----------|-------|
| providerId | "nonexistent-provider" |
| headers | Headers with session cookie |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create params with invalid provider | Provider doesn't exist |
| 2 | Call controller | Effect returned |
| 3 | Run effect | Effect fails |
| 4 | Check error | ApiError 404 |

**Expected Result**:
Effect fails with `ApiError { status: 404 }`

**Postconditions**:
- No state changes
- Other accounts remain linked

---

## Test Suite: User Domain (E-004)

### TC-020: Update User Name

**Priority**: P0
**Type**: Functional
**User Story**: US-014

**Preconditions**:
- User authenticated

**Test Data**:
| Variable | Value |
|----------|-------|
| name | "New Display Name" |
| headers | Headers with session cookie |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create UpdateUserServerParams | Params with name |
| 2 | Call updateUserServerController | Effect returned |
| 3 | Run effect | Effect executes |
| 4 | Verify response | Updated user object |
| 5 | Verify name changed | user.name = "New Display Name" |

**Expected Result**:
Effect succeeds with updated user

**Postconditions**:
- User record updated in database
- Session remains valid

---

### TC-021: Update User Image

**Priority**: P0
**Type**: Functional
**User Story**: US-014

**Preconditions**:
- User authenticated

**Test Data**:
| Variable | Value |
|----------|-------|
| image | "https://example.com/avatar.png" |
| headers | Headers with session cookie |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create params with image URL | Valid image URL |
| 2 | Call controller | Effect returned |
| 3 | Run effect | Effect executes |
| 4 | Verify response | Updated user |
| 5 | Verify image | user.image matches |

**Expected Result**:
Effect succeeds with updated user image

**Postconditions**:
- User image field updated
- Previous image URL replaced

---

### TC-022: Update User with Invalid Name

**Priority**: P1
**Type**: Edge Case
**User Story**: US-014

**Preconditions**:
- User authenticated

**Test Data**:
| Variable | Value |
|----------|-------|
| name | "" (empty string) |
| headers | Headers with session cookie |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create params with empty name | Invalid name |
| 2 | Call controller | Effect returned |
| 3 | Run effect | Effect fails or rejects |
| 4 | Check error | InputError or ApiError |

**Expected Result**:
Effect fails with validation error

**Postconditions**:
- User name unchanged
- Session remains valid

---

### TC-023: Delete User with Valid Password

**Priority**: P0
**Type**: Functional
**User Story**: US-015

**Preconditions**:
- User authenticated
- User has password set

**Test Data**:
| Variable | Value |
|----------|-------|
| password | "userPassword123" |
| headers | Headers with session cookie |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create DeleteUserServerParams | Params with password |
| 2 | Call deleteUserServerController | Effect returned |
| 3 | Run effect | Effect executes |
| 4 | Verify response | success: true or token |
| 5 | Verify user state | User marked for deletion |

**Expected Result**:
Effect succeeds with deletion initiated

**Postconditions**:
- Deletion token generated (if callbackURL provided)
- Or user immediately deleted

---

### TC-024: Delete User with Wrong Password

**Priority**: P0
**Type**: Error Handling
**User Story**: US-015

**Preconditions**:
- User authenticated

**Test Data**:
| Variable | Value |
|----------|-------|
| password | "wrongPassword" |
| headers | Headers with session cookie |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create params with wrong password | Invalid credentials |
| 2 | Call controller | Effect returned |
| 3 | Run effect | Effect fails |
| 4 | Check error | ApiError 401 |

**Expected Result**:
Effect fails with `ApiError { status: 401 }`

**Postconditions**:
- User account unchanged
- Session remains valid

---

### TC-025: Delete User Callback with Valid Token

**Priority**: P0
**Type**: Functional
**User Story**: US-016

**Preconditions**:
- Delete initiated, token received

**Test Data**:
| Variable | Value |
|----------|-------|
| token | "valid-delete-token" |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Initiate delete, capture token | Token received |
| 2 | Call deleteUserCallbackServerController | Effect returned |
| 3 | Run effect | Effect executes |
| 4 | Verify response | success: true |
| 5 | Verify user deleted | User no longer exists |

**Expected Result**:
Effect succeeds with `{ success: true }`, user permanently deleted

**Postconditions**:
- User record deleted
- All user sessions invalidated
- All linked accounts removed

---

### TC-026: Delete User Callback with Invalid Token

**Priority**: P0
**Type**: Error Handling
**User Story**: US-016

**Preconditions**:
- Invalid or expired token

**Test Data**:
| Variable | Value |
|----------|-------|
| token | "invalid-token" |

**Steps**:
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create params with invalid token | Bad token |
| 2 | Call controller | Effect returned |
| 3 | Run effect | Effect fails |
| 4 | Check error | ApiError 400 or 404 |

**Expected Result**:
Effect fails with `ApiError { status: 400 }`

**Postconditions**:
- User account unchanged
- Token consumed (if applicable)

---

## Automation Notes

### Vitest + @effect/vitest Test Structure

```typescript
import { describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import { Layer } from "effect";
import { signInSocialServerController } from "./signInSocial.controller";
import { AuthServerTag } from "../../../server.layer";

describe("signInSocialServerController", () => {
  // Mock AuthServer layer
  const MockAuthServerLayer = Layer.succeed(AuthServerTag, {
    api: {
      signInSocial: vi.fn().mockResolvedValue({ url: "https://github.com/...", redirect: false }),
    },
  } as unknown as AuthServer);

  it.effect("TC-001: should return redirect URL for valid provider", () =>
    Effect.gen(function*() {
      const result = yield* signInSocialServerController({
        _tag: "SignInSocialServerParams",
        body: {
          _tag: "SignInSocialCommand",
          provider: "github",
          disableRedirect: true,
        },
      });

      expect(result.url).toBeDefined();
      expect(result.redirect).toBe(false);
    }).pipe(Effect.provide(MockAuthServerLayer)));

  it.effect("TC-002: should fail with InputError for missing provider", () =>
    Effect.gen(function*() {
      const result = yield* signInSocialServerController({
        _tag: "SignInSocialServerParams",
        body: {
          _tag: "SignInSocialCommand",
          // Missing required 'provider' field
        } as any,
      }).pipe(Effect.either);

      expect(result._tag).toBe("Left");
      if (result._tag === "Left") {
        expect(result.left._tag).toBe("InputError");
      }
    }).pipe(Effect.provide(MockAuthServerLayer)));
});
```

### Integration Test Pattern

```typescript
import { describe, expect, it, beforeAll, afterAll } from "@effect/vitest";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";

describe("OAuth Integration", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("TC-007: should get session for authenticated user", () =>
    Effect.gen(function*() {
      // Sign up to create session
      const signUpRes = yield* Effect.tryPromise(() =>
        env.authServer.api.signUpEmail({
          body: { email: "test@example.com", password: "pass123", name: "Test" },
          asResponse: true,
        })
      );

      const cookie = signUpRes.headers.get("set-cookie");
      const headers = new Headers();
      if (cookie) headers.append("cookie", cookie);

      // Get session
      const result = yield* getSessionServerController({
        _tag: "GetSessionServerParams",
        body: { _tag: "GetSessionCommand" },
        headers,
      });

      expect(result).not.toBeNull();
      expect(result?.user?.email).toBe("test@example.com");
    }).pipe(Effect.provide(env.layer)));
});
```

---

## Test Case Index

| ID | Title | Priority | Type | User Story | Status |
|----|-------|----------|------|------------|--------|
| TC-001 | Sign-In Social with Valid Provider | P0 | Functional | US-001 | ⬜ Ready |
| TC-002 | Sign-In Social with Missing Provider | P0 | Error | US-001 | ⬜ Ready |
| TC-003 | OAuth Callback with Valid Code | P0 | Functional | US-002 | ⬜ Ready |
| TC-004 | OAuth Callback with Provider Error | P0 | Error | US-002 | ⬜ Ready |
| TC-005 | Link Social Account for Authenticated User | P0 | Functional | US-003 | ⬜ Ready |
| TC-006 | Link Social Account without Authentication | P0 | Error | US-003 | ⬜ Ready |
| TC-007 | Get Session for Authenticated User | P0 | Functional | US-004 | ⬜ Ready |
| TC-008 | Get Session without Authentication | P0 | Edge Case | US-004 | ⬜ Ready |
| TC-009 | List Sessions for Authenticated User | P0 | Functional | US-005 | ⬜ Ready |
| TC-010 | Refresh Token for Valid Session | P0 | Functional | US-006 | ⬜ Ready |
| TC-011 | Refresh Token for Expired Session | P0 | Error | US-006 | ⬜ Ready |
| TC-012 | Get Access Token | P0 | Functional | US-007 | ⬜ Ready |
| TC-013 | Revoke Specific Session by ID | P0 | Functional | US-008 | ⬜ Ready |
| TC-014 | Revoke All Sessions | P0 | Functional | US-009 | ⬜ Ready |
| TC-015 | Revoke Other Sessions (Keep Current) | P0 | Functional | US-010 | ⬜ Ready |
| TC-016 | Get Account Info | P0 | Functional | US-011 | ⬜ Ready |
| TC-017 | List User Accounts | P0 | Functional | US-012 | ⬜ Ready |
| TC-018 | Unlink Account Successfully | P0 | Functional | US-013 | ⬜ Ready |
| TC-019 | Unlink Nonexistent Account | P0 | Error | US-013 | ⬜ Ready |
| TC-020 | Update User Name | P0 | Functional | US-014 | ⬜ Ready |
| TC-021 | Update User Image | P0 | Functional | US-014 | ⬜ Ready |
| TC-022 | Update User with Invalid Name | P1 | Edge Case | US-014 | ⬜ Ready |
| TC-023 | Delete User with Valid Password | P0 | Functional | US-015 | ⬜ Ready |
| TC-024 | Delete User with Wrong Password | P0 | Error | US-015 | ⬜ Ready |
| TC-025 | Delete User Callback with Valid Token | P0 | Functional | US-016 | ⬜ Ready |
| TC-026 | Delete User Callback with Invalid Token | P0 | Error | US-016 | ⬜ Ready |

---

## Coverage Matrix

| Requirement | Test Cases | Status |
|-------------|------------|--------|
| FR-001 (OAuth Operations) | TC-001, TC-002, TC-003, TC-004, TC-005, TC-006 | ✅ Covered |
| FR-002 (Session Operations) | TC-007, TC-008, TC-009, TC-010, TC-011, TC-012, TC-013, TC-014, TC-015 | ✅ Covered |
| FR-003 (Account Operations) | TC-016, TC-017, TC-018, TC-019 | ✅ Covered |
| FR-004 (User Operations) | TC-020, TC-021, TC-022, TC-023, TC-024, TC-025, TC-026 | ✅ Covered |
| FR-005 (Controller-Service Pattern) | All TC-* | ✅ Covered |
| FR-006 (Typed Effect Returns) | All TC-* | ✅ Covered |
| FR-007 (Headers Support) | TC-001, TC-005, TC-007 | ✅ Covered |
| NFR-002 (80% Coverage) | All TC-* | ⏳ Pending |
