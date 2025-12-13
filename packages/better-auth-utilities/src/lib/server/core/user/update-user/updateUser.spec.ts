import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { updateUserServerService } from './updateUser.service';
import { AuthServerTag } from '../../../server.service';
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

		const program = updateUserServerService({
			body: {
				name: updatedName,
			},
			headers: new Headers({
				cookie: cookie || '',
			}),
		});

		const res = await Effect.runPromise(Effect.provideService(program, AuthServerTag, authServer));

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

		const program = updateUserServerService({
			body: {
				image: imageUrl,
			},
			headers: new Headers({
				cookie: cookie || '',
			}),
		});

		const res = await Effect.runPromise(Effect.provideService(program, AuthServerTag, authServer));

		expect(res).toBeDefined();
		expect(res.status).toBe(true);
	});
});
