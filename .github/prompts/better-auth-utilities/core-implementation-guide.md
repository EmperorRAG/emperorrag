# Better-Auth Utilities Core Implementation Guide

This document details the architectural patterns, type safety mechanisms, and functional programming paradigms used in the `better-auth-utilities` core modules (specifically `email` and `account`). It serves as the authoritative reference for implementing new core functionality.

## 1. Directory Structure

Each feature (e.g., `sign-in-email`, `list-accounts`) resides in its own directory under `src/lib/core/<domain>/client/` or `src/lib/core/<domain>/server/`.

**Standard File Layout:**

- `featureName.service.ts`: The core logic wrapped in Effect-TS.
- `featureName.types.ts`: TypeScript definitions inferred from Better Auth.
- `featureName.schema.ts`: Zod schemas for validation.
- `featureName.spec.ts`: Integration tests using `setupTestEnv`.
- `featureName.controller.ts`: (Optional) HTTP/API interface layer.
- `featureName.utils.ts`: (Optional) Helper functions.
- `CONTRIBUTING.md`, `README.md`, `SUMMARY.md`: Documentation files.

## 2. Type Inference Strategy (Critical)

**Goal:** Ensure types automatically adapt when Better Auth plugins add new properties to input/output objects.
**Rule:** Never hardcode interfaces for inputs or outputs. Always infer from the `better-auth` instance.

### Pattern

```typescript
import type { createAuthClient } from 'better-auth/client';
import type { AuthClientFor } from '../../../../client/client.types.js';

// 1. Define Input Type
export type FeatureInput<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> =
  Parameters<
    'methodName' extends keyof T
      ? (T['methodName'] extends (...args: any) => any ? T['methodName'] : never)
      : never
  >[0];

// 2. Define Result Type
export type FeatureResult<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> =
  ReturnType<
    'methodName' extends keyof T
      ? (T['methodName'] extends (...args: any) => any ? T['methodName'] : never)
      : never
  >;

// 3. Define Service Function Signature
export interface FeatureProps<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> {
  (deps: DomainAuthClientDeps<T>): (input: FeatureInput<T>) => Effect.Effect<Awaited<FeatureResult<T>>, DomainAuthError>;
}
```

## 3. Service Implementation (Effect-TS)

**Goal:** Wrap imperative, Promise-based Better Auth calls in pure, functional Effect-TS workflows.

### Service Implementation Pattern

1. **Currying**: Services are curried functions: `(deps) => (input) => Effect`.
2. **Error Handling**: Use `Effect.tryPromise` to catch errors and map them to domain-specific error classes (e.g., `EmailAuthApiError`).
3. **Pure**: Mark functions with `@pure`.

```typescript
import { Effect } from 'effect';
import type { FeatureProps } from './featureName.types.js';
import { DomainAuthApiError } from '../shared/domain.error.js';

export const featureName: FeatureProps = (deps) => (input) => {
  const { authClient } = deps;

  return Effect.tryPromise({
    try: () => authClient.methodName(input),
    catch: (error) => {
      const message = error instanceof Error ? error.message : 'Operation failed';
      const status = error && typeof error === 'object' && 'status' in error ? (error.status as number) : undefined;
      return new DomainAuthApiError(message, status, error);
    },
  });
};
```

## 4. Error Handling Architecture

**Goal:** Provide a discriminated union of errors for type-safe handling.

### Error Handling Architecture Pattern

Define a shared error file (e.g., `email.error.ts`) containing:

1. **Specific Error Classes**: `DomainAuthApiError`, `DomainAuthInputError`, etc.
2. **Discriminated Union**: A type alias exporting all possible errors.

```typescript
export class DomainAuthApiError extends Error {
  readonly _tag = 'DomainAuthApiError';
  constructor(message: string, public readonly status?: number, cause?: unknown) {
    super(message);
    this.name = 'DomainAuthApiError';
    this.cause = cause;
  }
}

export type DomainAuthError = DomainAuthApiError | DomainAuthInputError | ...;
```

## 5. Schema Validation

**Goal:** Validate inputs at runtime using Zod, mirroring the inferred types.

### Schema Validation Pattern

Schemas should match the expected input structure but are manually defined (since Zod cannot infer from complex TS conditional types easily).

```typescript
import { z } from 'zod';

export const featureInputSchema = z.object({
  email: z.string().email(),
  // ... other fields
  fetchOptions: z.object({ ... }).optional()
});
```

## 6. Testing Strategy

**Goal:** Integration testing with real dependencies.

### Testing Strategy Pattern

1. **Setup**: Use `setupTestEnv` to get a real `authClient` and `db`.
2. **Auth Flow**:
    - **SignUp**: Create a user.
    - **SignIn**: Establish a session.
    - **Headers**: Extract `cookie`, `authorization`, and `origin` headers.
3. **Execution**: Use `Effect.runPromise(Effect.either(...))` to run the service.
4. **Assertions**: Check `Either.isRight(result)` or `Either.isLeft(result)`.

```typescript
it('should perform action successfully', async () => {
  const { authClient } = env;
  // ... perform sign up & sign in ...

  const result = await Effect.runPromise(
    Effect.either(
      featureName({ authClient })({
        ...input,
        headers: { Cookie: ..., Authorization: ..., Origin: ... }
      })
    )
  );

  expect(Either.isRight(result)).toBeTruthy();
});
```
