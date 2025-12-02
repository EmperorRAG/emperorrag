# Contributing to Request Password Reset Module

## Code Requirements

### Type Extraction Pattern

See [Universal Type Extraction Pattern](../CONTRIBUTING.md#type-extraction-pattern) for the standard approach.

**Request password reset specific implementation:** See [requestPasswordReset.types.ts](./requestPasswordReset.types.ts)

### Curried Service Pattern

See [Universal Curried Service Pattern](../CONTRIBUTING.md#curried-service-pattern) for detailed examples.

**Request password reset specific implementation:** See [requestPasswordReset.service.ts](./requestPasswordReset.service.ts)

### Validation Schema Pattern

**Request password reset schema includes:**

- **email** field: Required (must be valid email format)
- **redirectTo**: Optional (URL where user will land to reset password)
- **callbackURL**: Optional (URL to redirect after password reset completion)
- **fetchOptions**: Optional (callbacks for success/error handling)

**Request password reset specific implementation:** See [requestPasswordReset.schema.ts](./requestPasswordReset.schema.ts)

See [Universal Validation Patterns](../CONTRIBUTING.md#validation-patterns) for shared validation requirements.

## Error Handling Strategy

See [Universal Error Handling](../CONTRIBUTING.md#error-handling) for the standard approach.

**Request password reset specific implementation:** See [requestPasswordReset.service.ts](./requestPasswordReset.service.ts) for error mapping in the `catch` block.

## Related Documentation

- [Shared Utilities CONTRIBUTING](../shared/CONTRIBUTING.md) - Error handling patterns, shared types, validation schemas
- [Reset Password CONTRIBUTING](../reset-password/CONTRIBUTING.md) - Related password reset operation
- [Sign-In Email CONTRIBUTING](../sign-in-email/CONTRIBUTING.md) - Similar patterns for sign-in operation
- [Sign-Up Email CONTRIBUTING](../sign-up-email/CONTRIBUTING.md) - Similar patterns for sign-up operation
- [Send Verification Email CONTRIBUTING](../send-verification-email/CONTRIBUTING.md) - Similar patterns for verification operation
- [Parent Client CONTRIBUTING](../CONTRIBUTING.md) - Universal patterns across all email operations
