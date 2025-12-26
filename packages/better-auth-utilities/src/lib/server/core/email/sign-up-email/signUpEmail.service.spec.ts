import { Effect, Schema } from "effect";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { signUpEmailServerService } from "./signUpEmail.service";
import { SignUpEmailServerParams } from "./signUpEmail.types";

describe("Server Sign Up Email", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it("should sign up a user via server api", async () => {
    const { authServer } = env;
    const email = "server-signup@example.com";
    const password = "password123";
    const name = "Server Sign Up";

    const params = Schema.decodeSync(SignUpEmailServerParams)({
      _tag: "SignUpEmailServerParams" as const,
      body: {
        _tag: "SignUpEmailCommand" as const,
        email,
        password,
        name,
      },
    });

    const program = signUpEmailServerService(params);

    const res = await Effect.runPromise(
      Effect.provideService(program, AuthServerTag, authServer),
    );

    expect(res).toBeDefined();
    expect(res.user).toBeDefined();
    expect(res.user.email).toBe(email);
  });
});
