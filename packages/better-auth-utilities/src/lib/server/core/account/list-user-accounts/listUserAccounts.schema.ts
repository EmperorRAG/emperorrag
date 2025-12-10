import type { AuthServerFor } from '../../../server.types';
/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/list-user-accounts/listUserAccounts.schema.ts
 * @description Zod schema generation for listUserAccounts server validation.
 * Provides dynamic schema creation based on Better Auth server configuration.
 */

import { Effect } from 'effect';
import { AuthServerTag } from '../../../server.service';
import { createSchemaWithRequiredHeaders } from '../../shared/core.schema';

/**
 * Creates a Zod schema for validating listUserAccounts server parameters.
 *
 * @pure
 * @description Dynamically generates a validation schema by extracting endpoint
 * configuration from the provided Better Auth server. Returns an Effect that
 * requires AuthServerFor context and produces the appropriate Zod schema.
 *
 * @returns Effect requiring AuthServerFor context, succeeding with a Zod schema
 *          for validating listUserAccounts input parameters
 */
export const createListUserAccountsServerParamsSchema = (): Effect.Effect<ReturnType<typeof createSchemaWithRequiredHeaders>, never, AuthServerFor> =>
	Effect.flatMap(AuthServerTag, (_authServer) =>
		Effect.succeed(createSchemaWithRequiredHeaders(undefined, 'headers must be an instance of Headers for session authentication'))
	);
