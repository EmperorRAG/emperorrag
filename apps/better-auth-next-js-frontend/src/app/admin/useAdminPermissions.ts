'use client';

import { useEffect, useState } from 'react';

interface AdminPermissionState {
  readonly isLoading: boolean;
  readonly permissions: Readonly<Record<string, ReadonlyArray<string>>>;
  readonly error: string | null;
}

const defaultState: AdminPermissionState = {
  isLoading: true,
  permissions: {},
  error: null,
};

const useAdminPermissions = () => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    let active = true;

    const loadPermissions = async () => {
      try {
        // TODO(plan §6): Fetch `/admin/has-permission` using existing Better Auth endpoints.
        // TODO(plan §6): Replace with real data derived from admin session context.
        if (!active) {
          return;
        }

        setState((previous) => ({
          ...previous,
          isLoading: false,
          permissions: {},
        }));
      } catch (error) {
        if (!active) {
          return;
        }

        setState({
          isLoading: false,
          permissions: {},
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    void loadPermissions();

    return () => {
      active = false;
    };
  }, []);

  return state;
};

export default useAdminPermissions;
