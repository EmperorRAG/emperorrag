---
description: "TypeScript instructions for coding standards and best practices."
applyTo: "**/*.ts"
---

# TypeScript

Instructions for writing TypeScript in this repository.

## Type Safety

### No Type Assertions

Do not use the `as` keyword for type assertions (for example, `as any`, `as unknown`, `as MyType`) to bypass type checking. If a type mismatch occurs, fix the underlying type definition or data structure, or report the issue if it requires upstream changes.

Exception: `as const` is allowed for literal narrowing.

## Type Definitions

### Interface-Based Function Types

Define function types as interfaces in separate `.types.ts` files:

```typescript
// handleApiError.types.ts
export interface HandleApiErrorProps {
  <A, E, R>(input: SomeType<A, E, R>): SomeType<A, OtherError, R>;
}
```

```typescript
// handleApiError.ts
import type { HandleApiErrorProps } from "./handleApiError.types";

export const handleApiError: HandleApiErrorProps = (input) => {
  // implementation
};
```

### Generic Type Parameters

Use descriptive single-letter generic type parameters consistently:

- `A` - Primary value/success type
- `E` - Error type
- `R` - Requirements/context/dependencies type
- `T` - General type parameter

### readonly Modifier for Immutable Properties

Use `readonly` modifier for properties that should not be reassigned:

```typescript
type PasswordPolicy = {
  readonly minLength: number;
  readonly maxLength: number;
};
```

### Type Aliases for Complex Types

Use `type` keyword to create type aliases for complex or reused types:

```typescript
export type BetterAuthOptionsType = typeof BetterAuthOptions.Type;
```

## Import Conventions

### Named Imports (Default)

Use named imports as the standard import style:

```typescript
import { ApiError } from "../../errors/api.error";
import { pipe, flow } from "effect/Function";
```

### Type-Only Imports

Use `import type` for imports that are only used in type positions:

```typescript
import type { ApiError } from "../../errors/api.error";
import type { SomeInterface } from "./some.types";
```

### Package-Specific Import Conventions

Package-specific import conventions take priority over the standard named import style. Follow the conventions established by each library. For example, Effect modules use namespace imports:

```typescript
import * as Schema from "effect/Schema";
import * as Effect from "effect/Effect";
```

## Function Patterns

### Arrow Function Exports

Export functions as `const` arrow function assignments:

```typescript
export const mapInputError = (error: unknown) => {
  // implementation
};
```

### Function Parameter with unknown

Use `unknown` instead of `any` for parameters accepting arbitrary input:

```typescript
static decode(input: unknown) {
  // safe parsing with type narrowing
}
```

### never Return Type

Use `never` as return type for functions that always throw or never return a value:

```typescript
(error: unknown): ResultType<never, SomeError>
```

## File Organization

### Separate Type Files

Place type definitions in dedicated `.types.ts` files alongside implementation:

```
pipeline/
  handle-api-error/
    handleApiError.ts
    handleApiError.types.ts
```

### Domain-Organized Files

Organize files by domain concept with consistent naming:

```
schema/
  emails/
    email.schema.ts
  users/
    user.schema.ts
commands/
  sign-up-email/
    SignUpEmail.command.ts
```

### File Naming Conventions

- Schema files: `*.schema.ts`
- Command files: `*.command.ts`
- Error files: `*.error.ts`
- Type files: `*.types.ts`
- Layer/service files: `*.layer.ts`
- Spec/test files: `*.spec.ts`