/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-session/revokeSession.controller.ts
 * @description Server-side controller for revoke session operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createRevokeSessionServerParamsSchema } from './revokeSession.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiRevokeSessionParamsFor, type AuthServerApiRevokeSessionParamsFor, type revokeSessionPropsFor } from './revokeSession.types';
import { SessionAuthServerInputError } from '../shared/session.error';
import { revokeSessionServerService } from './revokeSession.service';
import { SessionAuthServerServiceTag } from '../shared/session.service';

/**
 * Controller for revoke session operation with Zod validation and type narrowing.
 *
 * @pure
 * @description Validates input parameters using dynamic Zod schema, narrows types
 * using type guard, then delegates to the service layer.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The revoke session parameters to validate and process
 * @returns Effect that resolves to revoke result or fails with validation/API error
 */
export const revokeSessionServerController: revokeSessionPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiRevokeSessionParamsFor<T>) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(SessionAuthServerServiceTag);
		const schema = yield* _(createRevokeSessionServerParamsSchema(authServer));

		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid revoke session parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new SessionAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiRevokeSessionParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected revoke session parameters structure';
			return yield* _(Effect.fail(new SessionAuthServerInputError(message)));
		}

		const result = yield* _(revokeSessionServerService(parsed.data));

		return result;
	});
