/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/list-sessions/listSessions.spec.ts
 * @description Tests for server-side list sessions operation.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { listSessionsServerService } from './listSessions.service';
import { SessionAuthServerServiceTag } from '../shared/session.service';
import * as Effect from 'effect/Effect';

describe('Server List Sessions', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should list sessions for authenticated user', async () => {
		const { authServer } = env;
		const email = 'list-sessions-test@example.com';
		const password = 'password123';
		const name = 'List Sessions Test';

		// Create a user and sign in
		await authServer.api.signUpEmail({
			body: { email, password, name },
		});

		const signInResult = await authServer.api.signInEmail({
			body: { email, password },
		});

		const headers = new Headers();
		if (signInResult.token) {
			headers.set('Authorization', `Bearer ${signInResult.token}`);
		}

		const program = listSessionsServerService({ headers });

		const res = await Effect.runPromise(Effect.provideService(program, SessionAuthServerServiceTag, { authServer }));

		expect(res).toBeDefined();
		expect(Array.isArray(res)).toBe(true);
	});
});
