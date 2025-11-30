import { listAccountsServer as listAccountsUtility } from '@emperorrag/better-auth-utilities/core';
import { authServer } from '../../../../server/server';

export const listAccounts = listAccountsUtility({ authServer });
