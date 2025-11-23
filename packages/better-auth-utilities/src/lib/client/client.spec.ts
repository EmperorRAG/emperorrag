import { describe, it, expect, afterEach } from 'vitest';
import { setupTestEnv } from '../test/setup-test-env.js';

describe('createAuthClient', () => {
	let cleanup: () => Promise<void>;

	afterEach(async () => {
		if (cleanup) await cleanup();
	});

	it('should create a functional auth client instance', async () => {
		const env = await setupTestEnv();
		cleanup = env.cleanup;

		expect(env.authClient).toBeDefined();
		expect(env.authClient.signIn).toBeDefined();
		expect(env.authClient.signUp).toBeDefined();
	});

	it('should be able to communicate with the server', async () => {
		const env = await setupTestEnv();
		cleanup = env.cleanup;

		// Try a simple operation like getting session (should be null initially)
		const { data } = await env.authClient.getSession();
		expect(data).toBeNull();
	});
});
