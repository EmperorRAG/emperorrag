import { it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import { afterAll, beforeAll, describe, expect } from "vitest";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { changePasswordServerController } from "./changePassword.controller";

/**
 * Acceptance Criteria for Controller Tests:
 * 1. Must use `setupServerTestEnvironment` to mock/setup the auth server.
 * 2. Must test the happy path: successfully decoding input and calling the service.
 * 3. Must verify the result contains expected data.
 */
describe("Server Change Password Controller", () => {
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
      const newPassword = "newPassword123";
      const currentPassword = "oldPassword123";

      const rawInput = {
        _tag: "ChangePasswordServerParams" as const,
        body: {
          _tag: "ChangePasswordCommand" as const,
          newPassword,
          currentPassword,
          revokeOtherSessions: true,
        },
      };

      const program = changePasswordServerController(rawInput);

      const res = yield* Effect.provideService(
        program,
        AuthServerTag,
        authServer,
      );

      expect(res).toBeDefined();
    }));
});
