import { afterEach, describe, expect, it, vi } from "vitest";
import { setupTestEnv } from "../../../../test/setup-test-env";

describe("Reset Password", () => {
  let env: Awaited<ReturnType<typeof setupTestEnv>>;

  afterEach(async () => {
    await env?.cleanup();
  });

  it("should reset password successfully", async () => {
    const sendResetPasswordMock = vi.fn();

    env = await setupTestEnv({
      serverConfig: {
        emailAndPassword: {
          enabled: true,
          sendResetPassword: sendResetPasswordMock,
        },
      },
    });

    const { authClient } = env;
    const email = "reset-complete-test@example.com";
    const oldPassword = "oldpassword123";
    const newPassword = "newpassword123";

    // Create user
    await authClient.signUp.email({
      email,
      password: oldPassword,
      name: "Reset Complete User",
    });

    // Request reset
    await authClient.forgetPassword({
      email,
      redirectTo: "/reset-password",
    });

    // Get token from mock
    const token = sendResetPasswordMock.mock.calls[0][0].token;

    // Reset password
    const res = await authClient.resetPassword({
      newPassword,
      token,
    });

    expect(res.data).toBeDefined();
    expect(res.error).toBeNull();

    // Verify login with new password
    const signInRes = await authClient.signIn.email({
      email,
      password: newPassword,
    });

    expect(signInRes.data).toBeDefined();
    expect(signInRes.error).toBeNull();
  });
});
