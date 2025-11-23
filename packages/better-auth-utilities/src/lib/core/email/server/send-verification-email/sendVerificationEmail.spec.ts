import { describe, it, expect, vi, afterEach } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env.js';

describe('Server Send Verification Email', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	afterEach(async () => {
		await env?.cleanup();
	});

	it('should send verification email via server api', async () => {
		const sendVerificationEmailMock = vi.fn();

		env = await setupTestEnv({
			serverConfig: {
				emailVerification: {
					sendVerificationEmail: sendVerificationEmailMock,
				},
			},
		});

		const { authServer, authClient } = env;
		const email = 'server-verify@example.com';

		// Create user
		await authClient.signUp.email({
			email,
			password: 'password123',
			name: 'Server Verify',
		});

		// Send verification via server API
		const res = await authServer.api.sendVerificationEmail({
			body: {
				email,
			},
		});

		expect(res).toBeDefined();
		expect(sendVerificationEmailMock).toHaveBeenCalledTimes(1);
		const callArgs = sendVerificationEmailMock.mock.calls[0][0];
		expect(callArgs.user.email).toBe(email);
	});
});
