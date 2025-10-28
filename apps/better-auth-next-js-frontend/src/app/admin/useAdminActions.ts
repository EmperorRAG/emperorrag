'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';
import { Effect, Match, pipe } from 'effect';
import * as Option from 'effect/Option';

import {
  banAdminUser,
  createAdminUser,
  impersonateAdminUser,
  listAdminSessions,
  listAdminUsers,
  removeAdminUser,
  revokeAdminSession,
  unbanAdminUser,
  updateAdminUser,
  type AdminImpersonationResponse,
  type AdminPayload,
  type AdminQuery,
  type AdminSession,
  type AdminUser,
  type AdminUsersResponse,
} from './actions';

interface AdminActionsState {
  readonly pendingAction: Option.Option<AdminActionKind>;
  readonly lastError: Option.Option<string>;
  readonly lastSuccess: Option.Option<unknown>;
}

type AdminActionKind =
  | 'listUsers'
  | 'listSessions'
  | 'createUser'
  | 'updateUser'
  | 'banUser'
  | 'unbanUser'
  | 'impersonateUser'
  | 'removeUser'
  | 'revokeSession';

type SuccessHandler<T> = (value: T) => void;
type ErrorHandler = (error: Error) => void;

interface ActionHandlers<T> {
  readonly onSuccess?: SuccessHandler<T>;
  readonly onError?: ErrorHandler;
}

const defaultState: AdminActionsState = {
  pendingAction: Option.none(),
  lastError: Option.none(),
  lastSuccess: Option.none(),
};

/**
 * Normalizes unknown error causes into native `Error` instances.
 *
 * @pure Guarantees deterministic conversion of error inputs.
 * @description Distinguishes between existing `Error` instances and arbitrary values to maintain consistent error handling.
 *
 * @fp-pattern Refinement
 *
 * @param cause - The unknown error-like value.
 * @param fallbackMessage - The message assigned when the cause is not an `Error`.
 * @returns {Error} The normalized error instance.
 */
const toActionError = (cause: unknown, fallbackMessage: string): Error =>
  Match.value(cause).pipe(
    Match.when((value: unknown): value is Error => value instanceof Error, (error) => error),
    Match.orElse(() => new Error(fallbackMessage, { cause })),
  );

/**
 * Converts a success payload into an optional value.
 *
 * @pure Provides a referentially transparent mapping from possibly undefined payloads to `Option`.
 * @description Ensures `void` results become `Option.none()` while preserving substantive values.
 *
 * @fp-pattern Option constructor
 *
 * @param value - The success payload.
 * @returns {Option.Option<T>} An `Option` wrapping the value when present.
 */
const toSuccessOption = <T>(value: T): Option.Option<T> => Option.fromNullable(value);

