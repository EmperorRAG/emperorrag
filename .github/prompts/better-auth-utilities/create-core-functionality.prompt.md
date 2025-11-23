---
description: 'Prompt for creating core functionality in better-auth-utilities following the established email/account patterns'
---

# Create Core Better-Auth Utilities Functionality

You are tasked with implementing new core functionality for the `better-auth-utilities` package. This functionality must strictly follow the architectural patterns, type safety mechanisms, and testing strategies established in the existing `email` and `account` core modules.

## 1. Reference Implementation

The `packages/better-auth-utilities/src/lib/core/email` directory is the **Gold Standard** for structure and implementation.
Refer to the [Core Implementation Guide](file:///c%3A/Projects/emperorrag/.github/prompts/better-auth-utilities/core-implementation-guide.md) for a detailed breakdown of the patterns found in that directory.

- **Structure**: Each feature (e.g., `sign-in-email`) has its own folder containing:
    - `*.controller.ts`: HTTP/API interface layer (if applicable).
    - `*.service.ts`: The core logic wrapped in Effect-TS.
    - `*.schema.ts`: Zod schemas for validation.
    - `*.types.ts`: TypeScript definitions inferred from Better Auth.
    - `*.utils.ts`: Helper functions.
    - `*.spec.ts`: Integration tests.

## 2. Critical Requirement: Type Inference

**Do not hardcode input or output interfaces.**

You must infer types directly from the `better-auth` instance to ensure that any plugins added to the auth instance automatically update the types.
See the [Core Implementation Guide](file:///c%3A/Projects/emperorrag/.github/prompts/better-auth-utilities/core-implementation-guide.md) for the exact TypeScript patterns to use.

### Correct Pattern (Client Example)

```typescript
import type { createAuthClient } from 'better-auth/client';
import type { AuthClientFor } from '../../../../client/client.types.js';

// 1. Define the Generic
export type MyFeatureInput<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> =
	// 2. Extract the method from the generic T
	Parameters<'myMethod' extends keyof T ? (T['myMethod'] extends (...args: any) => any ? T['myMethod'] : never) : never>[0];

export type MyFeatureResult<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = ReturnType<
	'myMethod' extends keyof T ? (T['myMethod'] extends (...args: any) => any ? T['myMethod'] : never) : never
>;
```

### Incorrect Pattern (Do Not Use)

```typescript
// NEVER DO THIS
export interface MyFeatureInput {
	email: string;
	password: string;
	// This fails to account for plugins adding extra fields
}
```

## 3. Functional Programming (Effect-TS)

- Follow `fp-paradigm.instructions.md`.
- Use `Effect.tryPromise` to wrap Better Auth calls.
- Use `Effect.match` or `Effect.runPromise` in controllers/tests.
- Avoid `try/catch` blocks; let Effect handle errors.
- **Currying**: Services must be curried functions: `(deps) => (input) => Effect`. See the [Core Implementation Guide](file:///c%3A/Projects/emperorrag/.github/prompts/better-auth-utilities/core-implementation-guide.md) for the service signature pattern.

## 4. Testing Strategy

- **No Mocks**: Do not mock `better-auth` or the database.
- **Use `setupTestEnv`**: Use the provided test environment setup which spins up a real SQLite database and Better Auth instance.
- **Auth Flow**: If testing a protected route:
    1. Create a user (`signUp`).
    2. Sign in (`signIn`) to establish a session.
    3. Extract session tokens/headers.
    4. Pass headers (`Cookie`, `Authorization`, `Origin`) to the function under test.

## 5. Implementation Steps

1.  **Analyze the Better Auth SDK**: Determine the exact method name and signature on the `authClient` or `auth` (server) object.
2.  **Create Types**: Implement the inferred types in `*.types.ts` following the [Core Implementation Guide](file:///c%3A/Projects/emperorrag/.github/prompts/better-auth-utilities/core-implementation-guide.md).
3.  **Create Schema**: Define Zod schemas in `*.schema.ts` that match the inferred types.
4.  **Create Service**: Implement the logic in `*.service.ts` using Effect-TS and the curried pattern.
5.  **Create Tests**: Write integration tests in `*.spec.ts` verifying success and error paths using the real environment.

## 6. Avoid Over-Engineering

- **Keep it Simple**: Implement only what is necessary for the specific feature.
- **No Unnecessary Abstractions**: Do not create wrapper classes or complex factories unless absolutely required by the pattern.
- **Direct Usage**: Use the inferred types and Effect-TS primitives directly.
- **YAGNI**: Do not implement features or types "just in case" they are needed later. Stick to the immediate requirements of the Better Auth method being wrapped.
