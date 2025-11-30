import { updateUserServer as updateUserUtility } from '@emperorrag/better-auth-utilities/core';
import { authServer } from '../../../../server/server';

export const updateUser = updateUserUtility({ authServer });
