import { listAccountsClient as listAccountsUtility } from '@emperorrag/better-auth-utilities/core/account/client/list-accounts/listAccounts';
import { authClient } from '../../../../client/client';

export const listAccounts = listAccountsUtility({ authClient });
