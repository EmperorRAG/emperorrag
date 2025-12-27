import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { requestPasswordResetServerService } from "./requestPasswordReset.service";
import { RequestPasswordResetServerParams } from "./requestPasswordReset.types";

/**
 * Acceptance Criteria for Service Tests:
 * 1. Must use `setupServerTestEnvironment`.
 * 2. Must test the service function directly.
 * 3. Must decode params using `RequestPasswordResetServerParams` before passing to service (or construct valid typed object).
 * 4. Must provide `AuthServerTag` context.
 * 5. Must verify the API call result.
 * 6. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("Server Request Password Reset Service", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("should perform request password reset via server api", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // Prepare test data
      const email = "test@example.com";

      const params = Schema.decodeSync(RequestPasswordResetServerParams)({
        _tag: "RequestPasswordResetServerParams" as const,
        body: {
          _tag: "RequestPasswordResetCommand" as const,
          email,
        },
      });

      const program = requestPasswordResetServerService(params);

      const res = yield* Effect.provideService(
        program,
        AuthServerTag,
        authServer,
      );

      expect(res).toBeDefined();
    }));
});
