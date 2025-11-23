import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Effect, Either } from 'effect';
import { updateUser } from './updateUser.service.js';
import { setupTestEnv } from '../../../../test/setup-test-env.js';

describe('updateUser', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should update user name successfully', async () => {
		const { authClient, baseURL } = env;
		const newName = 'Updated Name';

		// 1. Sign up a user
		await authClient.signUp.email({
			email: 'test-update-client@example.com',
			password: 'password123',
			name: 'Original Name',
		});

		// 2. Sign in manually to get the session cookie (Node environment workaround)
		const signInRes = await fetch(`${baseURL}/api/auth/sign-in/email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: 'test-update-client@example.com',
				password: 'password123',
			}),
		});
		const cookie = signInRes.headers.get('set-cookie');

		// 3. Update user
		const result = await Effect.runPromise(
			Effect.either(
				updateUser({ authClient })({
					name: newName,
					fetchOptions: {
						headers: {
							Cookie: cookie || '',
						},
					},
				} as any)
			)
		);

		if (Either.isLeft(result)) {
			console.error('Update User Client Error:', result.left);
		}
		expect(Either.isRight(result)).toBeTruthy();
		if (Either.isRight(result)) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const data = (result.right as any).data;
			expect(data).toBeDefined();
			expect(data.status).toBe(true);

			// Verify update by getting session
			const session = await authClient.getSession({
				fetchOptions: {
					headers: {
						Cookie: cookie || '',
					},
				},
			});
			expect(session.data?.user.name).toBe(newName);
		}
	});

	it('should fail without authentication', async () => {
		const { authClient } = env;
		const newName = 'Updated Name';

		const result = await Effect.runPromise(
			Effect.either(
				updateUser({ authClient })({
					name: newName,
				} as any)
			)
		);

		expect(Either.isLeft(result)).toBeTruthy();
	});
});
