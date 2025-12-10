import * as Effect from 'effect/Effect';
import { createSignUpEmailServerParamsSchema } from './signUpEmail.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiSignUpEmailParamsFor, type AuthServerApiSignUpEmailParamsFor, type signUpEmailPropsFor } from './signUpEmail.types';
import { validateInputEffect } from '../../shared/core.error';
import { signUpEmailServerService } from './signUpEmail.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';

export const signUpEmailServerController: signUpEmailPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiSignUpEmailParamsFor<T>) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(EmailAuthServerServiceTag);

		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(createSignUpEmailServerParamsSchema(authServer), params, isAuthServerApiSignUpEmailParamsFor<T>, 'signUpEmail')
		);

		// 2) Call the service with the validated params
		const result = yield* _(signUpEmailServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
