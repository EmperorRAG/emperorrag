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

**Common Errors**:

- `401`: Invalid credentials
- `404`: User not found
- `429`: Rate limit exceeded

**Usage**:

```typescript
const program = signInEmail(deps)({
  email: 'user@example.com',
  password: 'password123',
  rememberMe: true
});
```

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

**Common Errors**:

- `400`: Invalid input data
- `409`: Email already registered (duplicate)
- `422`: Password too weak
- `429`: Too many registration attempts

**Usage**:

```typescript
const program = signUpEmail(deps)({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securePass123',
  image: 'https://example.com/avatar.jpg'
});
```

**Documentation**: [sign-up-email/README.md](./sign-up-email/README.md)

### Sign-Out (`sign-out/`)

**Purpose**: Terminate user session

**Input**: Empty object `{}`

**Common Errors**:

- `401`: No active session
- `500`: Session termination failed

**Usage**:

```typescript
const program = signOut(deps)({});
```

### Send Verification Email (`send-verification-email/`)

**Purpose**: Send email verification link to user

**Input Fields**:

- `email`: string (valid email format)
- `callbackURL`: string (optional - verification redirect URL)

**Common Errors**:

- `400`: Invalid email
- `404`: User not found
- `429`: Too many verification emails sent

**Usage**:

```typescript
const program = sendVerificationEmail(deps)({
  email: 'user@example.com',
  callbackURL: 'https://example.com/verify-success'
});
```

### Change Password (`change-password/`)

**Purpose**: Update password for authenticated user

**Input Fields**:

- `currentPassword`: string (existing password for verification)
- `newPassword`: string (new password to set)

**Common Errors**:

- `401`: Invalid current password
- `422`: New password too weak

**Usage**:

```typescript
const program = changePassword(deps)({
  currentPassword: 'oldPass123',
  newPassword: 'newSecurePass456'
});
```

### Request Password Reset (`request-password-reset/`)

**Purpose**: Initiate password reset flow (send reset email)

**Input Fields**:

- `email`: string (valid email format)
- `callbackURL`: string (optional - reset completion URL)

**Common Errors**:

- `404`: User not found
- `429`: Too many reset requests

**Usage**:

```typescript
const program = requestPasswordReset(deps)({
  email: 'user@example.com',
  callbackURL: 'https://example.com/reset-password'
});
```

### Reset Password (`reset-password/`)

**Purpose**: Complete password reset with token

**Input Fields**:

- `token`: string (reset token from email)
- `newPassword`: string (new password to set)

**Common Errors**:

- `400`: Invalid or expired token
- `422`: New password too weak

**Usage**:

```typescript
const program = resetPassword(deps)({
  token: 'reset-token-from-email',
  newPassword: 'newSecurePass789'
});
```

## Integration Patterns

### React Hook (Custom)

```typescript
import { useState } from 'react';
import { Effect } from 'effect';
import { signInEmail } from '@emperorrag/better-auth-utilities';
import type { EmailAuthError } from '@emperorrag/better-auth-utilities';

export function useAuth(authClient: AuthClient) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await Effect.runPromise(
        signInEmail({ authClient })({ email, password })
      );
      return result.data;
    } catch (err) {
      const error = err as EmailAuthError;
      const message = error._tag === 'EmailAuthApiError' && error.status === 401
        ? 'Invalid credentials'
        : 'Sign in failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading, error };
}
```

### NestJS Controller

```typescript
import { Controller, Post, Body, UnauthorizedException, ConflictException } from '@nestjs/common';
import { Effect } from 'effect';
import { signInEmail, signUpEmail } from '@emperorrag/better-auth-utilities';
import type { EmailAuthError } from '@emperorrag/better-auth-utilities';

@Controller('auth')
export class AuthController {
  constructor(private readonly authClient: AuthClient) {}

  @Post('sign-in')
  async signIn(@Body() body: { email: string; password: string }) {
    try {
      return await Effect.runPromise(
        signInEmail({ authClient: this.authClient })(body)
      );
    } catch (error) {
      const err = error as EmailAuthError;
      if (err._tag === 'EmailAuthApiError' && err.status === 401) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw error;
    }
  }

  @Post('sign-up')
  async signUp(@Body() body: { name: string; email: string; password: string }) {
    try {
      return await Effect.runPromise(
        signUpEmail({ authClient: this.authClient })(body)
      );
    } catch (error) {
      const err = error as EmailAuthError;
      if (err._tag === 'EmailAuthApiError' && err.status === 409) {
        throw new ConflictException('Email already registered');
      }
      throw error;
    }
  }
}
```

### Express Middleware

```typescript
import { Effect } from 'effect';
import { signInEmail, signUpEmail } from '@emperorrag/better-auth-utilities';
import type { Request, Response } from 'express';
import type { EmailAuthError } from '@emperorrag/better-auth-utilities';

export const createAuthHandlers = (authClient: AuthClient) => ({
  signIn: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const result = await Effect.runPromise(
        signInEmail({ authClient })({ email, password })
      );
      res.json(result.data);
    } catch (error) {
      const err = error as EmailAuthError;
      if (err._tag === 'EmailAuthApiError') {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  signUp: async (req: Request, res: Response) => {
    const { name, email, password, image } = req.body;

    try {
      const result = await Effect.runPromise(
        signUpEmail({ authClient })({ name, email, password, image })
      );
      res.status(201).json(result.data);
    } catch (error) {
      const err = error as EmailAuthError;
      if (err._tag === 'EmailAuthApiError') {
        const status = err.status || 500;
        res.status(status).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
});
```

### Next.js Server Action

