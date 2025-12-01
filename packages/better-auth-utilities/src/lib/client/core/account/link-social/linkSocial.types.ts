import type { Effect } from 'effect';
import type { createAuthClient } from 'better-auth/client';
import type { AuthClientFor } from '../../../client.types';
import type { AccountAuthClientDeps } from '../shared/account.types';
import type { AccountAuthError } from '../shared/account.error';

/**
 * Input for linking a social account.
 */
export type LinkSocialInput<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = Parameters<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	'linkSocial' extends keyof T ? (T['linkSocial'] extends (...args: any) => any ? T['linkSocial'] : never) : never
>[0];

/**
 * Result of linking a social account.
 */
export type LinkSocialResult<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = ReturnType<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	'linkSocial' extends keyof T ? (T['linkSocial'] extends (...args: any) => any ? T['linkSocial'] : never) : never
>;

/**
 * Type definition for the linkSocial service function.
 */
export interface LinkSocialProps<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> {
	(deps: AccountAuthClientDeps<T>): (input: LinkSocialInput<T>) => Effect.Effect<Awaited<LinkSocialResult<T>>, AccountAuthError>;
}
