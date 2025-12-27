import { it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { forgetPasswordServerService } from "./forgetPassword.service";
import { ForgetPasswordServerParams } from "./forgetPassword.types";

/**
 * Acceptance Criteria for Service Tests:
 * 1. Must use `setupServerTestEnvironment`.
 * 2. Must test the service function directly.
 * 3. Must decode params using `ForgetPasswordServerParams` before passing to service (or construct valid typed object).
 * 4. Must provide `AuthServerTag` context.
 * 5. Must verify the API call result.
 * 6. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("Server Forget Password Service", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("should perform forget password via server api", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // Prepare test data
      const email = "test@example.com";

      const params = Schema.decodeSync(ForgetPasswordServerParams)({
        _tag: "ForgetPasswordServerParams" as const,
        body: {
          _tag: "ForgetPasswordCommand" as const,
          email,
        },
      });

      const program = forgetPasswordServerService(params);

      const res = yield* Effect.provideService(
        program,
        AuthServerTag,
        authServer,
      );

      expect(res).toBeDefined();
    }));
});
