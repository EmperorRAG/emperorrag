import * as Effect from 'effect/Effect';
import { createAuthSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiSignOutParamsFor, type AuthServerApiSignOutParamsFor, type signOutPropsFor } from './signOut.types';
import { validateInputEffect } from '../../shared/core.error';
import { signOutServerService } from './signOut.service';

export const signOutServerController: signOutPropsFor = (params: AuthServerApiSignOutParamsFor<AuthServerFor>) =>
	Effect.gen(function* (_) {
		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(validateInputEffect(createAuthSchema({ headers: 'optional' }), params, isAuthServerApiSignOutParamsFor, 'signOut'));

		// 2) Call the service with the validated params
		const result = yield* _(signOutServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
