import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { signInEmailServerService } from './signInEmail.service';
import { AuthServerTag } from '../../../server.service';
import * as Effect from 'effect/Effect';

describe('Server Sign In Email', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
		// Create user via client for convenience
		await env.authClient.signUp.email({
			email: 'server-signin@example.com',
			password: 'password123',
			name: 'Server Sign In',
		});
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should sign in a user via server api', async () => {
		const { authServer } = env;
		const email = 'server-signin@example.com';
		const password = 'password123';

		const program = signInEmailServerService({
			body: {
				email,
				password,
			},
		});

		const res = await Effect.runPromise(Effect.provideService(program, AuthServerTag, authServer));

		expect(res).toBeDefined();
		expect(res.user).toBeDefined();
		expect(res.user.email).toBe(email);
	});
});
