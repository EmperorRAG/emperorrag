import { unlinkAccountServer as unlinkAccountUtility } from '@emperorrag/better-auth-utilities/core';
import { authServer } from '../../../../server/server';

export const unlinkAccount = unlinkAccountUtility({ authServer });
