import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { requestPasswordResetServerService } from './requestPasswordReset.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';
import * as Effect from 'effect/Effect';

describe('Server Request Password Reset', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should fail for non-existent user', async () => {
		const { authServer } = env;

		const program = requestPasswordResetServerService({
			body: {
				email: 'nonexistent@example.com',
			},
		});

		await expect(Effect.runPromise(Effect.provideService(program, EmailAuthServerServiceTag, { authServer }))).rejects.toThrow();
	});
});
