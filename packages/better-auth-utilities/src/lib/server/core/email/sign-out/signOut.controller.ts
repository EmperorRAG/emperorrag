import * as Effect from 'effect/Effect';
import { createSignOutServerParamsSchema } from './signOut.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiSignOutParamsFor, type AuthServerApiSignOutParamsFor, type signOutPropsFor } from './signOut.types';
import { EmailAuthServerInputError } from '../shared/email.error';
import { signOutServerService } from './signOut.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';

export const signOutServerController: signOutPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiSignOutParamsFor<T>) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(EmailAuthServerServiceTag);
		const schema = yield* _(createSignOutServerParamsSchema(authServer));

		// 1) Validate params input with Zod
		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid sign out parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new EmailAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiSignOutParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected sign out parameters structure';
			return yield* _(Effect.fail(new EmailAuthServerInputError(message)));
		}

		// 2) Call the service with the validated params
		const result = yield* _(signOutServerService(parsed.data));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
