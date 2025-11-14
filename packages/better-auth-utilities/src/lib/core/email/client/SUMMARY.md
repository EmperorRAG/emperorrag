# Email Client Operations - Quick Reference

## Purpose

Functional wrappers around Better Auth's email authentication APIs, providing type-safe Effect-based composition, structured error handling, and automatic synchronization with Better Auth's plugin system.

## Directory Structure

```
client/
├── shared/                       # Foundation utilities (3/3 complete)
│   ├── email.error.ts            # Discriminated union error types
│   ├── email.types.ts            # EmailAuthClientDeps<T>
│   ├── email.schema.ts           # emailAuthClientDepsSchema
│   ├── SUMMARY.md                # Quick reference
│   ├── CONTRIBUTING.md           # Code patterns
│   └── README.md                 # Comprehensive guide
│
├── sign-in-email/                # Email/password sign-in (3/6 complete)
│   ├── signInEmail.types.ts      # Type extractions (SignInEmailInput, SignInEmailResult)
│   ├── signInEmail.schema.ts     # Zod input validation
│   ├── signInEmail.service.ts    # Effect-based service
│   ├── signInEmail.utils.ts      # Placeholder (future)
│   ├── signInEmail.controller.ts # Placeholder (future validation layer)
│   ├── signInEmail.ts            # Barrel export
│   ├── SUMMARY.md                # Quick reference
│   ├── CONTRIBUTING.md           # Code patterns
│   └── README.md                 # Comprehensive guide
│
├── sign-up-email/                # Email/password registration (3/6 complete)
│   ├── signUpEmail.types.ts      # Type extractions (SignUpEmailInput, SignUpEmailResult)
│   ├── signUpEmail.schema.ts     # Zod input validation
│   ├── signUpEmail.service.ts    # Effect-based service
│   ├── signUpEmail.utils.ts      # Placeholder (future)
│   ├── signUpEmail.controller.ts # Placeholder (future validation layer)
│   ├── signUpEmail.ts            # Barrel export
│   ├── SUMMARY.md                # Quick reference
│   ├── CONTRIBUTING.md           # Code patterns
│   └── README.md                 # Comprehensive guide
│
├── sign-out/                     # Sign-out operation (single file)
│   └── signOut.ts                # Sign-out service
│
├── send-verification-email/      # Email verification (single file)
│   └── sendVerificationEmail.ts  # Send verification service
│
├── change-password/              # Password change (single file)
│   └── changePassword.ts         # Change password service
│
├── request-password-reset/       # Password reset request (single file)
│   └── requestPasswordReset.ts   # Request reset service
│
├── reset-password/               # Password reset completion (single file)
│   └── resetPassword.ts          # Reset password service
│
├── SUMMARY.md                    # This file - Quick reference
├── CONTRIBUTING.md               # Universal code patterns
└── README.md                     # Architecture and navigation guide
```

## Module Status

### Fully Documented (3 folders)

- **shared**: Foundation utilities - 100% complete (3 error classes, EmailAuthClientDeps type, validation schema)
- **sign-in-email**: Email/password sign-in - Service ready, controller pending (50% complete)
- **sign-up-email**: Email/password registration - Service ready, controller pending (50% complete)

### Implemented (5 single-file operations)

- **sign-out**: Sign-out operation
- **send-verification-email**: Email verification sender
- **change-password**: Password change for authenticated users
- **request-password-reset**: Password reset request initiator
- **reset-password**: Password reset completion handler

## Navigation Guide

### For AI Models

1. **Quick Scan**: Read SUMMARY.md files for file inventories and completion status
2. **Pattern Learning**: Read CONTRIBUTING.md files for code patterns and requirements
3. **Deep Understanding**: Read README.md files for architecture and usage examples

### For Humans

1. **Getting Started**: Start with [client/README.md](./README.md) for overall architecture
2. **Specific Operations**: Navigate to operation folders (sign-in-email, sign-up-email, etc.)
3. **Error Handling**: Reference [shared/README.md](./shared/README.md) for error system details
4. **Code Patterns**: Check CONTRIBUTING.md in any folder for pattern requirements

## Key Concepts

### Shared Utilities

All operations depend on:

- **Error Types**: 5 discriminated union error classes (EmailAuthDependenciesError, EmailAuthInputError, EmailAuthApiError, EmailAuthDataMissingError, EmailAuthSessionError)
- **Dependency Type**: EmailAuthClientDeps<T> - Readonly bundle with Better Auth client
- **Validation Schema**: emailAuthClientDepsSchema - Runtime dependency validation

See [shared/SUMMARY.md](./shared/SUMMARY.md) for quick reference.

### Type Extraction Pattern

All operations extract types from Better Auth APIs:

```typescript
// Extract input type
export type SignInEmailInput<T> = Parameters<
  AuthClientSignInFor<T>['email']
>[0];

// Extract result type
export type SignInEmailResult<T> = ReturnType<
  AuthClientSignInFor<T>['email']
>;
```

**Why**: Automatic synchronization with Better Auth API changes and plugin additions.

### Curried Service Pattern

All services follow curried dependency injection:

```typescript
export const operation = (deps: EmailAuthClientDeps) => (input: Input) =>
  Effect.tryPromise({
    try: () => deps.authClient.operation.method(input),
    catch: (error) => new EmailAuthApiError(...)
  });
```

**Why**: Clean dependency injection, partial application, testability.

### Effect-Based Composition

All operations return Effect for lazy evaluation:

```typescript
const program = signInEmail(deps)({ email, password });
const result = await Effect.runPromise(program);
```

**Why**: Composability, typed errors, retry/timeout strategies, testability.

## Quick Links

- [Shared Utilities](./shared/README.md) - Error types, shared types, validation
- [Sign-In Email](./sign-in-email/README.md) - Email/password authentication
- [Sign-Up Email](./sign-up-email/README.md) - Email/password registration
- [Universal Patterns](./CONTRIBUTING.md) - Code requirements across all operations
- [Architecture Guide](./README.md) - Overall design and integration patterns
