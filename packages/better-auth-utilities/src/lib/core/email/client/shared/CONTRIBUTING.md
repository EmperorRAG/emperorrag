# Contributing to Shared Email Utilities

## Code Requirements

### Error Types

All email authentication errors must:

- Extend `Error` class
- Include readonly `_tag` property for discriminated union
- Include optional `cause` property for error chaining
- Override `name` property to match class name
- Use constructor pattern: `(message: string, cause?: unknown)`

**Example:**

```typescript
export class EmailAuthApiError extends Error {
  readonly _tag = 'EmailAuthApiError';
  override readonly cause?: unknown;

  constructor(
    message: string,
    public readonly status?: number,
    cause?: unknown
  ) {
    super(message);
    this.name = 'EmailAuthApiError';
    this.cause = cause;
  }
}
```

**EmailAuthApiError Special Case:**

- Must include `status?: number` parameter for HTTP status codes
- Used for all Better Auth API call failures
- Status codes: 400 (validation), 401 (unauthorized), 409 (conflict), 429 (rate limit), 500 (server error)

### Shared Types

**EmailAuthClientDeps Pattern:**

- Must be generic with Better Auth client type parameter
- Must be Readonly to prevent mutations
- Must contain `authClient` property only
- Type constraint: `T extends AuthClientFor<ReturnType<typeof createAuthClient>>`

**Example:**

```typescript
export type EmailAuthClientDeps<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = Readonly<{
  authClient: T;
}>;
```

### Validation Schemas

**emailAuthClientDepsSchema Pattern:**

- Use `z.object()` for structure validation
- Use `.passthrough()` on authClient to allow plugin extensions
- Provide JSDoc with @description and @example

**Example:**

```typescript
export const emailAuthClientDepsSchema = z.object({
  authClient: z.object({}).passthrough(),
});
```

## Error Handling Strategy

### Pattern Matching with Effect-TS

Use `Match` from Effect for exhaustive error handling:

```typescript
import { Match } from 'effect';

const result = Match.value(error).pipe(
  Match.tag('EmailAuthDependenciesError', () => handleDepsError()),
  Match.tag('EmailAuthInputError', () => handleInputError()),
  Match.tag('EmailAuthApiError', (e) => handleApiError(e.status)),
  Match.exhaustive
);
```

### Error Propagation

- Never catch and ignore errors
- Always preserve original error in `cause` property
- Use typed error channels in Effect: `Effect.Effect<Success, EmailAuthError>`

## Testing Requirements

### Error Classes

- Test `_tag` property value matches class name
- Test `name` property value matches class name
- Test `cause` property is properly stored
- Test message is accessible via `.message`
- Test instanceof checks work correctly

### Schemas

- Test valid authClient structure passes validation
- Test missing authClient fails validation
- Test non-object authClient fails validation
- Test passthrough allows plugin-added properties

## Common Mistakes

❌ **Don't create new error types without _tag:**

```typescript
// WRONG
class MyError extends Error {}
```

✅ **Always include _tag for discriminated union:**

```typescript
// CORRECT
class MyError extends Error {
  readonly _tag = 'MyError';
}
```

❌ **Don't mutate EmailAuthClientDeps:**

```typescript
// WRONG
const deps: EmailAuthClientDeps = { authClient };
deps.authClient = newClient; // Type error - readonly!
```

✅ **Create new instances instead:**

```typescript
// CORRECT
const newDeps: EmailAuthClientDeps = { authClient: newClient };
```

❌ **Don't forget status code in EmailAuthApiError:**

```typescript
// WRONG - loses HTTP status information
new EmailAuthApiError(message, undefined, cause);
```

✅ **Always extract and pass status when available:**

```typescript
// CORRECT
const status = 'status' in error ? (error.status as number) : undefined;
new EmailAuthApiError(message, status, error);
```
