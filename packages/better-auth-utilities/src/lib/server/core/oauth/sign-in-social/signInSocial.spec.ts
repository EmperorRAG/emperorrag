/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/sign-in-social/signInSocial.spec.ts
 * @description Unit tests for signInSocial server-side OAuth service.
 */

import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import { OAuthAuthServerServiceTag } from '../shared/oauth.service';
import { signInSocialServerService } from './signInSocial.service';
import { isAuthServerApiSignInSocialParamsFor } from './signInSocial.types';

describe('signInSocial Server', () => {
	describe('signInSocialServerService', () => {
		it('should be a function', () => {
			expect(typeof signInSocialServerService).toBe('function');
		});

		it('should return an Effect when called with params', () => {
			const params = {
				body: {
					provider: 'google',
					callbackURL: '/dashboard',
				},
			};
			const result = signInSocialServerService(params);

			expect(Effect.isEffect(result)).toBe(true);
		});

		it('should require OAuthAuthServerService context', async () => {
			const params = {
				body: {
					provider: 'google',
					callbackURL: '/dashboard',
				},
			};
			const program = signInSocialServerService(params);

			// Mock authServer with signInSocial method
			const mockResult = {
				url: 'https://accounts.google.com/oauth/authorize?...',
				redirect: true,
			};

			const authServer = {
				api: {
					signInSocial: async () => mockResult,
				},
			};

			// Provide the service and run
			const result = await Effect.runPromise(Effect.provideService(program, OAuthAuthServerServiceTag, { authServer } as never));

			expect(result).toEqual(mockResult);
		});

		it('should fail with OAuthAuthServerApiError when API throws', async () => {
			const params = {
				body: {
					provider: 'invalid-provider',
				},
			};
			const program = signInSocialServerService(params);

			const authServer = {
				api: {
					signInSocial: async () => {
						throw new Error('Invalid provider');
					},
				},
			};

			const result = await Effect.runPromiseExit(Effect.provideService(program, OAuthAuthServerServiceTag, { authServer } as never));

			expect(result._tag).toBe('Failure');
		});

		it('should handle session-based response (no redirect)', async () => {
			const headers = new Headers();
			const params = {
				body: {
					provider: 'google',
					disableRedirect: true,
				},
				headers,
			};
			const program = signInSocialServerService(params);

			const mockSession = {
				user: { id: 'user-1', email: 'user@example.com' },
				session: { id: 'session-1' },
			};

			const authServer = {
				api: {
					signInSocial: async () => mockSession,
				},
			};

			const result = await Effect.runPromise(Effect.provideService(program, OAuthAuthServerServiceTag, { authServer } as never));

			expect(result).toEqual(mockSession);
		});

		it('should handle idToken-based authentication', async () => {
			const params = {
				body: {
					provider: 'google',
					idToken: {
						token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
						nonce: 'abc123',
					},
				},
			};
			const program = signInSocialServerService(params);

			const mockSession = {
				user: { id: 'user-1', email: 'user@example.com' },
				session: { id: 'session-1' },
			};

			const authServer = {
				api: {
					signInSocial: async () => mockSession,
				},
			};

			const result = await Effect.runPromise(Effect.provideService(program, OAuthAuthServerServiceTag, { authServer } as never));

			expect(result).toEqual(mockSession);
		});
	});

	describe('isAuthServerApiSignInSocialParamsFor', () => {
		it('should return true for valid params with provider', () => {
			const params = {
				body: {
					provider: 'google',
				},
			};

			expect(isAuthServerApiSignInSocialParamsFor(params)).toBe(true);
		});

		it('should return true for params with all optional fields', () => {
			const headers = new Headers();
			const params = {
				body: {
					provider: 'github',
					callbackURL: '/dashboard',
					errorCallbackURL: '/login?error=true',
					newUserCallbackURL: '/onboarding',
					disableRedirect: false,
				},
				headers,
				asResponse: false,
			};

			expect(isAuthServerApiSignInSocialParamsFor(params)).toBe(true);
		});

		it('should return false for null', () => {
			expect(isAuthServerApiSignInSocialParamsFor(null)).toBe(false);
		});

		it('should return false for undefined', () => {
			expect(isAuthServerApiSignInSocialParamsFor(undefined)).toBe(false);
		});

		it('should return false for non-object values', () => {
			expect(isAuthServerApiSignInSocialParamsFor('string')).toBe(false);
			expect(isAuthServerApiSignInSocialParamsFor(123)).toBe(false);
			expect(isAuthServerApiSignInSocialParamsFor(true)).toBe(false);
		});

		it('should return false for object without body', () => {
			const params = { headers: new Headers() };

			expect(isAuthServerApiSignInSocialParamsFor(params)).toBe(false);
		});

		it('should return false for object with body but without provider', () => {
			const params = {
				body: {
					callbackURL: '/dashboard',
				},
			};

			expect(isAuthServerApiSignInSocialParamsFor(params)).toBe(false);
		});

		it('should return false for object with non-string provider', () => {
			const params = {
				body: {
					provider: 123,
				},
			};

			expect(isAuthServerApiSignInSocialParamsFor(params)).toBe(false);
		});
	});
});
