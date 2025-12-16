import * as Effect from "effect/Effect";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestEnv } from "../../../../test/setup-test-env";
import { AuthServerTag } from "../../../server.service";
import { signOutServerService } from "./signOut.service";

describe("Server Sign Out", () => {
  let env: Awaited<ReturnType<typeof setupTestEnv>>;

  beforeAll(async () => {
    env = await setupTestEnv();
  });

  afterAll(async () => {
    await env.cleanup();
  });

  it("should sign out via server api", async () => {
    const { authServer, authClient } = env;

    // Create user via client
    await authClient.signUp.email({
      email: "server-signout@example.com",
      password: "password123",
      name: "Server Sign Out",
    });

    // Sign in via server to get session cookie
    const signInRes = await authServer.api.signInEmail({
      body: {
        email: "server-signout@example.com",
        password: "password123",
      },
      asResponse: true,
    });

    const cookie = signInRes.headers.get("set-cookie");
    expect(cookie).toBeDefined();

    // Sign out via server API using the service
    const program = signOutServerService({
      headers: new Headers({
        cookie: cookie || "",
      }),
    });

    const res = await Effect.runPromise(
      Effect.provideService(program, AuthServerTag, authServer),
    );

    expect(res).toBeDefined();
  });
});
