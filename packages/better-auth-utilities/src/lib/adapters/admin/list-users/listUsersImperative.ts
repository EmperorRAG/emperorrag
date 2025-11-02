import { Effect } from 'effect';
import {
	AdapterContext,
	AdapterResponse,
	AdminUser,
	ListUsersDependencies,
	ListUsersOptions,
} from '../../../types/admin/admin.types.js';
import { listUsers as listUsersFunctional } from './listUsersFunctional.js';

/**
 * Imperative wrapper that forwards to the Effect-based listUsers implementation.
 */
export const listUsers = async (
	dependencies: ListUsersDependencies,
	options: ListUsersOptions,
	context: AdapterContext
): Promise<AdapterResponse<ReadonlyArray<AdminUser>>> => {
	const program = listUsersFunctional(dependencies)(options, context);
	return Effect.runPromise(program);
};
