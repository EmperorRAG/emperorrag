import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { setupTestEnv } from '../../../../test/setup-test-env';
import { sendVerificationEmailServerService } from './sendVerificationEmail.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';
import * as Effect from 'effect/Effect';

describe('Server Send Verification Email', () => {
	let env: Awaited<ReturnType<typeof setupTestEnv>>;

	beforeAll(async () => {
		const sendVerificationEmailMock = vi.fn();

		env = await setupTestEnv({
			serverConfig: {
				emailVerification: {
					sendVerificationEmail: sendVerificationEmailMock,
				},
			},
		});
	});

	afterAll(async () => {
		await env.cleanup();
	});

	it('should send verification email via server api', async () => {
		const { authServer, authClient } = env;
		const email = 'server-verify@example.com';

		// Create user
		await authClient.signUp.email({
			email,
			password: 'password123',
			name: 'Server Verify',
		});

		// Send verification via server API using Effect service
		const program = sendVerificationEmailServerService({
			body: {
				email,
			},
		});

		const res = await Effect.runPromise(Effect.provideService(program, EmailAuthServerServiceTag, { authServer }));

		expect(res).toBeDefined();
		expect(res.status).toBe(true);
	});
});
