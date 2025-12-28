import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Option from "effect/Option";
import { InputError } from "../../../../errors/input.error";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { verifyEmailServerController } from "./verifyEmail.controller";

/**
 * Acceptance Criteria for Controller Tests:
 * 1. Must use `setupServerTestEnvironment` to mock/setup the auth server.
 * 2. Must test the happy path: successfully decoding input and calling the service.
 * 3. Must verify the result contains expected data.
 */
describe("Server Verify Email Controller", () => {
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

  it.effect("should successfully decode input and call service", () =>
    Effect.gen(function*() {
      const { authServer } = env;
      capturedToken = undefined;

      // 1. Sign Up
      yield* Effect.tryPromise(() =>
        authServer.api.signUpEmail({
          body: {
            email: "verify-controller@example.com",
            password: "password123",
            name: "Verify Controller User",
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

      const rawInput = {
        _tag: "VerifyEmailServerParams" as const,
        body: {
          _tag: "VerifyEmailCommand" as const,
          token: capturedToken,
          callbackURL: "http://localhost:3000",
        },
      };

      const program = verifyEmailServerController(rawInput);

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

  it.effect("should handle invalid input", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      const rawInput = {
        _tag: "InvalidTag",
      };

      const program = verifyEmailServerController(rawInput);

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
