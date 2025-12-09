import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { changePasswordServerService } from './changePassword.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';
import * as Effect from 'effect/Effect';

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

	it('should change password via server api', async () => {
		const { authServer, authClient } = env;
		const email = 'server-change-password@example.com';
		const currentPassword = 'oldpassword123';
		const newPassword = 'newpassword456';

		// Create user
		await authClient.signUp.email({
			email,
			password: currentPassword,
			name: 'Server Change Password',
		});

		// Sign in to get session with headers returned
		const signInRes = await authServer.api.signInEmail({
			body: {
				email,
				password: currentPassword,
			},
			returnHeaders: true,
		});

		// Create headers with session cookie from returned headers
		const headers = new Headers();
		const setCookieHeader = signInRes.headers?.get('set-cookie');
		if (setCookieHeader) {
			headers.set('cookie', setCookieHeader);
		}

		// Change password via server API using Effect service
		const program = changePasswordServerService({
			body: {
				currentPassword,
				newPassword,
			},
			headers,
		});

		const res = await Effect.runPromise(Effect.provideService(program, EmailAuthServerServiceTag, { authServer }));

		expect(res).toBeDefined();

		// Verify login with new password
		const newSignInRes = await authServer.api.signInEmail({
			body: {
				email,
				password: newPassword,
			},
		});

		expect(newSignInRes.user).toBeDefined();
	});
});
