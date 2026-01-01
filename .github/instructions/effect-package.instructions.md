---
description: "Effect-TS library patterns and conventions"
applyTo: "**/*.ts"
---

# Effect-TS Library

Patterns and conventions for using the Effect-TS library in this repository.

## Import Conventions

Import Effect modules as namespaces:

```typescript
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import * as Either from "effect/Either";
import * as Match from "effect/Match";
import * as Schema from "effect/Schema";
import * as Array from "effect/Array";
import { pipe } from "effect/Function";
```

## Core Patterns

### pipe for Composition

Use `pipe` from `effect/Function` to create clear, sequential data pipelines.

```typescript
import { pipe } from "effect/Function";
import * as Array from "effect/Array";

/**
 * @pure
 * @description Maps all function values to their string labels.
 * @composition Composes `getAllFunctionValues` with `map(getFunctionLabelValue)`.
 */
export const getAllFunctionLabelValues = (): string[] =>
  pipe(getAllFunctionValues(), Array.map(getFunctionLabelValue));
```

### Effect for Side Effects

Wrap impure operations in an `Effect` to make them declarative and composable.

- Functions that perform side effects must return an `Effect`.
- An `Effect<A, E, R>` describes a computation with success type `A`, error type `E`, and required context `R`.

```typescript
import * as Effect from "effect/Effect";

// Impure function
const log = (message: string): void => {
  console.log(message);
};

// Wrapped in an Effect
const logEffect = (message: string): Effect.Effect<void> =>
  Effect.sync(() => log(message));

// Usage in a pipeline
const program = pipe(
  logEffect("Starting..."),
  Effect.flatMap(() => Effect.succeed(42)),
  Effect.flatMap((n) => logEffect(`The answer is ${n}.`)),
);
```

### Option for Optional Values

Use `Option` to safely handle potentially missing values instead of null or undefined.

```typescript
import * as Option from "effect/Option";

const findUser = (id: number): Option.Option<{ id: number; name: string }> => {
  if (id === 1) {
    return Option.some({ id: 1, name: "Alice" });
  }
  return Option.none();
};

const userName = pipe(
  findUser(1),
  Option.map((user) => user.name),
  Option.getOrElse(() => "User not found"),
);
// => 'Alice'
```

### Either for Synchronous Error Handling

Use `Either` for synchronous functions that can fail. Use `Effect` for asynchronous or effectful functions that can fail.

- `Either<E, A>` represents a value that is either a `Left<E>` (error) or a `Right<A>` (success).

```typescript
import * as Either from "effect/Either";

const parseNumber = (s: string): Either.Either<Error, number> => {
  const n = parseFloat(s);
  return isNaN(n) ? Either.left(new Error("Invalid number")) : Either.right(n);
};

const result = pipe(
  parseNumber("123"),
  Either.map((n) => n * 2),
  Either.getOrElse((e) => e.message),
);
// => 246
```

### Match for Pattern Matching

Use the `Match` module for conditional logic instead of if/else or switch statements.

```typescript
import * as Match from "effect/Match";

/**
 * @pure
 * @description Gets the string label for a primitive value using pattern matching.
 */
export const getPrimitiveLabelValue = (value: unknown): string =>
  Match.value(value).pipe(
    Match.when(isNull, () => "null"),
    Match.when(isBigInt, () => "bigint"),
    Match.when(isSymbol, () => "symbol"),
    Match.when(isString, () => "string"),
    Match.when(isNumber, () => "number"),
    Match.when(isBoolean, () => "boolean"),
    Match.when(isUndefined, () => "undefined"),
    Match.orElse(getTypeOf),
  );
```

### Schema for Data Validation

Use `Schema` to parse and validate data structures with full type inference.

```typescript
import * as Schema from "effect/Schema";

const User = Schema.struct({
  id: Schema.number,
  name: Schema.string,
});

const result = Schema.decode(User)({ id: 1, name: "Bob" });
// => Effect.succeed({ id: 1, name: 'Bob' })

const errorResult = Schema.decode(User)({ id: "1", name: "Bob" });
// => Effect.fail(...)
```

## Effect Type Conventions

### Generic Type Parameters

Use consistent naming for Effect type parameters:

- `A` - Success/value type
- `E` - Error type
- `R` - Requirements/context type

```typescript
// Effect.Effect<A, E, R>
Effect.Effect<User, ApiError, AuthService>
```

### never for Infallible Effects

Use `never` for error type when an effect cannot fail:

```typescript
Effect.Effect<User, never, AuthService>
```

### void for Effects Without Meaningful Return

Use `void` for success type when the effect performs an action without returning a value:

```typescript
Effect.Effect<void, LogError, Logger>
```
