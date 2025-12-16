import * as Effect from "effect/Effect";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestEnv } from "../../../../test/setup-test-env";
import { AuthServerTag } from "../../../server.service";
import { deleteUserCallbackServerService } from "./deleteUserCallback.service";

describe("Server Delete User Callback", () => {
  let env: Awaited<ReturnType<typeof setupTestEnv>>;

  beforeAll(async () => {
    env = await setupTestEnv();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it("should fail with invalid token", async () => {
    const { authServer } = env;

    const program = deleteUserCallbackServerService({
      query: {
        token: "invalid-token",
      },
    });

    await expect(Effect.runPromise(Effect.provideService(program, AuthServerTag, authServer))).rejects.toThrow();
  });
});
