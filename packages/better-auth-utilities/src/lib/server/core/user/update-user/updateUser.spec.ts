import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as Effect from 'effect/Effect';
import * as Either from 'effect/Either';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { updateUserServer } from './updateUser.service';

describe('updateUserServer', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should update user successfully', async () => {
		const { authClient, authServer, baseURL } = env;

		// 1. Create a user
		await authClient.signUp.email({
			email: 'test-server-update@example.com',
			password: 'password123',
			name: 'Original Name',
		});

		// 2. Sign in manually to get the session cookie
		const signInRes = await fetch(`${baseURL}/api/auth/sign-in/email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: 'test-server-update@example.com',
				password: 'password123',
			}),
		});

		if (!signInRes.ok) {
			const text = await signInRes.text();
			throw new Error(`Sign in failed: ${signInRes.status} ${text}`);
		}

		const cookie = signInRes.headers.get('set-cookie');
		if (!cookie) {
			throw new Error('No cookie returned from sign in');
		}

		const headers = new Headers();
		headers.set('Cookie', cookie);
		// headers.set('Origin', baseURL); // Might be needed

		// 3. Update user using server function
		const result = await Effect.runPromise(
			Effect.either(
				updateUserServer({ authServer: authServer })({
					body: {
						name: 'Updated Name',
					},
					headers: headers,
				})
			)
		);

		expect(Either.isRight(result)).toBeTruthy();
		if (Either.isRight(result)) {
			expect((result.right as any).status).toBe(true);

			// Verify in DB
			const stmt = env.db.prepare('SELECT * FROM user WHERE email = ?');
			const user = stmt.get('test-server-update@example.com') as any;
			expect(user.name).toBe('Updated Name');
		}
	});
});
