# Contributing to Email Client Operations

This document defines universal patterns and requirements for all email authentication operations in the client module.

## Universal Code Requirements

### Type Extraction Pattern

**Required for all operations**: Extract types from Better Auth APIs instead of manual definitions.

```typescript
// ✅ Correct: Extract input from Better Auth
export type OperationInput<T> = Parameters<
  'method' extends keyof AuthClientOperationFor<T>
    ? AuthClientOperationFor<T>['method']
    : never
>[0];

// ✅ Correct: Extract result from Better Auth
export type OperationResult<T> = ReturnType<
  'method' extends keyof AuthClientOperationFor<T>
    ? AuthClientOperationFor<T>['method']
    : never
>;

// ❌ Wrong: Manual type definition
export type OperationInput = {
  email: string;
  password: string;
};
```

**Why**: Automatic synchronization with Better Auth changes and plugin additions. When Better Auth adds fields or changes signatures, our types automatically reflect those changes without code modifications.

### Curried Service Pattern

**Required for all operations**: Use multi-stage currying (dependencies → input → Effect).

```typescript
// ✅ Correct: Curried deps → input → Effect
export const operation: OperationProps = (deps) => (input) => {
  const { authClient } = deps;
  return Effect.tryPromise({
    try: () => authClient.operation.method(input),
    catch: (error) => new EmailAuthApiError(...)
  });
};

// ❌ Wrong: Single parameter (no dependency injection)
export const operation = (input: Input) => {
  return Effect.tryPromise({
    try: () => globalClient.operation.method(input),
    catch: (error) => new EmailAuthApiError(...)
  });
};

// ❌ Wrong: Non-curried multi-parameter
export const operation = (deps: Deps, input: Input) => {
  return Effect.tryPromise(...);
};
```

**Why**: Currying enables clean dependency injection at application boundaries, partial application for reuse, and easier testing with mocked dependencies.

### Effect Return Type

**Required for all operations**: Return `Effect.Effect<Success, EmailAuthError>`.

```typescript
// ✅ Correct: Effect with typed error channel
export const operation = (deps) => (input) =>
  Effect.tryPromise({
    try: () => deps.authClient.operation.method(input),
    catch: (error) => {
      const message = error instanceof Error ? error.message : 'Operation failed';
      const status = error && typeof error === 'object' && 'status' in error
        ? (error.status as number)
        : undefined;
      return new EmailAuthApiError(message, status, error);
    }
  });

// ❌ Wrong: Returning raw Promise
export const operation = async (deps, input) => {
  return await deps.authClient.operation.method(input);
};

// ❌ Wrong: Not preserving error details
catch: (error) => {
  return new EmailAuthApiError('Operation failed'); // Missing status and cause
}
```

**Why**: Effect provides lazy evaluation, composability with `pipe`/`flatMap`, typed error channels for pattern matching, and built-in retry/timeout/fallback strategies.

### Shared Dependencies

**Required for all operations**: Use `EmailAuthClientDeps<T>` from shared utilities.

```typescript
// ✅ Correct: Import shared dependency type
import type { EmailAuthClientDeps } from '../shared/email.types.js';

export interface OperationProps<T> {
  (deps: EmailAuthClientDeps<T>): (input: Input<T>) => Effect<...>;
}

// ❌ Wrong: Define operation-specific dependency type
export type OperationDeps = {
  authClient: AuthClient;
};
```

**Why**: Consistency across all operations, centralized type maintenance, easier refactoring when dependency structure changes.

### Error Handling

**Required for all operations**: Map Better Auth errors to `EmailAuthApiError`.

