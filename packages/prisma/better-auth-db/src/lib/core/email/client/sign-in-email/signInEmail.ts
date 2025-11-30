import { signInEmailClient as signInEmailUtility } from '@emperorrag/better-auth-utilities/core';
import { authClient } from '../../../../client/client';

export const signInEmail = signInEmailUtility({ authClient });
