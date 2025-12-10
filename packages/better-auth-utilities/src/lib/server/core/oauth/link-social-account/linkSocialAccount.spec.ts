/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/link-social-account/linkSocialAccount.spec.ts
 * @description Tests for server-side link social account operation.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { linkSocialAccountServerService } from './linkSocialAccount.service';
import { OAuthAuthServerServiceTag } from '../shared/oauth.service';
import * as Effect from 'effect/Effect';

describe('Server Link Social Account', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should fail without authentication', async () => {
		const { authServer } = env;

		const program = linkSocialAccountServerService({
			body: {
				provider: 'google',
			},
		});

		await expect(Effect.runPromise(Effect.provideService(program, OAuthAuthServerServiceTag, { authServer }))).rejects.toThrow();
	});
});
