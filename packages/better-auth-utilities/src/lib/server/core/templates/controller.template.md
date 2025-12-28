# Template for controller of server-side module

> **Note:** The `{{camelCase}}` and `{{PascalCase}}` placeholders must include the "Server" suffix (e.g., `signInServer`, `SignInServer`).

```typescript
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { pipe } from "effect/Function";
import { {{camelCase}}Service } from "./{{camelCase}}.service";
import { {{PascalCase}}Params } from "./{{camelCase}}.types";

/**
 * Controller for handling {{humanReadable}} requests.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `{{camelCase}}Controller`.
 * 2. Must take an `unknown` input.
 * 3. Must validate the input against the `{{PascalCase}}Params` schema using `Schema.decodeUnknown`.
 * 4. Must delegate processing to `{{camelCase}}Service` using `Effect.flatMap`.
 * 5. Must return an Effect.
 *
 * @param input - The input data for the request.
 * @returns An Effect that resolves to the result of the service.
 */
export const {{camelCase}}Controller = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown({{PascalCase}}Params),
    Effect.flatMap({{camelCase}}Service),
  );
```
