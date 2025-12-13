import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { revokeSessionServerService } from './revokeSession.service';
import { AuthServerTag } from '../../../server.service';
import * as Effect from 'effect/Effect';

describe('Server Revoke Session', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should fail with invalid token', async () => {
		const { authServer } = env;

		const program = revokeSessionServerService({
			headers: new Headers(),
			body: {
				token: 'invalid-session-token',
			},
		});

		await expect(Effect.runPromise(Effect.provideService(program, AuthServerTag, authServer))).rejects.toThrow();
	});
});
