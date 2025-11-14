import { createAuthClient } from 'better-auth/client';

/**
 * Type helper to infer the full client type including all plugins.
 *
 * @example
 * ```typescript
 * const authClient = createAuthClient(authConfig);
 * export type AuthClient = AuthClientFor<typeof authClient>;
 * ```
 */
export type AuthClientFor<T extends ReturnType<typeof createAuthClient>> = T;
