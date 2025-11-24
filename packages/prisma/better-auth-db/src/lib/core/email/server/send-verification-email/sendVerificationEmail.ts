import { sendVerificationEmailServer as sendVerificationEmailUtility } from '@emperorrag/better-auth-utilities/core/email/server/send-verification-email/sendVerificationEmail';
import { authServer } from '../../../../server/server';

export const sendVerificationEmail = sendVerificationEmailUtility({ authServer });
