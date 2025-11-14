# Change Password Module - Quick Reference

## Purpose

Implements password change functionality as a functional wrapper around Better Auth's `changePassword` API, providing type-safe inputs, Effect-based composition, and structured error handling for authenticated users updating their passwords.

## Files Overview

### `changePassword.types.ts`

**Purpose**: Type definitions for change password operation

**Key Exports**:

- `ChangePasswordInput<T>` - Extracts input type from Better Auth client (newPassword, currentPassword, revokeOtherSessions, fetchOptions)
- `ChangePasswordResult<T>` - Extracts Promise-wrapped result type (contains success status and message)
- `changePasswordProps<T>` - Function signature for curried service (deps → input → Effect)

**Dependencies**: better-auth/client, client.types.ts, shared/email.error.ts, shared/email.types.ts, effect

**Status**: Complete

### `changePassword.schema.ts`

**Purpose**: Zod validation schema for change password input

**Key Exports**:

- `changePasswordInputSchema` - Validates newPassword (string.min(8)), currentPassword (string.min(1)), revokeOtherSessions (boolean, optional), fetchOptions (object with onSuccess/onError callbacks, optional)

**Dependencies**: zod

**Status**: Complete

### `changePassword.service.ts`

**Purpose**: Effect-based service implementation wrapping Better Auth changePassword API

**Key Exports**:

- `changePassword` - Curried function (deps → input → Effect<ChangePasswordResult, EmailAuthApiError>)

**Dependencies**: effect, changePassword.types.ts, shared/email.error.ts

**Status**: Complete (ready for use, controller layer pending)

### `changePassword.utils.ts`

**Purpose**: Utility functions for change password operation

**Key Exports**: None (placeholder)

**Dependencies**: None

**Status**: Placeholder (will be populated when controller layer is implemented)

### `changePassword.controller.ts`

**Purpose**: Controller layer with comprehensive validation

**Key Exports**: None (placeholder)

**Dependencies**: None

**Status**: Placeholder (will add dependency validation, input validation, error transformation when needed)

### `changePassword.ts`

**Purpose**: Barrel export for change password module

**Key Exports**: Re-exports all public APIs from types, schema, service, utils, controller

**Dependencies**: All module files

**Status**: Complete

## Module Status

- **Files Complete**: 3/6 (50% - types, schema, service ready; utils, controller pending)
- **Ready for Use**: Yes (service layer functional, validation optional)
- **Pending Work**: Controller layer implementation with full validation pipeline
