import * as Effect from 'effect/Effect';
import { createSignOutServerParamsSchema } from './signOut.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiSignOutParamsFor, type AuthServerApiSignOutParamsFor, type signOutPropsFor } from './signOut.types';
import { validateInputEffect } from '../../shared/core.error';
import { signOutServerService } from './signOut.service';
import { AuthServerTag } from '../../../server.service';

export const signOutServerController: signOutPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiSignOutParamsFor<T>) =>
	Effect.gen(function* (_) {
		const authServer = yield* _(AuthServerTag);

		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(createSignOutServerParamsSchema(authServer), params, isAuthServerApiSignOutParamsFor<T>, 'signOut')
		);

		// 2) Call the service with the validated params
		const result = yield* _(signOutServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
