---
description: "Code documentation standards using TSDoc"
applyTo: "**/*.ts"
---

# Code Documentation

Standards for documenting TypeScript code using TSDoc comments.

## TSDoc for Pure Functions

Use this template for all exported pure functions:

```typescript
/**
 * A brief, imperative description of what the function does.
 *
 * @pure This tag is mandatory for all pure functions.
 * @description A more detailed explanation if necessary.
 *
 * @fp-pattern Describes the FP pattern used (e.g., "Higher-order function", "Curried function").
 * @composition Documents the chain of functions for `pipe`.
 *   - `pipe(fn1, fn2, fn3)`
 *
 * @param name - Description of the parameter.
 * @returns {ReturnType} Description of the return value.
 *
 * @example
 * // A clear, simple example of how to use the function.
 * const result = functionName(input);
 * // => expected output
 */
```

### Example

```typescript
/**
 * Maps all function values to their string labels.
 *
 * @pure
 * @description Retrieves all function values and transforms them to labels.
 *
 * @fp-pattern Higher-order function
 * @composition
 *   - `pipe(getAllFunctionValues(), Array.map(getFunctionLabelValue))`
 *
 * @returns {string[]} Array of function label strings.
 *
 * @example
 * const labels = getAllFunctionLabelValues();
 * // => ['add', 'subtract', 'multiply']
 */
export const getAllFunctionLabelValues = (): string[] =>
  pipe(getAllFunctionValues(), Array.map(getFunctionLabelValue));
```

## TSDoc for Effectful Functions

Use this template for functions returning an Effect:

```typescript
/**
 * A brief, imperative description of what the effectful function does.
 *
 * @description A more detailed explanation if necessary.
 *
 * @param name - Description of the parameter.
 * @returns {Effect.Effect<A, E, R>} Description of the returned Effect, including:
 *   - `A`: The success type.
 *   - `E`: The error type.
 *   - `R`: The required context/services.
 *
 * @example
 * // A clear, simple example of how to use the function.
 * const program = functionName(input);
 * const result = Effect.runSync(program);
 * // => expected output
 */
```

### Example

```typescript
/**
 * Fetches a user by ID from the database.
 *
 * @description Queries the user repository and returns the user if found.
 *
 * @param id - The unique identifier of the user.
 * @returns {Effect.Effect<User, NotFoundError, UserRepository>}
 *   - `User`: The user object if found.
 *   - `NotFoundError`: Error if user does not exist.
 *   - `UserRepository`: Requires access to user repository service.
 *
 * @example
 * const program = fetchUser(123);
 * const result = await Effect.runPromise(program.pipe(Effect.provide(liveRepo)));
 * // => { id: 123, name: 'Alice' }
 */
export const fetchUser = (id: number): Effect.Effect<User, NotFoundError, UserRepository> =>
  // implementation
```

## Required Tags

### @pure

Mark all pure functions with the `@pure` tag:

```typescript
/**
 * Adds two numbers.
 *
 * @pure
 * @param a - First number.
 * @param b - Second number.
 * @returns {number} The sum of a and b.
 */
export const add = (a: number, b: number): number => a + b;
```

### @composition

Document function composition chains:

```typescript
/**
 * @composition
 *   - `pipe(input, validate, transform, format)`
 */
```

### @fp-pattern

Document the functional programming pattern used:

```typescript
/**
 * @fp-pattern Curried function
 * @fp-pattern Higher-order function
 * @fp-pattern Monadic composition
 */
```

## Description Guidelines

### Brief Descriptions

Start with an imperative verb:

- "Fetches user data from the API"
- "Validates the input against the schema"
- "Transforms the raw response into a domain object"

### Parameter Descriptions

Be specific about expected values:

```typescript
/**
 * @param id - The unique user identifier (positive integer).
 * @param options - Configuration options for the request.
 * @param options.timeout - Request timeout in milliseconds (default: 5000).
 */
```

### Return Descriptions

Describe what the return value represents:

```typescript
/**
 * @returns {User} The authenticated user object with profile data.
 * @returns {Option<User>} Some(user) if found, None otherwise.
 * @returns {Effect.Effect<User[], ApiError, HttpClient>} Effect resolving to array of users.
 */
```

## Examples

Include practical examples that demonstrate usage:

```typescript
/**
 * @example
 * // Basic usage
 * const result = add(2, 3);
 * // => 5
 *
 * @example
 * // With partial application
 * const addFive = add(5);
 * const result = addFive(10);
 * // => 15
 */
```
