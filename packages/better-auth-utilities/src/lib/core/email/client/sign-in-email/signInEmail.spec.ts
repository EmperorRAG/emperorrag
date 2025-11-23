import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env.js';

describe('Sign In Email', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
		// Create a user to sign in with
		await env.authClient.signUp.email({
			email: 'signin-test@example.com',
			password: 'password123',
			name: 'Sign In User',
		});
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should sign in a user successfully', async () => {
		const { authClient } = env;
		const email = 'signin-test@example.com';
		const password = 'password123';

		const res = await authClient.signIn.email({
			email,
			password,
		});

		expect(res.data).toBeDefined();
		expect(res.error).toBeNull();
		expect(res.data?.user.email).toBe(email);
	});

	it('should fail to sign in with incorrect password', async () => {
		const { authClient } = env;
		const email = 'signin-test@example.com';
		const password = 'wrongpassword';

		const res = await authClient.signIn.email({
			email,
			password,
		});

		expect(res.data).toBeNull();
		expect(res.error).toBeDefined();
	});
});
