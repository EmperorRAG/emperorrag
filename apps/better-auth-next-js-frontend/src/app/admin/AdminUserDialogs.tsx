'use client';

import { useState } from 'react';
import { pipe } from 'effect';
import * as Option from 'effect/Option';

import styles from './page.module.css';
import useAdminPermissions from './useAdminPermissions';
import useAdminActions from './useAdminActions';
import type { AdminPayload } from './actions';

const AdminUserDialogs = () => {
  const [activeUserId, setActiveUserId] = useState<Option.Option<string>>(Option.none());
  const [activeSessionId, setActiveSessionId] = useState<Option.Option<string>>(Option.none());
  const [localError, setLocalError] = useState<Option.Option<string>>(Option.none());
  const [lastActionMessage, setLastActionMessage] = useState<Option.Option<string>>(Option.none());

  const {
    isLoading,
    canManageUsers,
    canManageSessions,
    canImpersonate,
    permissions,
    error,
  } = useAdminPermissions();

  const {
    createUser,
    updateUser,
    banUser,
    unbanUser,
    impersonateUser,
    removeUser,
    revokeSession,
    isPending: actionsPending,
    lastError: actionError,
    resetError,
  } = useAdminActions();

  const userActions = permissions['user'] ?? [];
  const sessionActions = permissions['session'] ?? [];
  const canUpdateUser = canManageUsers || userActions.includes('update');
  const canBanUser = userActions.includes('ban');
  const canUnbanUser = userActions.includes('unban');
  const canRemoveUser = userActions.includes('delete');
  const canRevokeSessions = canManageSessions || sessionActions.includes('revoke');

  const selectedUserLabel = pipe(
    activeUserId,
    Option.getOrElse(() => 'none'),
  );

  const sessionIdValue = pipe(
    activeSessionId,
    Option.getOrElse(() => ''),
  );

  const combinedError = pipe(
    localError,
    Option.orElse(() => actionError),
    Option.orElse(() => Option.fromNullable(error)),
  );

  const errorMessage = pipe(
    combinedError,
    Option.getOrElse(() => ''),
  );

  const statusMessage = pipe(
    lastActionMessage,
    Option.getOrElse(() => ''),
  );

  const clearFeedback = () => {
    setLocalError(Option.none());
    setLastActionMessage(Option.none());
    resetError();
  };

  const reportError = (message: string) => {
    setLocalError(Option.some(message));
    setLastActionMessage(Option.none());
  };

  const withActiveUser = (description: string, action: (userId: string) => void) =>
    pipe(
      activeUserId,
      Option.match({
        onSome: (userId) => {
          clearFeedback();
          action(userId);
        },
        onNone: () => reportError(description),
      }),
    );

  const handleCreateUser = () => {
    clearFeedback();
    const timestamp = Date.now();
    const payload = {
      email: `placeholder-${timestamp}@example.com`,
      password: `Placeholder-${timestamp}!`,
      name: 'Placeholder Admin User',
    } satisfies AdminPayload;

    createUser(payload, {
      onSuccess: (user) => {
        setLastActionMessage(Option.some(`Created user ${user.id}`));
      },
      onError: (failure) => {
        reportError(failure.message);
      },
    });
  };

  const handleUpdateUser = () =>
    withActiveUser('Select a user before attempting an update.', (userId) => {
      const payload = {
        userId,
        name: 'Updated via placeholder',
      } satisfies AdminPayload;

      updateUser(payload, {
        onSuccess: (user) => {
          setLastActionMessage(Option.some(`Updated user ${user.id}`));
        },
        onError: (failure) => {
          reportError(failure.message);
        },
      });
    });

  const handleBanUser = () =>
    withActiveUser('Select a user before issuing a ban.', (userId) => {
      const payload = {
        userId,
        reason: 'Placeholder ban issued from dashboard placeholder.',
      } satisfies AdminPayload;

      banUser(payload, {
        onSuccess: () => {
          setLastActionMessage(Option.some('Ban request submitted.'));
        },
        onError: (failure) => {
          reportError(failure.message);
        },
      });
    });

  const handleUnbanUser = () =>
    withActiveUser('Select a user before removing a ban.', (userId) => {
      const payload = {
        userId,
      } satisfies AdminPayload;

      unbanUser(payload, {
        onSuccess: () => {
          setLastActionMessage(Option.some('Unban request submitted.'));
        },
        onError: (failure) => {
          reportError(failure.message);
        },
      });
    });

  const handleImpersonateUser = () =>
    withActiveUser('Select a user before starting impersonation.', (userId) => {
      const payload = {
        userId,
      } satisfies AdminPayload;

      impersonateUser(payload, {
        onSuccess: (response) => {
          setLastActionMessage(
            Option.some(`Impersonation session ${response.session.id} created.`),
          );
        },
        onError: (failure) => {
          reportError(failure.message);
        },
      });
    });

  const handleRemoveUser = () =>
    withActiveUser('Select a user before removing the account.', (userId) => {
      const payload = {
        userId,
      } satisfies AdminPayload;

      removeUser(payload, {
        onSuccess: () => {
          setLastActionMessage(Option.some('Remove user request submitted.'));
        },
        onError: (failure) => {
          reportError(failure.message);
        },
      });
    });

  const handleRevokeSessions = () =>
    withActiveUser('Select a user before revoking sessions.', (userId) => {
      pipe(
        activeSessionId,
        Option.match({
          onSome: (sessionId) => {
            const payload = {
              userId,
              sessionId,
            } satisfies AdminPayload;

            revokeSession(payload, {
              onSuccess: () => {
                setLastActionMessage(Option.some(`Revoked session ${sessionId}.`));
              },
              onError: (failure) => {
                reportError(failure.message);
              },
            });
          },
          onNone: () => {
            reportError('Provide a session ID before revoking sessions.');
          },
        }),
      );
    });

  const disableWhilePending = isLoading || actionsPending;

  return (
    <div className={styles['placeholder']}>
      <div>Admin user dialogs placeholder (user: {selectedUserLabel})</div>
      {errorMessage ? <div role="status">{errorMessage}</div> : null}
      {statusMessage ? <div role="status">{statusMessage}</div> : null}

      <div className={styles['toolbar']}>
        <input
          className={styles['toolbarInput']}
          placeholder="Active user ID"
          value={pipe(
            activeUserId,
            Option.getOrElse(() => ''),
          )}
          onChange={(event) => {
            const value = event.target.value.trim();
            setActiveUserId(value.length > 0 ? Option.some(value) : Option.none());
          }}
        />
        <input
          className={styles['toolbarInput']}
          placeholder="Session ID"
          value={sessionIdValue}
          onChange={(event) => {
            const value = event.target.value.trim();
            setActiveSessionId(value.length > 0 ? Option.some(value) : Option.none());
          }}
        />
      </div>

      <div className={styles['toolbarActions']}>
        <button
          type="button"
          onClick={handleCreateUser}
          disabled={disableWhilePending || !canManageUsers}
        >
          Create user (placeholder)
        </button>
        <button
          type="button"
          onClick={handleUpdateUser}
          disabled={disableWhilePending || !canUpdateUser}
        >
          Update user (placeholder)
        </button>
        <button
          type="button"
          onClick={handleBanUser}
          disabled={disableWhilePending || !canBanUser}
        >
          Ban user
        </button>
        <button
          type="button"
          onClick={handleUnbanUser}
          disabled={disableWhilePending || !canUnbanUser}
        >
          Unban user
        </button>
        <button
          type="button"
          onClick={handleImpersonateUser}
          disabled={disableWhilePending || !canImpersonate}
        >
          Impersonate user
        </button>
        <button
          type="button"
          onClick={handleRemoveUser}
          disabled={disableWhilePending || !canRemoveUser}
        >
          Remove user
        </button>
        <button
          type="button"
          onClick={handleRevokeSessions}
          disabled={disableWhilePending || !canRevokeSessions}
        >
          Revoke sessions
        </button>
      </div>
    </div>
  );
};

export default AdminUserDialogs;
