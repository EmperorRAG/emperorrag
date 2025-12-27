import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { signUpEmailServerController } from "./signUpEmail.controller";

describe("Server Sign Up Email Controller", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("should successfully decode input and call service", () =>
    Effect.gen(function*() {
      const { authServer } = env;
      const email = "controller-signup@example.com";
      const password = "password123";
      const name = "Controller Sign Up";

      const rawInput = {
        _tag: "SignUpEmailServerParams" as const,
        body: {
          _tag: "SignUpEmailCommand" as const,
          email,
          password,
          name,
        },
      };

      const program = signUpEmailServerController(rawInput);

      const res = yield* Effect.provideService(
        program,
        AuthServerTag,
        authServer,
      );

      expect(res).toBeDefined();
      expect(res.user).toBeDefined();
      expect(res.user.email).toBe(email);
    }));
});
