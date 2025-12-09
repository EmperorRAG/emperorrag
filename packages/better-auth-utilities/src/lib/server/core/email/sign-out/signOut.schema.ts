/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-out/signOut.schema.ts
 * @description Zod validation schemas for server-side sign-out operation.
 */

import { z } from 'zod';

/**
 * Zod schema for validating signOut server parameters.
 *
 * @pure
 * @description Validates the parameter structure for sign-out operation.
 * Unlike sign-in/sign-up, signOut does not require a body parameter.
 *
 * @remarks
 * **Required Fields:**
 * - headers: Headers instance (required for accessing session cookies)
 *
 * **Optional Fields:**
 * - asResponse: Boolean to return full Response object
 * - returnHeaders: Boolean to include response headers in result
 *
 * **Usage Context:**
 * - Controller layer: Validate before calling service
 * - Testing: Ensure test data matches expected structure
 * - Type guards: Runtime verification of parameter shape
 *
 * @example
 * ```typescript
 * import { headers } from 'next/headers';
 *
 * const params = {
 *   headers: await headers()
 * };
 *
 * const result = signOutServerParamsSchema.safeParse(params);
 * if (result.success) {
 *   await signOutServer(deps)(result.data);
 * }
 * ```
 */
export const signOutServerParamsSchema = z.object({
	headers: z.instanceof(Headers, { message: 'Headers instance required for session termination' }),
	asResponse: z.boolean().optional(),
	returnHeaders: z.boolean().optional(),
});