```typescript
// ✅ Correct: Preserve message, status, and cause
catch: (error) => {
  const message = error instanceof Error ? error.message : 'Operation failed';
  const status = error && typeof error === 'object' && 'status' in error
    ? (error.status as number)
    : undefined;
  return new EmailAuthApiError(message, status, error);
}

// ❌ Wrong: Generic error message (loses details)
catch: () => {
  return new EmailAuthApiError('Operation failed');
}

// ❌ Wrong: Not extracting status code
catch: (error) => {
  const message = error instanceof Error ? error.message : 'Failed';
  return new EmailAuthApiError(message); // Missing status parameter
}
```

**Why**: Preserving status codes enables HTTP response mapping, cause preservation aids debugging, and consistent error structure supports exhaustive pattern matching.

## Validation Patterns

### Zod Schema Structure

**Required when validation needed**: Mirror type extraction with Zod runtime validation.

```typescript
// ✅ Correct: Schema matches extracted type structure
export const operationInputSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password required'),
  optionalField: z.string().optional(),
});

// ❌ Wrong: Missing optional fields (too strict)
export const operationInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  // optionalField missing - will reject valid inputs
});

// ❌ Wrong: Incorrect validation rules
export const operationInputSchema = z.object({
  email: z.string(), // Should use .email()
  callbackURL: z.string().optional(), // Should use .url()
});
```

**Why**: Runtime validation catches invalid inputs before API calls, Zod provides type inference from schemas, and schema-based validation generates clear error messages.

### Custom Validation Messages

**Recommended**: Provide user-friendly validation messages.

```typescript
// ✅ Correct: Custom messages for better UX
export const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  image: z.string().url('Invalid image URL').optional(),
});

// ❌ Wrong: Default Zod messages (less user-friendly)
export const schema = z.object({
  name: z.string().min(1), // "String must contain at least 1 character(s)"
  email: z.string().email(), // "Invalid email"
});
```

## File Organization

### Multi-File Operations (sign-in-email, sign-up-email)

**Required structure**:

```
operation-name/
├── operationName.types.ts      # Type extractions (Input, Result, Props)
├── operationName.schema.ts     # Zod validation schemas
├── operationName.service.ts    # Effect-based service implementation
├── operationName.utils.ts      # Utility functions (optional)
├── operationName.controller.ts # Controller layer (future - validation pipeline)
├── operationName.ts            # Barrel export
├── SUMMARY.md                  # Quick reference (file inventory)
├── CONTRIBUTING.md             # Code patterns and requirements
└── README.md                   # Comprehensive guide
```

### Single-File Operations (sign-out, send-verification-email, etc.)

**Current structure**:

```
operation-name/
└── operationName.ts            # Service implementation only
```

**Future structure** (when documentation added):

```
operation-name/
├── operationName.ts            # Service implementation
├── SUMMARY.md                  # Quick reference
├── CONTRIBUTING.md             # Code patterns
└── README.md                   # Usage guide
```

## Documentation Requirements

### SUMMARY.md Structure

**Required sections**:

1. **Purpose**: One-sentence module description
2. **Files Overview**: List each file with:
   - Purpose
   - Key Exports
   - Dependencies
   - Status (Complete/Pending/Placeholder)
3. **Module Status**: Completion percentage, readiness, pending work

### CONTRIBUTING.md Structure

**Required sections**:

1. **Code Requirements**: Type patterns, service patterns, validation patterns
2. **Error Handling Strategy**: Error mapping rules, status code handling
3. **Testing Requirements**: Unit tests, integration tests, schema tests
4. **Common Mistakes**: Examples with ❌ wrong / ✅ correct patterns

### README.md Structure

**Required sections**:

1. **Overview**: Module purpose and architecture summary
2. **Architecture**: Type system, validation layer, service layer
3. **Usage**: Basic examples, advanced patterns, Effect.gen composition
4. **Error Handling**: Pattern matching, HTTP status mapping, retry strategies
5. **Integration Patterns**: React hooks, NestJS controllers, Express middleware
6. **Testing**: Service tests, schema tests, integration tests
7. **Related Modules**: Cross-references to other documentation
8. **Design Decisions**: Why specific patterns were chosen

