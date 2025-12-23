import * as Effect from "effect/Effect";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestEnv } from "../../../../test/setup-test-env";
import { AuthServerTag } from "../../../server.service";
import { signUpEmailServerService } from "./signUpEmail.service";

describe("Server Sign Up Email", () => {
  let env: Awaited<ReturnType<typeof setupTestEnv>>;

  beforeAll(async () => {
    env = await setupTestEnv();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it("should sign up a user via server api", async () => {
    const { authServer } = env;
    const email = "server-signup@example.com";
    const password = "password123";
    const name = "Server Sign Up";

    const program = signUpEmailServerService({
      body: {
        email,
        password,
        name,
      },
    });

    const res = await Effect.runPromise(
      Effect.provideService(program, AuthServerTag, authServer),
    );

    expect(res).toBeDefined();
    expect(res.user).toBeDefined();
    expect(res.user.email).toBe(email);
  });
});
