/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset/requestPasswordReset.schema.ts
 * @description Zod validation schemas for server-side request password reset operation.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerFor } from '../../../server.types';
import { emailRequiredWithRedirectBodySchema, createBodySchemaWithOptionalHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for requestPasswordReset parameters.
 *
 * @pure
 * @description Generates a Zod schema for validating request password reset parameters.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createRequestPasswordResetServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.succeed(createBodySchemaWithOptionalHeaders(emailRequiredWithRedirectBodySchema));
