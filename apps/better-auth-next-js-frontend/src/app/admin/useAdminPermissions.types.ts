/**
 * Shared types for the admin permission hook.
 */

export interface AdminPermissionRequest {
  readonly userId?: string;
  readonly role?: string;
  readonly permission?: Readonly<Record<string, ReadonlyArray<string>>>;
  readonly permissions?: Readonly<Record<string, ReadonlyArray<string>>>;
}

export interface AdminPermissionResponse {
  readonly isPermitted?: boolean;
  readonly granted?: Readonly<Record<string, ReadonlyArray<string>>>;
  readonly capabilities?: {
    readonly user?: {
      readonly manage?: boolean | number | string;
    };
    readonly session?: {
      readonly manage?: boolean | number | string;
    };
    readonly impersonation?: {
      readonly create?: boolean | number | string;
    };
  };
}
