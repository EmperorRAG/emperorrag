import { afterEach, describe, expect, it, vi } from "vitest";
import { setupTestEnv } from "../../../../test/setup-test-env";

describe("Send Verification Email", () => {
  let env: Awaited<ReturnType<typeof setupTestEnv>>;

  afterEach(async () => {
    await env?.cleanup();
  });

  it("should send verification email", async () => {
    const sendVerificationEmailMock = vi.fn();

    env = await setupTestEnv({
      serverConfig: {
        emailVerification: {
          sendVerificationEmail: sendVerificationEmailMock,
        },
      },
    });

    const { authClient } = env;
    const email = "verify-test@example.com";

    // Create user
    await authClient.signUp.email({
      email,
      password: "password123",
      name: "Verify User",
    });

    // Send verification email
    const res = await authClient.sendVerificationEmail({
      email,
    });

    expect(res.data).toBeDefined();
    expect(res.error).toBeNull();

    expect(sendVerificationEmailMock).toHaveBeenCalledTimes(1);
    const callArgs = sendVerificationEmailMock.mock.calls[0][0];
    expect(callArgs.user.email).toBe(email);
    expect(callArgs.token).toBeDefined();
    expect(callArgs.url).toBeDefined();
  });
});
