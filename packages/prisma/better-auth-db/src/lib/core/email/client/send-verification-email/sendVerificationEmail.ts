import { sendVerificationEmailClient as sendVerificationEmailUtility } from '@emperorrag/better-auth-utilities/core';
import { authClient } from '../../../../client/client';

export const sendVerificationEmail = sendVerificationEmailUtility({ authClient });
