import { it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { resetPasswordServerService } from "./resetPassword.service";
import { ResetPasswordServerParams } from "./resetPassword.types";

/**
 * Acceptance Criteria for Service Tests:
 * 1. Must use `setupServerTestEnvironment`.
 * 2. Must test the service function directly.
 * 3. Must decode params using `ResetPasswordServerParams` before passing to service (or construct valid typed object).
 * 4. Must provide `AuthServerTag` context.
 * 5. Must verify the API call result.
 * 6. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("Server Reset Password Service", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("should perform reset password via server api", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // Prepare test data
      const newPassword = "newPassword123";
      const token = "valid-token";

      const params = Schema.decodeSync(ResetPasswordServerParams)({
        _tag: "ResetPasswordServerParams" as const,
        body: {
          _tag: "ResetPasswordCommand" as const,
          newPassword,
          token,
        },
      });

      const program = resetPasswordServerService(params);

      const res = yield* Effect.provideService(
        program,
        AuthServerTag,
        authServer,
      );

      expect(res).toBeDefined();
    }));
});
