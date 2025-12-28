import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Option from "effect/Option";
import { InputError } from "../../../../errors/input.error";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { changeEmailServerController } from "./changeEmail.controller";

/**
 * Acceptance Criteria for Controller Tests:
 * 1. Must use `setupServerTestEnvironment` to mock/setup the auth server.
 * 2. Must test the happy path: successfully decoding input and calling the service.
 * 3. Must verify the result contains expected data.
 */
describe("Server Change Email Controller", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment({
      serverConfig: {
        user: {
          changeEmail: {
            enabled: true,
          },
        },
        emailAndPassword: {
          enabled: true,
        },
        emailVerification: {
          sendOnSignUp: false,
          sendVerificationEmail: async () => {
            // Mock
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

      // 1. Sign Up to get session
      const email = "change-email-controller@example.com";
      const password = "password123";
      const newEmail = "new-email-controller@example.com";

      const signUpRes = yield* Effect.tryPromise(() =>
        authServer.api.signUpEmail({
          body: {
            email,
            password,
            name: "Change Email User",
          },
          asResponse: true,
        })
      );

      const cookie = signUpRes.headers.get("set-cookie");
      const headers = new Headers();
      if (cookie) {
        headers.append("cookie", cookie);
      }

      const rawInput = {
        _tag: "ChangeEmailServerParams" as const,
        body: {
          _tag: "ChangeEmailCommand" as const,
          newEmail,
        },
        headers,
      };

      const program = changeEmailServerController(rawInput);

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

      const program = changeEmailServerController(rawInput);

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
