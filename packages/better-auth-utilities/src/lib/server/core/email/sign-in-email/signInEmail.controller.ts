import * as Effect from 'effect/Effect';
import { createSignInEmailServerParamsSchema } from './signInEmail.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiSignInEmailParamsFor, type AuthServerApiSignInEmailParamsFor, type signInEmailPropsFor } from './signInEmail.types';
import { validateInputEffect } from '../../shared/core.error';
import { signInEmailServerService } from './signInEmail.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';

export const signInEmailServerController: signInEmailPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiSignInEmailParamsFor<T>) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(EmailAuthServerServiceTag);

		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(createSignInEmailServerParamsSchema(authServer), params, isAuthServerApiSignInEmailParamsFor<T>, 'signInEmail')
		);

		// 2) Call the service with the validated params
		const result = yield* _(signInEmailServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
