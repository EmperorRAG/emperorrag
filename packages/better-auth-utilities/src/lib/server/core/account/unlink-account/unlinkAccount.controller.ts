/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/unlink-account/unlinkAccount.controller.ts
 * @description Controller for server-side unlink account operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createUnlinkAccountServerParamsSchema } from './unlinkAccount.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiUnlinkAccountParamsFor, type AuthServerApiUnlinkAccountParamsFor, type unlinkAccountPropsFor } from './unlinkAccount.types';
import { AccountAuthServerInputError } from '../shared/account.error';
import { unlinkAccountServerService } from './unlinkAccount.service';
import { AccountAuthServerServiceTag } from '../shared/account.service';

/**
 * Controller for unlink account operation with input validation.
 *
 * @pure
 * @description Validates input parameters using dynamically generated Zod schema,
 * then delegates to the service layer. Uses type guard for proper type narrowing.
 *
 * @remarks
 * **Validation Flow:**
 * 1. Retrieve authServer from Effect context
 * 2. Generate Zod schema dynamically
 * 3. Validate input parameters
 * 4. Use type guard to narrow the type
 * 5. Call service with validated params
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The unlink account parameters to validate and process
 * @returns Effect requiring AccountAuthServerService context
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
 *   program.pipe(Effect.provideService(AccountAuthServerServiceTag, { authServer }))
 * );
 * ```
 */
export const unlinkAccountServerController: unlinkAccountPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiUnlinkAccountParamsFor<T>) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(AccountAuthServerServiceTag);
		const schema = yield* _(createUnlinkAccountServerParamsSchema(authServer));

		// 1) Validate params input with Zod
		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid unlink account parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new AccountAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiUnlinkAccountParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected unlink account parameters structure';
			return yield* _(Effect.fail(new AccountAuthServerInputError(message)));
		}

		// 2) Call the service with the validated params
		const result = yield* _(unlinkAccountServerService(parsed.data));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
