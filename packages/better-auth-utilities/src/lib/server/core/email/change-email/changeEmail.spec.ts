import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { changeEmailServerService } from './changeEmail.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';
import * as Effect from 'effect/Effect';

describe('Server Change Email', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should fail when change email is disabled', async () => {
		const { authServer } = env;
		const email = 'change-email-test@example.com';
		const password = 'password123';
		const name = 'Change Email Test';
		const newEmail = 'new-email@example.com';

		// First create a user
		await authServer.api.signUpEmail({
			body: {
				email,
				password,
				name,
			},
		});

		// Sign in to get session cookie
		const signInRes = await authServer.api.signInEmail({
			body: {
				email,
				password,
			},
			asResponse: true,
		});

		const cookie = signInRes.headers.get('set-cookie');
		expect(cookie).toBeDefined();

		const program = changeEmailServerService({
			body: {
				newEmail,
			},
			headers: new Headers({
				cookie: cookie || '',
			}),
		});

		// Change email is disabled in test environment
		await expect(Effect.runPromise(Effect.provideService(program, EmailAuthServerServiceTag, { authServer }))).rejects.toThrow();
	});
});
