import { afterAll, beforeAll, describe, expect, it } from "@effect/vitest";
import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import { ApiError } from "../../../../errors/api.error";
import { AuthServerTag } from "../../../server.layer";
import { setupServerTestEnvironment } from "../../../test/setupServerTestEnvironment";
import { changePasswordServerService } from "./changePassword.service";
import { ChangePasswordServerParams } from "./changePassword.types";

/**
 * Acceptance Criteria for Service Tests:
 * 1. Must use `setupServerTestEnvironment`.
 * 2. Must test the service function directly.
 * 3. Must decode params using `ChangePasswordServerParams` before passing to service (or construct valid typed object).
 * 4. Must provide `AuthServerTag` context.
 * 5. Must verify the API call result.
 * 6. Must use `it.effect` and `Effect.gen` for testing.
 */
describe("Server Change Password Service", () => {
  let env: Awaited<ReturnType<typeof setupServerTestEnvironment>>;

  beforeAll(async () => {
    env = await setupServerTestEnvironment();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it.effect("should perform change password via server api", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // 1. Sign Up to get session
      const email = "change-password-service@example.com";
      const currentPassword = "password123";
      const newPassword = "newPassword123";

      const signUpRes = yield* Effect.tryPromise(() =>
        authServer.api.signUpEmail({
          body: {
            email,
            password: currentPassword,
            name: "Change Password User",
          },
          asResponse: true,
        })
      );

      const cookie = signUpRes.headers.get("set-cookie");
      const headers = new Headers();
      if (cookie) {
        headers.append("cookie", cookie);
      }

      const params = Schema.decodeSync(ChangePasswordServerParams)({
        _tag: "ChangePasswordServerParams" as const,
        body: {
          _tag: "ChangePasswordCommand" as const,
          newPassword,
          currentPassword,
          revokeOtherSessions: true,
        },
        headers,
      });

      const program = changePasswordServerService(params);

      const res = yield* Effect.provideService(
        program,
        AuthServerTag,
        authServer,
      );

      expect(res).toBeDefined();
    }));

  it.effect("should handle ApiError (wrong password)", () =>
    Effect.gen(function*() {
      const { authServer } = env;

      // 1. Sign Up to get session
      const email = "change-password-error@example.com";
      const currentPassword = "password123";
      const wrongPassword = "wrongPassword123";
      const newPassword = "newPassword123";

      const signUpRes = yield* Effect.tryPromise(() =>
        authServer.api.signUpEmail({
          body: {
            email,
            password: currentPassword,
            name: "Change Password Error User",
          },
          asResponse: true,
        })
      );

      const cookie = signUpRes.headers.get("set-cookie");
      const headers = new Headers();
      if (cookie) {
        headers.append("cookie", cookie);
      }

      const params = Schema.decodeSync(ChangePasswordServerParams)({
        _tag: "ChangePasswordServerParams" as const,
        body: {
          _tag: "ChangePasswordCommand" as const,
          newPassword,
          currentPassword: wrongPassword, // Wrong password
          revokeOtherSessions: true,
        },
        headers,
      });

      const program = changePasswordServerService(params);

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
