import { listAccountsClient as listAccountsUtility } from '@emperorrag/better-auth-utilities/list-accounts/client';
import { authClient } from '../../../../client/client';

export const listAccountsClient = listAccountsUtility({ authClient });