const useAdminActions = () => {
  const [state, setState] = useState<AdminActionsState>(defaultState);
  const [isTransitionPending, startTransition] = useTransition();

  const run = useCallback(
    <Result>(
      kind: AdminActionKind,
      program: Effect.Effect<Result, Error, never>,
      onSuccess?: SuccessHandler<Result>,
      onError?: ErrorHandler,
    ) => {
      startTransition(() => {
        setState({
          pendingAction: Option.some(kind),
          lastError: Option.none(),
          lastSuccess: Option.none(),
        });

        void pipe(
          program,
          Effect.match({
            onFailure: (error) =>
              Effect.sync(() => {
                onError?.(error);
                setState({
                  pendingAction: Option.none(),
                  lastError: Option.some(error.message),
                  lastSuccess: Option.none(),
                });
              }),
            onSuccess: (result) =>
              Effect.sync(() => {
                onSuccess?.(result);
                setState({
                  pendingAction: Option.none(),
                  lastError: Option.none(),
                  lastSuccess: toSuccessOption(result),
                });
              }),
          }),
          Effect.runPromise,
        );
      });
    },
    [startTransition],
  );

  const listUsers = useCallback(
    (query: AdminQuery, handlers?: ActionHandlers<AdminUsersResponse>) =>
      run(
        'listUsers',
        Effect.tryPromise({
          try: () => listAdminUsers(query),
          catch: (cause) => toActionError(cause, 'Failed to list admin users.'),
        }),
        handlers?.onSuccess,
        handlers?.onError,
      ),
    [run],
  );

  const listSessions = useCallback(
    (payload: AdminPayload, handlers?: ActionHandlers<ReadonlyArray<AdminSession>>) =>
      run(
        'listSessions',
        Effect.tryPromise({
          try: () => listAdminSessions(payload),
          catch: (cause) => toActionError(cause, 'Failed to list admin sessions.'),
        }),
        handlers?.onSuccess,
        handlers?.onError,
      ),
    [run],
  );

  const createUser = useCallback(
    (payload: AdminPayload, handlers?: ActionHandlers<AdminUser>) =>
      run(
        'createUser',
        Effect.tryPromise({
          try: () => createAdminUser(payload),
          catch: (cause) => toActionError(cause, 'Failed to create admin user.'),
        }),
        handlers?.onSuccess,
        handlers?.onError,
      ),
    [run],
  );

  const updateUser = useCallback(
    (payload: AdminPayload, handlers?: ActionHandlers<AdminUser>) =>
      run(
        'updateUser',
        Effect.tryPromise({
          try: () => updateAdminUser(payload),
          catch: (cause) => toActionError(cause, 'Failed to update admin user.'),
        }),
        handlers?.onSuccess,
        handlers?.onError,
      ),
    [run],
  );

  const banUser = useCallback(
    (payload: AdminPayload, handlers?: ActionHandlers<void>) =>
      run(
        'banUser',
        Effect.tryPromise({
          try: () => banAdminUser(payload),
          catch: (cause) => toActionError(cause, 'Failed to ban admin user.'),
        }),
        handlers?.onSuccess,
        handlers?.onError,
      ),
    [run],
  );

  const unbanUser = useCallback(
    (payload: AdminPayload, handlers?: ActionHandlers<void>) =>
      run(
        'unbanUser',
        Effect.tryPromise({
          try: () => unbanAdminUser(payload),
          catch: (cause) => toActionError(cause, 'Failed to unban admin user.'),
        }),
        handlers?.onSuccess,
        handlers?.onError,
      ),
    [run],
  );

  const impersonateUser = useCallback(
    (payload: AdminPayload, handlers?: ActionHandlers<AdminImpersonationResponse>) =>
      run(
        'impersonateUser',
        Effect.tryPromise({
          try: () => impersonateAdminUser(payload),
          catch: (cause) => toActionError(cause, 'Failed to impersonate admin user.'),
        }),
        handlers?.onSuccess,
        handlers?.onError,
      ),
    [run],
  );

  const removeUser = useCallback(
    (payload: AdminPayload, handlers?: ActionHandlers<void>) =>
      run(
        'removeUser',
        Effect.tryPromise({
          try: () => removeAdminUser(payload),
          catch: (cause) => toActionError(cause, 'Failed to remove admin user.'),
        }),
        handlers?.onSuccess,
        handlers?.onError,
      ),
    [run],
  );

  const revokeSession = useCallback(
    (payload: AdminPayload, handlers?: ActionHandlers<void>) =>
      run(
        'revokeSession',
        Effect.tryPromise({
          try: () => revokeAdminSession(payload),
          catch: (cause) => toActionError(cause, 'Failed to revoke admin session.'),
        }),
        handlers?.onSuccess,
        handlers?.onError,
      ),
    [run],
  );

  const resetError = useCallback(() => {
    setState((previous) => ({
      pendingAction: previous.pendingAction,
      lastError: Option.none(),
      lastSuccess: previous.lastSuccess,
    }));
  }, []);

  const pendingAction = state.pendingAction;
  const lastError = state.lastError;
  const lastSuccess = state.lastSuccess;

  const isPending = useMemo(
    () => isTransitionPending || Option.isSome(pendingAction),
    [isTransitionPending, pendingAction],
  );

  return {
    listUsers,
    listSessions,
    createUser,
    updateUser,
    banUser,
    unbanUser,
    impersonateUser,
    removeUser,
    revokeSession,
    pendingAction,
    lastError,
    lastSuccess,
    isPending,
    resetError,
  };
};

export default useAdminActions;
