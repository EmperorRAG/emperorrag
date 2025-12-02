import type { createAuthClient } from 'better-auth/client';
import type { AuthClientFor } from '../../../client.types';

/**
 * Shared dependency type for email authentication operations.
 *
 * @description Defines the dependency bundle structure containing the Better Auth client,
 * used across all email authentication operations (signIn, signUp, signOut, etc.).
 *
 * @example
 * ```typescript
 * const deps: EmailAuthClientDeps<typeof authClient> = {
 *   authClient: myAuthClient
 * };
 * ```
 */
export type EmailAuthClientDeps<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = Readonly<{
	authClient: T;
}>;
