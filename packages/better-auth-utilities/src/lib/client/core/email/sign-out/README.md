# Sign-Out Module

## Overview

The sign-out module provides a functional, type-safe wrapper around Better Auth's `signOut` API. It follows Effect-TS patterns for composition, provides structured error handling via discriminated unions, and automatically synchronizes types with Better Auth's plugin system through type extraction.

## Architecture

### Type System

#### SignOutInput<T>

Generic type that extracts the input structure from Better Auth's `signOut` method using `Parameters` utility type.

**Why Type Extraction?**

- **Plugin Awareness**: Automatically includes fields added by Better Auth plugins
- **API Synchronization**: Type changes in Better Auth immediately reflect in our types
- **Zero Maintenance**: No manual type updates needed when Better Auth evolves

**Implementation:** See [signOut.types.ts](./signOut.types.ts)

**Extracted Fields:** callbackURL (string, optional), fetchOptions (object with callbacks, optional)

#### SignOutResult<T>

Generic type that extracts the Promise-wrapped result from Better Auth's `signOut` method using `ReturnType` utility type.

**Implementation:** See [signOut.types.ts](./signOut.types.ts)

**Typical Structure:** Promise resolving to void or object with success status.

#### signOutProps<T>

Interface defining the curried service function signature: deps → input → Effect.

**Implementation:** See [signOut.types.ts](./signOut.types.ts)

**Currying Stages:**

1. **Stage 1 (Dependencies)**: Inject Better Auth client
2. **Stage 2 (Input)**: Provide optional parameters (callbackURL, fetchOptions)
3. **Result**: Lazy Effect with typed error channel

### Validation Layer

#### signOutInputSchema

Zod schema providing runtime validation for sign-out input.

**Implementation:** See [signOut.schema.ts](./signOut.schema.ts)

**Validation Rules:**

- `callbackURL`: Must be valid URL when provided (redirect after sign-out)
- `fetchOptions`: Must be object with optional function properties when provided

### Service Layer

#### signOut

Pure function implementing the sign-out operation as an Effect. Wraps `authClient.signOut` with Effect.tryPromise and maps errors to EmailAuthApiError.

**Implementation:** See [signOut.service.ts](./signOut.service.ts)

## Related Modules

- [Shared Utilities](../shared/README.md) - Error types, shared types, validation schemas
- [Sign-In Email](../sign-in-email/README.md) - Email/password authentication implementation
- [Sign-Up Email](../sign-up-email/README.md) - Email/password registration implementation
- [Change Password](../change-password/README.md) - Password change implementation
- [Parent Client README](../README.md) - Email client operations overview
