import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Option from "effect/Option";
import { InputError } from "../../../../errors/input.error";
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

  it.effect("should handle invalid input", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // Prepare invalid test data
      const rawInput = {
        _tag: "InvalidTag",
      };

      const program = signUpEmailServerController(rawInput);

      const result = yield* Effect.exit(
        Effect.provideService(program, AuthServerTag, authServer),
      );

      if (Exit.isSuccess(result)) {
        expect.fail("Expected failure");
      }

      const cause = result.cause;
      const failureOption = Cause.failureOption(cause);

      if (Option.isNone(failureOption)) {
        expect.fail("Expected failure option to be Some");
      }

      const error = failureOption.value;

      expect(error).toBeInstanceOf(InputError);
    }));
});
