import type { betterAuth } from 'better-auth';
import type { AuthServerFor, AuthServerApiFor } from '../../../../server/server.types';
import type { AccountAuthServerError } from '../shared/account.error';
import type { AccountAuthServerDeps } from '../shared/account.types';
import type { Effect } from 'effect';

/**
 * Type helper to extract the body parameter type for auth.api.unlinkAccount.
 */
export type UnlinkAccountServerInput<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Parameters<
	'unlinkAccount' extends keyof AuthServerApiFor<T>
		? AuthServerApiFor<T>['unlinkAccount'] extends (...args: any) => any
			? AuthServerApiFor<T>['unlinkAccount']
			: never
		: never
>[0] extends { body: infer B }
	? B
	: never;

/**
 * Type helper to extract the headers parameter type for auth.api.unlinkAccount.
 */
export type UnlinkAccountServerHeaders = Headers;

/**
 * Type helper for the complete parameter structure accepted by unlinkAccount service.
 */
export type UnlinkAccountServerParams<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = {
	body: UnlinkAccountServerInput<T>;
	headers?: UnlinkAccountServerHeaders;
	asResponse?: boolean;
	returnHeaders?: boolean;
};

/**
 * Type helper to extract the result type from auth.api.unlinkAccount.
 */
export type UnlinkAccountServerResult<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Awaited<
	ReturnType<
		'unlinkAccount' extends keyof AuthServerApiFor<T>
			? AuthServerApiFor<T>['unlinkAccount'] extends (...args: any) => any
				? AuthServerApiFor<T>['unlinkAccount']
				: () => Promise<unknown>
			: () => Promise<unknown>
	>
>;

/**
 * Function signature for unlinkAccount server service.
 */
export interface UnlinkAccountServerProps<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> {
	(deps: AccountAuthServerDeps<T>): (params: UnlinkAccountServerParams<T>) => Effect.Effect<UnlinkAccountServerResult<T>, AccountAuthServerError>;
}
