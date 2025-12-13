import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { deleteUserServerService } from './deleteUser.service';
import { AuthServerTag } from '../../../server.service';
import * as Effect from 'effect/Effect';

describe('Server Delete User', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should fail without authentication', async () => {
		const { authServer } = env;

		const program = deleteUserServerService({
			body: {},
		});

		await expect(Effect.runPromise(Effect.provideService(program, AuthServerTag, authServer))).rejects.toThrow();
	});
});
