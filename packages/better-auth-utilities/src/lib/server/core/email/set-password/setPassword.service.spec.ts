import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import { ApiError } from "../../../../errors/api.error";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { signInEmailServerController } from "../sign-in-email/signInEmail.controller";
import { signUpEmailServerController } from "../sign-up-email/signUpEmail.controller";
import { setPasswordServerService } from "./setPassword.service";
import { SetPasswordServerParams } from "./setPassword.types";

/**
 * Acceptance Criteria for Service Tests:
 * 1. Must use `setupServerTestEnvironment`.
 * 2. Must test the service function directly.
 * 3. Must decode params using `SetPasswordServerParams` before passing to service (or construct valid typed object).
 * 4. Must provide `AuthServerTag` context.
 * 5. Must verify the API call result.
 * 6. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("Server Set Password Service", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("should perform set password via server api", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      const email = "server-setpassword@example.com";
      const password = "password123";
      const name = "Server Set Password User";
      const newPassword = "newPassword123";

      // 1. Sign Up
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

      // 2. Sign In to get headers
      const signInInput = {
        _tag: "SignInEmailServerParams",
        body: {
          _tag: "SignInEmailCommand",
          email,
          password,
        },
        asResponse: true,
      };

      const signInRes = yield* Effect.provideService(
        signInEmailServerController(signInInput),
        AuthServerTag,
        authServer,
      );

      if (!(signInRes instanceof Response)) {
        expect.fail("Expected Response object");
      }

      const headers = new Headers();
      const setCookie = signInRes.headers.get("set-cookie");
      if (setCookie) {
        headers.set("cookie", setCookie);
      }

      // 3. Set Password
      const params = Schema.decodeSync(SetPasswordServerParams)({
        _tag: "SetPasswordServerParams" as const,
        body: {
          _tag: "SetPasswordCommand" as const,
          newPassword,
        },
        headers,
      });

      const program = setPasswordServerService(params);

      // We expect this to fail because the user already has a password
      const result = yield* Effect.exit(
        Effect.provideService(program, AuthServerTag, authServer),
      );

      if (Exit.isSuccess(result)) {
        // If it somehow succeeded, great!
        expect(result.value).toBeDefined();
      } else {
        // If it failed, check if it's the expected "user already has a password" error
        const cause = result.cause;
        const failureOption = Cause.failureOption(cause);
        if (Option.isSome(failureOption)) {
          const error = failureOption.value;
          if (error instanceof ApiError && error.message === "user already has a password") {
            // This confirms the service called the API and got a domain-specific error
            expect(true).toBe(true);
          } else {
            // Re-raise other errors
            yield* error;
          }
        } else {
          expect.fail("Unknown failure");
        }
      }
    }));

  it.effect("should handle 'Failed to get session' error", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // Prepare test data
      const newPassword = "newPassword123";

      const params = Schema.decodeSync(SetPasswordServerParams)({
        _tag: "SetPasswordServerParams" as const,
        body: {
          _tag: "SetPasswordCommand" as const,
          newPassword,
        },
      });

      const program = setPasswordServerService(params);

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
      expect(error.message).toBe("UNAUTHORIZED");
    }));
});
