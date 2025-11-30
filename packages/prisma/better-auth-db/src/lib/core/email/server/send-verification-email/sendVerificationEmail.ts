import { sendVerificationEmailServer as sendVerificationEmailUtility } from '@emperorrag/better-auth-utilities/core';
import { authServer } from '../../../../server/server';

export const sendVerificationEmail = sendVerificationEmailUtility({ authServer });
