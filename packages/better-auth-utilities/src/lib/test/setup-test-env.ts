import { DevTools } from "@effect/experimental";
import { ClientOptions } from "better-auth";
import { getMigrations } from "better-auth/db";
import { toNodeHandler } from "better-auth/node";
import * as Effect from "effect/Effect";
import { createServer } from "http";
import { DatabaseSync } from "node:sqlite";
import { createAuthClient } from "../client/client.service";
import { createAuthServerInstance } from "../server/server.service";
import type { ServerConfig } from "../shared/config/config.types";

export const setupTestEnv = (options?: {
  serverConfig?: Partial<ServerConfig>;
}) => {
  const program = Effect.gen(function*() {
    // 1. Create in-memory SQLite DB
    const db = yield* Effect.sync(() => new DatabaseSync(":memory:"));

    // 2. Create Auth Server
    const authServer = yield* Effect.sync(() =>
      createAuthServerInstance(
        {
          server: {
            secret: "test-secret-123",
            baseURL: "http://localhost:0", // Port 0 for random free port
            database: db,
            emailAndPassword: {
              enabled: true,
            },
            ...options?.serverConfig,
          },
          client: {
            // Client config will be updated with actual URL later
          },
        },
        undefined,
      )
    ); // No prisma client

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

    // 6. Create Auth Client
    const authClient = yield* Effect.sync(() =>
      createAuthClient({
        server: {
          secret: "test-secret-123", // Required by type but unused by client
        },
        client: {
          baseURL,
        },
      } as unknown as ClientOptions)
    );

    return {
      authServer,
      authClient,
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
    program.pipe(Effect.withSpan("setupTestEnv"), Effect.provide(DevToolsLive)),
  );
};
