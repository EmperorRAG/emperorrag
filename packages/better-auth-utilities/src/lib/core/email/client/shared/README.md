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

**Example:**

```typescript
const result = emailAuthClientDepsSchema.safeParse(deps);
if (!result.success) {
  throw new EmailAuthDependenciesError(
    'Invalid dependencies',
    result.error
  );
}
```

#### EmailAuthInputError

**Purpose**: Indicates input payload validation failures
**When Thrown**: Input doesn't satisfy operation-specific schema
**Common Causes**:

- Missing required fields (email, password, name)
- Invalid email format
- Password too short/long
- Invalid URL formats (callbackURL, image)

**Example:**

```typescript
const result = signUpEmailInputSchema.safeParse(input);
if (!result.success) {
  throw new EmailAuthInputError(
    'Invalid sign-up input',
    result.error
  );
}
```

#### EmailAuthApiError

**Purpose**: Indicates Better Auth API call failures
**When Thrown**: API request fails with error response
**HTTP Status Codes**:

- `400` - Bad Request (validation failure)
- `401` - Unauthorized (invalid credentials)
- `409` - Conflict (email already exists)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error
- `undefined` - Network failure (no response)

**Example:**

```typescript
return Effect.tryPromise({
  try: () => authClient.signUp.email(input),
  catch: (error) => {
    const message = error instanceof Error ? error.message : 'Sign up failed';
    const status = error && typeof error === 'object' && 'status' in error
      ? (error.status as number)
      : undefined;
    return new EmailAuthApiError(message, status, error);
  },
});
```

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

**Type Definition:**

```typescript
export type EmailAuthClientDeps<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = Readonly<{
  authClient: T;
}>;
```

**Usage Pattern:**

```typescript
// Define deps at application boundary
const deps: EmailAuthClientDeps<typeof authClient> = {
  authClient: myAuthClient
};

// Pass to service functions
const program = signInEmail(deps)({ email, password });
```

### Validation Layer

#### emailAuthClientDepsSchema

Zod schema validating the structure of `EmailAuthClientDeps`.

**Validation Rules**:

- `authClient` must be an object
- Uses `.passthrough()` to allow plugin-added properties
- Runtime validation cannot verify Better Auth client structure (accepts any object)

**Usage in Controllers:**

```typescript
const validateDeps = validateWithSchema(
  emailAuthClientDepsSchema,
  (message, cause) => new EmailAuthDependenciesError(message, cause)
);

const validatedDeps = yield* validateDeps(deps);
```

## Usage

### Error Handling with Match

```typescript
import { Effect, Match } from 'effect';
import type { EmailAuthError } from './shared/email.error.js';

const program = signInEmail({ authClient })({ email, password });

Effect.runPromise(program).catch((error: EmailAuthError) => {
  const message = Match.value(error).pipe(
    Match.tag('EmailAuthDependenciesError', () =>
      'Configuration error: Invalid auth client'
    ),
    Match.tag('EmailAuthInputError', (e) =>
      `Validation error: ${e.message}`
    ),
    Match.tag('EmailAuthApiError', (e) =>
      e.status === 401
        ? 'Invalid credentials'
        : `API error (${e.status}): ${e.message}`
    ),
    Match.tag('EmailAuthDataMissingError', () =>
      'Unexpected response structure'
    ),
    Match.tag('EmailAuthSessionError', () =>
      'Session error'
    ),
    Match.exhaustive
  );

  console.error(message);
});
```

### Shared Dependency Pattern

All email operations follow the same dependency injection pattern:

```typescript
// Step 1: Create dependency bundle once
const deps: EmailAuthClientDeps<typeof authClient> = {
  authClient: createAuthClient({ baseURL: '...' })
};

// Step 2: Reuse across operations
const signIn = signInEmail(deps);
const signUp = signUpEmail(deps);
const signOut = signOutEmail(deps);

// Step 3: Execute operations
await Effect.runPromise(signIn({ email, password }));
await Effect.runPromise(signUp({ name, email, password }));
await Effect.runPromise(signOut({}));
```

## API Reference

### Error Classes

All error classes follow identical constructor patterns:

```typescript
constructor(message: string, cause?: unknown)
```

All error classes include:

- `_tag: string` - Discriminant for pattern matching
- `name: string` - Error class name
- `message: string` - Human-readable error description
- `cause?: unknown` - Original error for debugging

**EmailAuthApiError** additionally includes:

- `status?: number` - HTTP status code (when available)

### Types

#### EmailAuthClientDeps<T>

```typescript
type EmailAuthClientDeps<
  T extends AuthClientFor<ReturnType<typeof createAuthClient>>
> = Readonly<{
  authClient: T;
}>;
```

**Type Parameters**:

- `T` - Better Auth client type (defaults to base client type)

### Schemas

#### emailAuthClientDepsSchema

```typescript
const emailAuthClientDepsSchema: z.ZodObject<{
  authClient: z.ZodObject<{}, "passthrough", z.ZodTypeAny>
}>
```

**Validation**: Checks for `authClient` property with object type

## Related Modules

- [`sign-in-email/`](../sign-in-email/README.md) - Email/password sign-in implementation
- [`sign-up-email/`](../sign-up-email/README.md) - Email/password sign-up implementation
- [`sign-out/`](../sign-out/README.md) - Sign-out implementation
- [Parent README](../README.md) - Email client operations overview

## Design Decisions

### Why Discriminated Union Errors?

Discriminated unions with `_tag` enable:

1. **Type-safe pattern matching**: Compiler ensures exhaustive error handling
2. **Effect-TS integration**: Works seamlessly with `Match.tag()`
3. **Clear error boundaries**: Each error type represents specific failure mode
4. **Better debugging**: `cause` property preserves error chain

### Why Readonly Dependencies?

Immutability prevents bugs:

```typescript
// Prevented by type system:
deps.authClient = newClient; // ❌ Type error

// Must create new instance:
const newDeps = { authClient: newClient }; // ✅ Safe
```

### Why Minimal Dependencies?

Phase 8 cleanup removed logger, telemetry, and feature flags because:

1. **Simplicity**: Single dependency (authClient) easier to understand
2. **Separation of concerns**: Logging/telemetry belongs in separate layer
3. **Type inference**: Simpler type parameters improve developer experience
4. **Less coupling**: Fewer dependencies = easier testing

### Why Passthrough Schema?

`.passthrough()` on `authClient` schema allows:

- Better Auth plugins to add custom fields
- Type system captures plugin fields automatically
- Runtime validation remains flexible
- No manual schema updates when plugins added

## Future Considerations

### EmailAuthDataMissingError Usage

Currently unused but reserved for:

- Response parsing operations
- Data transformation layers
- Optional field validation

### EmailAuthSessionError Usage

Reserved for:

- Session-dependent operations (change password, etc.)
- Token refresh flows
- Multi-factor authentication

### Potential Schema Enhancements

Consider adding:

- `emailAuthClientSchema` for full client validation
- Better Auth version compatibility checks
- Plugin detection and validation
