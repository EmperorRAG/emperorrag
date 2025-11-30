import { resetPasswordServer as resetPasswordUtility } from '@emperorrag/better-auth-utilities/core';
import { authServer } from '../../../../server/server';

export const resetPassword = resetPasswordUtility({ authServer });
