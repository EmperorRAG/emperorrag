import { describe, it, expect, vi, afterEach } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env.js';

describe('Server Reset Password', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	afterEach(async () => {
		await env?.cleanup();
	});

	it('should reset password via server api', async () => {
		const sendResetPasswordMock = vi.fn();

		env = await setupTestEnv({
			serverConfig: {
				emailAndPassword: {
					enabled: true,
					sendResetPassword: sendResetPasswordMock,
				},
			},
		});

		const { authServer, authClient } = env;
		const email = 'server-reset@example.com';
		const newPassword = 'newpassword123';

		// Create user
		await authClient.signUp.email({
			email,
			password: 'oldpassword123',
			name: 'Server Reset',
		});

		// Request reset
		await authServer.api.forgetPassword({
			body: {
				email,
				redirectTo: '/reset',
			},
		});

		const token = sendResetPasswordMock.mock.calls[0][0].token;

		// Reset password via server API
		const res = await authServer.api.resetPassword({
			body: {
				newPassword,
				token,
			},
		});

		expect(res).toBeDefined();

		// Verify login with new password
		const signInRes = await authServer.api.signInEmail({
			body: {
				email,
				password: newPassword,
			},
		});

		expect(signInRes.user).toBeDefined();
	});
});
