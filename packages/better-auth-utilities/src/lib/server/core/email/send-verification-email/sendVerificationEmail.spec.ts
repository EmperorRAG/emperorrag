import * as Effect from "effect/Effect";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { setupTestEnv } from "../../../../test/setup-test-env";
import { AuthServerTag } from "../../../server.service";
import { sendVerificationEmailServerService } from "./sendVerificationEmail.service";

describe("Server Send Verification Email", () => {
  let env: Awaited<ReturnType<typeof setupTestEnv>>;

  beforeAll(async () => {
    const sendVerificationEmailMock = vi.fn();

    env = await setupTestEnv({
      serverConfig: {
        emailVerification: {
          sendVerificationEmail: sendVerificationEmailMock,
        },
      },
    });
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it("should send verification email via server api", async () => {
    const { authServer, authClient } = env;
    const email = "server-verify@example.com";

    // Create user
    await authClient.signUp.email({
      email,
      password: "password123",
      name: "Server Verify",
    });

    // Send verification via server API using Effect service
    const program = sendVerificationEmailServerService({
      body: {
        email,
      },
    });

    const res = await Effect.runPromise(Effect.provideService(program, AuthServerTag, authServer));

    expect(res).toBeDefined();
    expect(res.status).toBe(true);
  });
});
