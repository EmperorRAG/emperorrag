# Contributing to Sign-Up Email Module

## Code Requirements

### Type Extraction Pattern

All type definitions follow the "extract from Better Auth" pattern (same as sign-in module):

```typescript
// ✅ Correct: Extract input type from Better Auth API
export type SignUpEmailInput<T> = Parameters<
  'email' extends keyof AuthClientSignUpFor<T>
    ? AuthClientSignUpFor<T>['email']
    : never
>[0];

// ✅ Correct: Extract result type from Better Auth API
export type SignUpEmailResult<T> = ReturnType<
  'email' extends keyof AuthClientSignUpFor<T>
    ? AuthClientSignUpFor<T>['email']
    : never
>;

// ❌ Wrong: Manual type definition (loses Better Auth plugin awareness)
export type SignUpEmailInput = {
  name: string;
  email: string;
  password: string;
  image?: string;
};
```

**Why**: Type extraction ensures automatic synchronization when Better Auth adds new fields or changes existing signatures through plugins.

### Curried Service Pattern

Identical to sign-in module (see [Sign-In CONTRIBUTING](../sign-in-email/CONTRIBUTING.md#curried-service-pattern)):

```typescript
// ✅ Correct: Curried deps → input → Effect
export const signUpEmail: signUpEmailProps = (deps) => (input) => {
  return Effect.tryPromise({
    try: () => deps.authClient.signUp.email(input),
    catch: (error) => new EmailAuthApiError(...)
  });
};
```

### Validation Schema Pattern

Sign-up schema includes **name** field (required) and **image** field (optional URL), but excludes **rememberMe** (sign-in only):

```typescript
// ✅ Correct: Sign-up schema with name and image
export const signUpEmailInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),        // Required for sign-up
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  image: z.string().url('Invalid image URL').optional(), // Optional profile image
  callbackURL: z.string().url('Invalid callback URL').optional(),
  fetchOptions: z.object({
    onSuccess: z.function().optional(),
    onError: z.function().optional(),
  }).optional(),
});

// ❌ Wrong: Including rememberMe (sign-in only)
export const signUpEmailInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(), // ❌ Not part of sign-up API
});

// ❌ Wrong: Missing name field (required for sign-up)
export const signUpEmailInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ❌ Wrong: image field not validated as URL
export const signUpEmailInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  image: z.string().optional(), // ❌ Should be .url()
});
```

**Why**: Sign-up requires name for user display, accepts optional profile image URL, but doesn't include session duration flags (that's sign-in's responsibility).

## Error Handling Strategy

### Sign-Up Specific Errors

Sign-up operations include additional error scenarios not present in sign-in:

```typescript
// ✅ Correct: Handle 409 Conflict for duplicate emails
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

// When handling errors in application code:
Match.value(error).pipe(
  Match.tag('EmailAuthApiError', (e) => {
    if (e.status === 409) return 'Email already registered';
    if (e.status === 400) return 'Invalid registration data';
    return `Sign up failed: ${e.message}`;
  }),
  Match.exhaustive
);
```

**Sign-Up Error Scenarios:**

| HTTP Status | Meaning | User Message |
|-------------|---------|--------------|
| 400 | Invalid input | "Invalid registration data" |
| 409 | Duplicate email | "Email already registered" |
| 422 | Weak password | "Password doesn't meet requirements" |
| 429 | Rate limit | "Too many registration attempts" |
| 500 | Server error | "Registration failed. Try again." |

### Service Layer Focus

Service layer only throws `EmailAuthApiError` (same as sign-in):

```typescript
// ✅ Correct: Service layer only handles API errors
export const signUpEmail: signUpEmailProps = (deps) => (input) => {
  return Effect.tryPromise({
    try: () => deps.authClient.signUp.email(input),
    catch: (error) => {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      const status = error && typeof error === 'object' && 'status' in error
        ? (error.status as number)
        : undefined;
      return new EmailAuthApiError(message, status, error);
    },
  });
};

// ❌ Wrong: Validating name in service layer
if (!input.name) {
  return Effect.fail(new EmailAuthInputError('Name required'));
}
```

## Testing Requirements

### Type Tests

Verify type extraction captures sign-up specific fields:

```typescript
describe('SignUpEmailInput', () => {
  it('should extract name field from Better Auth signUp.email API', () => {
    type Input = SignUpEmailInput<typeof authClient>;
    const input: Input = {
      name: 'John Doe',
      email: 'user@example.com',
      password: 'password123',
    };
    expect(input.name).toBe('John Doe');
  });

  it('should include optional image field', () => {
    type Input = SignUpEmailInput<typeof authClient>;
    const input: Input = {
      name: 'John Doe',
      email: 'user@example.com',
      password: 'password123',
      image: 'https://example.com/avatar.jpg',
    };
    expect(input.image).toBe('https://example.com/avatar.jpg');
  });

  it('should NOT include rememberMe field (sign-in only)', () => {
    type Input = SignUpEmailInput<typeof authClient>;
    // TypeScript should error if rememberMe is added:
    // const input: Input = {
    //   name: 'John Doe',
    //   email: 'user@example.com',
    //   password: 'password123',
    //   rememberMe: true // ❌ Type error
    // };
  });
});
```

### Schema Tests

Validate sign-up specific fields and constraints:

```typescript
describe('signUpEmailInputSchema', () => {
  it('should accept valid sign-up credentials with name', () => {
    const result = signUpEmailInputSchema.safeParse({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing name field', () => {
    const result = signUpEmailInputSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['name']);
      expect(result.error.issues[0].message).toBe('Name is required');
    }
  });

  it('should accept optional image as valid URL', () => {
    const result = signUpEmailInputSchema.safeParse({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'password123',
      image: 'https://example.com/avatar.jpg',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid image URL format', () => {
    const result = signUpEmailInputSchema.safeParse({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'password123',
      image: 'not-a-url',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['image']);
      expect(result.error.issues[0].message).toBe('Invalid image URL');
    }
  });

  it('should reject rememberMe field (not part of sign-up)', () => {
    const result = signUpEmailInputSchema.safeParse({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'password123',
      rememberMe: true, // Should be rejected
    });
    // Zod will ignore unknown keys, but TypeScript should catch this
    expect(result.success).toBe(true);
  });
});
```

### Service Tests

Test sign-up specific scenarios including duplicate email handling:

```typescript
describe('signUpEmail', () => {
  it('should return user and session on successful sign-up', async () => {
    const mockAuthClient = {
      signUp: {
        email: vi.fn().mockResolvedValue({
          data: {
            user: { id: '1', email: 'user@example.com', name: 'John Doe' },
            session: { token: 'abc123' },
          },
        }),
      },
    };

    const result = await Effect.runPromise(
      signUpEmail({ authClient: mockAuthClient })({
        name: 'John Doe',
        email: 'user@example.com',
        password: 'password123',
      })
    );

    expect(result.data.user.name).toBe('John Doe');
    expect(result.data.user.email).toBe('user@example.com');
  });

  it('should throw EmailAuthApiError with 409 status for duplicate email', async () => {
    const mockAuthClient = {
      signUp: {
        email: vi.fn().mockRejectedValue(
          Object.assign(new Error('Email already exists'), { status: 409 })
        ),
      },
    };

    const program = signUpEmail({ authClient: mockAuthClient })({
      name: 'John Doe',
      email: 'existing@example.com',
      password: 'password123',
    });

    try {
      await Effect.runPromise(program);
      expect.fail('Should have thrown EmailAuthApiError');
    } catch (error) {
      expect(error).toBeInstanceOf(EmailAuthApiError);
      expect((error as EmailAuthApiError).status).toBe(409);
      expect((error as EmailAuthApiError).message).toBe('Email already exists');
    }
  });

  it('should handle optional image URL', async () => {
    const mockAuthClient = {
      signUp: {
        email: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: '1',
              email: 'user@example.com',
              name: 'John Doe',
              image: 'https://example.com/avatar.jpg',
            },
            session: { token: 'abc123' },
          },
        }),
      },
    };

    const result = await Effect.runPromise(
      signUpEmail({ authClient: mockAuthClient })({
        name: 'John Doe',
        email: 'user@example.com',
        password: 'password123',
        image: 'https://example.com/avatar.jpg',
      })
    );

    expect(mockAuthClient.signUp.email).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'password123',
      image: 'https://example.com/avatar.jpg',
    });
  });
});
```

## Common Mistakes

### ❌ Wrong: Including rememberMe in sign-up schema

```typescript
// Sign-up doesn't support session duration flags
export const signUpEmailInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(), // ❌ Not part of signUp API
});
```

### ✅ Correct: Sign-up specific fields only

```typescript
// Only include fields supported by signUp.email
export const signUpEmailInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  image: z.string().url('Invalid image URL').optional(),
  callbackURL: z.string().url('Invalid callback URL').optional(),
  fetchOptions: z.object({
    onSuccess: z.function().optional(),
    onError: z.function().optional(),
  }).optional(),
});
```

### ❌ Wrong: Not validating image as URL

```typescript
// image should be validated as URL format
export const signUpEmailInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  image: z.string().optional(), // ❌ Missing URL validation
});
```

### ✅ Correct: Validate image as URL

```typescript
// Ensure image is valid URL when provided
export const signUpEmailInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  image: z.string().url().optional(), // ✅ URL validation
});
```

### ❌ Wrong: Missing name field in schema

```typescript
// name is required for sign-up
export const signUpEmailInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
```

### ✅ Correct: Include required name field

```typescript
// name is required field for user display
export const signUpEmailInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  password: z.string().min(1),
});
```

### ❌ Wrong: Not handling 409 Conflict errors

```typescript
// Sign-up should handle duplicate email errors
Match.value(error).pipe(
  Match.tag('EmailAuthApiError', (e) =>
    `Sign up failed: ${e.message}` // ❌ Generic message for all statuses
  ),
  Match.exhaustive
);
```

### ✅ Correct: Handle duplicate email specifically

```typescript
// Provide user-friendly messages for duplicate emails
Match.value(error).pipe(
  Match.tag('EmailAuthApiError', (e) => {
    if (e.status === 409) return 'Email already registered';
    if (e.status === 400) return 'Invalid registration data';
    return `Sign up failed: ${e.message}`;
  }),
  Match.exhaustive
);
```

## Related Documentation

- [Shared Utilities CONTRIBUTING](../shared/CONTRIBUTING.md) - Error handling patterns, shared types, validation schemas
- [Sign-In Email CONTRIBUTING](../sign-in-email/CONTRIBUTING.md) - Similar patterns for sign-in operation (compare differences)
- [Parent Client CONTRIBUTING](../CONTRIBUTING.md) - Universal patterns across all email operations
