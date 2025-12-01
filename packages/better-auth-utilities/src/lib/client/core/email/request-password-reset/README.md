# Request Password Reset Module

## Overview

The request password reset module provides a functional, type-safe wrapper around Better Auth's `forgetPassword` API. It follows Effect-TS patterns for composition, provides structured error handling via discriminated unions, and automatically synchronizes types with Better Auth's plugin system through type extraction.

## Architecture

### Type System

#### RequestPasswordResetInput<T>

Generic type that extracts the input structure from Better Auth's `forgetPassword` method using `Parameters` utility type.

**Why Type Extraction?**

- **Plugin Awareness**: Automatically includes fields added by Better Auth plugins
- **API Synchronization**: Type changes in Better Auth immediately reflect in our types
- **Zero Maintenance**: No manual type updates needed when Better Auth evolves

**Implementation:** See [requestPasswordReset.types.ts](./requestPasswordReset.types.ts)

**Extracted Fields:** email (string), redirectTo (string, optional), callbackURL (string, optional), fetchOptions (object with callbacks, optional)

#### RequestPasswordResetResult<T>

Generic type that extracts the Promise-wrapped result from Better Auth's `forgetPassword` method using `ReturnType` utility type.

**Implementation:** See [requestPasswordReset.types.ts](./requestPasswordReset.types.ts)

**Typical Structure:** Promise resolving to object with success status and optional message field.

#### requestPasswordResetProps<T>

Interface defining the curried service function signature: deps → input → Effect.

**Implementation:** See [requestPasswordReset.types.ts](./requestPasswordReset.types.ts)

**Currying Stages:**

1. **Stage 1 (Dependencies)**: Inject Better Auth client
2. **Stage 2 (Input)**: Provide email and optional redirect parameters
3. **Result**: Lazy Effect with typed error channel

### Validation Layer

#### requestPasswordResetInputSchema

Zod schema providing runtime validation for request password reset input.

**Implementation:** See [requestPasswordReset.schema.ts](./requestPasswordReset.schema.ts)

**Validation Rules:**

- `email`: Must be valid email format (RFC 5322)
- `redirectTo`: Must be valid URL when provided (where user will land to reset password)
- `callbackURL`: Must be valid URL when provided (post-reset redirect)
- `fetchOptions`: Must be object with optional function properties when provided

### Service Layer

#### requestPasswordReset

Pure function implementing the request password reset operation as an Effect. Wraps `authClient.forgetPassword` with Effect.tryPromise and maps errors to EmailAuthApiError.

**Implementation:** See [requestPasswordReset.service.ts](./requestPasswordReset.service.ts)

## Related Modules

- [Shared Utilities](../shared/README.md) - Error types, shared types, validation schemas
- [Reset Password](../reset-password/README.md) - Password reset implementation (called after email link is clicked)
- [Sign-In Email](../sign-in-email/README.md) - Email/password authentication implementation
- [Sign-Up Email](../sign-up-email/README.md) - Email/password registration implementation
- [Send Verification Email](../send-verification-email/README.md) - Email verification implementation
- [Parent Client README](../README.md) - Email client operations overview
