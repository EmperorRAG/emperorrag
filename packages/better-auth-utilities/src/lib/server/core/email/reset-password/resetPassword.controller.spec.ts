import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Option from "effect/Option";
import { InputError } from "../../../../errors/input.error";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { resetPasswordServerController } from "./resetPassword.controller";

/**
 * Acceptance Criteria for Controller Tests:
 * 1. Must use `setupServerTestEnvironment` to mock/setup the auth server.
 * 2. Must test the happy path: successfully decoding input and calling the service.
 * 3. Must verify the result contains expected data.
 */
describe("Server Reset Password Controller", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;
  let capturedToken: string | undefined;

  beforeAll(async () => {
    env = await setupServerTestEnvironment({
      serverConfig: {
        emailAndPassword: {
          enabled: true,
          sendResetPassword: async ({ token }) => {
            capturedToken = token;
          },
        },
        emailVerification: {
          enabled: true,
          sendOnSignUp: false,
          sendVerificationEmail: async () => {},
        },
      },
    });
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it("should successfully decode input and call service", async () => {
    const { authServer } = env;

    // 1. Sign Up
    const email = "reset-controller@example.com";
    const password = "password123";
    const name = "Reset Controller User";

    await authServer.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    // 2. Forget Password
    await authServer.api.forgetPassword({
      body: {
        email,
        redirectTo: "/reset-password",
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    if (!capturedToken) {
      throw new Error("Token was not captured");
    }

    // 3. Reset Password
    const newPassword = "newPassword123";
    const rawInput = {
      _tag: "ResetPasswordServerParams" as const,
      body: {
        _tag: "ResetPasswordCommand" as const,
        newPassword,
        token: capturedToken,
      },
    };

    await Effect.runPromise(
      Effect.gen(function*() {
        const res = yield* Effect.provideService(
          resetPasswordServerController(rawInput),
          AuthServerTag,
          authServer,
        );

        // Verify password change by signing in
        const signInRes = yield* Effect.tryPromise(() =>
          authServer.api.signInEmail({
            body: {
              email,
              password: newPassword,
            },
          })
        );

        expect(signInRes).toBeDefined();
        expect(signInRes.user).toBeDefined();
      }),
    );
  }, 10000);

  it.effect("should handle invalid input (InputError)", () =>
    Effect.gen(function*() {
      const { authServer } = env;
      const invalidInput = {
        _tag: "ResetPasswordServerParams",
        body: {
          _tag: "ResetPasswordCommand",
          newPassword: "short", // Invalid password (too short)
          token: "some-token",
        },
      };

      const result = yield* Effect.exit(
        Effect.provideService(
          resetPasswordServerController(invalidInput),
          AuthServerTag,
          authServer,
        ),
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
