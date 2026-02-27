# API Contract: Better Auth Utilities Server Operations

## Overview

- **API Name**: Better Auth Utilities Server API
- **Purpose**: Type-safe Effect-TS wrappers for Better Auth SDK server operations
- **Version**: 1.0.0
- **Authentication**: Handled by underlying Better Auth SDK

---

## Architecture

All operations follow the same contract pattern:

```typescript
type OperationController = (input: unknown) => Effect.Effect<Response, InputError | ApiError, AuthServerTag>
```

### Common Dependencies

| Tag | Type | Purpose |
|-----|------|---------|
| `AuthServerTag` | `Context.Tag<AuthServer>` | Better Auth server instance |

### Common Error Types

| Error | Tag | Fields |
|-------|-----|--------|
| `InputError` | `"InputError"` | `message: string`, `cause?: unknown` |
| `ApiError` | `"ApiError"` | `message: string`, `status?: number`, `cause?: unknown` |
| `SessionError` | `"SessionError"` | `message: string`, `cause?: unknown` |

### Common ServerParams Pattern

All operations use this wrapper structure:

```typescript
class {Operation}ServerParams extends Schema.TaggedClass<{Operation}ServerParams>()(
  "{Operation}ServerParams",
  {
    body: {Operation}Command,
    headers: Schema.optional(Schema.instanceOf(Headers)),
    asResponse: Schema.optional(Schema.Boolean),
    returnHeaders: Schema.optional(Schema.Boolean),
  },
) {}
```

---

## OAuth Domain (E-001)

### US-001: Sign-In Social Operation

**Operation**: `signInSocialServerController`

**Description**: Initiates OAuth sign-in flow with an external provider

**Command Schema** (from `SignInSocial.command.ts`):
```typescript
class SignInSocialCommand extends Schema.TaggedClass<SignInSocialCommand>()(
  "SignInSocialCommand",
  {
    provider: Schema.String,                           // Required
    callbackURL: Schema.optional(UrlSchema),           // Optional
    errorCallbackURL: Schema.optional(UrlSchema),      // Optional
    newUserCallbackURL: Schema.optional(UrlSchema),    // Optional
    disableRedirect: Schema.optional(Schema.Boolean),  // Optional
  },
) {}
```

**Request Schema**:
```typescript
interface SignInSocialServerParams {
  _tag: "SignInSocialServerParams";
  body: {
    provider: string;                    // Required
    callbackURL?: { value: string };     // UrlSchema wrapper
    errorCallbackURL?: { value: string };
    newUserCallbackURL?: { value: string };
    disableRedirect?: boolean;
  };
  headers?: Headers;
  asResponse?: boolean;
  returnHeaders?: boolean;
}
```

**Response (Success)**:
```typescript
// When disableRedirect: false (default)
{ url: string; redirect: true }

// When disableRedirect: true
{ url: string; redirect: false }
```

**Response (Error)**:
```typescript
// InputError (validation failure)
{ _tag: "InputError", message: string, cause?: unknown }

// ApiError (provider failure)
{ _tag: "ApiError", message: string, status?: number, cause?: unknown }
```

---

### US-002: OAuth Callback Operation

**Operation**: `callbackOAuthServerController`

**Description**: Handles OAuth callback from provider, exchanges code for tokens

**Command Schema** (from `CallbackOAuth.command.ts`):
```typescript
class CallbackOAuthCommand extends Schema.TaggedClass<CallbackOAuthCommand>()(
  "CallbackOAuthCommand",
  {
    state: Schema.optional(Schema.String),
    code: Schema.optional(Schema.String),
    error: Schema.optional(Schema.String),
  },
) {}
```

**Request Schema**:
```typescript
interface CallbackOAuthServerParams {
  _tag: "CallbackOAuthServerParams";
  body: {
    state?: string;   // CSRF state parameter
    code?: string;    // Authorization code from provider
    error?: string;   // Error from provider if any
  };
  headers?: Headers;
  asResponse?: boolean;
  returnHeaders?: boolean;
}
```

**Response (Success)**:
```typescript
{
  user: User;
  session: Session;
  account: Account;
}
```

---

### US-003: Link Social Account Operation

**Operation**: `linkSocialAccountServerController`

**Description**: Links an OAuth provider to existing user account

