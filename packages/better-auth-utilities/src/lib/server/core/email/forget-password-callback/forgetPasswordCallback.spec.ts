/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/forget-password-callback/forgetPasswordCallback.spec.ts
 * @description Tests for server-side forget password callback operation.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { forgetPasswordCallbackServerService } from './forgetPasswordCallback.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';
import * as Effect from 'effect/Effect';

describe('Server Forget Password Callback', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should fail with invalid token', async () => {
		const { authServer } = env;

		const program = forgetPasswordCallbackServerService({
			query: {
				token: 'invalid-token',
			},
		});

		await expect(Effect.runPromise(Effect.provideService(program, EmailAuthServerServiceTag, { authServer }))).rejects.toThrow();
	});
});
