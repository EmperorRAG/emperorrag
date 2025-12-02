import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';

describe('Change Password', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
		// Create and sign in a user
		await env.authClient.signUp.email({
			email: 'changepass-test@example.com',
			password: 'oldpassword123',
			name: 'Change Pass User',
		});
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should change password successfully', async () => {
		const { authClient, authServer } = env;
		const email = 'changepass-test@example.com';
		const currentPassword = 'oldpassword123';
		const newPassword = 'newpassword123';

		// Explicitly sign in via server to get cookie
		const serverSignInRes = await authServer.api.signInEmail({
			body: {
				email,
				password: currentPassword,
			},
			asResponse: true,
		});

		const cookie = serverSignInRes.headers.get('set-cookie');

		const res = await authClient.changePassword({
			currentPassword,
			newPassword,
			revokeOtherSessions: true,
			fetchOptions: {
				headers: {
					cookie: cookie || '',
				},
			},
		});

		expect(res.data).toBeDefined();
		expect(res.error).toBeNull();

		// Verify login with new password
		const clientSignInRes = await authClient.signIn.email({
			email,
			password: newPassword,
		});

		expect(clientSignInRes.data).toBeDefined();
		expect(clientSignInRes.error).toBeNull();

		// Verify login with old password fails
		const signInOldRes = await authClient.signIn.email({
			email,
			password: currentPassword,
		});

		expect(signInOldRes.data).toBeNull();
		expect(signInOldRes.error).toBeDefined();
	});
});
