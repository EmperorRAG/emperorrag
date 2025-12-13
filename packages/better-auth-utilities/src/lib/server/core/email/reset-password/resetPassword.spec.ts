import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { resetPasswordServerService } from './resetPassword.service';
import { AuthServerTag } from '../../../server.service';
import * as Effect from 'effect/Effect';

describe('Server Reset Password', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;
	let sendResetPasswordMock: ReturnType<typeof vi.fn>;

	beforeAll(async () => {
		sendResetPasswordMock = vi.fn();

		env = await setupTestEnv({
			serverConfig: {
				emailAndPassword: {
					enabled: true,
					sendResetPassword: sendResetPasswordMock,
				},
			},
		});
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should reset password via server api', async () => {
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

		// Reset password via server API using Effect service
		const program = resetPasswordServerService({
			body: {
				newPassword,
				token,
			},
		});

		const res = await Effect.runPromise(Effect.provideService(program, AuthServerTag, authServer));

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
