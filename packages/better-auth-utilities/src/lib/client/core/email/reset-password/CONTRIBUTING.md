# Contributing to Reset Password Module

## Code Requirements

### Type Extraction Pattern

See [Universal Type Extraction Pattern](../CONTRIBUTING.md#type-extraction-pattern) for the standard approach.

**Reset password specific implementation:** See [resetPassword.types.ts](./resetPassword.types.ts)

### Curried Service Pattern

See [Universal Curried Service Pattern](../CONTRIBUTING.md#curried-service-pattern) for detailed examples.

**Reset password specific implementation:** See [resetPassword.service.ts](./resetPassword.service.ts)

### Validation Schema Pattern

**Reset password schema includes:**

- **newPassword** field: Required (minimum 8 characters)
- **token**: Optional verification token from password reset email
- **callbackURL**: Optional (URL to redirect after password reset)
- **fetchOptions**: Optional (callbacks for success/error handling)

**Reset password specific implementation:** See [resetPassword.schema.ts](./resetPassword.schema.ts)

See [Universal Validation Patterns](../CONTRIBUTING.md#validation-patterns) for shared validation requirements.

## Error Handling Strategy

See [Universal Error Handling](../CONTRIBUTING.md#error-handling) for the standard approach.

**Reset password specific implementation:** See [resetPassword.service.ts](./resetPassword.service.ts) for error mapping in the `catch` block.

## Related Documentation

- [Shared Utilities CONTRIBUTING](../shared/CONTRIBUTING.md) - Error handling patterns, shared types, validation schemas
- [Sign-In Email CONTRIBUTING](../sign-in-email/CONTRIBUTING.md) - Similar patterns for sign-in operation
- [Sign-Up Email CONTRIBUTING](../sign-up-email/CONTRIBUTING.md) - Similar patterns for sign-up operation
- [Send Verification Email CONTRIBUTING](../send-verification-email/CONTRIBUTING.md) - Similar patterns for verification operation
- [Parent Client CONTRIBUTING](../CONTRIBUTING.md) - Universal patterns across all email operations
