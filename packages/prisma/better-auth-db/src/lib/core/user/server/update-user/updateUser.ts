import { updateUser as updateUserUtility } from '@emperorrag/better-auth-utilities/core/user/server/update-user/updateUser';
import { authServer } from '../../../../auth/auth';

export const updateUser = updateUserUtility({ authServer });
