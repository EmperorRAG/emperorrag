import { updateUserServer as updateUserUtility } from '@emperorrag/better-auth-utilities/update-user/server';
import { authServer } from '../../../../server/server';

export const updateUserServer = updateUserUtility({ authServer });
