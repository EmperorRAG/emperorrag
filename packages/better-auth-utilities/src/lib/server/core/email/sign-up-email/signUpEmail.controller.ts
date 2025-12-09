import * as Effect from 'effect/Effect';
import { createSignUpEmailServerParamsSchema } from './signUpEmail.schema';
import type { AuthServerFor } from '../../../server.types';
import type { AuthServerApiSignUpEmailParamsFor, signUpEmailPropsFor } from './signUpEmail.types';
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
			// You could format Zod's error more nicely here
			const message = 'Invalid sign up parameters';
			const cause = parsed.error;

			// Early fail in the Effect flow with an input error
			yield* _(Effect.fail(new EmailAuthServerInputError(message, cause)));
		}

		// 2) Call the service with the validated params
		const result = yield* _(signUpEmailServerService(parsed.data as AuthServerApiSignUpEmailParamsFor<T>));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
