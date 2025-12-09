/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/change-email/changeEmail.spec.ts
 * @description Tests for server-side change email operation.
 */

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

	it('should request email change via server api', async () => {
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

		// Get session headers for the user
		const signInResult = await authServer.api.signInEmail({
			body: {
				email,
				password,
			},
		});

		const headers = new Headers();
		if (signInResult.token) {
			headers.set('Authorization', `Bearer ${signInResult.token}`);
		}

		const program = changeEmailServerService({
			body: {
				newEmail,
			},
			headers,
		});

		const res = await Effect.runPromise(Effect.provideService(program, EmailAuthServerServiceTag, { authServer }));

		expect(res).toBeDefined();
		expect(res.status).toBe(true);
	});
});
