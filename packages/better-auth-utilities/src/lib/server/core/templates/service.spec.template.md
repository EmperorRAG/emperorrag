# Template for service tests of server-side module

```typescript
import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { AuthServerTag } from "../../../server.layer"; // Adjust path
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment"; // Adjust path
import { {{camelCase}}ServerService } from "./{{camelCase}}.service";
import { {{PascalCase}}ServerParams } from "./{{camelCase}}.types";
import { ApiError } from "../../../../errors/api.error"; // Adjust path

/**
 * Acceptance Criteria for Service Tests:
 * 1. Must use `setupServerTestEnvironment`.
 * 2. Must test the service function directly.
 * 3. Must decode params using `{{PascalCase}}ServerParams` before passing to service (or construct valid typed object).
 * 4. Must provide `AuthServerTag` context.
 * 5. Must verify the API call result.
 * 6. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("Server {{PascalCase}} Service", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("should perform {{humanReadable}} via server api", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // Prepare test data
      const params = Schema.decodeSync({{PascalCase}}ServerParams)({
        _tag: "{{PascalCase}}ServerParams" as const,
        body: {
          // _tag: "{{PascalCase}}Command" as const,
          // ... fields
        },
      });

      const program = {{camelCase}}ServerService(params);

      const res = yield* Effect.provideService(program, AuthServerTag, authServer);

      expect(res).toBeDefined();
      // Add specific assertions
    }));

  it.effect("should handle ApiError", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // Prepare test data that causes error
      const params = Schema.decodeSync({{PascalCase}}ServerParams)({
        _tag: "{{PascalCase}}ServerParams" as const,
        body: {
          // ... fields that cause error
        },
      });

      const program = {{camelCase}}ServerService(params);

      const result = yield* Effect.exit(
        Effect.provideService(program, AuthServerTag, authServer),
      );

      // Assert failure
      // expect(result).toBeFailure();
    }));
});
```
