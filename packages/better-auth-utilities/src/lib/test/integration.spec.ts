import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from './setup-test-env.js';

describe('Better Auth Integration', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should sign up and sign in a user', async () => {
		const { authClient } = env;
		const email = 'test@example.com';
		const password = 'password123';
		const name = 'Test User';

		// 1. Sign Up
		const signUpRes = await authClient.signUp.email({
			email,
			password,
			name,
		});

		expect(signUpRes.data).toBeDefined();
		expect(signUpRes.error).toBeNull();
		expect(signUpRes.data?.user.email).toBe(email);

		// 2. Sign In
		const signInRes = await authClient.signIn.email({
			email,
			password,
		});

		expect(signInRes.data).toBeDefined();
		expect(signInRes.error).toBeNull();
		expect(signInRes.data?.user.email).toBe(email);
	});
});
