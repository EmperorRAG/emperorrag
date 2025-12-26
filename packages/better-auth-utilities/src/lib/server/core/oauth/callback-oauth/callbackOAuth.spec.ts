import * as Effect from "effect/Effect";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestEnv } from "../../../../test/setup-test-env";
import { AuthServerTag } from "../../../server.service";
import { callbackOAuthServerService } from "./callbackOAuth.service";

describe("Server Callback OAuth", () => {
  let env: Awaited<ReturnType<typeof setupTestEnv>>;

  beforeAll(async () => {
    env = await setupTestEnv();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it("should fail without valid OAuth state", async () => {
    const { authServer } = env;

    const program = callbackOAuthServerService({
      method: "GET",
      params: {
        id: "test-provider",
      },
      query: {
        code: "invalid-code",
        state: "invalid-state",
      },
    });

    await expect(
      Effect.runPromise(
        Effect.provideService(program, AuthServerTag, authServer),
      ),
    ).rejects.toThrow();
  });
});
