# Send Verification Email Module

## Overview

The send verification email module provides a functional, type-safe wrapper around Better Auth's `sendVerificationEmail` API. It follows Effect-TS patterns for composition, provides structured error handling via discriminated unions, and automatically synchronizes types with Better Auth's plugin system through type extraction.

## Architecture

### Type System

#### SendVerificationEmailInput<T>

Generic type that extracts the input structure from Better Auth's `sendVerificationEmail` method using `Parameters` utility type.

**Why Type Extraction?**

- **Plugin Awareness**: Automatically includes fields added by Better Auth plugins
- **API Synchronization**: Type changes in Better Auth immediately reflect in our types
- **Zero Maintenance**: No manual type updates needed when Better Auth evolves

**Implementation:** See [sendVerificationEmail.types.ts](./sendVerificationEmail.types.ts)

**Extracted Fields:** email (string), callbackURL (string, optional), fetchOptions (object with callbacks, optional)

#### SendVerificationEmailResult<T>

Generic type that extracts the Promise-wrapped result from Better Auth's `sendVerificationEmail` method using `ReturnType` utility type.

**Implementation:** See [sendVerificationEmail.types.ts](./sendVerificationEmail.types.ts)

**Typical Structure:** Promise resolving to object with success status and optional message field.

#### sendVerificationEmailProps<T>

Interface defining the curried service function signature: deps → input → Effect.

**Implementation:** See [sendVerificationEmail.types.ts](./sendVerificationEmail.types.ts)

**Currying Stages:**

1. **Stage 1 (Dependencies)**: Inject Better Auth client
2. **Stage 2 (Input)**: Provide email and optional parameters
3. **Result**: Lazy Effect with typed error channel

### Validation Layer

#### sendVerificationEmailInputSchema

Zod schema providing runtime validation for send verification email input.

**Implementation:** See [sendVerificationEmail.schema.ts](./sendVerificationEmail.schema.ts)

**Validation Rules:**

- `email`: Must be valid email format (RFC 5322)
- `callbackURL`: Must be valid URL when provided
- `fetchOptions`: Must be object with optional function properties when provided

### Service Layer

#### sendVerificationEmail

Pure function implementing the send verification operation as an Effect. Wraps `authClient.sendVerificationEmail` with Effect.tryPromise and maps errors to EmailAuthApiError.

**Implementation:** See [sendVerificationEmail.service.ts](./sendVerificationEmail.service.ts)

## Related Modules

- [Shared Utilities](../shared/README.md) - Error types, shared types, validation schemas
- [Sign-In Email](../sign-in-email/README.md) - Email/password authentication implementation
- [Sign-Up Email](../sign-up-email/README.md) - Email/password registration implementation
- [Sign-Out](../sign-out/README.md) - Sign-out implementation
- [Parent Client README](../README.md) - Email client operations overview
