# Contributing to Sign-In Email Module

## Code Requirements

### Type Extraction Pattern

All type definitions follow the "extract from Better Auth" pattern to maintain synchronization with the Better Auth client API:

```typescript
// ✅ Correct: Extract input type from Better Auth API
export type SignInEmailInput<T> = Parameters<
  'email' extends keyof AuthClientSignInFor<T>
    ? AuthClientSignInFor<T>['email']
    : never
>[0];

// ✅ Correct: Extract result type from Better Auth API
export type SignInEmailResult<T> = ReturnType<
  'email' extends keyof AuthClientSignInFor<T>
    ? AuthClientSignInFor<T>['email']
    : never
>;

// ❌ Wrong: Manual type definition (loses Better Auth plugin awareness)
export type SignInEmailInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};
```

**Why**: Type extraction ensures automatic synchronization when Better Auth adds new fields (e.g., via plugins) or changes existing signatures.

### Curried Service Pattern

All service functions follow the curried dependency injection pattern:

```typescript
// ✅ Correct: Curried deps → input → Effect
export const signInEmail: signInEmailProps = (deps) => (input) => {
  return Effect.tryPromise({
    try: () => deps.authClient.signIn.email(input),
    catch: (error) => new EmailAuthApiError(...)
  });
};

// ❌ Wrong: Single-parameter function (no dependency injection)
export const signInEmail = (input: SignInEmailInput) => {
  return Effect.tryPromise({
    try: () => globalAuthClient.signIn.email(input), // Global dependency
    catch: (error) => new EmailAuthApiError(...)
  });
};

// ❌ Wrong: Non-curried multi-parameter (breaks partial application)
export const signInEmail = (
  deps: EmailAuthClientDeps,
  input: SignInEmailInput
) => {
  return Effect.tryPromise(...);
};
```

**Why**: Currying enables dependency injection at application boundary, partial application for reuse, and clean separation of concerns (deps vs input).

### Validation Schema Pattern

Validation schemas mirror the extracted input types with runtime Zod validation:

```typescript
// ✅ Correct: Schema matches SignInEmailInput structure
export const signInEmailInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
  callbackURL: z.string().url().optional(),
  fetchOptions: z.object({
    onSuccess: z.function().optional(),
    onError: z.function().optional(),
  }).optional(),
});

// ❌ Wrong: Missing optional fields (too strict)
export const signInEmailInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ❌ Wrong: Incorrect validation rules (callbackURL not validated as URL)
export const signInEmailInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  callbackURL: z.string().optional(), // Should be .url()
});
```

**Why**: Runtime validation catches invalid inputs before calling Better Auth API, providing clear error messages at the application boundary.

## Error Handling Strategy

### Service Layer Errors

Service functions only throw `EmailAuthApiError` (API call failures):

```typescript
// ✅ Correct: Map Better Auth errors to EmailAuthApiError
return Effect.tryPromise({
  try: () => authClient.signIn.email(input),
  catch: (error) => {
    const message = error instanceof Error ? error.message : 'Sign in failed';
    const status = error && typeof error === 'object' && 'status' in error
      ? (error.status as number)
      : undefined;
    return new EmailAuthApiError(message, status, error);
  },
});

// ❌ Wrong: Throwing validation errors in service layer
if (!input.email) {
  return Effect.fail(new EmailAuthInputError('Email required'));
}
return Effect.tryPromise(...);

// ❌ Wrong: Not preserving original error
catch: (error) => {
  return new EmailAuthApiError('Sign in failed'); // Missing status and cause
}
```

**Why**: Service layer focuses on API integration. Validation belongs in controller layer. Preserving `cause` and `status` enables debugging and HTTP status code mapping.

### Controller Layer Errors (Future)

Controller layer will validate dependencies and inputs, throwing appropriate error types:

```typescript
// Future controller pattern (not yet implemented):
export const signInEmailController = (deps: unknown) => (input: unknown) =>
  Effect.gen(function* () {
    // Step 1: Validate dependencies
    const validDeps = yield* validateWithSchema(
      emailAuthClientDepsSchema,
      (msg, cause) => new EmailAuthDependenciesError(msg, cause)
    )(deps);

    // Step 2: Validate input
    const validInput = yield* validateWithSchema(
      signInEmailInputSchema,
      (msg, cause) => new EmailAuthInputError(msg, cause)
    )(input);

    // Step 3: Call service
    return yield* signInEmail(validDeps)(validInput);
  });
```

**Why**: Separation of concerns (validation in controller, integration in service) makes testing easier and error types clearer.

## Testing Requirements

### Type Tests

Verify type extraction maintains Better Auth API compatibility:

```typescript
describe('SignInEmailInput', () => {
  it('should extract email field from Better Auth signIn.email API', () => {
    type Input = SignInEmailInput<typeof authClient>;
    const input: Input = {
      email: 'user@example.com',
      password: 'password123',
    };
    expect(input.email).toBe('user@example.com');
  });

  it('should include optional rememberMe field', () => {
    type Input = SignInEmailInput<typeof authClient>;
    const input: Input = {
      email: 'user@example.com',
      password: 'password123',
      rememberMe: true, // Optional field must be allowed
    };
    expect(input.rememberMe).toBe(true);
  });
});
```

