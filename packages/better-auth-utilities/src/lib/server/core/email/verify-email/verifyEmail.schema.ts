/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/verify-email/verifyEmail.schema.ts
 * @description Zod validation schemas for server-side verify email operation.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerFor } from '../../../server.types';
import { tokenQuerySchema, createQuerySchemaWithOptionalHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for verifyEmail parameters.
 *
 * @pure
 * @description Generates a Zod schema that validates verify email parameters.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createVerifyEmailServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.succeed(createQuerySchemaWithOptionalHeaders(tokenQuerySchema));
