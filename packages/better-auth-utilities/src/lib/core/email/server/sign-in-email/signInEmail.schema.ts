/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-in-email/signInEmail.schema.ts
 * @description Zod validation schemas for server-side sign-in email operation.
 */

import { z } from 'zod';

/**
 * Zod schema for validating signInEmail server body parameters.
 *
 * @pure
 * @description Validates the authentication credentials and options for sign-in.
 *
 * @remarks
 * **Required Fields:**
 * - email: Valid email format
 * - password: Non-empty string (minimum 1 character)
 *
 * **Optional Fields:**
 * - rememberMe: Boolean flag for persistent session
 * - callbackURL: Valid URL for post-authentication redirect
 *
 * @example
 * ```typescript
 * const body = {
 *   email: 'user@example.com',
 *   password: 'securePassword123',
 *   rememberMe: true,
 *   callbackURL: 'https://example.com/dashboard'
 * };
 *
 * const result = signInEmailServerBodySchema.safeParse(body);
 * if (!result.success) {
 *   console.error('Validation failed:', result.error);
 * }
 * ```
 */
export const signInEmailServerBodySchema = z.object({
	email: z.string().email('Invalid email format'),
	password: z.string().min(1, 'Password is required'),
	rememberMe: z.boolean().optional(),
	callbackURL: z.string().url('Invalid callback URL').optional(),
});

/**
 * Zod schema for validating complete signInEmail server parameters.
 *
 * @pure
 * @description Validates the full parameter structure including body, headers, and options.
 *
 * @remarks
 * **Structure:**
 * - body: Required authentication credentials (validated by signInEmailServerBodySchema)
 * - headers: Optional Headers instance for session cookie handling
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
 *     email: 'user@example.com',
 *     password: 'securePassword123'
 *   },
 *   headers: await headers(),
 *   asResponse: false
 * };
 *
 * const result = signInEmailServerParamsSchema.safeParse(params);
 * if (result.success) {
 *   // Proceed with sign-in
 *   await signInEmailServer(deps)(result.data);
 * }
 * ```
 */
export const signInEmailServerParamsSchema = z.object({
	body: signInEmailServerBodySchema,
	headers: z.instanceof(Headers).optional(),
	asResponse: z.boolean().optional(),
	returnHeaders: z.boolean().optional(),
});
