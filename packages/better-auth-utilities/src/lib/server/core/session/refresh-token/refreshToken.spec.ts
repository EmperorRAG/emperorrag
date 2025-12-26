import * as Effect from "effect/Effect";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestEnv } from "../../../../test/setup-test-env";
import { AuthServerTag } from "../../../server.service";
import { refreshTokenServerService } from "./refreshToken.service";

describe("Server Refresh Token", () => {
  let env: Awaited<ReturnType<typeof setupTestEnv>>;

  beforeAll(async () => {
    env = await setupTestEnv();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it("should fail without valid refresh token", async () => {
    const { authServer } = env;

    const program = refreshTokenServerService({ body: { providerId: "test" } });

    await expect(
      Effect.runPromise(
        Effect.provideService(program, AuthServerTag, authServer),
      ),
    ).rejects.toThrow();
  });
});
