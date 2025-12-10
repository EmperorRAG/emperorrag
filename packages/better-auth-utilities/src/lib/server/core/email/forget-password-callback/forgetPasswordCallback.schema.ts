/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/forget-password-callback/forgetPasswordCallback.schema.ts
 * @description Zod validation schemas for server-side forget password callback operation.
 */

import * as Effect from 'effect/Effect';
import { tokenQuerySchema, createQuerySchemaWithOptionalHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for forgetPasswordCallback parameters.
 *
 * @pure
 * @description Generates a Zod schema for validating forget password callback parameters.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createForgetPasswordCallbackServerParamsSchema = () =>
	Effect.succeed(createQuerySchemaWithOptionalHeaders(tokenQuerySchema));
