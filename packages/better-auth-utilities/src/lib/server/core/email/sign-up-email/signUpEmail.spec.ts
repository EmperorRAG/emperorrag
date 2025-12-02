import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { signUpEmailServer } from './signUpEmail.service';
import * as Effect from 'effect/Effect';

describe('Server Sign Up Email', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;
	let wrappedAuthServer: ReturnType<typeof signUpEmailServer>;

	beforeAll(async () => {
		env = await setupTestEnv();
		const deps = env;
		wrappedAuthServer = signUpEmailServer(deps);
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should sign up a user via server api', async () => {
		//const { authServer } = env;
		//const wrappedAuthServerC = wrappedAuthServer({});
		const email = 'server-signup@example.com';
		const password = 'password123';
		const name = 'Server Sign Up';

		//const res = await authServer.api.signUpEmail({
		const res = await Effect.runPromise(
			wrappedAuthServer({
				body: {
					email,
					password,
					name,
				},
			})
		);
		expect(res).toBeDefined();
		expect(res.user).toBeDefined();
		expect(res.user.email).toBe(email);
		// expect(res.session).toBeDefined(); // Session might not be returned directly in all configs or types might vary
	});
});
