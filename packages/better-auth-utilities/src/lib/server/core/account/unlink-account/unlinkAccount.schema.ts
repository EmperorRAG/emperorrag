/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/unlink-account/unlinkAccount.schema.ts
 * @description Zod validation schemas for server-side unlink account operation.
 */

import * as Effect from 'effect/Effect';
import { providerIdBodySchema, createBodySchemaWithRequiredHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for unlinkAccount parameters based on the AuthServer configuration.
 *
 * @pure
 * @description Generates a Zod schema for validating unlink account parameters.
 * The schema validates provider ID, headers (required), and request options.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createUnlinkAccountServerParamsSchema = () =>
	Effect.succeed(createBodySchemaWithRequiredHeaders(providerIdBodySchema));
