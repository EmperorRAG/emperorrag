# Contributing to Change Password Module

## Code Requirements

### Type Extraction Pattern

See [Universal Type Extraction Pattern](../CONTRIBUTING.md#type-extraction-pattern) for the standard approach.

**Change password specific implementation:** See [changePassword.types.ts](./changePassword.types.ts)

### Curried Service Pattern

See [Universal Curried Service Pattern](../CONTRIBUTING.md#curried-service-pattern) for detailed examples.

**Change password specific implementation:** See [changePassword.service.ts](./changePassword.service.ts)

### Validation Schema Pattern

**Change password schema includes:**

- **newPassword** field: Required (minimum 8 characters)
- **currentPassword** field: Required (for authentication)
- **revokeOtherSessions**: Optional boolean (logs out other active sessions/devices)
- **fetchOptions**: Optional (callbacks for success/error handling)

**Change password specific implementation:** See [changePassword.schema.ts](./changePassword.schema.ts)

See [Universal Validation Patterns](../CONTRIBUTING.md#validation-patterns) for shared validation requirements.

## Error Handling Strategy

See [Universal Error Handling](../CONTRIBUTING.md#error-handling) for the standard approach.

**Change password specific implementation:** See [changePassword.service.ts](./changePassword.service.ts) for error mapping in the `catch` block.

## Related Documentation

- [Shared Utilities CONTRIBUTING](../shared/CONTRIBUTING.md) - Error handling patterns, shared types, validation schemas
- [Reset Password CONTRIBUTING](../reset-password/CONTRIBUTING.md) - Related password reset operation
- [Request Password Reset CONTRIBUTING](../request-password-reset/CONTRIBUTING.md) - Related password reset request operation
- [Sign-In Email CONTRIBUTING](../sign-in-email/CONTRIBUTING.md) - Similar patterns for sign-in operation
- [Sign-Up Email CONTRIBUTING](../sign-up-email/CONTRIBUTING.md) - Similar patterns for sign-up operation
- [Parent Client CONTRIBUTING](../CONTRIBUTING.md) - Universal patterns across all email operations