```typescript
'use server';

import { Effect } from 'effect';
import { signInEmail, signUpEmail } from '@emperorrag/better-auth-utilities';
import { createAuthClient } from 'better-auth/client';
import type { EmailAuthError } from '@emperorrag/better-auth-utilities';

const authClient = createAuthClient({ baseURL: process.env.BETTER_AUTH_URL });

export async function signInAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const result = await Effect.runPromise(
      signInEmail({ authClient })({ email, password })
    );
    return { success: true, user: result.data.user };
  } catch (error) {
    const err = error as EmailAuthError;
    return {
      success: false,
      error: err._tag === 'EmailAuthApiError' && err.status === 401
        ? 'Invalid credentials'
        : 'Sign in failed'
    };
  }
}

export async function signUpAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const result = await Effect.runPromise(
      signUpEmail({ authClient })({ name, email, password })
    );
    return { success: true, user: result.data.user };
  } catch (error) {
    const err = error as EmailAuthError;
    return {
      success: false,
      error: err._tag === 'EmailAuthApiError' && err.status === 409
        ? 'Email already registered'
        : 'Sign up failed'
    };
  }
}
```

## Advanced Composition

### Sequential Operations

```typescript
const registerAndVerify = Effect.gen(function* () {
  // Step 1: Register user
  const signUpResult = yield* signUpEmail(deps)({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securePass123'
  });

  // Step 2: Send verification email
  yield* sendVerificationEmail(deps)({
    email: signUpResult.data.user.email
  });

  return signUpResult.data.user;
});
```

### Fallback Strategies

```typescript
const signInWithFallback = signInEmail(deps)({ email, password }).pipe(
  Effect.catchTag('EmailAuthApiError', (error) => {
    // If API fails, try cached credentials
    if (error.status === undefined) {
      return loadCachedSession();
    }
    return Effect.fail(error);
  })
);
```

### Retry with Backoff

```typescript
const signInWithRetry = signInEmail(deps)({ email, password }).pipe(
  Effect.retry({
    times: 3,
    schedule: Schedule.exponential('100 millis')
  }),
  Effect.retryWhile((error: EmailAuthError) =>
    // Only retry on network errors (no HTTP status)
    error._tag === 'EmailAuthApiError' && error.status === undefined
  )
);
```

### Timeout Protection

```typescript
const signInWithTimeout = signInEmail(deps)({ email, password }).pipe(
  Effect.timeout('5 seconds'),
  Effect.catchTag('TimeoutException', () =>
    Effect.fail(new EmailAuthApiError('Request timeout', undefined))
  )
);
```

### Parallel Operations

```typescript
const deleteAccountFlow = Effect.gen(function* () {
  // Run multiple operations in parallel
  const [signOutResult, deleteUserResult] = yield* Effect.all([
    signOut(deps)({}),
    deleteUser(deps)({ userId: currentUserId })
  ]);

  return { signOutResult, deleteUserResult };
});
```

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

## Design Decisions

### Why Effect-TS?

**Lazy Evaluation**: Programs are descriptions, not executions. You can build, compose, test, and transform programs without side effects until explicitly run with `Effect.runPromise`.

**Typed Errors**: Error channel carries `EmailAuthError` union. Compiler ensures exhaustive error handling via pattern matching.

**Composability**: `pipe`, `flatMap`, `map`, `tap` enable building complex flows from simple operations without callback hell or try/catch pyramids.

**Built-in Operators**: Retry, timeout, fallback, race, parallel, sequential - no need for custom implementations or libraries like `p-retry`.

### Why Type Extraction?

**Plugin Awareness**: Better Auth plugins add fields to existing types. Type extraction ensures our wrappers include plugin-added fields automatically.

**API Synchronization**: When Better Auth changes signatures (e.g., adds required field), TypeScript errors surface immediately at compile time.

**Zero Maintenance**: No manual type updates needed. Better Auth evolves, our types evolve automatically.

**Type Safety**: Compiler verifies our wrappers match Better Auth's actual API surface.

### Why Discriminated Unions?

**Exhaustive Handling**: `Match.exhaustive` forces handling of all error types. Compiler errors if any `_tag` is missing.

**Type Narrowing**: Pattern matching narrows error type automatically. Inside `Match.tag('EmailAuthApiError', ...)`, TypeScript knows `error.status` exists.

**HTTP Mapping**: `EmailAuthApiError.status` maps directly to HTTP response codes for REST APIs.

**Debugging**: `cause` property preserves original error chain, enabling full stack traces.

### Why Currying?

**Partial Application**: Configure dependencies once (`const signIn = signInEmail(deps)`), reuse everywhere with different inputs.

**Testability**: Easy to mock dependencies by passing mock objects to first stage. No complex DI containers needed.

**Composition**: Curried functions compose naturally in `pipe` and `flatMap` chains.

**Separation of Concerns**: Dependencies configured at application boundary (startup), inputs provided at call site (runtime).

## Future Enhancements

### Planned Features

- **Controller Layers**: Add validation pipelines for sign-in-email and sign-up-email
- **Telemetry**: Structured logging and metrics for all operations
- **Rate Limiting**: Client-side rate limiting to prevent excessive API calls
- **Optimistic UI**: Return success immediately, sync with API in background
- **Offline Support**: Queue operations when offline, execute when connection restored

### Potential Optimizations

- **Request Deduplication**: Cache in-flight requests to prevent duplicate API calls
- **Smart Retry**: Exponential backoff with jitter, circuit breaker patterns
- **Session Management**: Automatic token refresh, session expiry handling
- **Multi-Factor Auth**: Support for TOTP, SMS, email verification codes
- **Social Sign-In**: Integrate with OAuth providers (Google, GitHub, etc.)
