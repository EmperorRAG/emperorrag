# Reset Password Module

## Overview

The reset password module provides a functional, type-safe wrapper around Better Auth's `resetPassword` API. It follows Effect-TS patterns for composition, provides structured error handling via discriminated unions, and automatically synchronizes types with Better Auth's plugin system through type extraction.

## Architecture

### Type System

#### ResetPasswordInput<T>

Generic type that extracts the input structure from Better Auth's `resetPassword` method using `Parameters` utility type.

**Why Type Extraction?**

- **Plugin Awareness**: Automatically includes fields added by Better Auth plugins
- **API Synchronization**: Type changes in Better Auth immediately reflect in our types
- **Zero Maintenance**: No manual type updates needed when Better Auth evolves

**Implementation:** See [resetPassword.types.ts](./resetPassword.types.ts)

**Extracted Fields:** newPassword (string), token (string, optional), callbackURL (string, optional), fetchOptions (object with callbacks, optional)

#### ResetPasswordResult<T>

Generic type that extracts the Promise-wrapped result from Better Auth's `resetPassword` method using `ReturnType` utility type.

**Implementation:** See [resetPassword.types.ts](./resetPassword.types.ts)

**Typical Structure:** Promise resolving to object with success status and optional message field.

#### resetPasswordProps<T>

Interface defining the curried service function signature: deps → input → Effect.

**Implementation:** See [resetPassword.types.ts](./resetPassword.types.ts)

**Currying Stages:**

1. **Stage 1 (Dependencies)**: Inject Better Auth client
2. **Stage 2 (Input)**: Provide new password, optional token, and optional parameters
3. **Result**: Lazy Effect with typed error channel

### Validation Layer

#### resetPasswordInputSchema

Zod schema providing runtime validation for reset password input.

**Implementation:** See [resetPassword.schema.ts](./resetPassword.schema.ts)

**Validation Rules:**

- `newPassword`: Minimum 8 characters (Better Auth may enforce additional rules)
- `token`: Optional verification token from password reset email
- `callbackURL`: Must be valid URL when provided
- `fetchOptions`: Must be object with optional function properties when provided

### Service Layer

#### resetPassword

Pure function implementing the reset password operation as an Effect. Wraps `authClient.resetPassword` with Effect.tryPromise and maps errors to EmailAuthApiError.

**Implementation:** See [resetPassword.service.ts](./resetPassword.service.ts)

## Related Modules

- [Shared Utilities](../shared/README.md) - Error types, shared types, validation schemas
- [Sign-In Email](../sign-in-email/README.md) - Email/password authentication implementation
- [Sign-Up Email](../sign-up-email/README.md) - Email/password registration implementation
- [Send Verification Email](../send-verification-email/README.md) - Email verification implementation
- [Parent Client README](../README.md) - Email client operations overview
