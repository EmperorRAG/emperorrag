import * as Effect from 'effect/Effect';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { signOutServerService } from './signOut.service';
import { isAuthServerApiSignOutParamsFor, type AuthServerApiSignOutParamsFor, type signOutPropsFor } from './signOut.types';

export const signOutServerController: signOutPropsFor = (params: AuthServerApiSignOutParamsFor<AuthServerFor>) =>
	Effect.gen(function* (_) {
		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(createAuthServerApiEndpointParamsSchema(AuthServerApiEndpoints.signOut), params, isAuthServerApiSignOutParamsFor, 'signOut')
		);

		// 2) Call the service with the validated params
		const result = yield* _(signOutServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
