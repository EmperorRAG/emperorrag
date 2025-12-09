/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-up-email/signUpEmail.schema.ts
 * @description Zod validation schemas for server-side sign-up email operation.
 */

import { pipe } from 'effect';
import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';
import { getAuthServerConfig, getEmailAndPasswordConfig, getUserAdditionalFields, getUserConfig } from './signUpEmail.utils';

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

/**
 * Creates a dynamic Zod schema for signUpEmail parameters based on the AuthServer configuration.
 *
 * @pure
 * @description Generates a Zod schema that enforces password policies and includes
 * additional user fields defined in the Better Auth configuration.
 *
 * @param authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createSignUpEmailServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(authServer: T) =>
	Effect.gen(function* () {
		const config = getAuthServerConfig(authServer);

		const passwordConfig = pipe(config, Option.flatMap(getEmailAndPasswordConfig));

		const minPasswordLength = pipe(
			passwordConfig,
			Option.flatMap((c) => Option.fromNullable(c.minPasswordLength)),
			Option.getOrElse(() => 8)
		);

		const maxPasswordLength = pipe(
			passwordConfig,
			Option.flatMap((c) => Option.fromNullable(c.maxPasswordLength)),
			Option.getOrElse(() => 32)
		);

		const additionalZodFields = pipe(
			config,
			Option.flatMap(getUserConfig),
			Option.flatMap(getUserAdditionalFields),
			Option.map((fields) =>
				Object.entries(fields)
					.filter(([_, fieldDef]) => {
						const input = typeof fieldDef === 'string' ? true : (fieldDef.input ?? true);
						return input;
					})
					.map(([key, fieldDef]) => {
						const type = typeof fieldDef === 'string' ? fieldDef : fieldDef.type;
						const required = typeof fieldDef === 'string' ? false : (fieldDef.required ?? false);

						let zodField: z.ZodTypeAny;
						if (type === 'string') zodField = z.string();
						else if (type === 'number') zodField = z.number();
						else if (type === 'boolean') zodField = z.boolean();
						else zodField = z.any();

						if (!required) zodField = zodField.optional();
						return [key, zodField] as const;
					})
			),
			Option.map((entries) => Object.fromEntries(entries)),
			Option.getOrElse(() => ({}))
		);

		const bodySchema = z
			.object({
				name: z.string().min(1, 'Name is required'),
				email: z.string().email('Invalid email format'),
				password: z.string().min(minPasswordLength).max(maxPasswordLength),
				callbackURL: z.string().url('Invalid callback URL').optional(),
				image: z.string().url('Invalid image URL').optional(),
			})
			.extend(additionalZodFields);

		return z.object({
			body: bodySchema,
			headers: z.instanceof(Headers).optional(),
			asResponse: z.boolean().optional(),
			returnHeaders: z.boolean().optional(),
		});
	});
