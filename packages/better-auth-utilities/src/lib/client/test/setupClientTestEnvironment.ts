import { DevTools } from "@effect/experimental";
import type { BetterAuthOptions, ClientOptions } from "better-auth";
import { createAuthClient } from "better-auth/client";
import { Effect } from "effect";
import { setupServerTestEnvironment } from "../../server/test/setupServerTestEnvironment";

export const setupClientTestEnvironment = (options?: {
  serverConfig?: Partial<BetterAuthOptions>;
  clientConfig?: Partial<ClientOptions>;
}) => {
  const program = Effect.gen(function*() {
    // 1. Setup Server Environment
    const serverEnv = yield* Effect.promise(() =>
      setupServerTestEnvironment(
        options?.serverConfig ? { serverConfig: options.serverConfig } : {},
      )
    );

    // 2. Create Auth Client
    const authClient = yield* Effect.sync(() =>
      createAuthClient({
        baseURL: serverEnv.baseURL,
        ...options?.clientConfig,
      })
    );

    return {
      ...serverEnv,
      authClient,
    };
  });

  const DevToolsLive = DevTools.layer();

  return Effect.runPromise(
    program.pipe(
      Effect.withSpan("setupClientTestEnvironment"),
      Effect.provide(DevToolsLive),
    ),
  );
};
