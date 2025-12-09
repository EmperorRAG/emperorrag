/**
 * @file libs/better-auth-utilities/src/lib/core/user/server/update-user/updateUser.spec.ts
 * @description Tests for server-side update user operation.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { updateUserServerService } from './updateUser.service';
import { UserAuthServerServiceTag } from '../shared/user.service';
import * as Effect from 'effect/Effect';

describe('Server Update User', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should update user name via server api', async () => {
		const { authServer } = env;
		const email = 'update-user-test@example.com';
		const password = 'password123';
		const originalName = 'Original Name';
		const updatedName = 'Updated Name';

		// First create a user
		await authServer.api.signUpEmail({
			body: {
				email,
				password,
				name: originalName,
			},
		});

		// Get session headers for the user
		const signInResult = await authServer.api.signInEmail({
			body: {
				email,
				password,
			},
		});

		// Create mock headers with session token
		const headers = new Headers();
		if (signInResult.token) {
			headers.set('Authorization', `Bearer ${signInResult.token}`);
		}

		const program = updateUserServerService({
			body: {
				name: updatedName,
			},
			headers,
		});

		const res = await Effect.runPromise(Effect.provideService(program, UserAuthServerServiceTag, { authServer }));

		expect(res).toBeDefined();
		expect(res.status).toBe(true);
	});

	it('should update user image via server api', async () => {
		const { authServer } = env;
		const email = 'update-user-image@example.com';
		const password = 'password123';
		const name = 'Image Test User';
		const imageUrl = 'https://example.com/avatar.jpg';

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

		// Create mock headers with session token
		const headers = new Headers();
		if (signInResult.token) {
			headers.set('Authorization', `Bearer ${signInResult.token}`);
		}

		const program = updateUserServerService({
			body: {
				image: imageUrl,
			},
			headers,
		});

		const res = await Effect.runPromise(Effect.provideService(program, UserAuthServerServiceTag, { authServer }));

		expect(res).toBeDefined();
		expect(res.status).toBe(true);
	});
});
