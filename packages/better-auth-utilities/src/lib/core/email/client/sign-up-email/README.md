# Sign-Up Email Module

## Overview

The sign-up email module provides a functional, type-safe wrapper around Better Auth's `signUp.email` API for user registration. It follows Effect-TS patterns for composition, provides structured error handling via discriminated unions, and automatically synchronizes types with Better Auth's plugin system through type extraction.

## Architecture

### Type System

#### SignUpEmailInput<T>

Generic type that extracts the registration credentials structure from Better Auth's `signUp.email` method.

**Type Extraction Pattern:**

```typescript
export type SignUpEmailInput<T> = Parameters<
  'email' extends keyof AuthClientSignUpFor<T>
    ? AuthClientSignUpFor<T>['email']
    : never
>[0];
```

**Extracted Fields:**

```typescript
{
  name: string;            // User's display name (required)
  email: string;           // User's email address (required)
  password: string;        // User's password (required)
  image?: string;          // Optional: Profile image URL
  callbackURL?: string;    // Optional: Redirect URL after registration
  fetchOptions?: {         // Optional: Callback handlers
    onSuccess?: Function;
    onError?: Function;
  };
}
```

**Key Differences from Sign-In:**

- **name**: Required field for user display (not in sign-in)
- **image**: Optional profile image URL (not in sign-in)
- **No rememberMe**: Session duration flag only exists in sign-in

#### SignUpEmailResult<T>

Generic type that extracts the Promise-wrapped result from Better Auth's `signUp.email` method.

**Type Extraction Pattern:**

```typescript
export type SignUpEmailResult<T> = ReturnType<
  'email' extends keyof AuthClientSignUpFor<T>
    ? AuthClientSignUpFor<T>['email']
    : never
>;
```

**Typical Structure:**

```typescript
Promise<{
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      // Additional fields from Better Auth plugins
    };
    session: {
      token: string;
      expiresAt: string;
      // Additional fields from Better Auth plugins
    };
  };
  error?: {
    message: string;
    status?: number;
  };
}>
```

#### signUpEmailProps<T>

Interface defining the curried service function signature (identical pattern to sign-in).

**Signature:**

```typescript
interface signUpEmailProps<T> {
  (deps: EmailAuthClientDeps<T>):
    (input: SignUpEmailInput<T>) =>
      Effect.Effect<Awaited<SignUpEmailResult<T>>, EmailAuthError>;
}
```

### Validation Layer

#### signUpEmailInputSchema

Zod schema providing runtime validation for registration credentials.

**Schema Definition:**

```typescript
export const signUpEmailInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),              // Required display name
  email: z.string().email('Invalid email format'),          // Valid email format
  password: z.string().min(1, 'Password is required'),      // Non-empty password
  image: z.string().url('Invalid image URL').optional(),    // Optional valid URL
  callbackURL: z.string().url('Invalid callback URL').optional(),
  fetchOptions: z.object({
    onSuccess: z.function().optional(),
    onError: z.function().optional(),
  }).optional(),
});
```

**Validation Rules:**

- `name`: Minimum 1 character, required (user display name)
- `email`: Must be valid email format (RFC 5322)
- `password`: Minimum 1 character (Better Auth enforces stronger rules)
- `image`: Must be valid URL when provided (profile picture)
- `callbackURL`: Must be valid URL when provided
- `fetchOptions`: Must be object with optional function properties when provided

**Notable Differences from Sign-In Schema:**

- **Includes name**: Required for user display
- **Includes image**: Optional profile picture URL
- **Excludes rememberMe**: Not applicable to registration

### Service Layer

#### signUpEmail

Pure function implementing the registration operation as an Effect.

**Implementation:**

```typescript
export const signUpEmail: signUpEmailProps = (deps) => (input) => {
  const { authClient } = deps;

  return Effect.tryPromise({
    try: () => authClient.signUp.email(input),
    catch: (error) => {
      const message = error instanceof Error
        ? error.message
        : 'Sign up failed';
      const status = error && typeof error === 'object' && 'status' in error
        ? (error.status as number)
        : undefined;
      return new EmailAuthApiError(message, status, error);
    },
  });
};
```

**Error Mapping:**

| Better Auth Error | Mapped Error | HTTP Status | User Message |
|------------------|--------------|-------------|--------------|
| Duplicate email | `EmailAuthApiError` | 409 | "Email already registered" |
| Invalid email | `EmailAuthApiError` | 400 | "Invalid email format" |
| Weak password | `EmailAuthApiError` | 422 | "Password too weak" |
| Rate limit | `EmailAuthApiError` | 429 | "Too many registration attempts" |
| Network failure | `EmailAuthApiError` | undefined | "Network error" |

## Usage

### Basic Registration

