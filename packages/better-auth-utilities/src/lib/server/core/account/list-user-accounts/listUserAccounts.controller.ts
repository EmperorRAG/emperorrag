/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/list-user-accounts/listUserAccounts.controller.ts
 * @description Controller for listUserAccounts server operations with input validation.
 * Combines schema validation with service execution in a type-safe manner.
 */

import * as Effect from 'effect/Effect';
import { CoreAuthServerApiError, CoreAuthServerDataMissingError, CoreAuthServerInputError, validateInputEffect } from '../../shared/core.error';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerFor } from '../../../server.types';
import { createBaseSchema, withOptionalHeaders } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { pipe } from 'effect/Function';
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
 *
 * @example
 * ```typescript
 * // Error handling in controller
 * const program = listUserAccountsServerController(rawInput).pipe(
 *   Effect.catchTag('CoreAuthServerInputError', (e) =>
 *     Effect.succeed({ error: 'validation_failed', issues: e.issues })
 *   ),
 *   Effect.catchTag('CoreAuthServerApiError', (e) =>
 *     Effect.succeed({ error: 'api_error', status: e.status })
 *   )
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Using with Express/Next.js route handler
 * export async function GET(request: Request) {
 *   const program = listUserAccountsServerController({
 *     headers: request.headers
 *   });
 *
 *   try {
 *     const accounts = await Effect.runPromise(
 *       Effect.provideService(program, AuthServerTag, authServer)
 *     );
 *     return Response.json({ accounts });
 *   } catch (error) {
 *     return Response.json({ error: 'Failed to fetch accounts' }, { status: 500 });
 *   }
 * }
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
		const authServer = yield* AuthServerTag;
		const validatedParams = yield* validateInputEffect(
			Effect.succeed(pipe(createBaseSchema(), withOptionalHeaders())),
			input,
			isAuthServerApiListUserAccountsParamsFor,
			'listUserAccounts'
		);
		return yield* listUserAccountsServerService(validatedParams).pipe(Effect.provideService(AuthServerTag, authServer));
	});
