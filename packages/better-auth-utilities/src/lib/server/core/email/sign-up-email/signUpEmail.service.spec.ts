import { it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { afterAll, beforeAll, describe, expect } from "vitest";
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

  it.effect("should sign up a user via server api", () =>
    Effect.gen(function*() {
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
