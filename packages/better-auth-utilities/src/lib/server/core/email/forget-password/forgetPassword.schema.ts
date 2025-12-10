/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/forget-password/forgetPassword.schema.ts
 * @description Zod validation schemas for server-side forget password operation.
 */

import * as Effect from 'effect/Effect';
import { emailWithRedirectBodySchema, createBodySchemaWithOptionalHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for forgetPassword parameters based on the AuthServer configuration.
 *
 * @pure
 * @description Generates a Zod schema for validating forget password parameters.
 * The schema validates email format and optional redirect URL.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createForgetPasswordServerParamsSchema = () =>
	Effect.succeed(createBodySchemaWithOptionalHeaders(emailWithRedirectBodySchema));
