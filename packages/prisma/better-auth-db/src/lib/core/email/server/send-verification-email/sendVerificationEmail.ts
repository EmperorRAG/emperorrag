import { sendVerificationEmailServer as sendVerificationEmailUtility } from '@emperorrag/better-auth-utilities/send-verification-email/server';
import { authServer } from '../../../../server/server';

export const sendVerificationEmail = sendVerificationEmailUtility({ authServer });
