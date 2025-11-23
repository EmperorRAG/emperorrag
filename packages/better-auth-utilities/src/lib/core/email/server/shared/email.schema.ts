/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/shared/email.schema.ts
 * @description Zod validation schemas for server-side email authentication dependencies.
 */

import { z } from 'zod';

/**
 * Zod schema for validating EmailAuthServerDeps dependencies.
 *
 * @pure
 * @description Runtime validation for the Better Auth server instance dependency.
 * Uses passthrough() to allow plugin-added properties on the api object.
 *
 * @remarks
 * - Validates structural shape: authServer.api must exist
 * - passthrough() allows plugin methods on api object
 * - Does not validate specific endpoint presence (plugin-dependent)
 * - Used in controller validation layer before service calls
 *
 * @example
 * ```typescript
 * import { emailAuthServerDepsSchema } from './email.schema.js';
 *
 * const deps = { authServer: betterAuth({ ... }) };
 *
 * // Runtime validation
 * const result = emailAuthServerDepsSchema.safeParse(deps);
 * if (!result.success) {
 *   throw new EmailAuthServerDependenciesError(
 *     'Invalid server dependencies',
 *     result.error
 *   );
 * }
 * ```
 */
export const emailAuthServerDepsSchema = z.object({
	authServer: z
		.object({
			api: z.object({}).passthrough(),
		})
		.passthrough(),
});
