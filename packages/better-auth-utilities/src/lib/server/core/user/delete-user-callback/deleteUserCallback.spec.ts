import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { deleteUserCallbackServerService } from './deleteUserCallback.service';
import { AuthServerTag } from '../../../server.service';
import * as Effect from 'effect/Effect';

describe('Server Delete User Callback', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should fail with invalid token', async () => {
		const { authServer } = env;

		const program = deleteUserCallbackServerService({
			query: {
				token: 'invalid-token',
			},
		});

		await expect(Effect.runPromise(Effect.provideService(program, AuthServerTag, authServer))).rejects.toThrow();
	});
});
