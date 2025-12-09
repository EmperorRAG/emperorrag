/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/callback-oauth/callbackOAuth.schema.ts
 * @description Zod validation schemas for server-side OAuth callback operation.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';

export const createCallbackOAuthServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.gen(function* () {
		return z.object({
			query: z
				.object({
					code: z.string().optional(),
					state: z.string().optional(),
					error: z.string().optional(),
					error_description: z.string().optional(),
				})
				.optional(),
			headers: z.instanceof(Headers).optional(),
			asResponse: z.boolean().optional(),
			returnHeaders: z.boolean().optional(),
		});
	});
