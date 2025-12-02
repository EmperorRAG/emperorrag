# Sign-Up Email Module

## Overview

The sign-up email module provides a functional, type-safe wrapper around Better Auth's `signUp.email` API for user registration. It follows Effect-TS patterns for composition, provides structured error handling via discriminated unions, and automatically synchronizes types with Better Auth's plugin system through type extraction.

## Architecture

### Type System

#### SignUpEmailInput<T>

Generic type that extracts the registration credentials structure from Better Auth's `signUp.email` method using `Parameters` utility type.

**Implementation:** See [signUpEmail.types.ts](./signUpEmail.types.ts)

**Extracted Fields:** name (string, required), email (string, required), password (string, required), image (string URL, optional), callbackURL (string, optional), fetchOptions (object with callbacks, optional)

**Key Differences from Sign-In:**

- **name**: Required field for user display (not in sign-in)
- **image**: Optional profile image URL (not in sign-in)
- **No rememberMe**: Session duration flag only exists in sign-in

#### SignUpEmailResult<T>

Generic type that extracts the Promise-wrapped result from Better Auth's `signUp.email` method using `ReturnType` utility type.

**Implementation:** See [signUpEmail.types.ts](./signUpEmail.types.ts)

**Typical Structure:** Promise resolving to object with optional `data` (contains user with id, email, name, image, and plugin fields; session with token, expiresAt, and plugin fields) and optional `error` (contains message and status).

#### signUpEmailProps<T>

Interface defining the curried service function signature: deps → input → Effect (identical pattern to sign-in).

**Implementation:** See [signUpEmail.types.ts](./signUpEmail.types.ts)

### Validation Layer

#### signUpEmailInputSchema

Zod schema providing runtime validation for registration credentials.

**Implementation:** See [signUpEmail.schema.ts](./signUpEmail.schema.ts)

**Validation Rules:**

- `name`: Minimum 1 character, required (user display name)
- `email`: Must be valid email format (RFC 5322)
- `password`: Minimum 1 character (Better Auth enforces stronger rules)
- `image`: Must be valid URL when provided (profile picture)
- `callbackURL`: Must be valid URL when provided
- `fetchOptions`: Must be object with optional function properties when provided

**Notable Differences from Sign-In Schema:**

- **Includes name**: Required for user display
- **Includes image**: Optional profile picture URL
- **Excludes rememberMe**: Not applicable to registration

### Service Layer

#### signUpEmail

Pure function implementing the registration operation as an Effect. Wraps `authClient.signUp.email` with Effect.tryPromise and maps errors to EmailAuthApiError.

**Implementation:** See [signUpEmail.service.ts](./signUpEmail.service.ts)

## Testing

### Service Layer Tests

Service tests verify Effect-based error handling, HTTP status mapping (especially 409 for duplicate emails, 422 for weak passwords), and cause preservation.

**Test Coverage**: Successful registration returns user with name/email/image, 409 errors on duplicate email, 422 errors on weak password.

**Implementation:** Test files not yet created (planned with controller layer)

### Schema Validation Tests

Schema tests verify Zod validation rules for required name field, email format, password requirements, optional image URL, and callbackURL validation.

**Test Coverage**: Valid registration accepted with name, missing name rejected, optional image URL accepted, invalid image URL rejected.

**Implementation:** Test files not yet created (planned with controller layer)

## Related Modules

- [Shared Utilities](../shared/README.md) - Error types, shared types, validation schemas
- [Sign-In Email](../sign-in-email/README.md) - Email/password sign-in implementation
- [Parent Client README](../README.md) - Email client operations overview
