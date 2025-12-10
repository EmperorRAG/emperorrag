import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { revokeOtherSessionsServerService } from './revokeOtherSessions.service';
import { SessionAuthServerServiceTag } from '../shared/session.service';
import * as Effect from 'effect/Effect';

describe('Server Revoke Other Sessions', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should fail without authentication', async () => {
		const { authServer } = env;

		const program = revokeOtherSessionsServerService({});

		await expect(Effect.runPromise(Effect.provideService(program, SessionAuthServerServiceTag, { authServer }))).rejects.toThrow();
	});
});
