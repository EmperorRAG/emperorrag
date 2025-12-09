import * as Effect from 'effect/Effect';
import { createSignInEmailServerParamsSchema } from './signInEmail.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiSignInEmailParamsFor, type AuthServerApiSignInEmailParamsFor, type signInEmailPropsFor } from './signInEmail.types';
import { EmailAuthServerInputError } from '../shared/email.error';
import { signInEmailServerService } from './signInEmail.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';

export const signInEmailServerController: signInEmailPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiSignInEmailParamsFor<T>) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(EmailAuthServerServiceTag);
		const schema = yield* _(createSignInEmailServerParamsSchema(authServer));

		// 1) Validate params input with Zod
		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid sign in parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new EmailAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiSignInEmailParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected sign in parameters structure';
			return yield* _(Effect.fail(new EmailAuthServerInputError(message)));
		}

		// 2) Call the service with the validated params
		const result = yield* _(signInEmailServerService(parsed.data));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
