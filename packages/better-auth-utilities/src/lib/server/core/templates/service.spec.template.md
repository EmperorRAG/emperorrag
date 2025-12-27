# Template for service tests of server-side module

```typescript
import { it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { AuthServerTag } from "../../../server.layer"; // Adjust path
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment"; // Adjust path
import { {{camelCase}}Service } from "./{{camelCase}}.service";
import { {{PascalCase}}Params } from "./{{camelCase}}.types";

/**
 * Acceptance Criteria for Service Tests:
 * 1. Must use `setupServerTestEnvironment`.
 * 2. Must test the service function directly.
 * 3. Must decode params using `{{PascalCase}}Params` before passing to service (or construct valid typed object).
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
      const params = Schema.decodeSync({{PascalCase}}Params)({
        _tag: "{{PascalCase}}Params" as const,
        body: {
          // _tag: "{{PascalCase}}Command" as const,
          // ... fields
        },
      });

      const program = {{camelCase}}Service(params);

      const res = yield* Effect.provideService(program, AuthServerTag, authServer);

      expect(res).toBeDefined();
      // Add specific assertions
    }));
});
```
