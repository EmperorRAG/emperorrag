/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/unlink-account/unlinkAccount.controller.ts
 * @description Controller for server-side unlink account operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createUnlinkAccountServerParamsSchema } from './unlinkAccount.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiUnlinkAccountParamsFor, type AuthServerApiUnlinkAccountParamsFor, type unlinkAccountPropsFor } from './unlinkAccount.types';
import { validateInputEffect } from '../../shared/core.error';
import { unlinkAccountServerService } from './unlinkAccount.service';

/**
 * Controller for unlink account operation with input validation.
 *
 * @pure
 * @description Validates input parameters using dynamically generated Zod schema,
 * then delegates to the service layer. Uses validateInputEffect for composable
 * error tracing through schema creation, parsing, and type guard validation.
 *
 * @remarks
 * **Validation Flow:**
 * 1. Retrieve authServer from Effect context
 * 2. Create schema via Effect pipeline
 * 3. Parse and validate with type guard
 * 4. Call service with validated params
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The unlink account parameters to validate and process
 * @returns Effect requiring AuthServerFor context
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { unlinkAccountServerController } from './unlinkAccount.controller';
 *
 * const program = unlinkAccountServerController({
 *   body: { providerId: 'google' },
 *   headers: requestHeaders
 * });
 *
 * await Effect.runPromise(
 *   program.pipe(Effect.provideService(AuthServerTag, authServer))
 * );
 * ```
 */
export const unlinkAccountServerController: unlinkAccountPropsFor = (params: AuthServerApiUnlinkAccountParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createUnlinkAccountServerParamsSchema(),
			params,
			isAuthServerApiUnlinkAccountParamsFor,
			'unlinkAccount'
		);
		return yield* unlinkAccountServerService(validatedParams);
	});
