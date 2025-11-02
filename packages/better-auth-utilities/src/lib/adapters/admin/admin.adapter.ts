/**
 * @file libs/better-auth-utilities/src/lib/adapters/admin/admin.adapter.ts
 * @description Server API adapter for the Better Auth Admin plugin that bridges
 * NestJS services and the Better Auth core runtime with type-safe helpers.
 */

import type { betterAuth } from 'better-auth';
import type {
  PluginAdapter,
  AdapterConfig,
  AdapterContext,
  AdapterResponse,
} from '../base/plugin-adapter.interface.ts';
import {
  AdapterOperationError,
  PluginNotAvailableError,
} from '../base/plugin-adapter.interface.js';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Describes the User payload emitted by the Admin endpoints after normalization.
 *
 * @remarks
 * Consumers should rely on this shape whenever they interact with admin user
 * operations through the adapter. The metadata mirrors Better Auth defaults
 * while allowing additional plugin-derived properties via the index signature.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  emailVerified: boolean;
  banned?: boolean;
  banReason?: string;
  banExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
}

/**
 * Represents the session payload exposed by the admin impersonation helpers.
 */
export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Options accepted when requesting a paginated list of users.
 */
export interface ListUsersOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'email' | 'name';
  sortDirection?: 'asc' | 'desc';
  filterBy?: string;
  filterValue?: string;
}

/**
 * Payload accepted when creating a new user through the admin API.
 */
export interface CreateUserOptions {
  email: string;
  password: string;
  name: string;
  role?: string;
  emailVerified?: boolean;
  [key: string]: unknown;
}

/**
 * Payload accepted when updating an existing user.
 */
export interface UpdateUserOptions {
  userId: string;
  data: {
    name?: string;
    email?: string;
    role?: string;
    emailVerified?: boolean;
    [key: string]: unknown;
  };
}

/**
 * Payload accepted when banning a user.
 */
export interface BanUserOptions {
  userId: string;
  reason?: string;
  banUntil?: Date;
}

/**
 * Payload accepted when lifting a user ban.
 */
export interface UnbanUserOptions {
  userId: string;
}

/**
 * Payload accepted when impersonating another user.
 */
export interface ImpersonateUserOptions {
  userId: string;
}

/**
 * Payload accepted when listing sessions for a specific user.
 */
export interface ListUserSessionsOptions {
  userId: string;
}

/**
 * Payload accepted when revoking a particular session.
 */
export interface RevokeUserSessionOptions {
  sessionId: string;
}

/**
 * Contract implemented by the Admin adapter to expose Better Auth server methods.
 */
export interface AdminServerAPI {
  listUsers(
    options: ListUsersOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: User[]; error?: unknown }>;

  createUser(
    options: CreateUserOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: User; error?: unknown }>;

  updateUser(
    options: UpdateUserOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: User; error?: unknown }>;

  deleteUser(options: {
    userId: string;
    headers?: Headers | Record<string, string>;
  }): Promise<{ data?: { success: boolean }; error?: unknown }>;

  banUser(
    options: BanUserOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: User; error?: unknown }>;

  unbanUser(
    options: UnbanUserOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: User; error?: unknown }>;

  impersonateUser(
    options: ImpersonateUserOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: { session: Session }; error?: unknown }>;

  listUserSessions(
    options: ListUserSessionsOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: Session[]; error?: unknown }>;

  revokeUserSession(
    options: RevokeUserSessionOptions & { headers?: Headers | Record<string, string> }
  ): Promise<{ data?: { success: boolean }; error?: unknown }>;
}

// ============================================================================
// ADMIN ADAPTER
// ============================================================================

/**
 * Provides a typed facade over the Better Auth Admin plugin server API.
 *
 * @remarks
 * - Construct this adapter through {@link createAdminAdapter} to benefit from the
 *   availability guard and debug logging.
 * - Methods mirror Better Auth admin endpoints but normalize their responses into
 *   {@link AdapterResponse} envelopes for ergonomic consumption in NestJS services
 *   or other Effect-TS workflows.
 *
 * @example
 * ```typescript
 * import { createAdminAdapter } from '@emperorrag/better-auth-utilities';
 * import { auth } from '@/lib/auth';
 *
 * const adapter = createAdminAdapter({ auth, debug: true });
 * const result = await adapter.listUsers({}, { headers: {} });
 * if (result.success) {
 *   console.log(result.data.length);
 * }
 * ```
 */
