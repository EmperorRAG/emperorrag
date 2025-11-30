import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';

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

		const res = await authServer.api.signInEmail({
			body: {
				email,
				password,
			},
		});

		expect(res).toBeDefined();
		expect(res.user).toBeDefined();
		expect(res.user.email).toBe(email);
	});
});
