import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { signInEmailServerController } from "../sign-in-email/signInEmail.controller";
import { signUpEmailServerController } from "../sign-up-email/signUpEmail.controller";
import { signOutEmailServerController } from "./signOutEmail.controller";

/**
 * Acceptance Criteria for Controller Tests:
 * 1. Must use `setupServerTestEnvironment` to mock/setup the auth server.
 * 2. Must test the happy path: successfully decoding input and calling the service.
 * 3. Must verify the result contains expected data.
 */
describe("Server Sign Out Email Controller", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("should successfully decode input and call service", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      const email = "controller-signout@example.com";
      const password = "password123";
      const name = "Controller Signout User";

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

      // 3. Sign Out
      // Prepare test data
      const rawInput = {
        _tag: "SignOutEmailServerParams" as const,
        headers,
      };

      const program = signOutEmailServerController(rawInput);

      const res = yield* Effect.provideService(
        program,
        AuthServerTag,
        authServer,
      );

      expect(res).toBeDefined();
    }));
});
