import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { verifyEmailServerController } from "./verifyEmail.controller";

/**
 * Acceptance Criteria for Controller Tests:
 * 1. Must use `setupServerTestEnvironment` to mock/setup the auth server.
 * 2. Must test the happy path: successfully decoding input and calling the service.
 * 3. Must verify the result contains expected data.
 */
describe("Server Verify Email Controller", () => {
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
      const token = "valid-token";
      const callbackURL = "https://example.com/callback";

      const rawInput = {
        _tag: "VerifyEmailServerParams" as const,
        body: {
          _tag: "VerifyEmailCommand" as const,
          token,
          callbackURL,
        },
      };

      const program = verifyEmailServerController(rawInput);

      const res = yield* Effect.provideService(
        program,
        AuthServerTag,
        authServer,
      );

      expect(res).toBeDefined();
    }));
});
