---
description: "Functional Programming paradigm guidelines for TypeScript"
applyTo: "**/*.ts"
---

# Functional Programming Paradigm

Guidelines for writing functional TypeScript code that is pure, immutable, and composable.

## Core Principles

### Purity

Pure functions have no side effects and always return the same output for the same input.

- Pure functions (no side effects) return raw values unless they are part of a larger effectful pipeline.
- Mark pure functions with a `@pure` tag in their JSDoc block.
- Functions that perform side effects (logging, network requests, file I/O) must be wrapped in an effect type.

### Immutability

Never mutate input parameters or global state.

- Use `const` for variable declarations unless a mutable binding is unavoidable.
- Return new data structures (objects, arrays) instead of modifying existing ones.

```typescript
// ❌ BAD: Mutates the input array.
const addItem = (arr: T[], item: T) => {
  arr.push(item);
  return arr;
};

// ✅ GOOD: Returns a new array, preserving immutability.
const addItem = <T>(arr: T[], item: T): T[] => [...arr, item];
```

### Function Composition

Compose multiple functions using left-to-right data flow.

- Use a composition utility (like `pipe`) for multi-step transformations.
- Document the composition chain in JSDoc for complex pipelines.
- Avoid method chaining (e.g., `array.map(...).filter(...)`) in favor of composed pipelines.

### Currying and Partial Application

Design functions to support partial application.

- Order parameters to support partial application (data-last).
- Use currying to create specialized, reusable functions from more generic ones.
- Document the signature of curried functions in JSDoc.

## Function Patterns

### Arrow Function Exports

Export functions as nameless arrow functions with `const`.

```typescript
// ✅ CORRECT: Nameless arrow function with const export
export const functionName = (param: Type): ReturnType => {
  // implementation
};

// ❌ AVOID: `function` declarations for exports
export function functionName(param: Type): ReturnType {
  // implementation
}
```

### Declarative Conditional Logic

Use declarative pattern matching instead of imperative conditionals.

```typescript
// ❌ BAD: Imperative if-else pyramid.
const getLabel = (value: unknown): string => {
  if (isNull(value)) {
    return "null";
  } else if (isString(value)) {
    return "string";
  } else {
    return "unknown";
  }
};

// ✅ GOOD: Declarative pattern matching.
const getLabel = (value: unknown): string =>
  match(value)
    .when(isNull, () => "null")
    .when(isString, () => "string")
    .otherwise(() => "unknown");
```

### Declarative Iteration

Use declarative operations instead of imperative loops.

```typescript
// ❌ BAD: Imperative `for` loop.
const labels = [];
for (let i = 0; i < values.length; i++) {
  labels.push(getLabel(values[i]));
}

// ✅ GOOD: Declarative `map` operation.
const labels = values.map(getLabel);
```

### Optional Values

Represent values that may or may not exist with an explicit optional type.

```typescript
// ❌ BAD: Returning null for missing values.
const findUser = (id: number): User | null => {
  // ...
};

// ✅ GOOD: Returning an explicit optional type.
const findUser = (id: number): Option<User> => {
  // ...
};
```

### Error Handling

Make error paths explicit and type-safe instead of throwing exceptions.

```typescript
// ❌ BAD: Throwing an error.
const parse = (json: string): MyType => {
  if (!isValid(json)) {
    throw new Error("Invalid JSON");
  }
  return JSON.parse(json);
};

// ✅ GOOD: Returning an explicit result type.
const parse = (json: string): Result<Error, MyType> => {
  // ...
};
```

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
| --- | --- | --- |
| Mutation | Unpredictable state changes | Return new data structures |
| If-else/switch pyramids | Hard to read and extend | Use pattern matching |
| Imperative loops | Verbose, error-prone | Use map, filter, reduce |
| null/undefined | Implicit optionality | Use explicit Option type |
| Throwing exceptions | Hidden error paths | Use explicit Result/Either type |

## Code Review Checklist

When generating or reviewing functional code, ensure:

- [ ] All pure functions are marked with `@pure`
- [ ] All exported functions are `const` arrow functions
- [ ] Immutability is strictly maintained
- [ ] Multi-step transformations use composition
- [ ] Pattern matching is used for conditional logic
- [ ] Optional values use an explicit type instead of null/undefined
- [ ] Errors are returned explicitly instead of thrown
- [ ] Curried functions use data-last parameter order
