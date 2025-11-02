import { Effect } from 'effect';
import {
	AdapterContext,
	AdapterResponse,
	AdminUser,
	CreateUserDependencies,
	CreateUserOptions,
} from '../../../types/admin/admin.types.js';
import { createUser as createUserFunctional } from './createUserFunctional.js';

/**
 * Imperative wrapper that forwards to the Effect-based createUser implementation.
 */
export const createUser = async (
	dependencies: CreateUserDependencies,
	options: CreateUserOptions,
	context: AdapterContext
): Promise<AdapterResponse<AdminUser>> => {
	const program = createUserFunctional(dependencies)(options, context);
	return Effect.runPromise(program);
};
