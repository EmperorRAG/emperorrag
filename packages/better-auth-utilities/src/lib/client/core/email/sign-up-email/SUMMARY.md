# Sign-Up Email Module - Quick Reference

## Purpose

Implements email/password registration functionality as a functional wrapper around Better Auth's `signUp.email` API, providing type-safe inputs, Effect-based composition, and structured error handling.

## Files Overview

### `signUpEmail.types.ts`

**Purpose**: Type definitions for sign-up email operation

**Key Exports**:

- `SignUpEmailInput<T>` - Extracts registration credentials type from Better Auth client (name, email, password, image, callbackURL, fetchOptions)
- `SignUpEmailResult<T>` - Extracts Promise-wrapped result type (contains user and session data)
- `signUpEmailProps<T>` - Function signature for curried service (deps → input → Effect)

**Dependencies**: better-auth/client, client.types.ts, shared/email.error.ts, shared/email.types.ts, effect

**Status**: Complete

### `signUpEmail.schema.ts`

**Purpose**: Zod validation schema for sign-up input

**Key Exports**:

- `signUpEmailInputSchema` - Validates name (string.min(1)), email (string.email), password (string.min(1)), image (string.url, optional), callbackURL (string.url, optional), fetchOptions (object with onSuccess/onError callbacks, optional)

**Dependencies**: zod

**Status**: Complete

### `signUpEmail.service.ts`

**Purpose**: Effect-based service implementation wrapping Better Auth signUp.email API

**Key Exports**:

- `signUpEmail` - Curried function (deps → input → Effect<SignUpEmailResult, EmailAuthApiError>)

**Dependencies**: effect, signUpEmail.types.ts, shared/email.error.ts

**Status**: Complete (ready for use, controller layer pending)

### `signUpEmail.utils.ts`

**Purpose**: Utility functions for sign-up email operation

**Key Exports**: None (placeholder)

**Dependencies**: None

**Status**: Placeholder (will be populated when controller layer is implemented)

### `signUpEmail.controller.ts`

**Purpose**: Controller layer with comprehensive validation

**Key Exports**: None (placeholder)

**Dependencies**: None

**Status**: Placeholder (will add dependency validation, input validation, error transformation when needed)

### `signUpEmail.ts`

**Purpose**: Barrel export for sign-up email module

**Key Exports**: Re-exports all public APIs from types, schema, service, utils, controller

**Dependencies**: All module files

**Status**: Complete

## Module Status

- **Files Complete**: 3/6 (50% - types, schema, service ready; utils, controller pending)
- **Ready for Use**: Yes (service layer functional, validation optional)
- **Pending Work**: Controller layer implementation with full validation pipeline

## Key Differences from Sign-In

- **Required name field**: Sign-up requires user's display name
- **Optional image field**: Sign-up accepts optional profile image URL
- **No rememberMe field**: Sign-up doesn't include session duration flag (only sign-in has this)
- **Different error scenarios**: Sign-up may return 409 Conflict for duplicate emails
