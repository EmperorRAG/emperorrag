import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import { ApiError } from "../../../../errors/api.error";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { forgetPasswordServerService } from "./forgetPassword.service";
import { ForgetPasswordServerParams } from "./forgetPassword.types";

/**
 * Acceptance Criteria for Service Tests:
 * 1. Must use `setupServerTestEnvironment`.
 * 2. Must test the service function directly.
 * 3. Must decode params using `ForgetPasswordServerParams` before passing to service (or construct valid typed object).
 * 4. Must provide `AuthServerTag` context.
 * 5. Must verify the API call result.
 * 6. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("Server Forget Password Service", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;
  let emailSent = false;

  beforeAll(async () => {
    env = await setupServerTestEnvironment({
      serverConfig: {
        emailAndPassword: {
          enabled: true,
          sendResetPassword: async () => {
            emailSent = true;
          },
        },
      },
    });
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("should perform forget password via server api", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // Prepare test data
      const email = "test@example.com";

      // Create user first
      yield* Effect.tryPromise(() =>
        authServer.api.signUpEmail({
          body: {
            email,
            password: "password123",
            name: "Test User",
          },
        })
      );

      const params = Schema.decodeSync(ForgetPasswordServerParams)({
        _tag: "ForgetPasswordServerParams" as const,
        body: {
          _tag: "ForgetPasswordCommand" as const,
          email,
        },
      });

      const program = forgetPasswordServerService(params);

      const res = yield* Effect.provideService(
        program,
        AuthServerTag,
        authServer,
      );

      expect(res).toBeDefined();

      // Wait a bit for the async email sender to fire
      yield* Effect.promise(() => new Promise((resolve) => setTimeout(resolve, 100)));
      expect(emailSent).toBe(true);
    }));

  it.effect("should handle ApiError", () =>
    Effect.gen(function*() {
      const { authServer } = env;
      const email = "api-error@example.com";

      // Mock failure
      const originalForgetPassword = authServer.api.forgetPassword;
      authServer.api.forgetPassword = (() => Promise.reject({ status: 500, body: { message: "API Error" } })) as any;

      const params = Schema.decodeSync(ForgetPasswordServerParams)({
        _tag: "ForgetPasswordServerParams" as const,
        body: {
          _tag: "ForgetPasswordCommand" as const,
          email,
        },
      });

      const program = forgetPasswordServerService(params);

      const result = yield* Effect.exit(
        Effect.provideService(program, AuthServerTag, authServer),
      );

      // Restore
      authServer.api.forgetPassword = originalForgetPassword;

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
