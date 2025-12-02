# Contributing to Sign-In Email Module

## Code Requirements

### Type Extraction Pattern

See [Universal Type Extraction Pattern](../CONTRIBUTING.md#type-extraction-pattern) for the standard approach.

**Sign-in specific implementation:** See [signInEmail.types.ts](./signInEmail.types.ts)

### Curried Service Pattern

See [Universal Curried Service Pattern](../CONTRIBUTING.md#curried-service-pattern) for detailed examples.

**Sign-in specific implementation:** See [signInEmail.service.ts](./signInEmail.service.ts)

### Validation Schema Pattern

**Sign-in schema includes:**

- **email** field: Required
- **password** field: Required
- **rememberMe** field: Optional boolean (session duration flag)
- **callbackURL** and **fetchOptions**: Optional

**Sign-in specific implementation:** See [signInEmail.schema.ts](./signInEmail.schema.ts)

See [Universal Validation Patterns](../CONTRIBUTING.md#validation-patterns) for shared validation requirements.

## Error Handling Strategy

See [Universal Error Handling](../CONTRIBUTING.md#error-handling) for the standard approach.

**Sign-in specific implementation:** See [signInEmail.service.ts](./signInEmail.service.ts) for error mapping in the `catch` block.

## Related Documentation

- [Shared Utilities CONTRIBUTING](../shared/CONTRIBUTING.md) - Error handling patterns, shared types, validation schemas
- [Sign-Up Email CONTRIBUTING](../sign-up-email/CONTRIBUTING.md) - Similar patterns for sign-up operation
- [Parent Client CONTRIBUTING](../CONTRIBUTING.md) - Universal patterns across all email operations
