# Template for controller of server-side module

```typescript
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { pipe } from "effect/Function";
import { mapInputError } from "../../../../pipeline/map-input-error/mapInputError"; // Adjust path
import { {{camelCase}}ServerService } from "./{{camelCase}}.service";
import { {{PascalCase}}ServerParams } from "./{{camelCase}}.types";

/**
 * Controller for handling {{humanReadable}} requests.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `{{camelCase}}ServerController`.
 * 2. Must take an `unknown` input.
 * 3. Must validate the input against the `{{PascalCase}}ServerParams` schema using `Schema.decodeUnknown`.
 * 4. Must delegate processing to `{{camelCase}}ServerService` using `Effect.flatMap`.
 * 5. Must return an Effect.
 *
 * @param input - The input data for the request.
 * @returns An Effect that resolves to the result of the service.
 */
export const {{camelCase}}ServerController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown({{PascalCase}}ServerParams),
    Effect.catchAll(mapInputError),
    Effect.flatMap({{camelCase}}ServerService),
  );
```