export class AdminAdapter implements PluginAdapter<AdminServerAPI> {
  public readonly pluginId = 'admin';
  public readonly pluginName = 'Admin';
  public readonly api: AdminServerAPI;

  private readonly auth: ReturnType<typeof betterAuth>;
  private readonly debug: boolean;

  /**
   * Creates a new adapter instance bound to the provided Better Auth runtime.
   *
   * @param config - Configuration block containing the Better Auth instance and optional debug flag.
   * @throws {@link PluginNotAvailableError} when the Admin plugin is disabled on the runtime.
   */
  constructor(config: AdapterConfig) {
    this.auth = config.auth;
    this.debug = config.debug ?? false;

    if (!this.isAvailable()) {
      throw new PluginNotAvailableError(
        this.pluginName,
        'Admin plugin not enabled in better-auth configuration'
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authApi = this.auth.api as any;

    this.api = {
      listUsers: authApi.listUsers?.bind(authApi),
      createUser: authApi.createUser?.bind(authApi),
      updateUser: authApi.updateUser?.bind(authApi),
      deleteUser: authApi.deleteUser?.bind(authApi),
      banUser: authApi.banUser?.bind(authApi),
      unbanUser: authApi.unbanUser?.bind(authApi),
      impersonateUser: authApi.impersonateUser?.bind(authApi),
      listUserSessions: authApi.listUserSessions?.bind(authApi),
      revokeUserSession: authApi.revokeUserSession?.bind(authApi),
    };

    this.log('Admin adapter initialized');
  }

  /**
   * Indicates whether the wrapped Better Auth runtime exposed the expected admin APIs.
   *
   * @returns True when the adapter can forward requests, false otherwise.
   */
  public isAvailable(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authApi = this.auth.api as any;
    return typeof authApi.listUsers === 'function';
  }

  /**
   * Lists all users with optional filtering and pagination.
   *
    * @param options - Query parameters such as pagination and sorting.
    * @param context - Request context, typically carrying headers for auth.
    * @returns Adapter response wrapping user data or the encountered error.
    *
    * @example
    * ```typescript
    * const users = await adapter.listUsers({ limit: 25 }, { headers });
    * ```
   */
  public async listUsers(
    options: ListUsersOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<User[]>> {
    try {
      this.log('Listing users with options:', options);

      const result = await this.api.listUsers({
        ...options,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError('listUsers', 'Failed to list users', result.error);
      }

      return {
        success: true,
        data: result.data || [],
        message: 'Users retrieved successfully',
      };
    } catch (error) {
      this.log('Error listing users:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Creates a new user (admin only).
   *
   * @param options - Creation payload containing credentials and profile details.
   * @param context - Request context for propagating headers or tracing metadata.
   * @returns Adapter response containing the created user.
   *
   * @example
   * ```typescript
   * const created = await adapter.createUser({
   *   email: 'admin@example.com',
   *   password: 'ChangeMe123',
   *   name: 'Admin Example',
   *   role: 'admin'
   * }, context);
   * ```
   */
  public async createUser(
    options: CreateUserOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<User>> {
    try {
      this.log('Creating user:', options.email);

      const result = await this.api.createUser({
        ...options,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError('createUser', 'Failed to create user', result.error);
      }

      return {
        success: true,
        data: result.data,
        message: 'User created successfully',
      };
    } catch (error) {
      this.log('Error creating user:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Updates an existing user.
   *
   * @param options - Update payload including the user identifier and patch data.
   * @param context - Request context for forwarding Better Auth cookies or headers.
   * @returns Adapter response containing the updated user state.
   */
  public async updateUser(
    options: UpdateUserOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<User>> {
    try {
      this.log('Updating user:', options.userId);

      const result = await this.api.updateUser({
        ...options,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError('updateUser', 'Failed to update user', result.error);
      }

      return {
        success: true,
        data: result.data,
        message: 'User updated successfully',
      };
    } catch (error) {
      this.log('Error updating user:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Deletes a user.
   *
   * @param userId - Identifier of the user to delete.
   * @param context - Request context for forwarding Better Auth cookies or headers.
   * @returns Adapter response signalling success or failure.
   */
  public async deleteUser(
    userId: string,
    context: AdapterContext
  ): Promise<AdapterResponse<{ success: boolean }>> {
    try {
      this.log('Deleting user:', userId);

      const result = await this.api.deleteUser({
        userId,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError('deleteUser', 'Failed to delete user', result.error);
      }

      return {
        success: true,
        data: result.data,
        message: 'User deleted successfully',
      };
    } catch (error) {
      this.log('Error deleting user:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Bans a user.
   *
   * @param options - Ban parameters including the user identifier and optional reason.
   * @param context - Request context for forwarding Better Auth cookies or headers.
   * @returns Adapter response containing the updated user record.
   */
  public async banUser(
    options: BanUserOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<User>> {
    try {
      this.log('Banning user:', options.userId);

      const result = await this.api.banUser({
        ...options,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError('banUser', 'Failed to ban user', result.error);
      }

      return {
        success: true,
        data: result.data,
        message: 'User banned successfully',
      };
    } catch (error) {
      this.log('Error banning user:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Unbans a user.
   *
   * @param options - Unban parameters including the user identifier.
   * @param context - Request context for forwarding Better Auth cookies or headers.
   * @returns Adapter response containing the updated user record.
   */
  public async unbanUser(
    options: UnbanUserOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<User>> {
    try {
      this.log('Unbanning user:', options.userId);

      const result = await this.api.unbanUser({
        ...options,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError('unbanUser', 'Failed to unban user', result.error);
      }

      return {
        success: true,
        data: result.data,
        message: 'User unbanned successfully',
      };
    } catch (error) {
      this.log('Error unbanning user:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Impersonates a user (creates a session as that user).
   *
   * @param options - Impersonation parameters including the target user identifier.
   * @param context - Request context for forwarding Better Auth cookies or headers.
   * @returns Adapter response containing the impersonation session.
   */
  public async impersonateUser(
    options: ImpersonateUserOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<{ session: Session }>> {
    try {
      this.log('Impersonating user:', options.userId);

      const result = await this.api.impersonateUser({
        ...options,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError(
          'impersonateUser',
          'Failed to impersonate user',
          result.error
        );
      }

      return {
        success: true,
        data: result.data,
        message: 'User impersonation successful',
      };
    } catch (error) {
      this.log('Error impersonating user:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Lists all sessions for a user.
   *
   * @param options - Session listing parameters including the user identifier.
   * @param context - Request context for forwarding Better Auth cookies or headers.
   * @returns Adapter response containing active sessions.
   */
  public async listUserSessions(
    options: ListUserSessionsOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<Session[]>> {
    try {
      this.log('Listing sessions for user:', options.userId);

      const result = await this.api.listUserSessions({
        ...options,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError(
          'listUserSessions',
          'Failed to list user sessions',
          result.error
        );
      }

      return {
        success: true,
        data: result.data || [],
        message: 'User sessions retrieved successfully',
      };
    } catch (error) {
      this.log('Error listing user sessions:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Revokes a specific user session.
   *
   * @param options - Revocation parameters including the target session identifier.
   * @param context - Request context for forwarding Better Auth cookies or headers.
   * @returns Adapter response signalling whether the session was revoked.
   */
  public async revokeUserSession(
    options: RevokeUserSessionOptions,
    context: AdapterContext
  ): Promise<AdapterResponse<{ success: boolean }>> {
    try {
      this.log('Revoking session:', options.sessionId);

      const result = await this.api.revokeUserSession({
        ...options,
        headers: context.headers,
      });

      if (result.error) {
        throw new AdapterOperationError(
          'revokeUserSession',
          'Failed to revoke user session',
          result.error
        );
      }

      return {
        success: true,
        data: result.data,
        message: 'User session revoked successfully',
      };
    } catch (error) {
      this.log('Error revoking user session:', error);
      return {
        success: false,
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Emits debug logs when the adapter operates in verbose mode.
   *
   * @param args - Values forwarded to the console logger.
   */
  private log(...args: unknown[]): void {
    if (this.debug) {
      console.log('[AdminAdapter]', ...args);
    }
  }
}

/**
 * Factory helper that instantiates {@link AdminAdapter} with safeguards and defaults.
 *
 * @param config - Adapter configuration including a Better Auth instance and optional debug flag.
 * @returns Fully initialized admin adapter ready for dependency injection.
 *
 * @example
 * ```typescript
 * import { createAdminAdapter } from '@emperorrag/better-auth-utilities';
 * import { auth } from '@/lib/auth';
 *
 * export const adminAdapter = createAdminAdapter({ auth });
 * ```
 */
export function createAdminAdapter(config: AdapterConfig): AdminAdapter {
  return new AdminAdapter(config);
}
