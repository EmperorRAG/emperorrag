import type { AuthServerFor } from '../../../server.types';
/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-session/getSession.schema.ts
 * @description Zod schema generation for getSession server validation.
 * Provides dynamic schema creation based on Better Auth server configuration.
 */

import * as Effect from 'effect/Effect';
import { AuthServerTag } from '../../../server.service';
import { createSchemaWithRequiredHeaders } from '../../shared/core.schema';

/**
 * Creates a Zod schema for validating getSession server parameters.
 *
 * @pure
 * @description Dynamically generates a validation schema for session retrieval parameters.
 * Returns an Effect that succeeds with the appropriate Zod schema for validating
 * getSession input parameters.
 *
 * @param _authServer - The Better Auth server instance (used for potential config extraction)
 * @returns Effect succeeding with a Zod schema for validating getSession input parameters
 */
export const createGetSessionServerParamsSchema = () =>
	Effect.succeed(createSchemaWithRequiredHeaders(undefined, 'headers must be an instance of Headers for session lookup'));

/**
 * Creates a Zod schema for validating getSession server parameters using Effect Context.
 *
 * @pure
 * @description Alternative version that retrieves authServer from context rather than parameter.
 * Useful when working within Effect pipelines where the service is already in context.
 *
 * @returns Effect requiring AuthServerFor context, succeeding with a Zod schema
 */
export const createGetSessionServerParamsSchemaFromContext = (): Effect.Effect<
	ReturnType<typeof createGetSessionServerParamsSchema> extends Effect.Effect<infer A, infer _E, infer _R> ? A : never,
	never,
	AuthServerFor
> => Effect.flatMap(AuthServerTag, (authServer) => createGetSessionServerParamsSchema());
