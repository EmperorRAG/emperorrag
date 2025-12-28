import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import { ApiError } from "../../../../errors/api.error";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { changeEmailServerService } from "./changeEmail.service";
import { ChangeEmailServerParams } from "./changeEmail.types";

/**
 * Acceptance Criteria for Service Tests:
 * 1. Must use `setupServerTestEnvironment`.
 * 2. Must test the service function directly.
 * 3. Must decode params using `ChangeEmailServerParams` before passing to service (or construct valid typed object).
 * 4. Must provide `AuthServerTag` context.
 * 5. Must verify the API call result.
 * 6. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("Server Change Email Service", () => {
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

  it.effect("should perform change email via server api", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // 1. Sign Up to get session
      const email = "change-email-service@example.com";
      const password = "password123";
      const newEmail = "new-email-service@example.com";

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

      const params = Schema.decodeSync(ChangeEmailServerParams)({
        _tag: "ChangeEmailServerParams" as const,
        body: {
          _tag: "ChangeEmailCommand" as const,
          newEmail,
        },
        headers,
      });

      const program = changeEmailServerService(params);

      const res = yield* Effect.provideService(
        program,
        AuthServerTag,
        authServer,
      );

      expect(res).toBeDefined();
    }));

  it.effect("should handle ApiError (existing email)", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // 1. Create User A (the one we will try to switch TO)
      const emailA = "user-a@example.com";
      yield* Effect.tryPromise(() =>
        authServer.api.signUpEmail({
          body: {
            email: emailA,
            password: "password123",
            name: "User A",
          },
        })
      );

      // 2. Create User B (the one changing email)
      const emailB = "user-b@example.com";
      const passwordB = "password123";
      const signUpRes = yield* Effect.tryPromise(() =>
        authServer.api.signUpEmail({
          body: {
            email: emailB,
            password: passwordB,
            name: "User B",
          },
          asResponse: true,
        })
      );

      const cookie = signUpRes.headers.get("set-cookie");
      const headers = new Headers();
      if (cookie) {
        headers.append("cookie", cookie);
      }

      // 3. Try to change User B's email to User A's email
      const params = Schema.decodeSync(ChangeEmailServerParams)({
        _tag: "ChangeEmailServerParams" as const,
        body: {
          _tag: "ChangeEmailCommand" as const,
          newEmail: emailA, // Already exists
        },
        headers,
      });

      const program = changeEmailServerService(params);

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
