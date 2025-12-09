# Email Client Operations

## Overview

The email client module provides functional, type-safe wrappers around Better Auth's email authentication APIs. Built on Effect-TS principles, these operations deliver lazy evaluation, typed error channels, automatic type synchronization with Better Auth's plugin system, and composable authentication flows.

## Architecture

### Module Organization

```plaintext
client/
├── shared/           # Foundation: Error types, shared types, validation schemas
├── sign-in-email/    # Multi-file: Email/password authentication
├── sign-up-email/    # Multi-file: Email/password registration
├── sign-out/         # Single-file: Session termination
├── send-verification-email/  # Single-file: Email verification
├── change-password/  # Single-file: Password updates
├── request-password-reset/   # Single-file: Reset requests
└── reset-password/   # Single-file: Reset completion
```

**Design Principle**: Operations start as single files. When complexity grows (validation layer, utilities, comprehensive testing), they expand to multi-file modules with dedicated documentation.

### Dependency Graph

```plaintext
All Operations
    ↓
Shared Utilities (email.error.ts, email.types.ts, email.schema.ts)
    ↓
Better Auth Client
```

**Key Point**: All operations depend on shared utilities for error types (`EmailAuthError` union) and dependency injection (`EmailAuthClientDeps<T>`). This ensures consistency and makes refactoring easier.

## Core Patterns

### Type Extraction

All operations extract types from Better Auth APIs using TypeScript utility types (`Parameters` for inputs, `ReturnType` for outputs).

**Implementation:** See [signInEmail.types.ts](./sign-in-email/signInEmail.types.ts), [signUpEmail.types.ts](./sign-up-email/signUpEmail.types.ts)

**Benefits**:

- **Plugin Awareness**: When Better Auth plugins add fields (e.g., custom user properties), types automatically include them
- **API Synchronization**: Breaking changes in Better Auth surface as TypeScript errors immediately
- **Zero Maintenance**: No manual type updates needed when Better Auth evolves
- **Type Safety**: Compiler ensures our wrappers match Better Auth's actual API

**Example**: If a Better Auth plugin adds a `phoneNumber` field to sign-up, `SignUpEmailInput<T>` automatically includes it without code changes.

### Dependency Injection via Currying

All operations follow a two-stage curried pattern: inject dependencies, then provide input, then execute Effect.

**Implementation:** See [signInEmail.service.ts](./sign-in-email/signInEmail.service.ts), [signUpEmail.service.ts](./sign-up-email/signUpEmail.service.ts)

**Benefits**:

- **Partial Application**: Create reusable operation instances with fixed dependencies
- **Testability**: Easy to mock dependencies without complex DI containers
- **Composition**: Combine operations in pipelines using `pipe` and `flatMap`
- **Separation of Concerns**: Dependencies configured once at application boundary

**Usage Example:** Configure dependencies once at app startup, create partially applied functions (signIn, signUp), reuse throughout application with different inputs.

### Effect-Based Composition

All operations return `Effect.Effect<Success, EmailAuthError>` for lazy evaluation and composition.

**Benefits**:

- **Lazy Evaluation**: Programs don't execute until explicitly run
- **Typed Errors**: Error channel carries `EmailAuthError` union for exhaustive pattern matching
- **Composability**: Use `pipe`, `flatMap`, `map`, `tap` to build complex flows
- **Built-in Operators**: Retry, timeout, fallback, race, etc. without custom implementations
- **Testability**: Mock effects without mocking modules or global state

**Usage:** Define programs with Effect.gen yielding multiple operations, execute with Effect.runPromise, compose with pipe/retry/timeout operators. See Integration Patterns section for concrete examples.

### Structured Error Handling

All operations throw errors from the `EmailAuthError` discriminated union with five variants: EmailAuthDependenciesError, EmailAuthInputError, EmailAuthApiError (includes HTTP status), EmailAuthDataMissingError, EmailAuthSessionError.

**Implementation:** See [shared/email.error.ts](./shared/email.error.ts)

**Pattern Matching:** Use Effect Match.value with Match.tag for each error type. Compiler ensures all tags handled with Match.exhaustive.

**Benefits**:

- **Exhaustive Handling**: Compiler forces handling of all error types
- **HTTP Status Mapping**: `EmailAuthApiError.status` enables REST API responses
- **Error Chain**: `cause` property preserves original errors for debugging
- **Type Safety**: Pattern matching provides type narrowing for each error variant

**Usage:** See Integration Patterns section for concrete error handling examples in React, NestJS, Express, and Next.js contexts.

## Operations Guide

### Sign-In Email (`sign-in-email/`)

**Purpose**: Email/password authentication

**Input Fields**:

- `email`: string (valid email format)
- `password`: string (minimum 1 character)
- `rememberMe`: boolean (optional - extends session duration)
- `callbackURL`: string (optional - redirect after sign-in)
- `fetchOptions`: object (optional - success/error callbacks)

**Documentation**: [sign-in-email/README.md](./sign-in-email/README.md)

### Sign-Up Email (`sign-up-email/`)

**Purpose**: Email/password registration

**Input Fields**:

- `name`: string (minimum 1 character, required)
- `email`: string (valid email format, required)
- `password`: string (minimum 1 character, required)
- `image`: string (optional - valid URL for profile picture)
- `callbackURL`: string (optional - redirect after registration)
- `fetchOptions`: object (optional - success/error callbacks)

**Documentation**: [sign-up-email/README.md](./sign-up-email/README.md)

### Sign-Out (`sign-out/`)

**Purpose**: Terminate user session

**Input**: Empty object `{}`

### Send Verification Email (`send-verification-email/`)

**Purpose**: Send email verification link to user

**Input Fields**:

- `email`: string (valid email format)
- `callbackURL`: string (optional - verification redirect URL)

### Change Password (`change-password/`)

**Purpose**: Update password for authenticated user

**Input Fields**:

- `currentPassword`: string (existing password for verification)
- `newPassword`: string (new password to set)

### Request Password Reset (`request-password-reset/`)

**Purpose**: Initiate password reset flow (send reset email)

**Input Fields**:

- `email`: string (valid email format)
- `callbackURL`: string (optional - reset completion URL)

### Reset Password (`reset-password/`)

**Purpose**: Complete password reset with token

**Input Fields**:

- `token`: string (reset token from email)
- `newPassword`: string (new password to set)

## Testing Strategies

### Service Layer Tests

Service tests verify Effect-based error handling with mocked Better Auth clients. Focus on successful operations returning expected data and error scenarios throwing appropriate EmailAuthApiError instances with correct HTTP status codes.

**Implementation:** See individual module test files (not yet created - planned with controller layer)

### Integration Tests

Integration tests verify end-to-end authentication flows across multiple operations (sign-up, verification, sign-in) using real or test Better Auth client instances. Ensure session tokens are created and data propagates correctly between operations.

**Implementation:** See E2E test suites (not yet created - planned with controller layer)

## Related Documentation

- [Shared Utilities](./shared/README.md) - Error system, shared types, validation schemas
- [Sign-In Email](./sign-in-email/README.md) - Email/password authentication
- [Sign-Up Email](./sign-up-email/README.md) - Email/password registration
- [Universal Patterns (CONTRIBUTING)](./CONTRIBUTING.md) - Code requirements for all operations
