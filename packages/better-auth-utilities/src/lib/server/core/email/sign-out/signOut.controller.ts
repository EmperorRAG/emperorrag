import * as Effect from 'effect/Effect';
import { PipelineContext } from '../../../../context/pipeline.context';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { signOutServerService } from './signOut.service';
import { isAuthServerApiSignOutParamsFor, type AuthServerApiSignOutParamsFor, type signOutPropsFor } from './signOut.types';

export const signOutServerController: signOutPropsFor = (params: AuthServerApiSignOutParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* validateInputEffect(createAuthServerApiEndpointParamsSchema(), params, isAuthServerApiSignOutParamsFor);

		// 2) Call the service with the validated params
		const result = yield* signOutServerService(validatedParams);

		// 3) Return the success value of the whole controller Effect
		return result;
	}).pipe(
		Effect.provideService(PipelineContext, {
			endpoint: AuthServerApiEndpoints.SignOut(),
		})
	);
