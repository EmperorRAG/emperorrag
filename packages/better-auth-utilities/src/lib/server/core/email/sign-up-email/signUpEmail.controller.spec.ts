import * as Effect from "effect/Effect";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestEnv } from "../../../../test/setup-test-env";
import { AuthServerTag } from "../../../server.service";
import { signUpEmailServerController } from "./signUpEmail.controller";

describe("Server Sign Up Email Controller", () => {
  let env: Awaited<ReturnType<typeof setupTestEnv>>;

  beforeAll(async () => {
    env = await setupTestEnv();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it("should successfully decode input and call service", async () => {
    const { authServer } = env;
    const email = "controller-signup@example.com";
    const password = "password123";
    const name = "Controller Sign Up";

    const rawInput = {
      _tag: "SignUpEmailServerParams",
      body: {
        _tag: "SignUpEmailCommand",
        email,
        password,
        name,
      },
    };

    const program = signUpEmailServerController(rawInput);

    const res = await Effect.runPromise(
      Effect.provideService(program, AuthServerTag, authServer),
    );

    expect(res).toBeDefined();
    expect(res.user).toBeDefined();
    expect(res.user.email).toBe(email);
  });
});
