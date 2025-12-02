import type { betterAuth } from 'better-auth';
import type { AuthServerFor, AuthServerApiFor } from '../../../server.types';
import type { AccountAuthServerError } from '../shared/account.error';
import type { AccountAuthServerDeps } from '../shared/account.types';
import type * as Effect from 'effect/Effect';

/**
 * Type helper to extract the body parameter type for auth.api.listAccounts.
 *
 * @pure
 * @description Extracts the 'body' property type from the first parameter of listAccounts.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type ListAccountsServerInput<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Parameters<
	'listAccounts' extends keyof AuthServerApiFor<T>
		? AuthServerApiFor<T>['listAccounts'] extends (...args: any) => any
			? AuthServerApiFor<T>['listAccounts']
			: never
		: never
>[0] extends { body: infer B }
	? B
	: void;

/**
 * Type helper to extract the headers parameter type for auth.api.listAccounts.
 */
export type ListAccountsServerHeaders = Headers;

/**
 * Type helper for the complete parameter structure accepted by listAccounts service.
 */
export type ListAccountsServerParams<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = {
	body?: ListAccountsServerInput<T>;
	headers?: ListAccountsServerHeaders;
	asResponse?: boolean;
	returnHeaders?: boolean;
};

/**
 * Type helper to extract the result type from auth.api.listAccounts.
 */
export type ListAccountsServerResult<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Awaited<
	ReturnType<
		'listAccounts' extends keyof AuthServerApiFor<T>
			? AuthServerApiFor<T>['listAccounts'] extends (...args: any) => any
				? AuthServerApiFor<T>['listAccounts']
				: () => Promise<unknown>
			: () => Promise<unknown>
	>
>;

/**
 * Function signature for listAccounts server service.
 */
export interface ListAccountsServerProps<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> {
	(deps: AccountAuthServerDeps<T>): (params: ListAccountsServerParams<T>) => Effect.Effect<ListAccountsServerResult<T>, AccountAuthServerError>;
}
