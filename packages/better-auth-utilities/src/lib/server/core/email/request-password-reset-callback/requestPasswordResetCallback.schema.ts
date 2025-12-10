/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset-callback/requestPasswordResetCallback.schema.ts
 * @description Zod validation schemas for server-side request password reset callback operation.
 */

import * as Effect from 'effect/Effect';
import { tokenQuerySchema, createQuerySchemaWithOptionalHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for requestPasswordResetCallback parameters.
 *
 * @pure
 * @description Generates a Zod schema for validating request password reset callback parameters.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createRequestPasswordResetCallbackServerParamsSchema = () =>
	Effect.succeed(createQuerySchemaWithOptionalHeaders(tokenQuerySchema));
