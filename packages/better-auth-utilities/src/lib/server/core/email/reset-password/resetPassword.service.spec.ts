import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import { ApiError } from "../../../../errors/api.error";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { resetPasswordServerService } from "./resetPassword.service";
import { ResetPasswordServerParams } from "./resetPassword.types";

/**
 * Acceptance Criteria for Service Tests:
 * 1. Must use `setupServerTestEnvironment`.
 * 2. Must test the service function directly.
 * 3. Must decode params using `ResetPasswordServerParams` before passing to service (or construct valid typed object).
 * 4. Must provide `AuthServerTag` context.
 * 5. Must verify the API call result.
 * 6. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("Server Reset Password Service", () => {
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
          sendOnSignUp: false,
          sendVerificationEmail: async () => {},
        },
      },
    });
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("should perform reset password via server api", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // 1. Sign Up
      const email = "reset-service@example.com";
      const password = "password123";
      const name = "Reset Service User";

      yield* Effect.tryPromise(() =>
        authServer.api.signUpEmail({
          body: {
            email,
            password,
            name,
          },
        })
      );

      // 2. Forget Password (to generate token)
      yield* Effect.tryPromise(() =>
        authServer.api.forgetPassword({
          body: {
            email,
            redirectTo: "/reset-password",
          },
        })
      );

      // Wait for token to be captured
      yield* Effect.promise(() => new Promise((resolve) => setTimeout(resolve, 100)));

      if (!capturedToken) {
        throw new Error("Token was not captured");
      }

      // 3. Reset Password
      const newPassword = "newPassword123";
      const params = Schema.decodeSync(ResetPasswordServerParams)({
        _tag: "ResetPasswordServerParams" as const,
        body: {
          _tag: "ResetPasswordCommand" as const,
          newPassword,
          token: capturedToken,
        },
      });

      yield* Effect.provideService(
        resetPasswordServerService(params),
        AuthServerTag,
        authServer,
      );

      // Verify password change by signing in with new password
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
      expect(signInRes.user.email).toBe(email);
    }), 10000);

  it.effect("should handle ApiError when token is invalid", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      const newPassword = "newPassword123";
      const token = "invalid-token";

      const params = Schema.decodeSync(ResetPasswordServerParams)({
        _tag: "ResetPasswordServerParams" as const,
        body: {
          _tag: "ResetPasswordCommand" as const,
          newPassword,
          token,
        },
      });

      const program = resetPasswordServerService(params);

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
      expect(error).toBeInstanceOf(ApiError);
    }));
});
