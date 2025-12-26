import { afterEach, describe, expect, it } from "vitest";
import { setupServerTestEnvironment } from "../server/test/setupServerTestEnvironment";

describe("createAuthServer", () => {
  let cleanup: () => Promise<void>;

  afterEach(async () => {
    if (cleanup) await cleanup();
  });

  it("should create a functional auth server instance", async () => {
    const env = await setupServerTestEnvironment();
    cleanup = env.cleanup;

    expect(env.authServer).toBeDefined();
    expect(env.authServer.api).toBeDefined();
  });

  it("should configure email and password auth correctly", async () => {
    const env = await setupServerTestEnvironment({
      serverConfig: {
        emailAndPassword: {
          enabled: true,
          minPasswordLength: 8,
        },
      },
    });
    cleanup = env.cleanup;

    // Verify we can sign up (implies email/password is enabled)
    const signUpRes = await env.authClient.signUp.email({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });

    expect(signUpRes.data).toBeDefined();
    expect(signUpRes.error).toBeNull();
  });
});
