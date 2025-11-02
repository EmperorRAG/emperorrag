import { Effect } from 'effect';
import {
	AdapterContext,
	AdapterResponse,
	AdminSession,
	ListUserSessionsDependencies,
	ListUserSessionsOptions,
} from '../../../types/admin/admin.types.js';
import { listUserSessions as listUserSessionsFunctional } from './listUserSessionsFunctional.js';

/**
 * Imperative wrapper that forwards to the Effect-based listUserSessions implementation.
 */
export const listUserSessions = async (
	dependencies: ListUserSessionsDependencies,
	options: ListUserSessionsOptions,
	context: AdapterContext
): Promise<AdapterResponse<ReadonlyArray<AdminSession>>> => {
	const program = listUserSessionsFunctional(dependencies)(options, context);
	return Effect.runPromise(program);
};
