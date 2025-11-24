import { updateUserServer as updateUserUtility } from '@emperorrag/better-auth-utilities/core/user/server/update-user/updateUser';
import { authServer } from '../../../../server/server';

export const updateUser = updateUserUtility({ authServer });
