import * as Effect from "effect/Effect";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestEnv } from "../../../../test/setup-test-env";
import { AuthServerTag } from "../../../server.service";
import { signInSocialServerService } from "./signInSocial.service";

describe("Server Sign In Social", () => {
  let env: Awaited<ReturnType<typeof setupTestEnv>>;

  beforeAll(async () => {
    env = await setupTestEnv();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it("should fail when oauth provider is not configured", async () => {
    const { authServer } = env;

    const program = signInSocialServerService({
      body: {
        provider: "google",
        callbackURL: "/dashboard",
      },
    });

    await expect(
      Effect.runPromise(
        Effect.provideService(program, AuthServerTag, authServer),
      ),
    ).rejects.toThrow();
  });

  it("should fail with invalid provider", async () => {
    const { authServer } = env;

    const program = signInSocialServerService({
      body: {
        provider: "invalid-provider",
      },
    });

    await expect(
      Effect.runPromise(
        Effect.provideService(program, AuthServerTag, authServer),
      ),
    ).rejects.toThrow();
  });
});
