import * as Effect from 'effect/Effect';
import { createSignUpEmailServerParamsSchema } from './signUpEmail.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiSignUpEmailParamsFor, type AuthServerApiSignUpEmailParamsFor, type signUpEmailPropsFor } from './signUpEmail.types';
import { EmailAuthServerInputError } from '../shared/email.error';
import { signUpEmailServerService } from './signUpEmail.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';

export const signUpEmailServerController: signUpEmailPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiSignUpEmailParamsFor<T>) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(EmailAuthServerServiceTag);
		const schema = yield* _(createSignUpEmailServerParamsSchema(authServer));

		// 1) Validate params input with Zod
		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid sign up parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new EmailAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiSignUpEmailParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected sign up parameters structure';
			return yield* _(Effect.fail(new EmailAuthServerInputError(message)));
		}

		// 2) Call the service with the validated params
		const result = yield* _(signUpEmailServerService(parsed.data));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