**Command Schema** (from `LinkSocialAccount.command.ts`):
```typescript
class LinkSocialAccountCommand extends Schema.TaggedClass<LinkSocialAccountCommand>()(
  "LinkSocialAccountCommand",
  {
    provider: Schema.String,
    callbackURL: Schema.optional(UrlSchema),
  },
) {}
```

**Request Schema**:
```typescript
interface LinkSocialAccountServerParams {
  _tag: "LinkSocialAccountServerParams";
  body: {
    provider: string;                    // Required
    callbackURL?: { value: string };     // UrlSchema wrapper
  };
  headers?: Headers;
  asResponse?: boolean;
  returnHeaders?: boolean;
}
```

**Response (Success)**:
```typescript
{ url: string }
```

**Error Codes**:
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `PROVIDER_NOT_CONFIGURED` | 400 | OAuth provider not enabled |
| `ACCOUNT_ALREADY_LINKED` | 409 | Provider already linked |
| `SESSION_REQUIRED` | 401 | No active session |

---

## Session Domain (E-002)

### US-004: Get Session Operation

**Operation**: `getSessionServerController`

**Description**: Retrieves the current user session

**Command Schema** (from `GetSession.command.ts`):
```typescript
class GetSessionCommand extends Schema.TaggedClass<GetSessionCommand>()(
  "GetSessionCommand",
  {},  // No body fields required
) {}
```

**Request Schema**:
```typescript
interface GetSessionServerParams {
  _tag: "GetSessionServerParams";
  body: {};  // Empty - session from headers
  headers?: Headers;
  asResponse?: boolean;
  returnHeaders?: boolean;
}
```

**Response (Success)**:
```typescript
{
  session: {
    id: string;
    userId: string;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  };
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
  };
} | null
```

---

### US-005: List Sessions Operation

**Operation**: `listSessionsServerController`

**Description**: Lists all active sessions for the current user

**Command Schema** (from `ListSessions.command.ts`):
```typescript
class ListSessionsCommand extends Schema.TaggedClass<ListSessionsCommand>()(
  "ListSessionsCommand",
  {},  // No body fields required
) {}
```

**Request Schema**:
```typescript
interface ListSessionsServerParams {
  _tag: "ListSessionsServerParams";
  body: {};
  headers?: Headers;
  asResponse?: boolean;
  returnHeaders?: boolean;
}
```

**Response (Success)**:
```typescript
Session[]
```

---

### US-006: Refresh Token Operation

**Operation**: `refreshTokenServerController`

**Description**: Refreshes session token and extends expiration

**Command Schema** (from `RefreshToken.command.ts`):
```typescript
class RefreshTokenCommand extends Schema.TaggedClass<RefreshTokenCommand>()(
  "RefreshTokenCommand",
  {},  // No body fields - uses session from headers
) {}
```

**Request Schema**:
```typescript
interface RefreshTokenServerParams {
  _tag: "RefreshTokenServerParams";
  body: {};
  headers?: Headers;
  asResponse?: boolean;
  returnHeaders?: boolean;
}
```

**Response (Success)**:
```typescript
{
  session: Session;
  accessToken: string;
  refreshToken?: string;
}
```

---

### US-007: Get Access Token Operation

**Operation**: `getAccessTokenServerController`

**Description**: Retrieves a short-lived access token for API calls

**Command Schema** (from `GetAccessToken.command.ts`):
```typescript
class GetAccessTokenCommand extends Schema.TaggedClass<GetAccessTokenCommand>()(
  "GetAccessTokenCommand",
  {},  // No body fields required
) {}
```

**Request Schema**:
```typescript
interface GetAccessTokenServerParams {
  _tag: "GetAccessTokenServerParams";
  body: {};
  headers?: Headers;
  asResponse?: boolean;
  returnHeaders?: boolean;
}
```

**Response (Success)**:
```typescript
{
  accessToken: string;
  expiresIn: number;
}
```

---

### US-008: Revoke Session Operation

**Operation**: `revokeSessionServerController`

**Description**: Revokes a specific session by token or ID

**Command Schema** (from `RevokeSession.command.ts`):
```typescript
class RevokeSessionCommand extends Schema.TaggedClass<RevokeSessionCommand>()(
  "RevokeSessionCommand",
  {
    token: Schema.optional(Schema.String),
    id: Schema.optional(Schema.String),
  },
) {}
```

