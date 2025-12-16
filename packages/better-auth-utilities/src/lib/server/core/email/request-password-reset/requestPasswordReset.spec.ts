import * as Effect from "effect/Effect";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestEnv } from "../../../../test/setup-test-env";
import { AuthServerTag } from "../../../server.service";
import { requestPasswordResetServerService } from "./requestPasswordReset.service";

describe("Server Request Password Reset", () => {
  let env: Awaited<ReturnType<typeof setupTestEnv>>;

  beforeAll(async () => {
    env = await setupTestEnv();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it("should fail for non-existent user", async () => {
    const { authServer } = env;

    const program = requestPasswordResetServerService({
      body: {
        email: "nonexistent@example.com",
      },
    });

    await expect(Effect.runPromise(Effect.provideService(program, AuthServerTag, authServer))).rejects.toThrow();
  });
});
