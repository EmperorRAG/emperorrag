# Contributing to Shared Email Utilities

## Code Requirements

### Error Types

See [Universal Error Handling](../CONTRIBUTING.md#error-handling) for error handling patterns.

**Shared error implementations:** See [email.error.ts](./email.error.ts) for all error class definitions:
- `EmailAuthDependenciesError`
- `EmailAuthInputError`
- `EmailAuthApiError` (includes `status` parameter)
- `EmailAuthDataMissingError`
- `EmailAuthSessionError`
- `EmailAuthError` (discriminated union type)

### Shared Types

**Shared type implementations:** See [email.types.ts](./email.types.ts) for:
- `EmailAuthClientDeps<T>` - Generic readonly dependency type

### Validation Schemas

**Shared schema implementations:** See [email.schema.ts](./email.schema.ts) for:
- `emailAuthClientDepsSchema` - Validates authClient with passthrough for plugin extensions

## Related Documentation

- [Sign-In Email CONTRIBUTING](../sign-in-email/CONTRIBUTING.md) - Sign-in specific patterns
- [Sign-Up Email CONTRIBUTING](../sign-up-email/CONTRIBUTING.md) - Sign-up specific patterns
- [Parent Client CONTRIBUTING](../CONTRIBUTING.md) - Universal patterns across all email operations
