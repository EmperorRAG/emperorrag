import { updateUserClient as updateUserUtility } from '@emperorrag/better-auth-utilities/core/user/client/update-user/updateUser';
import { authClient } from '../../../../auth/auth';

export const updateUser = updateUserUtility({ authClient });
