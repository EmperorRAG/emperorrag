import * as Effect from "effect/Effect";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestEnv } from "../../../../test/setup-test-env";
import { AuthServerTag } from "../../../server.service";
import { accountInfoServerService } from "./accountInfo.service";

describe("Server Account Info", () => {
  let env: Awaited<ReturnType<typeof setupTestEnv>>;

  beforeAll(async () => {
    env = await setupTestEnv();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it("should fail without authentication", async () => {
    const { authServer } = env;

    const program = accountInfoServerService({ body: { accountId: "test" } });

    await expect(
      Effect.runPromise(
        Effect.provideService(program, AuthServerTag, authServer),
      ),
    ).rejects.toThrow();
  });
});
