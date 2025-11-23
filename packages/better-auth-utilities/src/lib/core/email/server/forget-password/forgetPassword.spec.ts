import { describe, it, expect, vi, afterEach } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env.js';

describe('Server Forget Password', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	afterEach(async () => {
		await env?.cleanup();
	});

	it('should trigger forget password via server api', async () => {
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
		const email = 'server-forget@example.com';

		// Create user
		await authClient.signUp.email({
			email,
			password: 'password123',
			name: 'Server Forget',
		});

		// Call server API
		const res = await authServer.api.forgetPassword({
			body: {
				email,
				redirectTo: '/reset',
			},
		});

		expect(res).toBeDefined();
		expect(sendResetPasswordMock).toHaveBeenCalledTimes(1);
		const callArgs = sendResetPasswordMock.mock.calls[0][0];
		expect(callArgs.user.email).toBe(email);
	});
});
