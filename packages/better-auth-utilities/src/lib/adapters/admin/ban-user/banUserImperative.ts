import { Effect } from 'effect';
import {
	AdapterContext,
	AdapterResponse,
	AdminUser,
	BanUserDependencies,
	BanUserOptions,
} from '../../../types/admin/admin.types.js';
import { banUser as banUserFunctional } from './banUserFunctional.js';

/**
 * Imperative wrapper that forwards to the Effect-based banUser implementation.
 */
export const banUser = async (
	dependencies: BanUserDependencies,
	options: BanUserOptions,
	context: AdapterContext
): Promise<AdapterResponse<AdminUser>> => {
	const program = banUserFunctional(dependencies)(options, context);
	return Effect.runPromise(program);
};
