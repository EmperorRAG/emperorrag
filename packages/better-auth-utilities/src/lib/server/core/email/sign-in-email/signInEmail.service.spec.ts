import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import { ApiError } from "../../../../errors/api.error";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { signUpEmailServerController } from "../sign-up-email/signUpEmail.controller";
import { signInEmailServerService } from "./signInEmail.service";
import { SignInEmailServerParams } from "./signInEmail.types";

/**
 * Acceptance Criteria for Service Tests:
 * 1. Must use `setupServerTestEnvironment`.
 * 2. Must test the service function directly.
 * 3. Must decode params using `SignInEmailServerParams` before passing to service (or construct valid typed object).
 * 4. Must provide `AuthServerTag` context.
 * 5. Must verify the API call result.
 * 6. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("Server Sign In Email Service", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("should perform sign-in email via server api", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // Prepare test data
      const email = "server-signin@example.com";
      const password = "password123";
      const name = "Server Signin User";

      // 1. Sign Up first
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

      // 2. Sign In
      const params = Schema.decodeSync(SignInEmailServerParams)({
        _tag: "SignInEmailServerParams",
        body: {
          _tag: "SignInEmailCommand",
          email,
          password,
        },
      });

      const program = signInEmailServerService(params);

      const res = yield* Effect.provideService(
        program,
        AuthServerTag,
        authServer,
      );

      expect(res).toBeDefined();
    }));

  it.effect("should handle 'Invalid email or password' error", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // Prepare test data
      const email = "wrong-email@example.com";
      const password = "wrong-password";

      const params = Schema.decodeSync(SignInEmailServerParams)({
        _tag: "SignInEmailServerParams",
        body: {
          _tag: "SignInEmailCommand",
          email,
          password,
        },
      });

      const program = signInEmailServerService(params);

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
      expect(error.message).toBe("Invalid email or password");
    }));
});
