/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/forget-password/forgetPassword.schema.ts
 * @description Zod validation schemas for server-side forget password operation.
 */

import { z } from 'zod';

/**
 * Zod schema for validating forgetPassword server body parameters.
 *
 * @pure
 * @description Validates password reset request data including email address and optional redirect URL.
 *
 * @remarks
 * **Required Fields:**
 * - email: Valid email format
 *
 * **Optional Fields:**
 * - redirectTo: Valid URL for post-reset redirect (where user lands after clicking email link)
 *
 * @example
 * ```typescript
 * const body = {
 *   email: 'user@example.com',
 *   redirectTo: 'https://example.com/reset-password'
 * };
 *
 * const result = forgetPasswordServerBodySchema.safeParse(body);
 * if (!result.success) {
 *   console.error('Validation failed:', result.error);
 * }
 * ```
 */
export const forgetPasswordServerBodySchema = z.object({
	email: z.string().email('Invalid email format'),
	redirectTo: z.string().url('Invalid redirect URL').optional(),
});

/**
 * Zod schema for validating complete forgetPassword server parameters.
 *
 * @pure
 * @description Validates the full parameter structure including body, headers, and options.
 *
 * @remarks
 * **Structure:**
 * - body: Required password reset request data (validated by forgetPasswordServerBodySchema)
 * - headers: Optional Headers instance for request context
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
 * const params = {
 *   body: {
 *     email: 'user@example.com',
 *     redirectTo: 'https://example.com/reset-password'
 *   }
 * };
 *
 * const result = forgetPasswordServerParamsSchema.safeParse(params);
 * if (result.success) {
 *   await forgetPasswordServer(deps)(result.data);
 * }
 * ```
 */
export const forgetPasswordServerParamsSchema = z.object({
	body: forgetPasswordServerBodySchema,
	headers: z.instanceof(Headers).optional(),
	asResponse: z.boolean().optional(),
	returnHeaders: z.boolean().optional(),
});
