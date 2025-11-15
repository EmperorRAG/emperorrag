# Shared Email Utilities Summary

## Purpose

Provides foundational types, schemas, and error definitions shared across all email authentication operations in the client module.

## Files Overview

### email.error.ts

**Purpose**: Defines discriminated union error types for email authentication operations

**Key Exports**:

- `EmailAuthDependenciesError` - Dependencies validation failures
- `EmailAuthInputError` - Input validation failures
- `EmailAuthApiError` - Better Auth API call failures (includes HTTP status)
- `EmailAuthDataMissingError` - Response data missing errors
- `EmailAuthSessionError` - Session resolution failures
- `EmailAuthError` - Union type for pattern matching

**Dependencies**: None (pure error definitions)

**Status**: Complete

### email.types.ts

**Purpose**: Defines shared dependency type used across all email operations

**Key Exports**:

- `EmailAuthClientDeps<T>` - Readonly dependency bundle with Better Auth client

**Dependencies**: better-auth/client, client.types.ts

**Status**: Complete

### email.schema.ts

**Purpose**: Zod validation schema for shared dependencies

**Key Exports**:

- `emailAuthClientDepsSchema` - Validates EmailAuthClientDeps structure

**Dependencies**: zod

**Status**: Complete

## Module Status

- **Completion**: 100% (3/3 files complete)
- **Ready for Use**: Yes
- **Pending Work**: None
