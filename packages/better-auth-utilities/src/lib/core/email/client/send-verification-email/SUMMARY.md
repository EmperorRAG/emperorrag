# Send Verification Email Module - Quick Reference

## Purpose

Implements email verification functionality as a functional wrapper around Better Auth's `sendVerificationEmail` API, providing type-safe inputs, Effect-based composition, and structured error handling.

## Files Overview

### `sendVerificationEmail.types.ts`

**Purpose**: Type definitions for send verification email operation

**Key Exports**:

- `SendVerificationEmailInput<T>` - Extracts input type from Better Auth client (email, callbackURL, fetchOptions)
- `SendVerificationEmailResult<T>` - Extracts Promise-wrapped result type (contains success status and message)
- `sendVerificationEmailProps<T>` - Function signature for curried service (deps → input → Effect)

**Dependencies**: better-auth/client, client.types.ts, shared/email.error.ts, shared/email.types.ts, effect

**Status**: Complete

### `sendVerificationEmail.schema.ts`

**Purpose**: Zod validation schema for send verification email input

**Key Exports**:

- `sendVerificationEmailInputSchema` - Validates email (string.email), callbackURL (string.url, optional), fetchOptions (object with onSuccess/onError callbacks, optional)

**Dependencies**: zod

**Status**: Complete

### `sendVerificationEmail.service.ts`

**Purpose**: Effect-based service implementation wrapping Better Auth sendVerificationEmail API

**Key Exports**:

- `sendVerificationEmail` - Curried function (deps → input → Effect<SendVerificationEmailResult, EmailAuthApiError>)

**Dependencies**: effect, sendVerificationEmail.types.ts, shared/email.error.ts

**Status**: Complete (ready for use, controller layer pending)

### `sendVerificationEmail.utils.ts`

**Purpose**: Utility functions for send verification email operation

**Key Exports**: None (placeholder)

**Dependencies**: None

**Status**: Placeholder (will be populated when controller layer is implemented)

### `sendVerificationEmail.controller.ts`

**Purpose**: Controller layer with comprehensive validation

**Key Exports**: None (placeholder)

**Dependencies**: None

**Status**: Placeholder (will add dependency validation, input validation, error transformation when needed)

### `sendVerificationEmail.ts`

**Purpose**: Barrel export for send verification email module

**Key Exports**: Re-exports all public APIs from types, schema, service, utils, controller

**Dependencies**: All module files

**Status**: Complete

## Module Status

- **Files Complete**: 3/6 (50% - types, schema, service ready; utils, controller pending)
- **Ready for Use**: Yes (service layer functional, validation optional)
- **Pending Work**: Controller layer implementation with full validation pipeline
