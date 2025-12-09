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
