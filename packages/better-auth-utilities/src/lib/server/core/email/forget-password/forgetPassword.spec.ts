import * as Effect from "effect/Effect";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { setupTestEnv } from "../../../../test/setup-test-env";
import { AuthServerTag } from "../../../server.service";
import { forgetPasswordServerService } from "./forgetPassword.service";

describe("Server Forget Password", () => {
  let env: Awaited<ReturnType<typeof setupTestEnv>>;
  let sendResetPasswordMock: ReturnType<typeof vi.fn>;

  beforeAll(async () => {
    sendResetPasswordMock = vi.fn();

    env = await setupTestEnv({
      serverConfig: {
        emailAndPassword: {
          enabled: true,
          sendResetPassword: sendResetPasswordMock,
        },
      },
    });
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it("should trigger forget password via server api", async () => {
    const { authServer, authClient } = env;
    const email = "server-forget@example.com";

    // Create user
    await authClient.signUp.email({
      email,
      password: "password123",
      name: "Server Forget",
    });

    // Call server API using Effect service
    const program = forgetPasswordServerService({
      body: {
        email,
        redirectTo: "/reset",
      },
    });

    const res = await Effect.runPromise(
      Effect.provideService(program, AuthServerTag, authServer),
    );

    expect(res).toBeDefined();
    expect(res.status).toBe(true);
    expect(sendResetPasswordMock).toHaveBeenCalledTimes(1);
    const callArgs = sendResetPasswordMock.mock.calls[0][0];
    expect(callArgs.user.email).toBe(email);
  });
});
