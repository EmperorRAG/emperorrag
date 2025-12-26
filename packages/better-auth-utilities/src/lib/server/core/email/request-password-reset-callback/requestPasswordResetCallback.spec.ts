import * as Effect from "effect/Effect";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestEnv } from "../../../../test/setup-test-env";
import { AuthServerTag } from "../../../server.service";
import { requestPasswordResetCallbackServerService } from "./requestPasswordResetCallback.service";

describe("Server Request Password Reset Callback", () => {
  let env: Awaited<ReturnType<typeof setupTestEnv>>;

  beforeAll(async () => {
    env = await setupTestEnv();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it("should fail with invalid token", async () => {
    const { authServer } = env;

    const program = requestPasswordResetCallbackServerService({
      params: {
        token: "invalid-token",
      },
      query: {
        callbackURL: "http://localhost",
      },
    });

    await expect(
      Effect.runPromise(
        Effect.provideService(program, AuthServerTag, authServer),
      ),
    ).rejects.toThrow();
  });
});
