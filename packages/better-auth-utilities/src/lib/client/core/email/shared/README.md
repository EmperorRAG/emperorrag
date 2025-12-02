# Shared Email Utilities

## Overview

The shared email utilities folder provides foundational types, schemas, and error definitions used across all email authentication operations in the Better Auth client wrapper. This module establishes the common contracts and error handling patterns that signIn, signUp, signOut, and other email operations build upon.

## Architecture

### Error System

The email authentication module uses a discriminated union error type `EmailAuthError` with five variants, each designed for a specific failure scenario:

#### EmailAuthDependenciesError

**Purpose**: Indicates dependency validation failures
**When Thrown**: Dependencies bundle doesn't satisfy `EmailAuthClientDeps` contract
**Common Causes**:

- Missing authClient property
- Invalid authClient type (not a Better Auth client instance)
- Schema validation failure in controller layer

#### EmailAuthInputError

**Purpose**: Indicates input payload validation failures
**When Thrown**: Input doesn't satisfy operation-specific schema
**Common Causes**:

- Missing required fields (email, password, name)
- Invalid email format
- Password too short/long
- Invalid URL formats (callbackURL, image)

**Implementation:** See [email.error.ts](./email.error.ts)

**Usage:** Throw when Zod schema validation fails, passing validation error as cause.

#### EmailAuthApiError

**Purpose**: Indicates Better Auth API call failures
**When Thrown**: API request fails with error response

**Implementation:** See [email.error.ts](./email.error.ts)

**Usage:** Catch errors from Better Auth API calls in Effect.tryPromise catch block, extract status code when available.

#### EmailAuthDataMissingError

**Purpose**: Indicates expected data missing from successful API response
**When Thrown**: Response succeeds but lacks required fields
**Common Causes**:

- User payload missing from sign-up/sign-in response
- Session missing from authentication response
- Better Auth API structure changed

**Current Usage**: Not actively used in sign-in/sign-up modules (may be used in future operations)

#### EmailAuthSessionError

**Purpose**: Indicates session resolution failures
**When Thrown**: Session retrieval or validation fails
**Common Causes**:

- Invalid session token
- Expired session
- Session fetch API failure

**Current Usage**: Not actively used in sign-in/sign-up modules (may be used in session-dependent operations)

### Type System

#### EmailAuthClientDeps<T>

Generic type defining the dependency bundle structure for all email operations.

**Design Principles**:

- **Generic**: Type parameter `T` captures exact Better Auth client type with plugins
- **Readonly**: Prevents accidental mutations
- **Minimal**: Contains only `authClient` property (removed logger, telemetry, featureFlags in Phase 8 cleanup)

**Implementation:** See [email.types.ts](./email.types.ts)

**Usage Pattern:** Create readonly object with authClient property at application boundary, pass to service functions.

### Validation Layer

#### emailAuthClientDepsSchema

Zod schema validating the structure of `EmailAuthClientDeps`.

**Validation Rules**:

- `authClient` must be an object
- Uses `.passthrough()` to allow plugin-added properties
- Runtime validation cannot verify Better Auth client structure (accepts any object)

**Implementation:** See [email.schema.ts](./email.schema.ts)

**Usage:** Controller layer validates dependencies before passing to service functions.

## API Reference

### Error Classes

All error classes follow identical constructor patterns with message (string) and optional cause (unknown) parameters.

**Implementation:** See [email.error.ts](./email.error.ts)

All error classes include:

- `_tag: string` - Discriminant for pattern matching
- `name: string` - Error class name
- `message: string` - Human-readable error description
- `cause?: unknown` - Original error for debugging

**EmailAuthApiError** additionally includes:

- `status?: number` - HTTP status code (when available)

### Types

See [email.types.ts](./email.types.ts) for EmailAuthClientDeps<T> type definition. Type parameter T captures Better Auth client type with plugins, defaults to base client type.

### Schemas

See [email.schema.ts](./email.schema.ts) for emailAuthClientDepsSchema. Validates authClient property with object type using passthrough for plugin properties.

## Related Modules

- [`sign-in-email/`](../sign-in-email/README.md) - Email/password sign-in implementation
- [`sign-up-email/`](../sign-up-email/README.md) - Email/password sign-up implementation
- [`sign-out/`](../sign-out/README.md) - Sign-out implementation
- [Parent README](../README.md) - Email client operations overview
