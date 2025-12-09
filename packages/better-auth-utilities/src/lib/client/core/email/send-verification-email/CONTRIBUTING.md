# Contributing to Send Verification Email Module

## Code Requirements

### Type Extraction Pattern

See [Universal Type Extraction Pattern](../CONTRIBUTING.md#type-extraction-pattern) for the standard approach.

**Send verification specific implementation:** See [sendVerificationEmail.types.ts](./sendVerificationEmail.types.ts)

### Curried Service Pattern

See [Universal Curried Service Pattern](../CONTRIBUTING.md#curried-service-pattern) for detailed examples.

**Send verification specific implementation:** See [sendVerificationEmail.service.ts](./sendVerificationEmail.service.ts)

### Validation Schema Pattern

**Send verification schema includes:**

- **email** field: Required (must be valid email format)
- **callbackURL**: Optional (URL to redirect after verification)
- **fetchOptions**: Optional (callbacks for success/error handling)

**Send verification specific implementation:** See [sendVerificationEmail.schema.ts](./sendVerificationEmail.schema.ts)

See [Universal Validation Patterns](../CONTRIBUTING.md#validation-patterns) for shared validation requirements.

## Error Handling Strategy

See [Universal Error Handling](../CONTRIBUTING.md#error-handling) for the standard approach.

**Send verification specific implementation:** See [sendVerificationEmail.service.ts](./sendVerificationEmail.service.ts) for error mapping in the `catch` block.

## Related Documentation

- [Shared Utilities CONTRIBUTING](../shared/CONTRIBUTING.md) - Error handling patterns, shared types, validation schemas
- [Sign-In Email CONTRIBUTING](../sign-in-email/CONTRIBUTING.md) - Similar patterns for sign-in operation
- [Sign-Up Email CONTRIBUTING](../sign-up-email/CONTRIBUTING.md) - Similar patterns for sign-up operation
- [Parent Client CONTRIBUTING](../CONTRIBUTING.md) - Universal patterns across all email operations
