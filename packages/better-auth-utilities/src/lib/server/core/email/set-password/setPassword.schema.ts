/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/set-password/setPassword.schema.ts
 * @description Zod validation schemas for server-side set password operation.
 */

import { pipe } from 'effect';
import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';
import { getAuthServerConfig, getEmailAndPasswordConfig } from '../../../../shared/config/config.utils';

/**
 * Creates a dynamic Zod schema for setPassword parameters based on the AuthServer configuration.
 *
 * @pure
 * @description Generates a Zod schema that enforces password policies from the Better Auth configuration.
 *
 * @param authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createSetPasswordServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(authServer: T) =>
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

		const bodySchema = z.object({
			newPassword: z.string().min(minPasswordLength).max(maxPasswordLength),
		});

		return z.object({
			body: bodySchema,
			headers: z.instanceof(Headers).optional(),
			asResponse: z.boolean().optional(),
			returnHeaders: z.boolean().optional(),
		});
	});
