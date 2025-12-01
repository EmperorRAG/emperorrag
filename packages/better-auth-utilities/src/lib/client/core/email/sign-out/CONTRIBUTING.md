# Contributing to Sign-Out Module

## Code Requirements

### Type Extraction Pattern

See [Universal Type Extraction Pattern](../CONTRIBUTING.md#type-extraction-pattern) for the standard approach.

**Sign-out specific implementation:** See [signOut.types.ts](./signOut.types.ts)

### Curried Service Pattern

See [Universal Curried Service Pattern](../CONTRIBUTING.md#curried-service-pattern) for detailed examples.

**Sign-out specific implementation:** See [signOut.service.ts](./signOut.service.ts)

### Validation Schema Pattern

**Sign-out schema includes:**

- **callbackURL**: Optional (URL to redirect after sign-out)
- **fetchOptions**: Optional (callbacks for success/error handling)

**Sign-out specific implementation:** See [signOut.schema.ts](./signOut.schema.ts)

See [Universal Validation Patterns](../CONTRIBUTING.md#validation-patterns) for shared validation requirements.

## Error Handling Strategy

See [Universal Error Handling](../CONTRIBUTING.md#error-handling) for the standard approach.

**Sign-out specific implementation:** See [signOut.service.ts](./signOut.service.ts) for error mapping in the `catch` block.

## Related Documentation

- [Shared Utilities CONTRIBUTING](../shared/CONTRIBUTING.md) - Error handling patterns, shared types, validation schemas
- [Sign-In Email CONTRIBUTING](../sign-in-email/CONTRIBUTING.md) - Similar patterns for sign-in operation
- [Sign-Up Email CONTRIBUTING](../sign-up-email/CONTRIBUTING.md) - Similar patterns for sign-up operation
- [Change Password CONTRIBUTING](../change-password/CONTRIBUTING.md) - Similar patterns for password change operation
- [Parent Client CONTRIBUTING](../CONTRIBUTING.md) - Universal patterns across all email operations
