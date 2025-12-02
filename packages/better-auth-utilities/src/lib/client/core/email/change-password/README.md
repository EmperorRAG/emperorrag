# Change Password Module

## Overview

The change password module provides a functional, type-safe wrapper around Better Auth's `changePassword` API. It follows Effect-TS patterns for composition, provides structured error handling via discriminated unions, and automatically synchronizes types with Better Auth's plugin system through type extraction.

## Architecture

### Type System

#### ChangePasswordInput<T>

Generic type that extracts the input structure from Better Auth's `changePassword` method using `Parameters` utility type.

**Why Type Extraction?**

- **Plugin Awareness**: Automatically includes fields added by Better Auth plugins
- **API Synchronization**: Type changes in Better Auth immediately reflect in our types
- **Zero Maintenance**: No manual type updates needed when Better Auth evolves

**Implementation:** See [changePassword.types.ts](./changePassword.types.ts)

**Extracted Fields:** newPassword (string), currentPassword (string), revokeOtherSessions (boolean, optional), fetchOptions (object with callbacks, optional)

#### ChangePasswordResult<T>

Generic type that extracts the Promise-wrapped result from Better Auth's `changePassword` method using `ReturnType` utility type.

**Implementation:** See [changePassword.types.ts](./changePassword.types.ts)

**Typical Structure:** Promise resolving to object with success status and optional message field.

#### changePasswordProps<T>

Interface defining the curried service function signature: deps → input → Effect.

**Implementation:** See [changePassword.types.ts](./changePassword.types.ts)

**Currying Stages:**

1. **Stage 1 (Dependencies)**: Inject Better Auth client
2. **Stage 2 (Input)**: Provide current password, new password, and optional session revocation flag
3. **Result**: Lazy Effect with typed error channel

### Validation Layer

#### changePasswordInputSchema

Zod schema providing runtime validation for change password input.

**Implementation:** See [changePassword.schema.ts](./changePassword.schema.ts)

**Validation Rules:**

- `newPassword`: Minimum 8 characters (Better Auth may enforce additional rules)
- `currentPassword`: Minimum 1 character (required for authentication)
- `revokeOtherSessions`: Must be boolean when provided (logs out other devices)
- `fetchOptions`: Must be object with optional function properties when provided

### Service Layer

#### changePassword

Pure function implementing the change password operation as an Effect. Wraps `authClient.changePassword` with Effect.tryPromise and maps errors to EmailAuthApiError.

**Implementation:** See [changePassword.service.ts](./changePassword.service.ts)

## Related Modules

- [Shared Utilities](../shared/README.md) - Error types, shared types, validation schemas
- [Reset Password](../reset-password/README.md) - Password reset implementation (for forgotten passwords)
- [Request Password Reset](../request-password-reset/README.md) - Password reset request implementation
- [Sign-In Email](../sign-in-email/README.md) - Email/password authentication implementation
- [Sign-Up Email](../sign-up-email/README.md) - Email/password registration implementation
- [Parent Client README](../README.md) - Email client operations overview
