# Sign-In Email Module - Quick Reference

## Purpose

Implements email/password sign-in functionality as a functional wrapper around Better Auth's `signIn.email` API, providing type-safe inputs, Effect-based composition, and structured error handling.

## Files Overview

### `signInEmail.types.ts`

**Purpose**: Type definitions for sign-in email operation

**Key Exports**:

- `SignInEmailInput<T>` - Extracts credentials type from Better Auth client (email, password, rememberMe, callbackURL, fetchOptions)
- `SignInEmailResult<T>` - Extracts Promise-wrapped result type (contains user and session data)
- `signInEmailProps<T>` - Function signature for curried service (deps → input → Effect)

**Dependencies**: better-auth/client, client.types.ts, shared/email.error.ts, shared/email.types.ts, effect

**Status**: Complete

### `signInEmail.schema.ts`

**Purpose**: Zod validation schema for sign-in input

**Key Exports**:

- `signInEmailInputSchema` - Validates email (string.email), password (string.min(1)), rememberMe (boolean, optional), callbackURL (string.url, optional), fetchOptions (object with onSuccess/onError callbacks, optional)

**Dependencies**: zod

**Status**: Complete

### `signInEmail.service.ts`

**Purpose**: Effect-based service implementation wrapping Better Auth signIn.email API

**Key Exports**:

- `signInEmail` - Curried function (deps → input → Effect<SignInEmailResult, EmailAuthApiError>)

**Dependencies**: effect, signInEmail.types.ts, shared/email.error.ts

**Status**: Complete (ready for use, controller layer pending)

### `signInEmail.utils.ts`

**Purpose**: Utility functions for sign-in email operation

**Key Exports**: None (placeholder)

**Dependencies**: None

**Status**: Placeholder (will be populated when controller layer is implemented)

### `signInEmail.controller.ts`

**Purpose**: Controller layer with comprehensive validation

**Key Exports**: None (placeholder)

**Dependencies**: None

**Status**: Placeholder (will add dependency validation, input validation, error transformation when needed)

### `signInEmail.ts`

**Purpose**: Barrel export for sign-in email module

**Key Exports**: Re-exports all public APIs from types, schema, service, utils, controller

**Dependencies**: All module files

**Status**: Complete

## Module Status

- **Files Complete**: 3/6 (50% - types, schema, service ready; utils, controller pending)
- **Ready for Use**: Yes (service layer functional, validation optional)
- **Pending Work**: Controller layer implementation with full validation pipeline
