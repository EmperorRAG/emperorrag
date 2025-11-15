# Sign-Out Module - Quick Reference

## Purpose

Implements sign-out functionality as a functional wrapper around Better Auth's `signOut` API, providing type-safe inputs, Effect-based composition, and structured error handling.

## Files Overview

### `signOut.types.ts`

**Purpose**: Type definitions for sign-out operation

**Key Exports**:

- `SignOutInput<T>` - Extracts input type from Better Auth client (callbackURL, fetchOptions)
- `SignOutResult<T>` - Extracts Promise-wrapped result type (typically void or success status)
- `signOutProps<T>` - Function signature for curried service (deps → input → Effect)

**Dependencies**: better-auth/client, client.types.ts, shared/email.error.ts, shared/email.types.ts, effect

**Status**: Complete

### `signOut.schema.ts`

**Purpose**: Zod validation schema for sign-out input

**Key Exports**:

- `signOutInputSchema` - Validates callbackURL (string.url, optional), fetchOptions (object with onSuccess/onError callbacks, optional)

**Dependencies**: zod

**Status**: Complete

### `signOut.service.ts`

**Purpose**: Effect-based service implementation wrapping Better Auth signOut API

**Key Exports**:

- `signOut` - Curried function (deps → input → Effect<SignOutResult, EmailAuthApiError>)

**Dependencies**: effect, signOut.types.ts, shared/email.error.ts

**Status**: Complete (ready for use, controller layer pending)

### `signOut.utils.ts`

**Purpose**: Utility functions for sign-out operation

**Key Exports**: None (placeholder)

**Dependencies**: None

**Status**: Placeholder (will be populated when controller layer is implemented)

### `signOut.controller.ts`

**Purpose**: Controller layer with comprehensive validation

**Key Exports**: None (placeholder)

**Dependencies**: None

**Status**: Placeholder (will add dependency validation, input validation, error transformation when needed)

### `signOut.ts`

**Purpose**: Barrel export for sign-out module

**Key Exports**: Re-exports all public APIs from types, schema, service, utils, controller

**Dependencies**: All module files

**Status**: Complete

## Module Status

- **Files Complete**: 3/6 (50% - types, schema, service ready; utils, controller pending)
- **Ready for Use**: Yes (service layer functional, validation optional)
- **Pending Work**: Controller layer implementation with full validation pipeline
