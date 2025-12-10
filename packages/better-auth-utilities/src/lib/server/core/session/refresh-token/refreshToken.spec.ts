import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { refreshTokenServerService } from './refreshToken.service';
import { SessionAuthServerServiceTag } from '../shared/session.service';
import * as Effect from 'effect/Effect';

describe('Server Refresh Token', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should fail without valid refresh token', async () => {
		const { authServer } = env;

		const program = refreshTokenServerService({});

		await expect(Effect.runPromise(Effect.provideService(program, SessionAuthServerServiceTag, { authServer }))).rejects.toThrow();
	});
});
