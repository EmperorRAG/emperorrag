/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/account-info/accountInfo.schema.ts
 * @description Zod validation schemas for server-side account info operation.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerFor } from '../../../server.types';
import { createSchemaWithOptionalHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for accountInfo parameters.
 *
 * @pure
 * @description Generates a Zod schema for validating account info parameters.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createAccountInfoServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.succeed(createSchemaWithOptionalHeaders());