**Request Schema**:
```typescript
interface RevokeSessionServerParams {
  _tag: "RevokeSessionServerParams";
  body: {
    token?: string;  // Session token to revoke
    id?: string;     // Session ID to revoke
  };
  headers?: Headers;
  asResponse?: boolean;
  returnHeaders?: boolean;
}
```

**Response (Success)**:
```typescript
{ success: true }
```

---

### US-009: Revoke All Sessions Operation

**Operation**: `revokeSessionsServerController`

**Description**: Revokes all sessions for current user

**Command Schema** (from `RevokeSessions.command.ts`):
```typescript
class RevokeSessionsCommand extends Schema.TaggedClass<RevokeSessionsCommand>()(
  "RevokeSessionsCommand",
  {},  // No body fields
) {}
```

**Request Schema**:
```typescript
interface RevokeSessionsServerParams {
  _tag: "RevokeSessionsServerParams";
  body: {};
  headers?: Headers;
  asResponse?: boolean;
  returnHeaders?: boolean;
}
```

**Response (Success)**:
```typescript
{ success: true }
```

---

### US-010: Revoke Other Sessions Operation

**Operation**: `revokeOtherSessionsServerController`

**Description**: Revokes all sessions except the current one

**Command Schema** (from `RevokeOtherSessions.command.ts`):
```typescript
class RevokeOtherSessionsCommand extends Schema.TaggedClass<RevokeOtherSessionsCommand>()(
  "RevokeOtherSessionsCommand",
  {},  // No body fields
) {}
```

**Request Schema**:
```typescript
interface RevokeOtherSessionsServerParams {
  _tag: "RevokeOtherSessionsServerParams";
  body: {};
  headers?: Headers;
  asResponse?: boolean;
  returnHeaders?: boolean;
}
```

**Response (Success)**:
```typescript
{ success: true }
```

---

## Account Domain (E-003)

### US-011: Account Info Operation

**Operation**: `accountInfoServerController`

**Description**: Retrieves linked accounts for the current user

**Command Schema** (from `AccountInfo.command.ts`):
```typescript
class AccountInfoCommand extends Schema.TaggedClass<AccountInfoCommand>()(
  "AccountInfoCommand",
  {},  // No body fields required
) {}
```

**Request Schema**:
```typescript
interface AccountInfoServerParams {
  _tag: "AccountInfoServerParams";
  body: {};
  headers?: Headers;
  asResponse?: boolean;
  returnHeaders?: boolean;
}
```

**Response (Success)**:
```typescript
Account[]
```

---

### US-012: List User Accounts Operation

**Operation**: `listUserAccountsServerController`

**Description**: Lists all linked accounts for a user

**Command Schema** (from `ListUserAccounts.command.ts`):
```typescript
class ListUserAccountsCommand extends Schema.TaggedClass<ListUserAccountsCommand>()(
  "ListUserAccountsCommand",
  {},  // No body fields - uses session from headers
) {}
```

**Request Schema**:
```typescript
interface ListUserAccountsServerParams {
  _tag: "ListUserAccountsServerParams";
  body: {};
  headers?: Headers;
  asResponse?: boolean;
  returnHeaders?: boolean;
}
```

**Response (Success)**:
```typescript
Account[]
```

---

### US-013: Unlink Account Operation

**Operation**: `unlinkAccountServerController`

**Description**: Unlinks a provider from user account

**Command Schema** (from `UnlinkAccount.command.ts`):
```typescript
class UnlinkAccountCommand extends Schema.TaggedClass<UnlinkAccountCommand>()(
  "UnlinkAccountCommand",
  {
    providerId: Schema.String,  // Required
  },
) {}
```

**Request Schema**:
```typescript
interface UnlinkAccountServerParams {
  _tag: "UnlinkAccountServerParams";
  body: {
    providerId: string;  // Provider to unlink
  };
  headers?: Headers;
  asResponse?: boolean;
  returnHeaders?: boolean;
}
```

**Response (Success)**:
```typescript
{ success: true }
```

**Error Codes**:
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `ACCOUNT_NOT_FOUND` | 404 | Linked account not found |
| `CANNOT_UNLINK_LAST` | 400 | Cannot unlink only auth method |

