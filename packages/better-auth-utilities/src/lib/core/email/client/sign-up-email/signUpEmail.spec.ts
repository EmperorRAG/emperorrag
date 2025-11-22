import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env.js';

describe('Sign Up Email', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should sign up a user successfully', async () => {
		const { authClient } = env;
		const email = 'signup-test@example.com';
		const password = 'password123';
		const name = 'Sign Up User';

		const res = await authClient.signUp.email({
			email,
			password,
			name,
		});

		expect(res.data).toBeDefined();
		expect(res.error).toBeNull();
		expect(res.data?.user.email).toBe(email);
		expect(res.data?.user.name).toBe(name);
	});
});
