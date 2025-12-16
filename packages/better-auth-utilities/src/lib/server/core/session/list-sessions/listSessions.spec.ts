import * as Effect from "effect/Effect";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestEnv } from "../../../../test/setup-test-env";
import { AuthServerTag } from "../../../server.service";
import { listSessionsServerService } from "./listSessions.service";

describe("Server List Sessions", () => {
  let env: Awaited<ReturnType<typeof setupTestEnv>>;

  beforeAll(async () => {
    env = await setupTestEnv();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it("should list sessions for authenticated user", async () => {
    const { authServer } = env;
    const email = "list-sessions-test@example.com";
    const password = "password123";
    const name = "List Sessions Test";

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

    const program = listSessionsServerService({
      headers: new Headers({
        cookie: cookie || "",
      }),
    });

    const res = await Effect.runPromise(Effect.provideService(program, AuthServerTag, authServer));

    expect(res).toBeDefined();
    expect(Array.isArray(res)).toBe(true);
  });
});
