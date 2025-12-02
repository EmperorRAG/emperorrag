# Request Password Reset Module - Quick Reference

## Purpose

Implements password reset request functionality as a functional wrapper around Better Auth's `forgetPassword` API, providing type-safe inputs, Effect-based composition, and structured error handling.

## Files Overview

### `requestPasswordReset.types.ts`

**Purpose**: Type definitions for request password reset operation

**Key Exports**:

- `RequestPasswordResetInput<T>` - Extracts input type from Better Auth client (email, redirectTo, callbackURL, fetchOptions)
- `RequestPasswordResetResult<T>` - Extracts Promise-wrapped result type (contains success status and message)
- `requestPasswordResetProps<T>` - Function signature for curried service (deps → input → Effect)

**Dependencies**: better-auth/client, client.types.ts, shared/email.error.ts, shared/email.types.ts, effect

**Status**: Complete

### `requestPasswordReset.schema.ts`

**Purpose**: Zod validation schema for request password reset input

**Key Exports**:

- `requestPasswordResetInputSchema` - Validates email (string.email), redirectTo (string.url, optional), callbackURL (string.url, optional), fetchOptions (object with onSuccess/onError callbacks, optional)

**Dependencies**: zod

**Status**: Complete

### `requestPasswordReset.service.ts`

**Purpose**: Effect-based service implementation wrapping Better Auth forgetPassword API

**Key Exports**:

- `requestPasswordReset` - Curried function (deps → input → Effect<RequestPasswordResetResult, EmailAuthApiError>)

**Dependencies**: effect, requestPasswordReset.types.ts, shared/email.error.ts

**Status**: Complete (ready for use, controller layer pending)

### `requestPasswordReset.utils.ts`

**Purpose**: Utility functions for request password reset operation

**Key Exports**: None (placeholder)

**Dependencies**: None

**Status**: Placeholder (will be populated when controller layer is implemented)

### `requestPasswordReset.controller.ts`

**Purpose**: Controller layer with comprehensive validation

**Key Exports**: None (placeholder)

**Dependencies**: None

**Status**: Placeholder (will add dependency validation, input validation, error transformation when needed)

### `requestPasswordReset.ts`

**Purpose**: Barrel export for request password reset module

**Key Exports**: Re-exports all public APIs from types, schema, service, utils, controller

**Dependencies**: All module files

**Status**: Complete

## Module Status

- **Files Complete**: 3/6 (50% - types, schema, service ready; utils, controller pending)
- **Ready for Use**: Yes (service layer functional, validation optional)
- **Pending Work**: Controller layer implementation with full validation pipeline
