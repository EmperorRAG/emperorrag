import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { AuthServerTag } from '../../../server.service';
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

	it('should have AuthServerTag defined', () => {
		expect(AuthServerTag).toBeDefined();
	});

	it('should create AuthServerTag context', async () => {
		const { authServer } = env;

		const program = Effect.flatMap(AuthServerTag, (server) => Effect.succeed(server));

		const result = await Effect.runPromise(Effect.provideService(program, AuthServerTag, authServer));

		expect(result).toBe(authServer);
	});
});
