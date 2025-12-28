import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Option from "effect/Option";
import { InputError } from "../../../../errors/input.error";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { signInEmailServerController } from "../sign-in-email/signInEmail.controller";
import { signUpEmailServerController } from "../sign-up-email/signUpEmail.controller";
import { setPasswordServerController } from "./setPassword.controller";

/**
 * Acceptance Criteria for Controller Tests:
 * 1. Must use `setupServerTestEnvironment` to mock/setup the auth server.
 * 2. Must test the happy path: successfully decoding input and calling the service.
 * 3. Must verify the result contains expected data.
 */
describe("Server Set Password Controller", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  /*
   * TODO: This test requires tooling to create a user without a password and sign them in without a password.
   * Currently, the `signUpEmailServerController` enforces password creation, and `signInEmailServerController` requires a password.
   * We need a way to seed a passwordless user (e.g., via OAuth mock or direct DB insertion with valid session generation)
   * to properly test the happy path of `setPassword`.
   */
  it.effect.skip("should successfully decode input and call service", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      const email = "controller-setpassword@example.com";
      const password = "password123";
      const name = "Controller Set Password User";
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
      const rawInput = {
        _tag: "SetPasswordServerParams" as const,
        body: {
          _tag: "SetPasswordCommand" as const,
          newPassword,
        },
        headers,
      };

      const program = setPasswordServerController(rawInput);

      const result = yield* Effect.exit(
        Effect.provideService(program, AuthServerTag, authServer),
      );

      if (Exit.isFailure(result)) {
        expect.fail(`Set Password failed: ${Cause.pretty(result.cause)}`);
      }

      expect(result.value).toBeDefined();
    }));

  it.effect("should handle invalid input", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // Prepare invalid test data
      const rawInput = {
        _tag: "InvalidTag",
      };

      const program = setPasswordServerController(rawInput);

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
