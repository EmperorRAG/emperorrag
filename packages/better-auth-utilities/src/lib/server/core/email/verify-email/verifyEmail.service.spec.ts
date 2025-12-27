import { it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { verifyEmailServerService } from "./verifyEmail.service";
import { VerifyEmailServerParams } from "./verifyEmail.types";

/**
 * Acceptance Criteria for Service Tests:
 * 1. Must use `setupServerTestEnvironment`.
 * 2. Must test the service function directly.
 * 3. Must decode params using `VerifyEmailServerParams` before passing to service (or construct valid typed object).
 * 4. Must provide `AuthServerTag` context.
 * 5. Must verify the API call result.
 * 6. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("Server Verify Email Service", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("should perform verify email via server api", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // Prepare test data
      const token = "valid-token";
      const callbackURL = "https://example.com/callback";

      const params = Schema.decodeSync(VerifyEmailServerParams)({
        _tag: "VerifyEmailServerParams" as const,
        body: {
          _tag: "VerifyEmailCommand" as const,
          token,
          callbackURL,
        },
      });

      const program = verifyEmailServerService(params);

      const res = yield* Effect.provideService(
        program,
        AuthServerTag,
        authServer,
      );

      expect(res).toBeDefined();
    }));
});
