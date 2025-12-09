/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset/requestPasswordReset.schema.ts
 * @description Zod validation schemas for server-side request password reset operation.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';

export const createRequestPasswordResetServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.gen(function* () {
		return z.object({
			body: z.object({
				email: z.string().email('Invalid email format').min(1, 'Email is required'),
				redirectTo: z.string().url('Invalid redirect URL').optional(),
			}),
			headers: z.instanceof(Headers).optional(),
			asResponse: z.boolean().optional(),
			returnHeaders: z.boolean().optional(),
		});
	});
