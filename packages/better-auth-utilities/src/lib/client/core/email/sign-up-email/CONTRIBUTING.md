# Contributing to Sign-Up Email Module

## Code Requirements

### Type Extraction Pattern

See [Universal Type Extraction Pattern](../CONTRIBUTING.md#type-extraction-pattern) for the standard approach.

**Sign-up specific implementation:** See [signUpEmail.types.ts](./signUpEmail.types.ts)

### Curried Service Pattern

See [Universal Curried Service Pattern](../CONTRIBUTING.md#curried-service-pattern) and [Sign-In Module Implementation](../sign-in-email/CONTRIBUTING.md#curried-service-pattern) for detailed examples.

**Sign-up specific implementation:** See [signUpEmail.service.ts](./signUpEmail.service.ts)

### Validation Schema Pattern

**Sign-up schema differences from sign-in:**

- **name** field: Required (user display name)
- **image** field: Optional URL (profile image)
- **No rememberMe field** (sign-in only)

**Sign-up specific implementation:** See [signUpEmail.schema.ts](./signUpEmail.schema.ts)

See [Universal Validation Patterns](../CONTRIBUTING.md#validation-patterns) for shared validation requirements.

## Error Handling Strategy

See [Universal Error Handling](../CONTRIBUTING.md#error-handling) for the standard approach.

**Sign-up specific implementation:** See [signUpEmail.service.ts](./signUpEmail.service.ts) for error mapping in the `catch` block.

## Related Documentation

- [Shared Utilities CONTRIBUTING](../shared/CONTRIBUTING.md) - Error handling patterns, shared types, validation schemas
- [Sign-In Email CONTRIBUTING](../sign-in-email/CONTRIBUTING.md) - Similar patterns for sign-in operation (compare differences)
- [Parent Client CONTRIBUTING](../CONTRIBUTING.md) - Universal patterns across all email operations
