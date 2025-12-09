/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/account-info/accountInfo.types.ts
 * @description Type definitions for server-side account info operation.
 */

import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { AccountAuthServerError } from '../shared/account.error';
import type { AccountAuthServerService } from '../shared/account.types';
import type * as Effect from 'effect/Effect';

export type AuthServerApiAccountInfoPropsFor<T extends AuthServerFor = AuthServerFor> =
	'accountInfo' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['accountInfo'] : never;

export type AuthServerApiAccountInfoParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiAccountInfoPropsFor<T>>[0];

export type AuthServerApiAccountInfoResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiAccountInfoPropsFor<T>>;

export interface accountInfoPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiAccountInfoParamsFor<T>
	): Effect.Effect<Awaited<AuthServerApiAccountInfoResultFor<T>>, AccountAuthServerError, AccountAuthServerService>;
}

export const isAuthServerApiAccountInfoParamsFor = <T extends AuthServerFor = AuthServerFor>(value: unknown): value is AuthServerApiAccountInfoParamsFor<T> => {
	if (typeof value !== 'object' || value === null) return false;
	return true;
};
