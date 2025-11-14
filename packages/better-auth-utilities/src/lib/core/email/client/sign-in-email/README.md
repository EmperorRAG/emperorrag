# Sign-In Email Module

## Overview

The sign-in email module provides a functional, type-safe wrapper around Better Auth's `signIn.email` API. It follows Effect-TS patterns for composition, provides structured error handling via discriminated unions, and automatically synchronizes types with Better Auth's plugin system through type extraction.

## Architecture

### Type System

#### SignInEmailInput<T>

Generic type that extracts the credentials structure from Better Auth's `signIn.email` method using `Parameters` utility type.

**Why Type Extraction?**

- **Plugin Awareness**: Automatically includes fields added by Better Auth plugins
- **API Synchronization**: Type changes in Better Auth immediately reflect in our types
- **Zero Maintenance**: No manual type updates needed when Better Auth evolves

**Implementation:** See [signInEmail.types.ts](./signInEmail.types.ts)

**Extracted Fields:** email (string), password (string), rememberMe (boolean, optional), callbackURL (string, optional), fetchOptions (object with callbacks, optional)

#### SignInEmailResult<T>

Generic type that extracts the Promise-wrapped result from Better Auth's `signIn.email` method using `ReturnType` utility type.

**Implementation:** See [signInEmail.types.ts](./signInEmail.types.ts)

**Typical Structure:** Promise resolving to object with optional `data` (contains user and session) and optional `error` (contains message and status). User includes id, email, name, and plugin fields. Session includes token, expiresAt, and plugin fields.

#### signInEmailProps<T>

Interface defining the curried service function signature: deps → input → Effect.

**Implementation:** See [signInEmail.types.ts](./signInEmail.types.ts)

**Currying Stages:**

1. **Stage 1 (Dependencies)**: Inject Better Auth client
2. **Stage 2 (Input)**: Provide sign-in credentials
3. **Result**: Lazy Effect with typed error channel

### Validation Layer

#### signInEmailInputSchema

Zod schema providing runtime validation for sign-in credentials.

**Implementation:** See [signInEmail.schema.ts](./signInEmail.schema.ts)

**Validation Rules:**

- `email`: Must be valid email format (RFC 5322)
- `password`: Minimum 1 character (Better Auth enforces stronger rules)
- `rememberMe`: Must be boolean when provided
- `callbackURL`: Must be valid URL when provided
- `fetchOptions`: Must be object with optional function properties when provided

### Service Layer

#### signInEmail

Pure function implementing the sign-in operation as an Effect. Wraps `authClient.signIn.email` with Effect.tryPromise and maps errors to EmailAuthApiError.

**Implementation:** See [signInEmail.service.ts](./signInEmail.service.ts)

## Related Modules

- [Shared Utilities](../shared/README.md) - Error types, shared types, validation schemas
- [Sign-Up Email](../sign-up-email/README.md) - Email/password registration implementation
- [Sign-Out](../sign-out/README.md) - Sign-out implementation
- [Parent Client README](../README.md) - Email client operations overview
