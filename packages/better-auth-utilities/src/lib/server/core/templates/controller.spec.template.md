# Template for controller tests of server-side module

> **Note:** The `{{camelCase}}` and `{{PascalCase}}` placeholders must include the "Server" suffix (e.g., `signInServer`, `SignInServer`).

```typescript
import { it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { AuthServerTag } from "../../../server.layer"; // Adjust path
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment"; // Adjust path
import { {{camelCase}}Controller } from "./{{camelCase}}.controller";

/**
 * Acceptance Criteria for Controller Tests:
 * 1. Must use `setupServerTestEnvironment` to mock/setup the auth server.
 * 2. Must test the happy path: successfully decoding input and calling the service.
 * 3. Must verify the result contains expected data.
 */
describe("Server {{PascalCase}} Controller", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("should successfully decode input and call service", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // Prepare test data
      const rawInput = {
        _tag: "{{PascalCase}}Params" as const,
        body: {
          // _tag: "{{PascalCase}}Command" as const,
          // ... required fields
        },
      };

      const program = {{camelCase}}Controller(rawInput);

      const res = yield* Effect.provideService(program, AuthServerTag, authServer);

      expect(res).toBeDefined();
      // Add specific assertions
    }));
});
```
