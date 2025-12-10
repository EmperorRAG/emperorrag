/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/account-info/accountInfo.types.ts
 * @description Type definitions for server-side account info operation.
 */

import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { CoreAuthServerError } from '../../shared/core.error';
import type * as Effect from 'effect/Effect';

export type AuthServerApiAccountInfoPropsFor<T extends AuthServerFor = AuthServerFor> =
	'accountInfo' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['accountInfo'] : never;

export type AuthServerApiAccountInfoParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiAccountInfoPropsFor<AuthServerFor>>[0];

export type AuthServerApiAccountInfoResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiAccountInfoPropsFor<AuthServerFor>>;

export interface accountInfoPropsFor<T extends AuthServerFor = AuthServerFor> {
	(params: AuthServerApiAccountInfoParamsFor<AuthServerFor>): Effect.Effect<Awaited<AuthServerApiAccountInfoResultFor<AuthServerFor>>, CoreAuthServerError, AuthServerFor>;
}

export const isAuthServerApiAccountInfoParamsFor = (value: unknown): value is AuthServerApiAccountInfoParamsFor<AuthServerFor> => {
	if (typeof value !== 'object' || value === null) return false;
	return true;
};
