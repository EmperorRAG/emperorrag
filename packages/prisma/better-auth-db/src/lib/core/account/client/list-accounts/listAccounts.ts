import { listAccountsClient as listAccountsUtility } from '@emperorrag/better-auth-utilities/core';
import { authClient } from '../../../../client/client';

export const listAccounts = listAccountsUtility({ authClient });
