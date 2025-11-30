import { updateUserClient as updateUserUtility } from '@emperorrag/better-auth-utilities/update-user/client';
import { authClient } from '../../../../client/client';

export const updateUser = updateUserUtility({ authClient });
