import { it } from "@effect/vitest";
import { Effect, Schema } from "effect";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { sendVerificationEmailService } from "./sendVerificationEmail.service";
import { SendVerificationEmailServerParams } from "./sendVerificationEmail.types";

/**
 * Acceptance Criteria for Service Tests:
 * 1. Must use `setupServerTestEnvironment`.
 * 2. Must test the service function directly.
 * 3. Must decode params using `SendVerificationEmailServerParams` before passing to service (or construct valid typed object).
 * 4. Must provide `AuthServerTag` context.
 * 5. Must verify the API call result.
 * 6. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("Server Send Verification Email Service", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("should perform send verification email via server api", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // Prepare test data
      const email = "test@example.com";

      const params = Schema.decodeSync(SendVerificationEmailServerParams)({
        _tag: "SendVerificationEmailServerParams" as const,
        body: {
          _tag: "SendVerificationEmailCommand" as const,
          email,
        },
      });

      const program = sendVerificationEmailService(params);

      const res = yield* Effect.provideService(
        program,
        AuthServerTag,
        authServer,
      );

      expect(res).toBeDefined();
    }));
});
