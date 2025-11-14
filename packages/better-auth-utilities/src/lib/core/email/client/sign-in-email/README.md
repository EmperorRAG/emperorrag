# Sign-In Email Module

## Overview

The sign-in email module provides a functional, type-safe wrapper around Better Auth's `signIn.email` API. It follows Effect-TS patterns for composition, provides structured error handling via discriminated unions, and automatically synchronizes types with Better Auth's plugin system through type extraction.

## Architecture

### Type System

#### SignInEmailInput<T>

Generic type that extracts the credentials structure from Better Auth's `signIn.email` method using `Parameters` utility type.

**Why Type Extraction?**

- **Plugin Awareness**: Automatically includes fields added by Better Auth plugins
- **API Synchronization**: Type changes in Better Auth immediately reflect in our types
- **Zero Maintenance**: No manual type updates needed when Better Auth evolves

**Implementation:** See [signInEmail.types.ts](./signInEmail.types.ts)

**Extracted Fields:** email (string), password (string), rememberMe (boolean, optional), callbackURL (string, optional), fetchOptions (object with callbacks, optional)

#### SignInEmailResult<T>

Generic type that extracts the Promise-wrapped result from Better Auth's `signIn.email` method using `ReturnType` utility type.

**Implementation:** See [signInEmail.types.ts](./signInEmail.types.ts)

**Typical Structure:** Promise resolving to object with optional `data` (contains user and session) and optional `error` (contains message and status). User includes id, email, name, and plugin fields. Session includes token, expiresAt, and plugin fields.

#### signInEmailProps<T>

Interface defining the curried service function signature: deps → input → Effect.

**Implementation:** See [signInEmail.types.ts](./signInEmail.types.ts)

**Currying Stages:**

1. **Stage 1 (Dependencies)**: Inject Better Auth client
2. **Stage 2 (Input)**: Provide sign-in credentials
3. **Result**: Lazy Effect with typed error channel

### Validation Layer

#### signInEmailInputSchema

Zod schema providing runtime validation for sign-in credentials.

**Implementation:** See [signInEmail.schema.ts](./signInEmail.schema.ts)

**Validation Rules:**

- `email`: Must be valid email format (RFC 5322)
- `password`: Minimum 1 character (Better Auth enforces stronger rules)
- `rememberMe`: Must be boolean when provided
- `callbackURL`: Must be valid URL when provided
- `fetchOptions`: Must be object with optional function properties when provided

### Service Layer

#### signInEmail

Pure function implementing the sign-in operation as an Effect. Wraps `authClient.signIn.email` with Effect.tryPromise and maps errors to EmailAuthApiError.

**Implementation:** See [signInEmail.service.ts](./signInEmail.service.ts)

**Error Mapping:**

| Better Auth Error | Mapped Error | HTTP Status |
|------------------|--------------|-------------|
| Invalid credentials | `EmailAuthApiError` | 401 |
| User not found | `EmailAuthApiError` | 404 |
| Account suspended | `EmailAuthApiError` | 403 |
| Rate limit exceeded | `EmailAuthApiError` | 429 |
| Network failure | `EmailAuthApiError` | undefined |

## Usage

### Basic Sign-In

```typescript
import { Effect } from 'effect';
import { signInEmail } from './sign-in-email/signInEmail.service.js';
import { createAuthClient } from 'better-auth/client';

// Step 1: Create dependency bundle
const deps = {
  authClient: createAuthClient({ baseURL: 'http://localhost:3000' })
};

// Step 2: Create partially applied function
const signIn = signInEmail(deps);

// Step 3: Execute sign-in
const program = signIn({
  email: 'user@example.com',
  password: 'securePassword123'
});

// Step 4: Run Effect
const result = await Effect.runPromise(program);
console.log('Signed in:', result.data.user.email);
```

### Sign-In with Remember Me

```typescript
const program = signInEmail(deps)({
  email: 'user@example.com',
  password: 'securePassword123',
  rememberMe: true // Extends session duration
});
```

### Sign-In with Redirect

```typescript
const program = signInEmail(deps)({
  email: 'user@example.com',
  password: 'securePassword123',
  callbackURL: 'https://example.com/dashboard'
});
```

### Sign-In with Effect.gen

```typescript
const program = Effect.gen(function* () {
  // Sign in user
  const result = yield* signInEmail(deps)({
    email: 'user@example.com',
    password: 'securePassword123'
  });

  // Access user data
  const { user, session } = result.data;
  console.log(`Welcome back, ${user.email}!`);

  // Additional operations
  yield* trackSignInEvent({ userId: user.id });
  yield* fetchUserPreferences({ userId: user.id });

  return { user, session };
});
```

## Error Handling

### Pattern Matching with Match

```typescript
import { Effect, Match } from 'effect';
import type { EmailAuthError } from '../shared/email.error.js';

const program = signInEmail(deps)({
  email: 'user@example.com',
  password: 'wrong-password'
});

Effect.runPromise(program).catch((error: EmailAuthError) => {
  const message = Match.value(error).pipe(
    Match.tag('EmailAuthApiError', (e) => {
      if (e.status === 401) return 'Invalid email or password';
      if (e.status === 403) return 'Account suspended. Contact support.';
      if (e.status === 429) return 'Too many attempts. Try again later.';
      return `Sign in failed: ${e.message}`;
    }),
    Match.tag('EmailAuthInputError', (e) =>
      `Invalid input: ${e.message}`
    ),
    Match.tag('EmailAuthDependenciesError', () =>
      'Configuration error. Contact administrator.'
    ),
    Match.orElse(() => 'Unexpected error occurred')
  );

  console.error(message);
});
```