```typescript
import { Effect } from 'effect';
import { signUpEmail } from './sign-up-email/signUpEmail.service.js';
import { createAuthClient } from 'better-auth/client';

// Step 1: Create dependency bundle
const deps = {
  authClient: createAuthClient({ baseURL: 'http://localhost:3000' })
};

// Step 2: Create partially applied function
const signUp = signUpEmail(deps);

// Step 3: Execute registration
const program = signUp({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securePassword123'
});

// Step 4: Run Effect
const result = await Effect.runPromise(program);
console.log('Registered:', result.data.user.name);
```

### Registration with Profile Image

```typescript
const program = signUpEmail(deps)({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securePassword123',
  image: 'https://example.com/avatars/john.jpg'
});
```

### Registration with Redirect

```typescript
const program = signUpEmail(deps)({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securePassword123',
  callbackURL: 'https://example.com/welcome'
});
```

### Registration with Effect.gen

```typescript
const program = Effect.gen(function* () {
  // Register user
  const result = yield* signUpEmail(deps)({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securePassword123',
    image: 'https://example.com/avatars/john.jpg'
  });

  // Access user data
  const { user, session } = result.data;
  console.log(`Welcome, ${user.name}!`);

  // Send welcome email
  yield* sendWelcomeEmail({ email: user.email, name: user.name });

  // Track registration event
  yield* trackEvent({ type: 'user_registered', userId: user.id });

  return { user, session };
});
```

## Error Handling

### Handling Duplicate Emails (409 Conflict)

```typescript
import { Effect, Match } from 'effect';
import type { EmailAuthError } from '../shared/email.error.js';

const program = signUpEmail(deps)({
  name: 'John Doe',
  email: 'existing@example.com',
  password: 'password123'
});

Effect.runPromise(program).catch((error: EmailAuthError) => {
  const message = Match.value(error).pipe(
    Match.tag('EmailAuthApiError', (e) => {
      if (e.status === 409) {
        return 'Email already registered. Try signing in instead.';
      }
      if (e.status === 400) {
        return 'Invalid registration data. Check your input.';
      }
      if (e.status === 422) {
        return 'Password too weak. Use at least 8 characters with mixed case.';
      }
      if (e.status === 429) {
        return 'Too many registration attempts. Try again later.';
      }
      return `Registration failed: ${e.message}`;
    }),
    Match.tag('EmailAuthInputError', (e) =>
      `Validation error: ${e.message}`
    ),
    Match.tag('EmailAuthDependenciesError', () =>
      'Configuration error. Contact support.'
    ),
    Match.orElse(() => 'Unexpected error occurred')
  );

  console.error(message);
});
```

### Fallback to Sign-In on Duplicate Email

```typescript
const registerOrSignIn = (credentials: {
  name: string;
  email: string;
  password: string;
}) =>
  Effect.gen(function* () {
    try {
      // Attempt registration
      return yield* signUpEmail(deps)(credentials);
    } catch (error) {
      // If email exists, try signing in
      if (
        error._tag === 'EmailAuthApiError' &&
        error.status === 409
      ) {
        console.log('Email exists, signing in instead...');
        return yield* signInEmail(deps)({
          email: credentials.email,
          password: credentials.password
        });
      }
      throw error;
    }
  });
```

### Validation Before Registration

```typescript
const validateAndRegister = (input: unknown) =>
  Effect.gen(function* () {
    // Validate input
    const result = signUpEmailInputSchema.safeParse(input);
    if (!result.success) {
      const firstError = result.error.issues[0];
      throw new EmailAuthInputError(
        `${firstError.path.join('.')}: ${firstError.message}`,
        result.error
      );
    }

    // Register with validated input
    return yield* signUpEmail(deps)(result.data);
  });
```

## Integration Patterns

### With React Hook

```typescript
import { useState } from 'react';
import { Effect } from 'effect';
import { signUpEmail } from '@emperorrag/better-auth-utilities';

export function useSignUp(authClient: AuthClient) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (
    name: string,
    email: string,
    password: string,
    image?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const result = await Effect.runPromise(
        signUpEmail({ authClient })({ name, email, password, image })
      );
      return result.data;
    } catch (err) {
      const message = err._tag === 'EmailAuthApiError' && err.status === 409
        ? 'Email already registered'
        : err instanceof Error
          ? err.message
          : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading, error };
}
```

### With NestJS Controller

```typescript
import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { Effect } from 'effect';
import { signUpEmail } from '@emperorrag/better-auth-utilities';

@Controller('auth')
export class AuthController {
  constructor(private readonly authClient: AuthClient) {}

  @Post('sign-up')
  async signUp(
    @Body() body: { name: string; email: string; password: string; image?: string }
  ) {
    const program = signUpEmail({ authClient: this.authClient })(body);

    try {
      return await Effect.runPromise(program);
    } catch (error) {
      if (error._tag === 'EmailAuthApiError' && error.status === 409) {
        throw new ConflictException('Email already registered');
      }
      throw error;
    }
  }
}
```