---

## User Domain (E-004)

### US-014: Update User Operation

**Operation**: `updateUserServerController`

**Description**: Updates user profile information

**Command Schema** (from `UpdateUser.command.ts`):
```typescript
class UpdateUserCommand extends Schema.TaggedClass<UpdateUserCommand>()(
  "UpdateUserCommand",
  {
    name: Schema.optional(NameSchema),
    image: Schema.optional(ImageSchema),
    additionalFields: Schema.optional(
      Schema.Record({ key: Schema.String, value: Schema.Unknown }),
    ),
  },
) {}
```

**Request Schema**:
```typescript
interface UpdateUserServerParams {
  _tag: "UpdateUserServerParams";
  body: {
    name?: { value: string };       // NameSchema wrapper
    image?: { value: string };      // ImageSchema wrapper
    additionalFields?: Record<string, unknown>;
  };
  headers?: Headers;
  asResponse?: boolean;
  returnHeaders?: boolean;
}
```

**Response (Success)**:
```typescript
User
```

---

### US-015: Delete User Operation

**Operation**: `deleteUserServerController`

**Description**: Deletes the current user account and all data

**Command Schema** (from `DeleteUser.command.ts`):
```typescript
class DeleteUserCommand extends Schema.TaggedClass<DeleteUserCommand>()(
  "DeleteUserCommand",
  {
    password: Schema.optional(PasswordSchema({ minLength: 1, maxLength: 100 })),
    callbackURL: Schema.optional(UrlSchema),
  },
) {}
```

**Request Schema**:
```typescript
interface DeleteUserServerParams {
  _tag: "DeleteUserServerParams";
  body: {
    password?: { value: string };    // PasswordSchema wrapper
    callbackURL?: { value: string }; // UrlSchema wrapper
  };
  headers?: Headers;
  asResponse?: boolean;
  returnHeaders?: boolean;
}
```

**Response (Success)**:
```typescript
{ success: true }
```

---

### US-016: Delete User Callback Operation

**Operation**: `deleteUserCallbackServerController`

**Description**: Handles callback after delete user verification

**Command Schema** (from `DeleteUserCallback.command.ts`):
```typescript
class DeleteUserCallbackCommand extends Schema.TaggedClass<DeleteUserCallbackCommand>()(
  "DeleteUserCallbackCommand",
  {
    token: Schema.String,  // Required
  },
) {}
```

**Request Schema**:
```typescript
interface DeleteUserCallbackServerParams {
  _tag: "DeleteUserCallbackServerParams";
  body: {
    token: string;  // Verification token - required
  };
  headers?: Headers;
  asResponse?: boolean;
  returnHeaders?: boolean;
}
```

**Response (Success)**:
```typescript
{ success: true }
```

---

## Common Response Schemas

### User

```typescript
interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Session

```typescript
interface Session {
  id: string;
  userId: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}
```

### Account

```typescript
interface Account {
  id: string;
  userId: string;
  providerId: string;
  accountId: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
  scope?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Schema validation failed (InputError) |
| `UNAUTHORIZED` | 401 | No valid session |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `PROVIDER_ERROR` | 502 | OAuth provider failure |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Traceability

| User Story | Operation | Epic |
|------------|-----------|------|
| US-001 | signInSocialServerController | E-001 |
| US-002 | callbackOAuthServerController | E-001 |
| US-003 | linkSocialAccountServerController | E-001 |
| US-004 | getSessionServerController | E-002 |
| US-005 | listSessionsServerController | E-002 |
| US-006 | refreshTokenServerController | E-002 |
| US-007 | getAccessTokenServerController | E-002 |
| US-008 | revokeSessionServerController | E-002 |
| US-009 | revokeSessionsServerController | E-002 |
| US-010 | revokeOtherSessionsServerController | E-002 |
| US-011 | accountInfoServerController | E-003 |
| US-012 | listUserAccountsServerController | E-003 |
| US-013 | unlinkAccountServerController | E-003 |
| US-014 | updateUserServerController | E-004 |
| US-015 | deleteUserServerController | E-004 |
| US-016 | deleteUserCallbackServerController | E-004 |

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-03 | Initial API contract aligned with codebase command schemas |
