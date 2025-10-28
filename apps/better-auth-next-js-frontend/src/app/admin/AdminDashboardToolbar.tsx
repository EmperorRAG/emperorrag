'use client';

import { useState } from 'react';
import { Match, pipe } from 'effect';
import * as Option from 'effect/Option';

import styles from './page.module.css';
import useAdminPermissions from './useAdminPermissions';
import useAdminActions from './useAdminActions';
import type { AdminQuery } from './actions';

const AdminDashboardToolbar = () => {
  const [searchValue, setSearchValue] = useState('');
  const {
    isLoading,
    canManageUsers,
    error,
  } = useAdminPermissions();
  const {
    listUsers,
    pendingAction,
    lastError: actionError,
  } = useAdminActions();
  const [lastFetchMessage, setLastFetchMessage] = useState<Option.Option<string>>(Option.none());

  const isRefreshing = pipe(
    pendingAction,
    Option.match({
      onSome: (kind) => kind === 'listUsers',
      onNone: () => false,
    }),
  );

  const combinedError = pipe(
    Option.fromNullable(error),
    Option.orElse(() => actionError),
  );

  const errorMessage = pipe(
    combinedError,
    Option.getOrElse(() => ''),
  );

  const fetchMessage = pipe(
    lastFetchMessage,
    Option.getOrElse(() => ''),
  );

  const handleRefresh = () => {
    const query = pipe(
      searchValue.trim(),
      Match.value,
      Match.when('', () => ({})),
      Match.orElse((value) => ({ search: value })),
    ) as AdminQuery;

    listUsers(
      query,
      {
        onSuccess: (response) => {
          setLastFetchMessage(Option.some(`Fetched ${response.total} users`));
        },
        onError: () => {
          setLastFetchMessage(Option.none());
        },
      },
    );
  };

  // TODO(plan §4): Synchronize toolbar state with server actions from actions.ts.
  // TODO(plan §5): Hook buttons into workflow modals and optimistic updates.

  return (
    <div className={styles['toolbar']}>
      <input
        className={styles['toolbarInput']}
        placeholder="Search users"
        value={searchValue}
        onChange={(event) => {
          const value = event.target.value;
          setSearchValue(value);
          // TODO(plan §5): Debounce search and trigger listAdminUsers action.
        }}
      />

  {errorMessage ? <span role="status">{errorMessage}</span> : null}

      {fetchMessage ? <span role="status">{fetchMessage}</span> : null}

      <div className={styles['toolbarActions']}>
        <button
          type="button"
          onClick={() => {
            // TODO(plan §5): Trigger create-user modal workflow.
          }}
          disabled={isLoading || !canManageUsers}
        >
          New user
        </button>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default AdminDashboardToolbar;