## Testing Requirements

### Service Layer Tests

**Required tests**:

```typescript
describe('operation', () => {
  it('should return success result on valid input', async () => {
    const mockClient = { operation: { method: vi.fn().mockResolvedValue(...) } };
    const result = await Effect.runPromise(operation({ authClient: mockClient })(input));
    expect(result.data).toBeDefined();
  });

  it('should throw EmailAuthApiError on API failure', async () => {
    const mockClient = {
      operation: {
        method: vi.fn().mockRejectedValue(
          Object.assign(new Error('Failed'), { status: 400 })
        )
      }
    };
    const program = operation({ authClient: mockClient })(input);
    await expect(Effect.runPromise(program)).rejects.toThrow(EmailAuthApiError);
  });

  it('should preserve HTTP status code in error', async () => {
    const mockClient = {
      operation: {
        method: vi.fn().mockRejectedValue(
          Object.assign(new Error('Unauthorized'), { status: 401 })
        )
      }
    };
    try {
      await Effect.runPromise(operation({ authClient: mockClient })(input));
    } catch (error) {
      expect((error as EmailAuthApiError).status).toBe(401);
    }
  });
});
```

### Schema Validation Tests

**Required tests**:

```typescript
describe('operationInputSchema', () => {
  it('should accept valid input', () => {
    const result = schema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('should reject invalid required fields', () => {
    const result = schema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['fieldName']);
    }
  });

  it('should accept optional fields when provided', () => {
    const result = schema.safeParse({ ...validInput, optionalField: 'value' });
    expect(result.success).toBe(true);
  });
});
```

## Common Mistakes

### ❌ Wrong: Not using shared error types

```typescript
// Creating operation-specific errors
export class SignInError extends Error {
  constructor(message: string) {
    super(message);
  }
}
```

### ✅ Correct: Use shared EmailAuthError types

```typescript
// Reuse shared error types
import { EmailAuthApiError } from '../shared/email.error.js';

catch: (error) => {
  return new EmailAuthApiError(message, status, error);
}
```

### ❌ Wrong: Manual type definitions

```typescript
// Hardcoded types lose Better Auth sync
export type Input = {
  email: string;
  password: string;
};
```

### ✅ Correct: Extract types from Better Auth

```typescript
// Automatic sync with Better Auth changes
export type Input<T> = Parameters<AuthClientFor<T>['operation']['method']>[0];
```

### ❌ Wrong: Mixing validation and service logic

```typescript
// Service layer validating inputs
export const operation = (deps) => (input) => {
  if (!input.email) {
    return Effect.fail(new EmailAuthInputError('Email required'));
  }
  return Effect.tryPromise(...);
};
```

### ✅ Correct: Separate validation and service

```typescript
// Service layer focuses on API integration
export const operation = (deps) => (input) => {
  return Effect.tryPromise({
    try: () => deps.authClient.operation.method(input),
    catch: (error) => new EmailAuthApiError(...)
  });
};

// Controller layer handles validation (future implementation)
```

### ❌ Wrong: Promise-based APIs

```typescript
// Returning raw Promises
export const operation = async (deps, input) => {
  return await deps.authClient.operation.method(input);
};
```

### ✅ Correct: Effect-based APIs

```typescript
// Returning Effect for composability
export const operation = (deps) => (input) =>
  Effect.tryPromise({
    try: () => deps.authClient.operation.method(input),
    catch: (error) => new EmailAuthApiError(...)
  });
```

## Related Documentation

- [Shared Utilities CONTRIBUTING](./shared/CONTRIBUTING.md) - Error types, shared types, validation schemas
- [Sign-In Email CONTRIBUTING](./sign-in-email/CONTRIBUTING.md) - Sign-in specific patterns
- [Sign-Up Email CONTRIBUTING](./sign-up-email/CONTRIBUTING.md) - Sign-up specific patterns
