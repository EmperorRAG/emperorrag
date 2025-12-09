import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { signUpEmailServerService } from './signUpEmail.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';
import * as Effect from 'effect/Effect';

describe('Server Sign Up Email', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should sign up a user via server api', async () => {
		const { authServer } = env;
		const email = 'server-signup@example.com';
		const password = 'password123';
		const name = 'Server Sign Up';

		const program = signUpEmailServerService({
			body: {
				email,
				password,
				name,
			},
		});

		const res = await Effect.runPromise(Effect.provideService(program, EmailAuthServerServiceTag, { authServer }));

		expect(res).toBeDefined();
		expect(res.user).toBeDefined();
		expect(res.user.email).toBe(email);
	});
});
