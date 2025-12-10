import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { listUserAccountsServerService } from './listUserAccounts.service';
import { AccountAuthServerServiceTag } from '../shared/account.service';
import * as Effect from 'effect/Effect';

describe('Server List User Accounts', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		env = await setupTestEnv();
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should list user accounts for authenticated user', async () => {
		const { authServer } = env;
		const email = 'list-accounts-test@example.com';
		const password = 'password123';
		const name = 'List Accounts Test';

		// Create a user
		await authServer.api.signUpEmail({
			body: { email, password, name },
		});

		// Sign in to get session cookie
		const signInRes = await authServer.api.signInEmail({
			body: { email, password },
			asResponse: true,
		});

		const cookie = signInRes.headers.get('set-cookie');
		expect(cookie).toBeDefined();

		const program = listUserAccountsServerService({
			headers: new Headers({
				cookie: cookie || '',
			}),
		});

		const res = await Effect.runPromise(Effect.provideService(program, AccountAuthServerServiceTag, { authServer }));

		expect(res).toBeDefined();
		expect(Array.isArray(res)).toBe(true);
	});

	it('should fail without authentication', async () => {
		const { authServer } = env;

		const program = listUserAccountsServerService({});

		await expect(Effect.runPromise(Effect.provideService(program, AccountAuthServerServiceTag, { authServer }))).rejects.toThrow();
	});
});
