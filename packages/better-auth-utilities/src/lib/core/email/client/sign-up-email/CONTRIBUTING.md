# Contributing to Sign-Up Email Module

## Code Requirements

### Type Extraction Pattern

See [Universal Type Extraction Pattern](../CONTRIBUTING.md#type-extraction-pattern) for the standard approach.

**Sign-up specific example:**

```typescript
// ✅ Correct: Extract from Better Auth signUp.email API
export type SignUpEmailInput<T> = Parameters<
  'email' extends keyof AuthClientSignUpFor<T>
    ? AuthClientSignUpFor<T>['email']
    : never
>[0];

export type SignUpEmailResult<T> = ReturnType<
  'email' extends keyof AuthClientSignUpFor<T>
    ? AuthClientSignUpFor<T>['email']
    : never
>;
```

### Curried Service Pattern

See [Universal Curried Service Pattern](../CONTRIBUTING.md#curried-service-pattern) and [Sign-In Module Implementation](../sign-in-email/CONTRIBUTING.md#curried-service-pattern) for detailed examples.

### Validation Schema Pattern

**Sign-up schema differences from sign-in:**

- **name** field: Required (user display name)
- **image** field: Optional URL (profile image)
- **No rememberMe field** (sign-in only)

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

See [Universal Validation Patterns](../CONTRIBUTING.md#validation-patterns) for shared validation requirements.

## Error Handling Strategy

See [Universal Error Handling](../CONTRIBUTING.md#error-handling) for the standard approach.

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

## Testing Requirements

See [Universal Testing Requirements](../CONTRIBUTING.md#testing-requirements) for shared patterns.

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

See [Universal Schema Tests](../CONTRIBUTING.md#schema-validation-tests) for additional validation test patterns.

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

See [Universal Service Tests](../CONTRIBUTING.md#service-layer-tests) for additional testing patterns.

## Related Documentation

- [Shared Utilities CONTRIBUTING](../shared/CONTRIBUTING.md) - Error handling patterns, shared types, validation schemas
- [Sign-In Email CONTRIBUTING](../sign-in-email/CONTRIBUTING.md) - Similar patterns for sign-in operation (compare differences)
- [Parent Client CONTRIBUTING](../CONTRIBUTING.md) - Universal patterns across all email operations
