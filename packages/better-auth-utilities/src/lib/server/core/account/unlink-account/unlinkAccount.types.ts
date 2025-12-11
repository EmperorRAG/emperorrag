/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/unlink-account/unlinkAccount.types.ts
 * @description Type definitions for server-side unlink account operation.
 */

import type * as Effect from 'effect/Effect';
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { CoreAuthServerError } from '../../shared/core.error';

/**
 * Type helper to extract the unlinkAccount endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `unlinkAccount` method from the server API. This method
 * removes a linked OAuth/social account from the authenticated user.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type UnlinkAccountMethod = AuthServerApiUnlinkAccountPropsFor<typeof authServer>;
 * // (args: { body: { providerId: string }, headers: Headers, ... }) => Promise<...>
 *
 * // Usage in implementation
 * const unlinkAccount: AuthServerApiUnlinkAccountPropsFor = authServer.api.unlinkAccount;
 * const result = await unlinkAccount({
 *   body: { providerId: 'google' },
 *   headers: request.headers
 * });
 * ```
 */
export type AuthServerApiUnlinkAccountPropsFor<T extends AuthServerFor = AuthServerFor> =
	'unlinkAccount' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['unlinkAccount'] : never;

/**
 * Type helper to extract the input parameter type for auth.api.unlinkAccount.
 *
 * @pure
 * @description Extracts the first parameter type from the unlinkAccount method.
 * Includes provider ID, headers (required), and request options.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Input = AuthServerApiUnlinkAccountParamsFor<typeof authServer>;
 * // { body: { providerId: string }, headers: Headers, asResponse?: boolean, ... }
 * ```
 */
export type AuthServerApiUnlinkAccountParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiUnlinkAccountPropsFor<T>>[0];
/**
 * Type helper to extract the return type from auth.api.unlinkAccount.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 * The Promise resolves to success confirmation.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Result = AuthServerApiUnlinkAccountResultFor<typeof authServer>;
 * // Promise<{ status: boolean }>
 * ```
 */
export type AuthServerApiUnlinkAccountResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiUnlinkAccountPropsFor<T>>;

/**
 * Function signature for unlinkAccount server service.
 *
 * @pure
 * @description Function accepting input parameters, returning an Effect that requires AuthServerFor context.
 * Dependencies are accessed through Effect's context layer rather than curried function arguments.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @remarks
 * **Context-Based Dependency Injection:**
 * - Dependencies (authServer) are provided via Effect's context layer (AuthServerFor)
 * - Function accepts only the API parameters directly
 * - Effect executes lazily when run with provided context
 *
 * **Error Channel:**
 * - CoreAuthServerApiError: API call failures with HTTP status codes
 * - Other CoreAuthServerError types from validation layers (if using controller)
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { unlinkAccountServerService } from './unlinkAccount.service';
 *
 * const program = unlinkAccountServerService({
 *   body: { providerId: 'google' },
 *   headers: requestHeaders
 * });
 *
 * // Provide context and run
 * await Effect.runPromise(
 *   program.pipe(Effect.provideService(AuthServerTag, authServer))
 * );
 * ```
 */
export interface unlinkAccountPropsFor<T extends AuthServerFor = AuthServerFor> {
	(params: AuthServerApiUnlinkAccountParamsFor<T>): Effect.Effect<Awaited<AuthServerApiUnlinkAccountResultFor<T>>, CoreAuthServerError, T>;
}

/**
 * Type guard for validating AuthServerApiUnlinkAccountParamsFor.
 *
 * @pure
 * @description Narrows an unknown value to AuthServerApiUnlinkAccountParamsFor<AuthServerFor> by checking
 * the required structural properties. Use after Zod validation to provide type narrowing
 * without casting.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param value - The value to check
 * @returns True if value conforms to AuthServerApiUnlinkAccountParamsFor<AuthServerFor> structure
 */
export const isAuthServerApiUnlinkAccountParamsFor = (value: unknown): value is AuthServerApiUnlinkAccountParamsFor<AuthServerFor> => {
	if (typeof value !== 'object' || value === null) return false;
	const obj = value as Record<string, unknown>;

	if (typeof obj.body !== 'object' || obj.body === null) return false;
	const body = obj.body as Record<string, unknown>;

	if (typeof body.providerId !== 'string') return false;

	// headers is required for unlinkAccount
	if (!(obj.headers instanceof Headers)) return false;

	return true;
};