### Schema Tests

Validate Zod schema accepts valid inputs and rejects invalid ones:

```typescript
describe('signInEmailInputSchema', () => {
  it('should accept valid sign-in credentials', () => {
    const result = signInEmailInputSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
      rememberMe: true,
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email format', () => {
    const result = signInEmailInputSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty password', () => {
    const result = signInEmailInputSchema.safeParse({
      email: 'user@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });

  it('should accept optional callbackURL as valid URL', () => {
    const result = signInEmailInputSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
      callbackURL: 'https://example.com/callback',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid callbackURL format', () => {
    const result = signInEmailInputSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
      callbackURL: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });
});
```

### Service Tests

Test Effect-based service with mocked Better Auth client:

```typescript
describe('signInEmail', () => {
  it('should return user and session on successful sign-in', async () => {
    const mockAuthClient = {
      signIn: {
        email: vi.fn().mockResolvedValue({
          data: {
            user: { id: '1', email: 'user@example.com' },
            session: { token: 'abc123' },
          },
        }),
      },
    };

    const result = await Effect.runPromise(
      signInEmail({ authClient: mockAuthClient })({
        email: 'user@example.com',
        password: 'password123',
      })
    );

    expect(result.data.user.email).toBe('user@example.com');
    expect(mockAuthClient.signIn.email).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    });
  });

  it('should throw EmailAuthApiError on API failure', async () => {
    const mockAuthClient = {
      signIn: {
        email: vi.fn().mockRejectedValue(
          Object.assign(new Error('Invalid credentials'), { status: 401 })
        ),
      },
    };

    const program = signInEmail({ authClient: mockAuthClient })({
      email: 'user@example.com',
      password: 'wrong-password',
    });

    await expect(Effect.runPromise(program)).rejects.toThrow(
      EmailAuthApiError
    );
  });

  it('should preserve HTTP status code in EmailAuthApiError', async () => {
    const mockAuthClient = {
      signIn: {
        email: vi.fn().mockRejectedValue(
          Object.assign(new Error('Too many requests'), { status: 429 })
        ),
      },
    };

    const program = signInEmail({ authClient: mockAuthClient })({
      email: 'user@example.com',
      password: 'password123',
    });

    try {
      await Effect.runPromise(program);
    } catch (error) {
      expect(error).toBeInstanceOf(EmailAuthApiError);
      expect((error as EmailAuthApiError).status).toBe(429);
    }
  });
});
```

## Common Mistakes

### ❌ Wrong: Not using type extraction

```typescript
// Manual type definition loses Better Auth plugin awareness
export type SignInEmailInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};
```

### ✅ Correct: Extract types from Better Auth API

```typescript
// Automatic synchronization with Better Auth API changes
export type SignInEmailInput<T> = Parameters<
  'email' extends keyof AuthClientSignInFor<T>
    ? AuthClientSignInFor<T>['email']
    : never
>[0];
```

### ❌ Wrong: Missing optional fields in schema

```typescript
// Too strict, rejects valid Better Auth inputs
export const signInEmailInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
```

### ✅ Correct: Include all optional fields

```typescript
// Accepts all valid Better Auth inputs
export const signInEmailInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
  callbackURL: z.string().url().optional(),
  fetchOptions: z.object({
    onSuccess: z.function().optional(),
    onError: z.function().optional(),
  }).optional(),
});
```

### ❌ Wrong: Not preserving error details

```typescript
// Loses HTTP status and original error
catch: (error) => {
  return new EmailAuthApiError('Sign in failed');
}
```

### ✅ Correct: Preserve status and cause

```typescript
// Enables debugging and HTTP status mapping
catch: (error) => {
  const message = error instanceof Error ? error.message : 'Sign in failed';
  const status = error && typeof error === 'object' && 'status' in error
    ? (error.status as number)
    : undefined;
  return new EmailAuthApiError(message, status, error);
}
```

### ❌ Wrong: Mixing validation and service logic

```typescript
// Service layer should not validate inputs
export const signInEmail = (deps) => (input) => {
  if (!input.email || !input.password) {
    return Effect.fail(new EmailAuthInputError('Email and password required'));
  }
  return Effect.tryPromise({
    try: () => deps.authClient.signIn.email(input),
    catch: (error) => new EmailAuthApiError(...)
  });
};
```

### ✅ Correct: Separate validation and service

```typescript
// Service layer focuses on API integration
export const signInEmail = (deps) => (input) => {
  return Effect.tryPromise({
    try: () => deps.authClient.signIn.email(input),
    catch: (error) => new EmailAuthApiError(...)
  });
};

// Controller layer handles validation (future implementation)
export const signInEmailController = (deps) => (input) =>
  Effect.gen(function* () {
    const validInput = yield* validateInput(input);
    return yield* signInEmail(deps)(validInput);
  });
```

## Related Documentation

- [Shared Utilities CONTRIBUTING](../shared/CONTRIBUTING.md) - Error handling patterns, shared types, validation schemas
- [Sign-Up Email CONTRIBUTING](../sign-up-email/CONTRIBUTING.md) - Similar patterns for sign-up operation
- [Parent Client CONTRIBUTING](../CONTRIBUTING.md) - Universal patterns across all email operations
