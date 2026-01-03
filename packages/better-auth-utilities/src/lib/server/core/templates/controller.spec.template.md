# Template for controller tests of server-side module

```typescript
import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Cause from "effect/Cause";
import * as Option from "effect/Option";
import { AuthServerTag } from "../../../server.layer"; // Adjust path
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment"; // Adjust path
import { {{camelCase}}ServerController } from "./{{camelCase}}.controller";
import { InputError } from "../../../../errors/input.error"; // Adjust path

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
        _tag: "{{PascalCase}}ServerParams" as const,
        body: {
          // _tag: "{{PascalCase}}Command" as const,
          // ... required fields
        },
      };

      const program = {{camelCase}}ServerController(rawInput);

      const res = yield* Effect.provideService(program, AuthServerTag, authServer);

      expect(res).toBeDefined();
      // Add specific assertions
    }));

  it.effect("should handle invalid input", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      const rawInput = {
        _tag: "InvalidTag",
      };

      const program = {{camelCase}}ServerController(rawInput);

      const result = yield* Effect.exit(
        Effect.provideService(program, AuthServerTag, authServer),
      );

      if (Exit.isSuccess(result)) {
        expect.fail("Expected failure");
      }

      const cause = result.cause;
      const failureOption = Cause.failureOption(cause);

      if (Option.isNone(failureOption)) {
        expect.fail("Expected failure option to be Some");
      }

      const error = failureOption.value;
      expect(error).toBeInstanceOf(InputError);
    }));
});
```
