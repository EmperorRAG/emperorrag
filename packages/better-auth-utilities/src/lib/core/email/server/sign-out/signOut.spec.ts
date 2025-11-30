import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';

describe('Server Sign Out', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
		// Create user
		await env.authClient.signUp.email({
			email: 'server-signout@example.com',
			password: 'password123',
			name: 'Server Sign Out',
		});
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should sign out via server api', async () => {
		const { authServer } = env;
		const email = 'server-signout@example.com';
		const password = 'password123';

		// Sign in via server to get session cookie
		const signInRes = await authServer.api.signInEmail({
			body: {
				email,
				password,
			},
			asResponse: true,
		});

		const cookie = signInRes.headers.get('set-cookie');
		expect(cookie).toBeDefined();

		// Sign out via server API using the cookie
		const signOutRes = await authServer.api.signOut({
			headers: new Headers({
				cookie: cookie || '',
			}),
			asResponse: true,
		});

		expect(signOutRes.status).toBe(200);
	});
});
