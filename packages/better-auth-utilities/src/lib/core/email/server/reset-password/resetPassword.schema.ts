/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/reset-password/resetPassword.schema.ts
 * @description Zod validation schemas for server-side reset password operation.
 */

import { z } from 'zod';

/**
 * Zod schema for validating resetPassword server body parameters.
 *
 * @pure
 * @description Validates password reset data including token and new password.
 *
 * @remarks
 * **Required Fields:**
 * - token: Non-empty string (secure reset token from email link)
 * - password: Non-empty string (minimum 8 characters recommended by security best practices)
 *
 * @example
 * ```typescript
 * const body = {
 *   token: 'secure-reset-token-from-email',
 *   password: 'newSecurePassword123'
 * };
 *
 * const result = resetPasswordServerBodySchema.safeParse(body);
 * if (!result.success) {
 *   console.error('Validation failed:', result.error);
 * }
 * ```
 */
export const resetPasswordServerBodySchema = z.object({
	token: z.string().min(1, 'Reset token is required'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
});

/**
 * Zod schema for validating complete resetPassword server parameters.
 *
 * @pure
 * @description Validates the full parameter structure including body, headers, and options.
 *
 * @remarks
 * **Structure:**
 * - body: Required password reset data (validated by resetPasswordServerBodySchema)
 * - headers: Optional Headers instance for request context and session cookie creation
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
 *     token: 'secure-reset-token-from-email',
 *     password: 'newSecurePassword123'
 *   },
 *   headers: await headers()
 * };
 *
 * const result = resetPasswordServerParamsSchema.safeParse(params);
 * if (result.success) {
 *   await resetPasswordServer(deps)(result.data);
 * }
 * ```
 */
export const resetPasswordServerParamsSchema = z.object({
	body: resetPasswordServerBodySchema,
	headers: z.instanceof(Headers).optional(),
	asResponse: z.boolean().optional(),
	returnHeaders: z.boolean().optional(),
});
