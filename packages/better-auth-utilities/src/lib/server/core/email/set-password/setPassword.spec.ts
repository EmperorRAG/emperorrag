import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { setPasswordServerService } from './setPassword.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';
import * as Effect from 'effect/Effect';

describe('Server Set Password', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should fail without authentication', async () => {
		const { authServer } = env;

		const program = setPasswordServerService({
			body: {
				newPassword: 'newSecurePassword123',
			},
		});

		await expect(Effect.runPromise(Effect.provideService(program, EmailAuthServerServiceTag, { authServer }))).rejects.toThrow();
	});
});
