/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/send-verification-email/sendVerificationEmail.schema.ts
 * @description Zod validation schemas for server-side send verification email operation.
 */

import { z } from 'zod';

/**
 * Zod schema for validating sendVerificationEmail server body parameters.
 *
 * @pure
 * @description Validates verification email data including email address and optional callback URL.
 *
 * @remarks
 * **Required Fields:**
 * - email: Valid email format
 *
 * **Optional Fields:**
 * - callbackURL: Valid URL for post-verification redirect
 *
 * @example
 * ```typescript
 * const body = {
 *   email: 'user@example.com',
 *   callbackURL: 'https://example.com/verify-success'
 * };
 *
 * const result = sendVerificationEmailServerBodySchema.safeParse(body);
 * if (!result.success) {
 *   console.error('Validation failed:', result.error);
 * }
 * ```
 */
export const sendVerificationEmailServerBodySchema = z.object({
	email: z.string().email('Invalid email format'),
	callbackURL: z.string().url('Invalid callback URL').optional(),
});

/**
 * Zod schema for validating complete sendVerificationEmail server parameters.
 *
 * @pure
 * @description Validates the full parameter structure including body, headers, and options.
 *
 * @remarks
 * **Structure:**
 * - body: Required verification email data (validated by sendVerificationEmailServerBodySchema)
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
 *     callbackURL: 'https://example.com/verify'
 *   }
 * };
 *
 * const result = sendVerificationEmailServerParamsSchema.safeParse(params);
 * if (result.success) {
 *   await sendVerificationEmailServer(deps)(result.data);
 * }
 * ```
 */
export const sendVerificationEmailServerParamsSchema = z.object({
	body: sendVerificationEmailServerBodySchema,
	headers: z.instanceof(Headers).optional(),
	asResponse: z.boolean().optional(),
	returnHeaders: z.boolean().optional(),
});
