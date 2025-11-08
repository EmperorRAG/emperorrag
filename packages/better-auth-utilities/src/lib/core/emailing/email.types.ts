import type { UserPureType } from '@emperorrag/prisma-better-auth-db/types';

type EmailRequestType = {
	user: UserPureType;
	url: string;
	token: string;
};

export interface SignInProps {
	email: UserPureType['email'];
	password: string;
	rememberMe?: boolean;
	callbackUrl?: string;
}

export interface SignUpProps {
	name: UserPureType['name'];
	email: UserPureType['email'];
	password: string;
	image?: UserPureType['image'];
	callbackUrl?: string;
}

export interface SignOutFetchOptions {
	onSuccess?: () => void;
}

export interface SignOutProps {
	fetchOptions?: SignOutFetchOptions;
}

export interface sendVerificationEmailArgs {
	user: EmailRequestType['user'];
	url: EmailRequestType['url'];
	token: EmailRequestType['token'];
}

export interface sendResetPasswordArgs {
	user: EmailRequestType['user'];
	url: EmailRequestType['url'];
	token: EmailRequestType['token'];
}

export interface onPasswordResetArgs {
	user: EmailRequestType['user'];
}

export interface requestPasswordResetProps {
	email: UserPureType['email'];
	redirectTo?: string;
}

export interface resetPasswordProps {
	newPassword: string;
	token: string;
}

export interface ChangePasswordProps {
	newPassword: string;
	currentPassword: string;
	revokeOtherSessions?: boolean;
}

export interface EmailAndPasswordOptions {
	enabled?: boolean;
	disableSignUp?: boolean;
	minPasswordLength?: number;
	maxPasswordLength?: number;
	sendResetPassword?: (args: sendResetPasswordArgs, request: Request) => Promise<void>;
	onPasswordReset?: (args: onPasswordResetArgs, request: Request) => Promise<void>;
	resetPasswordTokenExpiresIn?: number;
	password?: Record<string, unknown>;
}
