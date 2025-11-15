/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-up-email/signUpEmail.schema.ts
 * @description Zod validation schemas for server-side sign-up email operation.
 */

import { z } from 'zod';

/**
 * Zod schema for validating signUpEmail server body parameters.
 *
 * @pure
 * @description Validates user registration data including name, email, password, and optional fields.
 *
 * @remarks
 * **Required Fields:**
 * - name: Non-empty string (minimum 1 character)
 * - email: Valid email format
 * - password: Non-empty string (minimum 1 character)
 *
 * **Optional Fields:**
 * - callbackURL: Valid URL for post-registration redirect
 * - image: Valid URL for user profile image
 *
 * @example
 * ```typescript
 * const body = {
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'securePassword123',
 *   callbackURL: 'https://example.com/welcome',
 *   image: 'https://example.com/avatars/john.jpg'
 * };
 *
 * const result = signUpEmailServerBodySchema.safeParse(body);
 * if (!result.success) {
 *   console.error('Validation failed:', result.error);
 * }
 * ```
 */
export const signUpEmailServerBodySchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email format'),
	password: z.string().min(1, 'Password is required'),
	callbackURL: z.string().url('Invalid callback URL').optional(),
	image: z.string().url('Invalid image URL').optional(),
});

/**
 * Zod schema for validating complete signUpEmail server parameters.
 *
 * @pure
 * @description Validates the full parameter structure including body, headers, and options.
 *
 * @remarks
 * **Structure:**
 * - body: Required registration data (validated by signUpEmailServerBodySchema)
 * - headers: Optional Headers instance for session cookie creation
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
 *     name: 'Jane Smith',
 *     email: 'jane@example.com',
 *     password: 'securePassword123'
 *   },
 *   headers: await headers(),
 *   asResponse: false
 * };
 *
 * const result = signUpEmailServerParamsSchema.safeParse(params);
 * if (result.success) {
 *   await signUpEmailServer(deps)(result.data);
 * }
 * ```
 */
export const signUpEmailServerParamsSchema = z.object({
	body: signUpEmailServerBodySchema,
	headers: z.instanceof(Headers).optional(),
	asResponse: z.boolean().optional(),
	returnHeaders: z.boolean().optional(),
});
