# Reset Password Module - Quick Reference

## Purpose

Implements password reset functionality as a functional wrapper around Better Auth's `resetPassword` API, providing type-safe inputs, Effect-based composition, and structured error handling.

## Files Overview

### `resetPassword.types.ts`

**Purpose**: Type definitions for reset password operation

**Key Exports**:

- `ResetPasswordInput<T>` - Extracts input type from Better Auth client (newPassword, token, callbackURL, fetchOptions)
- `ResetPasswordResult<T>` - Extracts Promise-wrapped result type (contains success status and message)
- `resetPasswordProps<T>` - Function signature for curried service (deps → input → Effect)

**Dependencies**: better-auth/client, client.types.ts, shared/email.error.ts, shared/email.types.ts, effect

**Status**: Complete

### `resetPassword.schema.ts`

**Purpose**: Zod validation schema for reset password input

**Key Exports**:

- `resetPasswordInputSchema` - Validates newPassword (string.min(8)), token (string, optional), callbackURL (string.url, optional), fetchOptions (object with onSuccess/onError callbacks, optional)

**Dependencies**: zod

**Status**: Complete

### `resetPassword.service.ts`

**Purpose**: Effect-based service implementation wrapping Better Auth resetPassword API

**Key Exports**:

- `resetPassword` - Curried function (deps → input → Effect<ResetPasswordResult, EmailAuthApiError>)

**Dependencies**: effect, resetPassword.types.ts, shared/email.error.ts

**Status**: Complete (ready for use, controller layer pending)

### `resetPassword.utils.ts`

**Purpose**: Utility functions for reset password operation

**Key Exports**: None (placeholder)

**Dependencies**: None

**Status**: Placeholder (will be populated when controller layer is implemented)

### `resetPassword.controller.ts`

**Purpose**: Controller layer with comprehensive validation

**Key Exports**: None (placeholder)

**Dependencies**: None

**Status**: Placeholder (will add dependency validation, input validation, error transformation when needed)

### `resetPassword.ts`

**Purpose**: Barrel export for reset password module

**Key Exports**: Re-exports all public APIs from types, schema, service, utils, controller

**Dependencies**: All module files

**Status**: Complete

## Module Status

- **Files Complete**: 3/6 (50% - types, schema, service ready; utils, controller pending)
- **Ready for Use**: Yes (service layer functional, validation optional)
- **Pending Work**: Controller layer implementation with full validation pipeline
