import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';

describe('Server Change Password', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should have changePassword endpoint', async () => {
		const { authServer } = env;
		expect(authServer.api.changePassword).toBeDefined();
	});
});
