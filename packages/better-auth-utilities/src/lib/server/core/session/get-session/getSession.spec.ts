import * as Effect from "effect/Effect";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestEnv } from "../../../../test/setup-test-env";
import { AuthServerTag } from "../../../server.service";
import { getSessionServerService } from "./getSession.service";

describe("Server Get Session", () => {
  let env: Awaited<ReturnType<typeof setupTestEnv>>;

  beforeAll(async () => {
    env = await setupTestEnv();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it("should get session for authenticated user", async () => {
    const { authServer } = env;
    const email = "get-session-test@example.com";
    const password = "password123";
    const name = "Get Session Test";

    // Create a user
    await authServer.api.signUpEmail({
      body: { email, password, name },
    });

    // Sign in to get session cookie
    const signInRes = await authServer.api.signInEmail({
      body: { email, password },
      asResponse: true,
    });

    const cookie = signInRes.headers.get("set-cookie");
    expect(cookie).toBeDefined();

    const program = getSessionServerService({
      headers: new Headers({
        cookie: cookie || "",
      }),
    });

    const res = await Effect.runPromise(Effect.provideService(program, AuthServerTag, authServer));

    expect(res).toBeDefined();
    expect(res?.user).toBeDefined();
    expect(res?.user.email).toBe(email);
  });

  it("should return null without authentication", async () => {
    const { authServer } = env;

    const program = getSessionServerService({ headers: new Headers() });

    const res = await Effect.runPromise(Effect.provideService(program, AuthServerTag, authServer));

    expect(res).toBeNull();
  });
});
