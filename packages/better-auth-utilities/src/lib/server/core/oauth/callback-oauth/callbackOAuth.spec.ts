/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/callback-oauth/callbackOAuth.spec.ts
 * @description Tests for server-side OAuth callback operation.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { callbackOAuthServerService } from './callbackOAuth.service';
import { OAuthServerServiceTag } from '../shared/oauth.service';
import * as Effect from 'effect/Effect';

describe('Server Callback OAuth', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should fail without valid OAuth state', async () => {
		const { authServer } = env;

		const program = callbackOAuthServerService({
			query: {
				code: 'invalid-code',
				state: 'invalid-state',
			},
		});

		await expect(Effect.runPromise(Effect.provideService(program, OAuthServerServiceTag, { authServer }))).rejects.toThrow();
	});
});
