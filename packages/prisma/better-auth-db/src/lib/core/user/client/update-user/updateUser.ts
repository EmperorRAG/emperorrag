import { updateUserClient as updateUserUtility } from '@emperorrag/better-auth-utilities/core';
import { authClient } from '../../../../client/client';

export const updateUser = updateUserUtility({ authClient });
