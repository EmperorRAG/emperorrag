import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { AccountAuthServerServiceTag } from '../shared/account.service';
import * as Effect from 'effect/Effect';

describe('Server Unlink Account', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should have unlinkAccount endpoint', async () => {
		const { authServer } = env;
		expect(authServer.api.unlinkAccount).toBeDefined();
	});

	it('should have AccountAuthServerServiceTag defined', () => {
		expect(AccountAuthServerServiceTag).toBeDefined();
	});

	it('should create AccountAuthServerService context', async () => {
		const { authServer } = env;

		const program = Effect.flatMap(AccountAuthServerServiceTag, ({ authServer: server }) => Effect.succeed(server));

		const result = await Effect.runPromise(Effect.provideService(program, AccountAuthServerServiceTag, { authServer }));

		expect(result).toBe(authServer);
	});
});
