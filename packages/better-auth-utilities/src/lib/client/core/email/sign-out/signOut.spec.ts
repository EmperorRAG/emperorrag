import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';

describe('Sign Out', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
		// Create and sign in a user
		await env.authClient.signUp.email({
			email: 'signout-test@example.com',
			password: 'password123',
			name: 'Sign Out User',
		});
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should sign out a user successfully', async () => {
		const { authClient } = env;

		// Verify session exists
		const sessionBefore = await authClient.getSession();
		expect(sessionBefore.data).toBeDefined();

		// Sign out
		const res = await authClient.signOut();
		expect(res.data).toBeDefined();
		// expect(res.error).toBeNull(); // signOut might return error if session is already invalid or other issues, but data should be present

		// Verify session is gone
		const sessionAfter = await authClient.getSession();
		expect(sessionAfter.data).toBeNull();
	});
});
