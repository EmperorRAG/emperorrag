/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/send-verification-email/sendVerificationEmail.schema.ts
 * @description Zod validation schemas for server-side send verification email operation.
 */

import * as Effect from 'effect/Effect';
import { emailWithCallbackBodySchema, createBodySchemaWithOptionalHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for sendVerificationEmail parameters based on the AuthServer configuration.
 *
 * @pure
 * @description Generates a Zod schema for validating send verification email parameters.
 * The schema validates email format and optional callback URL.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createSendVerificationEmailServerParamsSchema = () =>
	Effect.succeed(createBodySchemaWithOptionalHeaders(emailWithCallbackBodySchema));
