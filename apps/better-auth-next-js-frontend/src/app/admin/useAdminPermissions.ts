'use client';

import { useEffect, useState } from 'react';
import { Effect, Match, pipe } from 'effect';

import type { AdminPermissionRequest, AdminPermissionResponse } from './useAdminPermissions.types.ts';

interface AdminPermissionState {
  readonly isLoading: boolean;
  readonly canManageUsers: boolean;
  readonly canManageSessions: boolean;
  readonly canImpersonate: boolean;
  readonly permissions: Readonly<Record<string, ReadonlyArray<string>>>;
  readonly error: string | null;
}

const defaultState: AdminPermissionState = {
  isLoading: true,
  canManageUsers: false,
  canManageSessions: false,
  canImpersonate: false,
  permissions: {},
  error: null,
};

const ADMIN_PERMISSIONS_ENDPOINT = '/api/auth/admin/has-permission';

const defaultPermissionRequest: AdminPermissionRequest = {
  permissions: {
    user: ['create', 'update', 'delete'],
    session: ['list', 'revoke'],
    impersonation: ['create'],
  },
};

const createPermissionRequest = (
  overrides?: Partial<AdminPermissionRequest>,
): AdminPermissionRequest => ({
  ...defaultPermissionRequest,
  ...overrides,
});

const toBoolean = (value: unknown): boolean =>
  Match.value(value).pipe(
    Match.when(true, () => true),
    Match.when(false, () => false),
    Match.when((input: unknown) => input === 1 || input === 'true', () => true),
    Match.orElse(() => false),
  );

const parsePermissionResponse = (
  response: AdminPermissionResponse,
): Pick<AdminPermissionState, 'canManageUsers' | 'canManageSessions' | 'canImpersonate' | 'permissions'> => ({
  canManageUsers: toBoolean(response.capabilities?.user?.manage),
  canManageSessions: toBoolean(response.capabilities?.session?.manage),
  canImpersonate: toBoolean(response.capabilities?.impersonation?.create),
  permissions: response.granted ?? {},
});

const fetchAdminPermissions = (
  input: AdminPermissionRequest,
): Effect.Effect<AdminPermissionResponse, Error> =>
  Effect.tryPromise({
    try: () =>
      fetch(ADMIN_PERMISSIONS_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(input),
      }),
    catch: (cause) => (cause instanceof Error ? cause : new Error('Failed to call admin permissions endpoint', { cause })),
  }).pipe(
    Effect.flatMap((response) =>
      Match.value(response.ok).pipe(
        Match.when(true, () =>
          Effect.tryPromise({
            try: () => response.json() as Promise<AdminPermissionResponse>,
            catch: (cause) => (cause instanceof Error ? cause : new Error('Failed to parse admin permissions response', { cause })),
          }),
        ),
        Match.orElse(() =>
          Effect.tryPromise({
            try: () => response.text(),
            catch: (cause) => (cause instanceof Error ? cause : new Error('Failed to read error payload', { cause })),
          }).pipe(
            Effect.flatMap((errorBody) =>
              Effect.fail(
                new Error(
                  `Admin permissions endpoint returned HTTP ${response.status}${errorBody ? ` - ${errorBody}` : ''}`,
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );

const useAdminPermissions = (
  overrides?: Partial<AdminPermissionRequest>,
) => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    let active = true;
    const requestPayload = createPermissionRequest(overrides);

    const loadPermissions = async () => {
      const effect = pipe(
        fetchAdminPermissions(requestPayload),
        Effect.map(parsePermissionResponse),
        Effect.match({
          onFailure: (error) => ({
            isLoading: false,
            canManageUsers: false,
            canManageSessions: false,
            canImpersonate: false,
            permissions: {},
            error: error.message,
          }),
          onSuccess: (result) => ({
            isLoading: false,
            canManageUsers: result.canManageUsers,
            canManageSessions: result.canManageSessions,
            canImpersonate: result.canImpersonate,
            permissions: result.permissions,
            error: null,
          }),
        }),
      );

      const outcome = await Effect.runPromise(effect);

      if (!active) {
        return;
      }

      setState((previous) => ({
        ...previous,
        ...outcome,
      }));
    };

    void loadPermissions();

    return () => {
      active = false;
    };
  }, [overrides]);

  return state;
};

export default useAdminPermissions;
