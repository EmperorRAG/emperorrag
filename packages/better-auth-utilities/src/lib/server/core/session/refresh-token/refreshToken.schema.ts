/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/refresh-token/refreshToken.schema.ts
 * @description Zod validation schemas for server-side refresh token operation.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';

export const createRefreshTokenServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.gen(function* () {
		return z.object({
			headers: z.instanceof(Headers).optional(),
			asResponse: z.boolean().optional(),
			returnHeaders: z.boolean().optional(),
		});
	});
