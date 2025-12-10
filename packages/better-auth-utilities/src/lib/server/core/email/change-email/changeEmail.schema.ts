/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/change-email/changeEmail.schema.ts
 * @description Zod validation schemas for server-side change email operation.
 */

import * as Effect from 'effect/Effect';
import { newEmailBodySchema, createBodySchemaWithOptionalHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for changeEmail parameters.
 *
 * @pure
 * @description Generates a Zod schema that validates change email parameters.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createChangeEmailServerParamsSchema = () =>
	Effect.succeed(createBodySchemaWithOptionalHeaders(newEmailBodySchema));
