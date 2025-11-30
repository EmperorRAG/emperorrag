import { unlinkAccountClient as unlinkAccountUtility } from '@emperorrag/better-auth-utilities/core';
import { authClient } from '../../../../client/client';

export const unlinkAccount = unlinkAccountUtility({ authClient });
