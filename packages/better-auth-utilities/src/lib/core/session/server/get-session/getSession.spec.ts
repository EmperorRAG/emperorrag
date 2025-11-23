import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Effect, Either } from 'effect';
import { getSessionServer } from './getSession.service.js';
import { setupTestEnv } from '../../../../test/setup-test-env.js';

describe('getSessionServer', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should get session successfully via server api', async () => {
		const { authClient, authServer, baseURL } = env;

		// 1. Sign up a user
		await authClient.signUp.email({
			email: 'test-server-session@example.com',
			password: 'password123',
			name: 'Server Session User',
		});

		// 2. Sign in manually to get the session cookie
		const signInRes = await fetch(`${baseURL}/api/auth/sign-in/email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: 'test-server-session@example.com',
				password: 'password123',
			}),
		});
		const cookie = signInRes.headers.get('set-cookie');

		const headers = new Headers();
		if (cookie) {
			headers.set('Cookie', cookie);
		}

		// 3. Get session via server
		const result = await Effect.runPromise(
			Effect.either(
				getSessionServer({ authServer })({
					headers: headers,
				})
			)
		);

		if (Either.isLeft(result)) {
			console.error('Get Session Server Error:', result.left);
		}
		expect(Either.isRight(result)).toBeTruthy();
		if (Either.isRight(result)) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const data = result.right as any;
			expect(data).toBeDefined();
			expect(data.user).toBeDefined();
			expect(data.user.email).toBe('test-server-session@example.com');
			expect(data.session).toBeDefined();
		}
	});

	it('should return null session when not authenticated', async () => {
		const { authServer } = env;

		const result = await Effect.runPromise(
			Effect.either(
				getSessionServer({ authServer })({
					headers: new Headers(),
				})
			)
		);

		expect(Either.isRight(result)).toBeTruthy();
		if (Either.isRight(result)) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const data = result.right as any;
			expect(data).toBeNull();
		}
	});
});
