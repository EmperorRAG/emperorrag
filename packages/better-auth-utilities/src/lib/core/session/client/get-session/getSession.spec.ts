import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Effect, Either } from 'effect';
import { getSession } from './getSession.service.js';
import { setupTestEnv } from '../../../../test/setup-test-env.js';

describe('getSession', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should get session successfully', async () => {
		const { authClient, baseURL } = env;

		// 1. Sign up a user
		await authClient.signUp.email({
			email: 'test-session@example.com',
			password: 'password123',
			name: 'Session User',
		});

		// 2. Sign in manually to get the session cookie
		const signInRes = await fetch(`${baseURL}/api/auth/sign-in/email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: 'test-session@example.com',
				password: 'password123',
			}),
		});
		const cookie = signInRes.headers.get('set-cookie');

		// 3. Get session
		const result = await Effect.runPromise(
			Effect.either(
				getSession({ authClient })({
					fetchOptions: {
						headers: {
							Cookie: cookie || '',
						},
					},
				} as any)
			)
		);

		if (Either.isLeft(result)) {
			console.error('Get Session Error:', result.left);
		}
		expect(Either.isRight(result)).toBeTruthy();
		if (Either.isRight(result)) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const data = (result.right as any).data;
			expect(data).toBeDefined();
			expect(data.user).toBeDefined();
			expect(data.user.email).toBe('test-session@example.com');
			expect(data.session).toBeDefined();
		}
	});

	it('should return null session when not authenticated', async () => {
		const { authClient } = env;

		const result = await Effect.runPromise(Effect.either(getSession({ authClient })()));

		expect(Either.isRight(result)).toBeTruthy();
		if (Either.isRight(result)) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const data = (result.right as any).data;
			expect(data).toBeNull();
		}
	});
});
