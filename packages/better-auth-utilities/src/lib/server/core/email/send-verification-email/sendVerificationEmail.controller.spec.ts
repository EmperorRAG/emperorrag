import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Option from "effect/Option";
import { InputError } from "../../../../errors/input.error";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { signUpEmailServerController } from "../sign-up-email/signUpEmail.controller";
import { sendVerificationEmailServerController } from "./sendVerificationEmail.controller";

/**
 * Acceptance Criteria for Controller Tests:
 * 1. Must use `setupServerTestEnvironment` to mock/setup the auth server.
 * 2. Must test the happy path: successfully decoding input and calling the service.
 * 3. Must verify the result contains expected data.
 */
describe("Server Send Verification Email Controller", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment({
      serverConfig: {
        emailVerification: {
          sendOnSignUp: true,
          sendVerificationEmail: async () => {
            // Mock email sending
          },
        },
      },
    });
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("should successfully decode input and call service", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // 1. Sign Up
      const email = "controller-verify@example.com";
      const password = "password123";
      const name = "Controller Verify User";

      const signUpInput = {
        _tag: "SignUpEmailServerParams",
        body: {
          _tag: "SignUpEmailCommand",
          email,
          password,
          name,
        },
      };

      yield* Effect.provideService(
        signUpEmailServerController(signUpInput),
        AuthServerTag,
        authServer,
      );

      // 2. Send Verification Email
      const rawInput = {
        _tag: "SendVerificationEmailServerParams" as const,
        body: {
          _tag: "SendVerificationEmailCommand" as const,
          email,
        },
      };

      const program = sendVerificationEmailServerController(rawInput);

      const res = yield* Effect.provideService(
        program,
        AuthServerTag,
        authServer,
      );

      expect(res).toBeDefined();
    }));

  it.effect("should handle invalid input", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      const rawInput = {
        _tag: "InvalidTag",
      };

      const program = sendVerificationEmailServerController(rawInput);

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
