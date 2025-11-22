import { describe, it, expect, vi, afterEach } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env.js';

describe('Request Password Reset', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	afterEach(async () => {
		await env?.cleanup();
	});

	it('should send a reset password email', async () => {
		const sendResetPasswordMock = vi.fn();

		env = await setupTestEnv({
			serverConfig: {
				emailAndPassword: {
					enabled: true,
					sendResetPassword: sendResetPasswordMock,
				},
			},
		});

		const { authClient } = env;
		const email = 'reset-test@example.com';

		// Create user
		await authClient.signUp.email({
			email,
			password: 'password123',
			name: 'Reset User',
		});

		// Request reset
		const res = await authClient.forgetPassword({
			email,
			redirectTo: '/reset-password',
		});

		expect(res.data).toBeDefined();
		expect(res.error).toBeNull();

		expect(sendResetPasswordMock).toHaveBeenCalledTimes(1);
		const callArgs = sendResetPasswordMock.mock.calls[0][0];
		expect(callArgs.user.email).toBe(email);
		expect(callArgs.url).toContain('/reset-password');
		expect(callArgs.token).toBeDefined();
	});
});
