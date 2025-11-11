import { z } from 'zod';

import type {
	ChangePasswordInput,
	EmailAuthClientDeps,
	SignInEmailInput,
	SignOutOptions,
	SignUpEmailInput,
	VerificationEmailInput,
	requestPasswordResetInput,
	resetPasswordInput,
} from './email.types.js';
import type { AuthClient } from '../../../client.js';

const emailSchema = z.string().trim().email({ message: 'Invalid email address.' });

const passwordSchema = z
	.string()
	.min(8, { message: 'Password must contain at least 8 characters.' })
	.max(256, { message: 'Password must contain 256 characters or fewer.' });

const optionalCallbackUrlSchema = z.string().url({ message: 'Callback URL must be a valid absolute URL.' }).optional();

const httpsOrDataImageSchema = z
	.string()
	.trim()
	.refine((value) => value.startsWith('https://') || value.startsWith('data:'), { message: 'Image must be an https URL or a data URI.' })
	.optional();

const rememberMeSchema = z.boolean().optional().default(false);

const lifecycleHandlerSchema = z
	.custom<() => void | Promise<void>>((value) => typeof value === 'function', {
		message: 'Handler must be a function.',
	})
	.optional();

const errorHandlerSchema = z
	.custom<(error: unknown) => void | Promise<void>>((value) => typeof value === 'function', {
		message: 'Error handler must be a function.',
	})
	.optional();

const signUpEmailSchema: z.ZodType<SignUpEmailInput> = z
	.object({
		name: z.string().trim().min(1, { message: 'Name is required.' }),
		email: emailSchema,
		password: passwordSchema,
		image: httpsOrDataImageSchema,
		callbackUrl: optionalCallbackUrlSchema,
	})
	.strict();

const signInEmailSchema: z.ZodType<SignInEmailInput> = z
	.object({
		email: emailSchema,
		password: z.string().min(1, { message: 'Password is required.' }),
		rememberMe: rememberMeSchema,
		callbackUrl: optionalCallbackUrlSchema,
	})
	.strict();

const signOutOptionsSchema: z.ZodType<SignOutOptions | undefined> = z
	.object({
		all: z.boolean().optional(),
		redirectTo: z.string().url({ message: 'Redirect target must be a valid absolute URL.' }).optional(),
		fetchOptions: z
			.object({
				onSuccess: lifecycleHandlerSchema,
				onError: errorHandlerSchema,
			})
			.strict()
			.optional(),
	})
	.strict()
	.optional();

const verificationEmailSchema: z.ZodType<VerificationEmailInput> = z
	.object({
		email: emailSchema,
		callbackUrl: optionalCallbackUrlSchema,
	})
	.strict();

const requestPasswordResetSchema: z.ZodType<requestPasswordResetInput> = z
	.object({
		email: emailSchema,
		redirectTo: z.string().url({ message: 'Redirect target must be a valid absolute URL.' }).optional(),
	})
	.strict();

const resetPasswordSchema: z.ZodType<resetPasswordInput> = z
	.object({
		newPassword: passwordSchema,
		token: z.string().min(1, { message: 'Token is required.' }),
	})
	.strict();

const changePasswordSchema: z.ZodType<ChangePasswordInput> = z
	.object({
		newPassword: passwordSchema,
		currentPassword: z.string().min(1, { message: 'Current password is required.' }),
		revokeOtherSessions: z.boolean().optional(),
	})
	.strict();

export type EmailClientSchemas = Readonly<{
	signUp: typeof signUpEmailSchema;
	signIn: typeof signInEmailSchema;
	signOut: typeof signOutOptionsSchema;
	sendVerificationEmail: typeof verificationEmailSchema;
	requestPasswordReset: typeof requestPasswordResetSchema;
	resetPassword: typeof resetPasswordSchema;
	changePassword: typeof changePasswordSchema;
}>;

const schemaBundle: EmailClientSchemas = Object.freeze({
	signUp: signUpEmailSchema,
	signIn: signInEmailSchema,
	signOut: signOutOptionsSchema,
	sendVerificationEmail: verificationEmailSchema,
	requestPasswordReset: requestPasswordResetSchema,
	resetPassword: resetPasswordSchema,
	changePassword: changePasswordSchema,
});

export const emailClientSchemas = schemaBundle;

/**
 * Constructs immutable email client schemas aligned with Better Auth payload expectations.
 *
 * @pure
 * @description Returns a frozen schema map. The provided dependencies are reserved for future schema tailoring once runtime AuthClient metadata is available.
 *
 * @fp-pattern Factory function
 * @composition
 *   - Returns the pre-built `schemaBundle`
 *
 * @param deps - Dependency bundle containing the Better Auth client instance.
 * @returns {EmailClientSchemas} Immutable Zod schema collection for email flows.
 *
 * @example
 * const schemas = createEmailClientSchemas({ authClient });
 * const payload = schemas.signUp.parse(input);
 */
export const createEmailClientSchemas = <TAuthClient extends AuthClient>(deps: EmailAuthClientDeps<TAuthClient>): EmailClientSchemas => {
	void deps;
	return schemaBundle;
};
