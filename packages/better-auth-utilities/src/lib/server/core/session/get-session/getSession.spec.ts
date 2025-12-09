/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-session/getSession.spec.ts
 * @description Unit tests for getSession server-side session service.
 */

import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import { SessionAuthServerServiceTag } from '../shared/session.service';
import { getSessionServerService } from './getSession.service';
import { isAuthServerApiGetSessionParamsFor } from './getSession.types';

describe('getSession Server', () => {
	describe('getSessionServerService', () => {
		it('should be a function', () => {
			expect(typeof getSessionServerService).toBe('function');
		});

		it('should return an Effect when called with params', () => {
			const headers = new Headers();
			const params = { headers };
			const result = getSessionServerService(params);

			expect(Effect.isEffect(result)).toBe(true);
		});

		it('should require SessionAuthServerService context', async () => {
			const headers = new Headers();
			const params = { headers };
			const program = getSessionServerService(params);

			// Mock authServer with getSession method returning session data
			const mockSession = {
				user: { id: 'user-1', email: 'test@example.com', name: 'Test User' },
				session: { id: 'session-1', userId: 'user-1', expiresAt: new Date() },
			};

			const authServer = {
				api: {
					getSession: async () => mockSession,
				},
			};

			// Provide the service and run
			const result = await Effect.runPromise(Effect.provideService(program, SessionAuthServerServiceTag, { authServer } as never));

			expect(result).toEqual(mockSession);
		});

		it('should return null when no session exists', async () => {
			const headers = new Headers();
			const params = { headers };
			const program = getSessionServerService(params);

			const authServer = {
				api: {
					getSession: async () => null,
				},
			};

			const result = await Effect.runPromise(Effect.provideService(program, SessionAuthServerServiceTag, { authServer } as never));

			expect(result).toBeNull();
		});

		it('should fail with SessionAuthServerApiError when API throws', async () => {
			const headers = new Headers();
			const params = { headers };
			const program = getSessionServerService(params);

			const authServer = {
				api: {
					getSession: async () => {
						throw new Error('Database connection failed');
					},
				},
			};

			const result = await Effect.runPromiseExit(Effect.provideService(program, SessionAuthServerServiceTag, { authServer } as never));

			expect(result._tag).toBe('Failure');
		});

		it('should handle session with plugin-augmented user data', async () => {
			const headers = new Headers();
			const params = { headers };
			const program = getSessionServerService(params);

			// Mock session with additional plugin fields
			const mockSession = {
				user: {
					id: 'user-1',
					email: 'admin@example.com',
					name: 'Admin User',
					role: 'admin', // Plugin-added field
					organizationId: 'org-1', // Plugin-added field
				},
				session: {
					id: 'session-1',
					userId: 'user-1',
					expiresAt: new Date(),
					activeOrganizationId: 'org-1', // Plugin-added field
				},
			};

			const authServer = {
				api: {
					getSession: async () => mockSession,
				},
			};

			const result = await Effect.runPromise(Effect.provideService(program, SessionAuthServerServiceTag, { authServer } as never));

			expect(result).toEqual(mockSession);
			expect((result as unknown as typeof mockSession).user.role).toBe('admin');
		});
	});

	describe('isAuthServerApiGetSessionParamsFor', () => {
		it('should return true for valid params with headers', () => {
			const headers = new Headers();
			const params = { headers };

			expect(isAuthServerApiGetSessionParamsFor(params)).toBe(true);
		});

		it('should return true for params with optional asResponse', () => {
			const headers = new Headers();
			const params = { headers, asResponse: false };

			expect(isAuthServerApiGetSessionParamsFor(params)).toBe(true);
		});

		it('should return true for params with optional returnHeaders', () => {
			const headers = new Headers();
			const params = { headers, returnHeaders: true };

			expect(isAuthServerApiGetSessionParamsFor(params)).toBe(true);
		});

		it('should return false for null', () => {
			expect(isAuthServerApiGetSessionParamsFor(null)).toBe(false);
		});

		it('should return false for undefined', () => {
			expect(isAuthServerApiGetSessionParamsFor(undefined)).toBe(false);
		});

		it('should return false for non-object values', () => {
			expect(isAuthServerApiGetSessionParamsFor('string')).toBe(false);
			expect(isAuthServerApiGetSessionParamsFor(123)).toBe(false);
			expect(isAuthServerApiGetSessionParamsFor(true)).toBe(false);
		});

		it('should return false for object without headers', () => {
			const params = { asResponse: false };

			expect(isAuthServerApiGetSessionParamsFor(params)).toBe(false);
		});

		it('should return false for object with non-Headers headers', () => {
			const params = { headers: {} };

			expect(isAuthServerApiGetSessionParamsFor(params)).toBe(false);
		});

		it('should return false for object with headers as plain object', () => {
			const params = { headers: { 'Content-Type': 'application/json' } };

			expect(isAuthServerApiGetSessionParamsFor(params)).toBe(false);
		});
	});
});
