import type { UserPureType } from '@emperorrag/prisma-better-auth-db/schemas';

type UserCreateOneArgs = z.infer<typeof UserCreateOneZodSchema>;
type UserCreateOneData = UserCreateOneArgs['data'];

export interface SignInOptions {
	email: UserPureType['email'];
	password: string;
	rememberMe?: boolean;
	callbackUrl?: string;
}

export interface SignUpOptions {
	name: UserPureType['name'];
	email: UserPureType['email'];
	password: string;
	image?: UserPureType['image'];
	callbackUrl?: string;
}

export interface SignOutFetchOptions {
	onSuccess?: () => void;
}

export interface SignOutOptions {
	fetchOptions?: SignOutFetchOptions;
}

export interface sendVerificationEmailOptions {
	user: UserPureType;
	url: string;
	token: string;
}

export interface sendResetPasswordOptions {
	user: UserPureType;
	url: string;
	token: string;
}

export interface onPasswordResetOptions {
	user: UserPureType;
}

export interface requestPasswordResetOptions {
	email: UserPureType['email'];
	redirectTo?: string;
}

export interface resetPasswordOptions {
	newPassword: string;
	token: string;
}

export interface ChangePasswordOptions {
	newPassword: string;
	currentPassword: string;
	revokeOtherSessions?: boolean;
}

export interface EmailAndPasswordOptions {
	enabled?: boolean;
	disableSignUp?: boolean;
	minPasswordLength?: number;
	maxPasswordLength?: number;
	sendResetPassword?: (options: sendResetPasswordOptions, request: Request) => Promise<void>;
	onPasswordReset?: (options: onPasswordResetOptions, request: Request) => Promise<void>;
	resetPasswordTokenExpiresIn?: number;
	password?: Record<string, unknown>;
}
