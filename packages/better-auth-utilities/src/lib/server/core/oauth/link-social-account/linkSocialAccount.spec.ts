import * as Effect from "effect/Effect";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestEnv } from "../../../../test/setup-test-env";
import { AuthServerTag } from "../../../server.service";
import { linkSocialAccountServerService } from "./linkSocialAccount.service";

describe("Server Link Social Account", () => {
  let env: Awaited<ReturnType<typeof setupTestEnv>>;

  beforeAll(async () => {
    env = await setupTestEnv();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it("should fail without authentication", async () => {
    const { authServer } = env;

    const program = linkSocialAccountServerService({
      headers: new Headers(),
      body: {
        provider: "google",
      },
    });

    await expect(Effect.runPromise(Effect.provideService(program, AuthServerTag, authServer))).rejects.toThrow();
  });
});
