/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/list-sessions/listSessions.controller.ts
 * @description Server-side controller for list sessions operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createListSessionsServerParamsSchema } from './listSessions.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiListSessionsParamsFor, type AuthServerApiListSessionsParamsFor, type listSessionsPropsFor } from './listSessions.types';
import { SessionAuthServerInputError } from '../shared/session.error';
import { listSessionsServerService } from './listSessions.service';
import { SessionAuthServerServiceTag } from '../shared/session.service';

/**
 * Controller for list sessions operation with Zod validation and type narrowing.
 *
 * @pure
 * @description Validates input parameters using dynamic Zod schema, narrows types
 * using type guard, then delegates to the service layer.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The list sessions parameters to validate and process
 * @returns Effect that resolves to list of sessions or fails with validation/API error
 */
export const listSessionsServerController: listSessionsPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiListSessionsParamsFor<T>) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(SessionAuthServerServiceTag);
		const schema = yield* _(createListSessionsServerParamsSchema(authServer));

		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid list sessions parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new SessionAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiListSessionsParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected list sessions parameters structure';
			return yield* _(Effect.fail(new SessionAuthServerInputError(message)));
		}

		const result = yield* _(listSessionsServerService(parsed.data));

		return result;
	});
