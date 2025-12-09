import { createServer } from 'http';
import { DatabaseSync } from 'node:sqlite';
import { toNodeHandler } from 'better-auth/node';
import { getMigrations } from 'better-auth/db';
import { createAuthServer } from '../server/server.service';
import { createAuthClient } from '../client/client.service';
import type { ServerConfig } from '../shared/config/config.types';

export async function setupTestEnv(options?: { serverConfig?: Partial<ServerConfig> }) {
	// 1. Create in-memory SQLite DB
	const db = new DatabaseSync(':memory:');

	// 2. Create Auth Server
	const authServer = createAuthServer(
		{
			server: {
				secret: 'test-secret-123',
				baseURL: 'http://localhost:0', // Port 0 for random free port
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
		undefined
	); // No prisma client

	// 3. Run Migrations
	const { runMigrations } = await getMigrations(authServer.options);
	await runMigrations();

	// 4. Create Node HTTP Server
	const nodeHandler = toNodeHandler(authServer);
	const server = createServer(async (req, res) => {
		await nodeHandler(req, res);
	});

	// 5. Start Server
	await new Promise<void>((resolve) => {
		server.listen(0, () => resolve());
	});

	const address = server.address();
	const port = typeof address === 'object' && address ? address.port : 0;
	const baseURL = `http://localhost:${port}`;

	// 6. Create Auth Client
	const authClient = createAuthClient({
		server: {
			secret: 'test-secret-123', // Required by type but unused by client
		},
		client: {
			baseURL,
		},
	} as any);

	return {
		authServer,
		authClient,
		db,
		server,
		baseURL,
		cleanup: async () => {
			server.close();
			db.close();
		},
	};
}