### HTTP Status Code Mapping

```typescript
const handleSignInError = (error: EmailAuthError): string => {
  if (error._tag === 'EmailAuthApiError') {
    switch (error.status) {
      case 401:
        return 'Invalid credentials';
      case 403:
        return 'Account disabled';
      case 404:
        return 'User not found';
      case 429:
        return 'Rate limit exceeded';
      case 500:
        return 'Server error';
      default:
        return error.status
          ? `Error ${error.status}: ${error.message}`
          : 'Network error';
    }
  }
  return 'Unexpected error';
};
```

### Retry Strategy with Effect

```typescript
import { Effect, Schedule } from 'effect';

const program = signInEmail(deps)({
  email: 'user@example.com',
  password: 'password123'
}).pipe(
  // Retry up to 3 times with exponential backoff
  Effect.retry({
    times: 3,
    schedule: Schedule.exponential('100 millis')
  }),
  // Only retry on network errors (status undefined)
  Effect.retryWhile((error: EmailAuthError) =>
    error._tag === 'EmailAuthApiError' && error.status === undefined
  )
);
```

## Integration Patterns

### With React Hook

```typescript
import { useState } from 'react';
import { Effect } from 'effect';
import { signInEmail } from '@emperorrag/better-auth-utilities';

export function useSignIn(authClient: AuthClient) {
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
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading, error };
}
```

### With NestJS Controller

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { Effect } from 'effect';
import { signInEmail } from '@emperorrag/better-auth-utilities';

@Controller('auth')
export class AuthController {
  constructor(private readonly authClient: AuthClient) {}

  @Post('sign-in')
  async signIn(@Body() body: { email: string; password: string }) {
    const program = signInEmail({ authClient: this.authClient })(body);

    return await Effect.runPromise(program);
  }
}
```

### With Express Middleware

```typescript
import { Effect } from 'effect';
import { signInEmail } from '@emperorrag/better-auth-utilities';
import type { Request, Response } from 'express';

export const signInHandler = (authClient: AuthClient) =>
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const result = await Effect.runPromise(
        signInEmail({ authClient })({ email, password })
      );
      res.json(result.data);
    } catch (error) {
      if (error._tag === 'EmailAuthApiError') {
        const status = error.status || 500;
        res.status(status).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
```

## Testing

### Service Layer Tests

Service tests verify Effect-based error handling, HTTP status mapping, and cause preservation.

**Test Coverage**: Successful sign-in returns user data, 401 errors on invalid credentials, cause property preserved in errors.

**Implementation:** Test files not yet created (planned with controller layer)

### Schema Validation Tests

Schema tests verify Zod validation rules for email format, password requirements, optional fields, and URL validation.

**Test Coverage**: Valid credentials accepted, rememberMe flag supported, invalid email/password/callbackURL rejected with proper error paths.

**Implementation:** Test files not yet created (planned with controller layer)

## Related Modules

- [Shared Utilities](../shared/README.md) - Error types, shared types, validation schemas
- [Sign-Up Email](../sign-up-email/README.md) - Email/password registration implementation
- [Sign-Out](../sign-out/README.md) - Sign-out implementation
- [Parent Client README](../README.md) - Email client operations overview

## Design Decisions

### Why Curried Functions?

Currying enables clean dependency injection:

```typescript
// Step 1: Inject dependencies at application boundary
const signIn = signInEmail({ authClient });

// Step 2: Reuse across multiple sign-in operations
await Effect.runPromise(signIn({ email: 'user1@example.com', password: 'pass1' }));
await Effect.runPromise(signIn({ email: 'user2@example.com', password: 'pass2' }));
```

### Why Type Extraction?

Type extraction eliminates manual type maintenance. When Better Auth changes API signatures (adds required fields, removes fields, changes types), our types automatically stay synchronized because they're derived from Better Auth's actual types using TypeScript utility types.

**Implementation:** See [signInEmail.types.ts](./signInEmail.types.ts) for type extraction pattern using `Parameters` and `ReturnType`.

### Why Effect Instead of Promise?

Effect provides superior composition:

- **Lazy Evaluation**: Programs don't execute until `Effect.runPromise`
- **Typed Errors**: Error channel carries `EmailAuthError` union type
- **Composability**: `pipe`, `flatMap`, `retry`, `timeout` compose cleanly
- **Testability**: Mock effects without mocking modules

### Why Service/Controller Separation?

Separation of concerns improves testability:

- **Service Layer**: Focuses on API integration, minimal validation
- **Controller Layer (Future)**: Handles comprehensive validation, error transformation
- **Testing**: Service layer can be tested with mocked Better Auth client
- **Reusability**: Service layer can be called directly when input is pre-validated

## Future Enhancements

### Planned Features

- **Controller Layer**: Add comprehensive validation pipeline with dependency and input validation
- **Utility Functions**: Helper functions for common sign-in patterns (redirect handling, session storage)
- **Telemetry**: Structured logging and metrics for sign-in events
- **Rate Limiting**: Client-side rate limiting to prevent excessive sign-in attempts
- **Multi-Factor Authentication**: Support for MFA flows when Better Auth adds support

### Potential Optimizations

- **Caching**: Cache successful sign-ins to reduce API calls
- **Batch Operations**: Support signing in multiple accounts simultaneously
- **Progressive Enhancement**: Add optimistic UI updates before API response
