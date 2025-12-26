import { DevTools } from "@effect/experimental";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db";
import { toNodeHandler } from "better-auth/node";
import { Effect } from "effect";
import { createServer } from "http";
import { DatabaseSync } from "node:sqlite";

export const setupServerTestEnvironment = (options?: {
  serverConfig?: Partial<BetterAuthOptions>;
}) => {
  const program = Effect.gen(function*() {
    // 1. Create in-memory SQLite DB
    const db = yield* Effect.sync(() => new DatabaseSync(":memory:"));

    // 2. Create Auth Server
    const authServer = yield* Effect.sync(() =>
      betterAuth({
        secret: "test-secret-123",
        baseURL: "http://localhost:0", // Port 0 for random free port
        database: db,
        emailAndPassword: {
          enabled: true,
        },
        ...options?.serverConfig,
      })
    );

    // 3. Run Migrations
    const { runMigrations } = yield* Effect.tryPromise(() => getMigrations(authServer.options));
    yield* Effect.tryPromise(() => runMigrations());

    // 4. Create Node HTTP Server
    const nodeHandler = toNodeHandler(authServer);
    const server = yield* Effect.sync(() =>
      createServer(async (req, res) => {
        await nodeHandler(req, res);
      })
    );

    // 5. Start Server
    yield* Effect.async<void, Error>((resume) => {
      server.listen(0, () => resume(Effect.void));
      server.on("error", (err) => resume(Effect.fail(err)));
    });

    const address = yield* Effect.sync(() => server.address());
    const port = typeof address === "object" && address ? address.port : 0;
    const baseURL = `http://localhost:${port}`;

    return {
      authServer,
      db,
      server,
      baseURL,
      cleanup: async () => {
        await new Promise<void>((resolve) => server.close(() => resolve()));
        db.close();
      },
    };
  });

  const DevToolsLive = DevTools.layer();

  return Effect.runPromise(
    program.pipe(
      Effect.withSpan("setupServerTestEnvironment"),
      Effect.provide(DevToolsLive),
    ),
  );
};
