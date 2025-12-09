/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/list-user-accounts/listUserAccounts.spec.ts
 * @description Unit tests for listUserAccounts server-side authentication service.
 */

import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import { AccountAuthServerServiceTag } from '../shared/account.service';
import { listUserAccountsServerService } from './listUserAccounts.service';
import { isAuthServerApiListUserAccountsParamsFor } from './listUserAccounts.types';

describe('listUserAccounts Server', () => {
	describe('listUserAccountsServerService', () => {
		it('should be a function', () => {
			expect(typeof listUserAccountsServerService).toBe('function');
		});

		it('should return an Effect when called with params', () => {
			const headers = new Headers();
			const params = { headers };
			const result = listUserAccountsServerService(params);

			expect(Effect.isEffect(result)).toBe(true);
		});

		it('should require AccountAuthServerService context', async () => {
			const headers = new Headers();
			const params = { headers };
			const program = listUserAccountsServerService(params);

			// Mock authServer with listUserAccounts method
			const mockAccounts = [
				{ id: 'acc-1', providerId: 'google', accountId: 'google-123' },
				{ id: 'acc-2', providerId: 'github', accountId: 'github-456' },
			];

			const authServer = {
				api: {
					listUserAccounts: async () => mockAccounts,
				},
			};

			// Provide the service and run
			const result = await Effect.runPromise(Effect.provideService(program, AccountAuthServerServiceTag, { authServer } as never));

			expect(result).toEqual(mockAccounts);
		});

		it('should fail with AccountAuthServerApiError when API throws', async () => {
			const headers = new Headers();
			const params = { headers };
			const program = listUserAccountsServerService(params);

			const authServer = {
				api: {
					listUserAccounts: async () => {
						throw new Error('Session expired');
					},
				},
			};

			const result = await Effect.runPromiseExit(Effect.provideService(program, AccountAuthServerServiceTag, { authServer } as never));

			expect(result._tag).toBe('Failure');
		});

		it('should fail with AccountAuthServerDataMissingError when API returns null', async () => {
			const headers = new Headers();
			const params = { headers };
			const program = listUserAccountsServerService(params);

			const authServer = {
				api: {
					listUserAccounts: async () => null,
				},
			};

			const result = await Effect.runPromiseExit(Effect.provideService(program, AccountAuthServerServiceTag, { authServer } as never));

			expect(result._tag).toBe('Failure');
		});

		it('should handle empty accounts array', async () => {
			const headers = new Headers();
			const params = { headers };
			const program = listUserAccountsServerService(params);

			const authServer = {
				api: {
					listUserAccounts: async () => [],
				},
			};

			const result = await Effect.runPromise(Effect.provideService(program, AccountAuthServerServiceTag, { authServer } as never));

			expect(result).toEqual([]);
		});
	});

	describe('isAuthServerApiListUserAccountsParamsFor', () => {
		it('should return true for valid params with headers', () => {
			const headers = new Headers();
			const params = { headers };

			expect(isAuthServerApiListUserAccountsParamsFor(params)).toBe(true);
		});

		it('should return true for params with optional asResponse', () => {
			const headers = new Headers();
			const params = { headers, asResponse: false };

			expect(isAuthServerApiListUserAccountsParamsFor(params)).toBe(true);
		});

		it('should return false for null', () => {
			expect(isAuthServerApiListUserAccountsParamsFor(null)).toBe(false);
		});

		it('should return false for undefined', () => {
			expect(isAuthServerApiListUserAccountsParamsFor(undefined)).toBe(false);
		});

		it('should return false for non-object values', () => {
			expect(isAuthServerApiListUserAccountsParamsFor('string')).toBe(false);
			expect(isAuthServerApiListUserAccountsParamsFor(123)).toBe(false);
			expect(isAuthServerApiListUserAccountsParamsFor(true)).toBe(false);
		});

		it('should return false for object without headers', () => {
			const params = { asResponse: false };

			expect(isAuthServerApiListUserAccountsParamsFor(params)).toBe(false);
		});

		it('should return false for object with non-Headers headers', () => {
			const params = { headers: {} };

			expect(isAuthServerApiListUserAccountsParamsFor(params)).toBe(false);
		});
	});
});
