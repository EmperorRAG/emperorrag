/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/list-user-accounts/listUserAccounts.controller.ts
 * @description Controller for listUserAccounts server operations with input validation.
 * Combines schema validation with service execution in a type-safe manner.
 */

import * as Effect from 'effect/Effect';
import { CoreAuthServerApiError, CoreAuthServerDataMissingError, CoreAuthServerInputError, validateInputEffect } from '../../shared/core.error';
import type { AuthServerFor } from '../../../server.types';
import { createAuthSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { listUserAccountsServerService } from './listUserAccounts.service';
import {
	isAuthServerApiListUserAccountsParamsFor,
	type AuthServerApiListUserAccountsParamsFor,
	type AuthServerApiListUserAccountsResultFor,
} from './listUserAccounts.types';

/**
 * Controller for server-side listUserAccounts operations with validation.
 *
 * @pure
 * @description Validates input using validateInputEffect which composes schema creation,
 * parsing, and type guard validation into a single traceable Effect pipeline.
 * Each validation step produces a traceable error if it fails.
 *
 * @param input - Raw input parameters to validate and process
 * @returns Effect requiring AuthServerFor context, failing with validation or API errors,
 *          and succeeding with the accounts list result
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { AuthServerTag } from '../../../server.service';
 * import { listUserAccountsServerController } from './listUserAccounts.controller';
 *
 * // Handle incoming request
 * const program = listUserAccountsServerController({
 *   headers: request.headers
 * });
 *
 * // Provide the AuthServer dependency
 * const result = await Effect.runPromise(
 *   Effect.provideService(program, AuthServerTag, authServer)
 * );
 *
 * // result is Account[]
 * console.log(`Found ${result.length} linked accounts`);
 * ```
 */
export const listUserAccountsServerController = (
	input: AuthServerApiListUserAccountsParamsFor
): Effect.Effect<
	Awaited<AuthServerApiListUserAccountsResultFor<AuthServerFor>>,
	CoreAuthServerInputError | CoreAuthServerApiError | CoreAuthServerDataMissingError,
	AuthServerFor
> =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthSchema(AuthServerApiEndpoints.listUserAccounts),
			input,
			isAuthServerApiListUserAccountsParamsFor,
			'listUserAccounts'
		);
		return yield* listUserAccountsServerService(validatedParams);
	});
