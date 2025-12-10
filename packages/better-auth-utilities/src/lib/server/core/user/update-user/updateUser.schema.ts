/**
 * @file libs/better-auth-utilities/src/lib/core/user/server/update-user/updateUser.schema.ts
 * @description Zod validation schemas for server-side update user operation.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';
import { nameOptionalSchema, emailOptionalSchema, imageURLNullableOptionalSchema, createBodySchemaWithOptionalHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for updateUser parameters based on the AuthServer configuration.
 *
 * @pure
 * @description Generates a Zod schema that validates update user parameters.
 * All body fields are optional since users may update any subset of their profile.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createUpdateUserServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.succeed(
		createBodySchemaWithOptionalHeaders(
			z.object({
				name: nameOptionalSchema,
				email: emailOptionalSchema,
				image: imageURLNullableOptionalSchema,
			})
		)
	);
