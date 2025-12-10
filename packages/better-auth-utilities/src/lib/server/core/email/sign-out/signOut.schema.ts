/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-out/signOut.schema.ts
 * @description Zod validation schemas for server-side sign-out operation.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerFor } from '../../../server.types';
import { createSchemaWithRequiredHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for signOut parameters based on the AuthServer configuration.
 *
 * @pure
 * @description Generates a Zod schema for validating sign-out parameters.
 * Unlike sign-up, sign-out does not require body parameters, only headers for session access.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createSignOutServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.succeed(createSchemaWithRequiredHeaders(undefined, 'Headers instance required for session termination'));
