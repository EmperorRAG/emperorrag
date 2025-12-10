/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/account-info/accountInfo.schema.ts
 * @description Zod validation schemas for server-side account info operation.
 */

import * as Effect from 'effect/Effect';
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
export const createAccountInfoServerParamsSchema = () =>
	Effect.succeed(createSchemaWithOptionalHeaders());
