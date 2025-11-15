/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/change-password/changePassword.schema.ts
 * @description Zod validation schemas for server-side change password operation.
 */

import { z } from 'zod';

/**
 * Zod schema for validating changePassword server body parameters.
 *
 * @pure
 * @description Validates password change data including current password, new password, and session revocation option.
 *
 * @remarks
 * **Required Fields:**
 * - currentPassword: Non-empty string (minimum 1 character) for verification
 * - newPassword: Non-empty string (minimum 8 characters recommended by security best practices)
 *
 * **Optional Fields:**
 * - revokeOtherSessions: Boolean flag to invalidate all other active sessions (default: false)
 *
 * @example
 * ```typescript
 * const body = {
 *   currentPassword: 'oldPassword123',
 *   newPassword: 'newSecurePassword456',
 *   revokeOtherSessions: true
 * };
 *
 * const result = changePasswordServerBodySchema.safeParse(body);
 * if (!result.success) {
 *   console.error('Validation failed:', result.error);
 * }
 * ```
 */
export const changePasswordServerBodySchema = z.object({
	currentPassword: z.string().min(1, 'Current password is required'),
	newPassword: z.string().min(8, 'New password must be at least 8 characters'),
	revokeOtherSessions: z.boolean().optional(),
});

/**
 * Zod schema for validating complete changePassword server parameters.
 *
 * @pure
 * @description Validates the full parameter structure including body, headers, and options.
 *
 * @remarks
 * **Structure:**
 * - body: Required password change data (validated by changePasswordServerBodySchema)
 * - headers: Required Headers instance for session identification
 * - asResponse: Optional boolean to return full Response object
 * - returnHeaders: Optional boolean to include response headers in result
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
 *   body: {
 *     currentPassword: 'oldPassword123',
 *     newPassword: 'newSecurePassword456',
 *     revokeOtherSessions: false
 *   },
 *   headers: await headers()
 * };
 *
 * const result = changePasswordServerParamsSchema.safeParse(params);
 * if (result.success) {
 *   await changePasswordServer(deps)(result.data);
 * }
 * ```
 */
export const changePasswordServerParamsSchema = z.object({
	body: changePasswordServerBodySchema,
	headers: z.instanceof(Headers, { message: 'Headers instance required for session identification' }),
	asResponse: z.boolean().optional(),
	returnHeaders: z.boolean().optional(),
});
