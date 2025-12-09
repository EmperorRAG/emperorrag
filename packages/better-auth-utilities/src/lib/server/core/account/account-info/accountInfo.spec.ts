/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/account-info/accountInfo.spec.ts
 * @description Tests for server-side account info operation.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { accountInfoServerService } from './accountInfo.service';
import { AccountAuthServerServiceTag } from '../shared/account.service';
import * as Effect from 'effect/Effect';

describe('Server Account Info', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should fail without authentication', async () => {
		const { authServer } = env;

		const program = accountInfoServerService({});

		await expect(Effect.runPromise(Effect.provideService(program, AccountAuthServerServiceTag, { authServer }))).rejects.toThrow();
	});
});
