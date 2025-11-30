import type { betterAuth } from 'better-auth';
import type { AuthServerFor, AuthServerApiFor } from '../../../../server/server.types';
import type { UserAuthServerError } from '../shared/user.error';
import type { UserAuthServerDeps } from '../shared/user.types';
import type { Effect } from 'effect';

/**
 * Type helper to extract the body parameter type for auth.api.updateUser.
 */
export type UpdateUserServerInput<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Parameters<
	'updateUser' extends keyof AuthServerApiFor<T>
		? AuthServerApiFor<T>['updateUser'] extends (...args: any) => any
			? AuthServerApiFor<T>['updateUser']
			: never
		: never
>[0] extends { body: infer B }
	? B
	: never;

/**
 * Type helper to extract the headers parameter type for auth.api.updateUser.
 */
export type UpdateUserServerHeaders = Headers;

/**
 * Type helper for the complete parameter structure accepted by updateUser service.
 */
export type UpdateUserServerParams<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = {
	body: UpdateUserServerInput<T>;
	headers?: UpdateUserServerHeaders;
	asResponse?: boolean;
	returnHeaders?: boolean;
};

/**
 * Type helper to extract the result type from auth.api.updateUser.
 */
export type UpdateUserServerResult<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Awaited<
	ReturnType<
		'updateUser' extends keyof AuthServerApiFor<T>
			? AuthServerApiFor<T>['updateUser'] extends (...args: any) => any
				? AuthServerApiFor<T>['updateUser']
				: () => Promise<unknown>
			: () => Promise<unknown>
	>
>;

/**
 * Function signature for updateUser server service.
 */
export interface UpdateUserServerProps<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> {
	(deps: UserAuthServerDeps<T>): (params: UpdateUserServerParams<T>) => Effect.Effect<UpdateUserServerResult<T>, UserAuthServerError>;
}