### With Form Validation

```typescript
import { Effect } from 'effect';
import { signUpEmail, signUpEmailInputSchema } from '@emperorrag/better-auth-utilities';

export const handleRegistration = async (formData: FormData) => {
  // Extract form data
  const input = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    image: formData.get('image') as string | undefined,
  };

  // Validate with Zod
  const validation = signUpEmailInputSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors
    };
  }

  // Register user
  try {
    const result = await Effect.runPromise(
      signUpEmail({ authClient })(validation.data)
    );
    return { success: true, user: result.data.user };
  } catch (error) {
    return {
      success: false,
      errors: { _form: error.message }
    };
  }
};
```

## Testing

### Service Layer Tests

```typescript
import { describe, it, expect, vi } from 'vitest';
import { Effect } from 'effect';
import { signUpEmail } from './signUpEmail.service.js';
import { EmailAuthApiError } from '../shared/email.error.js';

describe('signUpEmail', () => {
  it('should return user with name and email on successful registration', async () => {
    const mockAuthClient = {
      signUp: {
        email: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: '1',
              email: 'john@example.com',
              name: 'John Doe',
              image: 'https://example.com/john.jpg',
            },
            session: { token: 'abc123', expiresAt: '2025-12-31' },
          },
        }),
      },
    };

    const result = await Effect.runPromise(
      signUpEmail({ authClient: mockAuthClient })({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        image: 'https://example.com/john.jpg',
      })
    );

    expect(result.data.user.name).toBe('John Doe');
    expect(result.data.user.email).toBe('john@example.com');
    expect(result.data.user.image).toBe('https://example.com/john.jpg');
  });

  it('should throw EmailAuthApiError with 409 for duplicate email', async () => {
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
    }
  });

  it('should throw EmailAuthApiError with 422 for weak password', async () => {
    const mockAuthClient = {
      signUp: {
        email: vi.fn().mockRejectedValue(
          Object.assign(new Error('Password too weak'), { status: 422 })
        ),
      },
    };

    const program = signUpEmail({ authClient: mockAuthClient })({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123',
    });

    try {
      await Effect.runPromise(program);
      expect.fail('Should have thrown EmailAuthApiError');
    } catch (error) {
      expect(error).toBeInstanceOf(EmailAuthApiError);
      expect((error as EmailAuthApiError).status).toBe(422);
    }
  });
});
```

### Schema Validation Tests

```typescript
import { describe, it, expect } from 'vitest';
import { signUpEmailInputSchema } from './signUpEmail.schema.js';

describe('signUpEmailInputSchema', () => {
  it('should accept valid registration with name', () => {
    const result = signUpEmailInputSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing name', () => {
    const result = signUpEmailInputSchema.safeParse({
      email: 'john@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('should accept optional image URL', () => {
    const result = signUpEmailInputSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      image: 'https://example.com/avatar.jpg',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid image URL', () => {
    const result = signUpEmailInputSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      image: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });
});
```

## Related Modules

- [Shared Utilities](../shared/README.md) - Error types, shared types, validation schemas
- [Sign-In Email](../sign-in-email/README.md) - Email/password sign-in implementation
- [Sign-Out](../sign-out/README.md) - Sign-out implementation
- [Parent Client README](../README.md) - Email client operations overview

## Design Decisions

### Why Separate Sign-Up from Sign-In?

Different concerns warrant separate modules:

- **Different fields**: Sign-up requires name, accepts image; sign-in has rememberMe
- **Different errors**: Sign-up handles 409 Conflict; sign-in handles 401 Unauthorized
- **Different flows**: Sign-up may trigger email verification; sign-in may require MFA
- **Type safety**: Separate types prevent accidentally using sign-in fields in sign-up

### Why Required Name Field?

Better Auth requires name for user display:

- **User identification**: Name shown in UI, notifications, admin panels
- **Better UX**: Personalized greetings ("Welcome, John!")
- **Better Auth requirement**: API enforces name field presence

### Why Optional Image Field?

Profile images enhance user experience but aren't required:

- **Progressive enhancement**: Users can add images later
- **Different sources**: Some users upload images, others use OAuth avatars
- **Validation complexity**: URL validation sufficient at registration (actual image validation happens server-side)

## Future Enhancements

### Planned Features

- **Controller Layer**: Add comprehensive validation pipeline
- **Email Verification**: Integrate with send-verification-email operation
- **Password Strength**: Client-side password strength validation
- **Duplicate Detection**: Check email availability before submission
- **Profile Completion**: Multi-step registration with optional fields

### Potential Optimizations

- **Optimistic UI**: Show success state before API response
- **Batch Validation**: Validate all fields simultaneously
- **Smart Defaults**: Auto-generate avatar from name (initials)
- **Progressive Form**: Collect minimal data first, gather more later
