import { resetPasswordClient as resetPasswordUtility } from '@emperorrag/better-auth-utilities/core';
import { authClient } from '../../../../client/client';

export const resetPassword = resetPasswordUtility({ authClient });
