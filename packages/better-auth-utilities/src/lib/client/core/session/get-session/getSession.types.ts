import * as Effect from 'effect/Effect';
import type { createAuthClient } from 'better-auth/client';
import type { AuthClientFor } from '../../../client.types';
import type { SessionAuthClientDeps } from '../shared/session.types';
import type { SessionAuthError } from '../shared/session.error';

/**
 * Input parameters for the getSession operation.
 *
 * @description Infers the input type directly from the `getSession` method of the Better Auth client.
 */
export type GetSessionInput<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = Parameters<
	'getSession' extends keyof T ? (T['getSession'] extends (...args: any) => any ? T['getSession'] : never) : never
>[0];

/**
 * Result type for the getSession operation.
 *
 * @description Infers the return type directly from the `getSession` method of the Better Auth client.
 */
export type GetSessionResult<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = ReturnType<
	'getSession' extends keyof T ? (T['getSession'] extends (...args: any) => any ? T['getSession'] : never) : never
>;

/**
 * Functional interface for the getSession service.
 *
 * @description Defines the curried function signature for the getSession operation.
 */
export interface GetSessionProps<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> {
	(deps: SessionAuthClientDeps<T>): (input?: GetSessionInput<T>) => Effect.Effect<Awaited<GetSessionResult<T>>, SessionAuthError>;
}
