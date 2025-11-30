import * as Effect from 'effect/Effect';
import type { betterAuth } from 'better-auth';
import type { AuthServerFor } from '../../../../server/server.types';
import type { SessionAuthServerDeps } from '../shared/session.types';
import type { SessionAuthServerError } from '../shared/session.error';

/**
 * Input parameters for the getSession server operation.
 *
 * @description Infers the input type directly from the `api.getSession` method of the Better Auth server.
 */
export type GetSessionServerInput<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Parameters<
	'getSession' extends keyof T['api'] ? (T['api']['getSession'] extends (...args: any) => any ? T['api']['getSession'] : never) : never
>[0];

/**
 * Result type for the getSession server operation.
 *
 * @description Infers the return type directly from the `api.getSession` method of the Better Auth server.
 */
export type GetSessionServerResult<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = ReturnType<
	'getSession' extends keyof T['api'] ? (T['api']['getSession'] extends (...args: any) => any ? T['api']['getSession'] : never) : never
>;

/**
 * Functional interface for the getSession server service.
 *
 * @description Defines the curried function signature for the getSession server operation.
 */
export interface GetSessionServerProps<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> {
	(deps: SessionAuthServerDeps<T>): (input: GetSessionServerInput<T>) => Effect.Effect<Awaited<GetSessionServerResult<T>>, SessionAuthServerError>;
}
