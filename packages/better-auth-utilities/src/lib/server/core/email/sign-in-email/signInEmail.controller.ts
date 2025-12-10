import * as Effect from 'effect/Effect';
import { createAuthSchema, emailRequiredSchema, rememberMeOptionalSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiSignInEmailParamsFor, type AuthServerApiSignInEmailParamsFor, type signInEmailPropsFor } from './signInEmail.types';
import { validateInputEffect } from '../../shared/core.error';
import { signInEmailServerService } from './signInEmail.service';

export const signInEmailServerController: signInEmailPropsFor = (params: AuthServerApiSignInEmailParamsFor<AuthServerFor>) =>
	Effect.gen(function* (_) {
		const signInEmailBodySchema = z.object({
			email: emailRequiredSchema,
			password: z.string().min(1, 'Password is required'),
			rememberMe: rememberMeOptionalSchema,
		});

		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(
				createAuthSchema({ body: signInEmailBodySchema, headers: 'optional' }),
				params,
				isAuthServerApiSignInEmailParamsFor,
				'signInEmail'
			)
		);

		// 2) Call the service with the validated params
		const result = yield* _(signInEmailServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
