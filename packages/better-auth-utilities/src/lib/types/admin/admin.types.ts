export interface AdapterContext {
	readonly headers?: Headers | Record<string, string>;
	readonly [key: string]: unknown;
}

export interface AdapterResponse<TResult> {
	readonly success: boolean;
	readonly data?: TResult;
	readonly error?: unknown;
	readonly message?: string;
}

export interface AdminUser {
	readonly id: string;
	readonly email: string;
	readonly name: string;
	readonly role?: string;
	readonly emailVerified: boolean;
	readonly banned?: boolean;
	readonly banReason?: string;
	readonly banExpires?: Date | null;
	readonly banExpiresAt?: Date | null;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly [key: string]: unknown;
}

export interface AdminSession {
	readonly id: string;
	readonly userId: string;
	readonly expiresAt: Date;
	readonly token?: string;
	readonly ipAddress?: string;
	readonly userAgent?: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly [key: string]: unknown;
}

export interface AdminUserSession {
	readonly session: AdminSession;
}

export interface ListUsersOptions {
	readonly limit?: number;
	readonly offset?: number;
	readonly sortBy?: 'createdAt' | 'email' | 'name';
	readonly sortDirection?: 'asc' | 'desc';
	readonly filterBy?: string;
	readonly filterValue?: string;
}

export interface CreateUserOptions {
	readonly email: string;
	readonly password: string;
	readonly name: string;
	readonly role?: string;
	readonly emailVerified?: boolean;
	readonly [key: string]: unknown;
}

export interface UpdateUserOptions {
	readonly userId: string;
	readonly data: {
		readonly name?: string;
		readonly email?: string;
		readonly role?: string;
		readonly emailVerified?: boolean;
		readonly [key: string]: unknown;
	};
}

export interface BanUserOptions {
	readonly userId: string;
	readonly reason?: string;
	readonly banUntil?: Date;
}

export interface UnbanUserOptions {
	readonly userId: string;
}

export interface DeleteUserResult {
	readonly success: boolean;
}

export interface RevokeUserSessionResult {
	readonly success: boolean;
}

export interface ListUserSessionsOptions {
	readonly userId: string;
}

export interface ImpersonateUserOptions {
	readonly userId: string;
}

export interface RevokeUserSessionOptions {
	readonly sessionId: string;
}

export interface ListUsersApiResult {
	readonly data?: ReadonlyArray<AdminUser>;
	readonly error?: unknown;
}

export type ListUsersApi = (input: ListUsersOptions & { readonly headers?: Headers | Record<string, string> }) => Promise<ListUsersApiResult>;

export interface CreateUserApiResult {
	readonly data?: AdminUser;
	readonly error?: unknown;
}

export type CreateUserApi = (input: CreateUserOptions & { readonly headers?: Headers | Record<string, string> }) => Promise<CreateUserApiResult>;

export interface UpdateUserApiResult {
	readonly data?: AdminUser;
	readonly error?: unknown;
}

export type UpdateUserApi = (input: UpdateUserOptions & { readonly headers?: Headers | Record<string, string> }) => Promise<UpdateUserApiResult>;

export interface DeleteUserApiResult {
	readonly data?: DeleteUserResult;
	readonly error?: unknown;
}

export type DeleteUserApi = (input: { readonly userId: string; readonly headers?: Headers | Record<string, string> }) => Promise<DeleteUserApiResult>;

export interface BanUserApiResult {
	readonly data?: AdminUser;
	readonly error?: unknown;
}

export type BanUserApi = (input: BanUserOptions & { readonly headers?: Headers | Record<string, string> }) => Promise<BanUserApiResult>;

export interface UnbanUserApiResult {
	readonly data?: AdminUser;
	readonly error?: unknown;
}

export type UnbanUserApi = (input: UnbanUserOptions & { readonly headers?: Headers | Record<string, string> }) => Promise<UnbanUserApiResult>;

export interface ImpersonateUserApiResult {
	readonly data?: AdminUserSession;
	readonly error?: unknown;
}

export type ImpersonateUserApi = (input: ImpersonateUserOptions & { readonly headers?: Headers | Record<string, string> }) => Promise<ImpersonateUserApiResult>;

export interface ListUserSessionsApiResult {
	readonly data?: ReadonlyArray<AdminSession>;
	readonly error?: unknown;
}

export type ListUserSessionsApi = (
	input: ListUserSessionsOptions & { readonly headers?: Headers | Record<string, string> }
) => Promise<ListUserSessionsApiResult>;

export interface RevokeUserSessionApiResult {
	readonly data?: RevokeUserSessionResult;
	readonly error?: unknown;
}

export type RevokeUserSessionApi = (
	input: RevokeUserSessionOptions & { readonly headers?: Headers | Record<string, string> }
) => Promise<RevokeUserSessionApiResult>;

export interface ListUsersDependencies {
	readonly listUsersApi: ListUsersApi;
}

export interface CreateUserDependencies {
	readonly createUserApi: CreateUserApi;
}

export interface UpdateUserDependencies {
	readonly updateUserApi: UpdateUserApi;
}

export interface DeleteUserDependencies {
	readonly deleteUserApi: DeleteUserApi;
}

export interface BanUserDependencies {
	readonly banUserApi: BanUserApi;
}

export interface UnbanUserDependencies {
	readonly unbanUserApi: UnbanUserApi;
}

export interface ImpersonateUserDependencies {
	readonly impersonateUserApi: ImpersonateUserApi;
}

export interface ListUserSessionsDependencies {
	readonly listUserSessionsApi: ListUserSessionsApi;
}

export interface RevokeUserSessionDependencies {
	readonly revokeUserSessionApi: RevokeUserSessionApi;
}
