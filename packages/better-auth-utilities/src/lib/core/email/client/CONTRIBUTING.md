# Contributing to Email Client Operations

This document defines universal patterns and requirements for all email authentication operations in the client module.

## Universal Code Requirements

### Type Extraction Pattern

**Required for all operations**: Extract types from Better Auth APIs instead of manual definitions.

**Why**: Automatic synchronization with Better Auth changes and plugin additions.

**Example implementations:**

- [signInEmail.types.ts](./sign-in-email/signInEmail.types.ts)
- [signUpEmail.types.ts](./sign-up-email/signUpEmail.types.ts)

### Curried Service Pattern

**Required for all operations**: Use multi-stage currying (dependencies → input → Effect).

**Why**: Enables clean dependency injection, partial application, and easier testing.

**Example implementations:**

- [signInEmail.service.ts](./sign-in-email/signInEmail.service.ts)
- [signUpEmail.service.ts](./sign-up-email/signUpEmail.service.ts)

### Effect Return Type

**Required for all operations**: Return `Effect.Effect<Success, EmailAuthError>`.

**Why**: Provides lazy evaluation, composability, typed error channels, and built-in retry/timeout/fallback strategies.

### Shared Dependencies

**Required for all operations**: Use `EmailAuthClientDeps<T>` from shared utilities.

**Why**: Consistency across all operations, centralized type maintenance.

**Implementation:** See [shared/email.types.ts](./shared/email.types.ts)

### Error Handling

**Required for all operations**: Map Better Auth errors to `EmailAuthApiError`.

**Why**: Preserving status codes enables HTTP response mapping, cause preservation aids debugging.

**Error types:** See [shared/email.error.ts](./shared/email.error.ts)

## Validation Patterns

### Zod Schema Structure

**Required when validation needed**: Mirror type extraction with Zod runtime validation.

**Why**: Runtime validation catches invalid inputs before API calls, generates clear error messages.

**Example implementations:**

- [signInEmail.schema.ts](./sign-in-email/signInEmail.schema.ts)
- [signUpEmail.schema.ts](./sign-up-email/signUpEmail.schema.ts)
- [shared/email.schema.ts](./shared/email.schema.ts)

## File Organization

See [SUMMARY.md](./SUMMARY.md) for complete directory structure and module status.

## Related Documentation

- [Shared Utilities CONTRIBUTING](./shared/CONTRIBUTING.md) - Error types, shared types, validation schemas
- [Sign-In Email CONTRIBUTING](./sign-in-email/CONTRIBUTING.md) - Sign-in specific patterns
- [Sign-Up Email CONTRIBUTING](./sign-up-email/CONTRIBUTING.md) - Sign-up specific patterns
