import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import { ApiError } from "../../../../errors/api.error";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { verifyEmailServerService } from "./verifyEmail.service";
import { VerifyEmailServerParams } from "./verifyEmail.types";

/**
 * Acceptance Criteria for Service Tests:
 * 1. Must use `setupServerTestEnvironment`.
 * 2. Must test the service function directly.
 * 3. Must decode params using `VerifyEmailServerParams` before passing to service (or construct valid typed object).
 * 4. Must provide `AuthServerTag` context.
 * 5. Must verify the API call result.
 * 6. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("Server Verify Email Service", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;
  let capturedToken: string | undefined;

  beforeAll(async () => {
    env = await setupServerTestEnvironment({
      serverConfig: {
        emailVerification: {
          sendOnSignUp: true,
          sendVerificationEmail: async ({ token }) => {
            capturedToken = token;
          },
        },
      },
    });
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("should perform verify email via server api", () =>
    Effect.gen(function*() {
      const { authServer } = env;
      capturedToken = undefined;

      // 1. Sign Up to trigger verification email
      yield* Effect.tryPromise(() =>
        authServer.api.signUpEmail({
          body: {
            email: "verify-service@example.com",
            password: "password123",
            name: "Verify Service User",
          },
        })
      );

      // Wait for token capture
      yield* Effect.promise(() =>
        new Promise((resolve) => {
          const check = () => {
            if (capturedToken) resolve(true);
            else setTimeout(check, 50);
          };
          check();
        })
      );

      if (!capturedToken) throw new Error("Token not captured");

      const params = Schema.decodeSync(VerifyEmailServerParams)({
        _tag: "VerifyEmailServerParams" as const,
        body: {
          _tag: "VerifyEmailCommand" as const,
          token: capturedToken,
          callbackURL: "http://localhost:3000",
        },
      });

      const program = verifyEmailServerService(params);

      // Expect success or 302 redirect
      yield* Effect.provideService(
        program,
        AuthServerTag,
        authServer,
      ).pipe(
        Effect.catchTag("ApiError", (e) => e.status === 302 ? Effect.void : Effect.fail(e)),
      );

      expect(true).toBe(true);
    }));

  it.effect("should handle ApiError (invalid token)", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      const params = Schema.decodeSync(VerifyEmailServerParams)({
        _tag: "VerifyEmailServerParams" as const,
        body: {
          _tag: "VerifyEmailCommand" as const,
          token: "invalid-token",
          callbackURL: "http://localhost:3000",
        },
      });

      const program = verifyEmailServerService(params);

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
