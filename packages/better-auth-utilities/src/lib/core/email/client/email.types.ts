//import type { UserPureType } from '@emperorrag/prisma-better-auth-db/types';
/*
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
*/

import type { AuthClient, AuthClientSessionUserOf, AuthClientSessionUserSessionOf } from '../../../client.js';

export type SignUpEmailInput = {
	name: string;
	email: string;
	password: string;
	image?: string;
	callbackUrl?: string;
};

export type SignInEmailInput = {
	email: string;
	password: string;
	rememberMe?: boolean;
	callbackUrl?: string;
};

export type VerificationEmailInput = {
	email: string;
	callbackUrl?: string;
};

export type requestPasswordResetInput = {
	email: string;
	redirectTo?: string;
};

export type resetPasswordInput = {
	newPassword: string;
	token: string;
};

export type ChangePasswordInput = {
	newPassword: string;
	currentPassword: string;
	revokeOtherSessions?: boolean;
};

export type SignOutOptions = {
	all?: boolean;
	redirectTo?: string;
	fetchOptions?: Readonly<{
		onSuccess?: () => void | Promise<void>;
		onError?: (error: unknown) => void | Promise<void>;
	}>;
};

export type SignUpEmailResult<TAuthClient extends AuthClient> = {
	user: AuthClientSessionUserOf<TAuthClient>;
	session: AuthClientSessionUserSessionOf<TAuthClient>;
	callbackUrl?: string;
};

export type SignInEmailResult<TAuthClient extends AuthClient> = {
	user: AuthClientSessionUserOf<TAuthClient>;
	session: AuthClientSessionUserSessionOf<TAuthClient>;
	requiresVerification: boolean;
};

export type EmailAuthClientLogger = Readonly<{
	debug: (message: string, metadata?: Readonly<Record<string, unknown>>) => void;
	info: (message: string, metadata?: Readonly<Record<string, unknown>>) => void;
	warn: (message: string, metadata?: Readonly<Record<string, unknown>>) => void;
	error: (message: string, metadata?: Readonly<Record<string, unknown>>) => void;
}>;

export type EmailAuthClientTelemetry = Readonly<{
	trackEvent: (name: string, properties?: Readonly<Record<string, unknown>>) => void | Promise<void>;
}>;

export type EmailAuthClientFeatureFlags = Readonly<Record<string, boolean>>;

export type EmailAuthClientDeps<TAuthClient extends AuthClient = AuthClient> = Readonly<{
	authClient: TAuthClient;
	logger?: EmailAuthClientLogger;
	telemetry?: EmailAuthClientTelemetry;
	featureFlags?: EmailAuthClientFeatureFlags;
}>;

export type EmailAuthClientPreloaded<TAuthClient extends AuthClient = AuthClient> = Readonly<{
	signUpEmail: ReturnType<signUpEmailProps<TAuthClient>>;
	signInEmail: ReturnType<signInEmailProps<TAuthClient>>;
	signOut: ReturnType<signOutProps<TAuthClient>>;
	sendVerificationEmail: ReturnType<sendVerificationEmailProps>;
	requestPasswordReset: ReturnType<requestPasswordResetProps>;
	resetPassword: ReturnType<resetPasswordProps>;
	changePassword: ReturnType<changePasswordProps>;
}>;

export interface signUpEmailProps<TAuthClient extends AuthClient> {
	(deps: EmailAuthClientDeps<TAuthClient>): (input: SignUpEmailInput) => Promise<SignUpEmailResult<TAuthClient>>;
}
export interface signInEmailProps<TAuthClient extends AuthClient> {
	(deps: EmailAuthClientDeps<TAuthClient>): (input: SignInEmailInput) => Promise<SignInEmailResult<TAuthClient>>;
}
export interface signOutProps<TAuthClient extends AuthClient> {
	(deps: EmailAuthClientDeps<TAuthClient>): (options?: SignOutOptions) => Promise<void>;
}
export interface sendVerificationEmailProps {
	(deps: EmailAuthClientDeps): (input: VerificationEmailInput) => Promise<void>;
}
export interface requestPasswordResetProps {
	(deps: EmailAuthClientDeps): (input: requestPasswordResetInput) => Promise<void>;
}

export interface resetPasswordProps {
	(deps: EmailAuthClientDeps): (input: resetPasswordInput) => Promise<void>;
}
export interface changePasswordProps {
	(deps: EmailAuthClientDeps): (input: ChangePasswordInput) => Promise<void>;
}
