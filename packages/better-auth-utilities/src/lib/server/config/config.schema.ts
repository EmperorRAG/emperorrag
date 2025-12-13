import { Schema } from 'effect';

/**
 * @description Schema for Better Auth database configuration
 */
const DatabaseOptions = Schema.Struct({
	dialect: Schema.optional(Schema.Literal('postgres', 'mysql', 'sqlite', 'mssql')),
	type: Schema.optional(Schema.Literal('postgres', 'mysql', 'sqlite', 'mssql')),
	casing: Schema.optional(Schema.Literal('camel', 'snake')),
	provider: Schema.optional(Schema.String), // For custom providers
});

/**
 * @description Schema for Better Auth session configuration
 */
const SessionOptions = Schema.Struct({
	modelName: Schema.optional(Schema.String),
	fields: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.String })),
	expiresIn: Schema.optional(Schema.Number),
	updateAge: Schema.optional(Schema.Number),
	disableSessionRefresh: Schema.optional(Schema.Boolean),
	storeSessionInDatabase: Schema.optional(Schema.Boolean),
	preserveSessionInDatabase: Schema.optional(Schema.Boolean),
	cookieCache: Schema.optional(
		Schema.Struct({
			enabled: Schema.Boolean,
			maxAge: Schema.optional(Schema.Number),
		})
	),
});

/**
 * @description Schema for Better Auth user configuration
 */
const UserOptions = Schema.Struct({
	modelName: Schema.optional(Schema.String),
	fields: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.String })),
	additionalFields: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.Any })),
	changeEmail: Schema.optional(
		Schema.Struct({
			enabled: Schema.Boolean,
			sendChangeEmailConfirmation: Schema.optional(Schema.Any), // Function
			updateEmailWithoutVerification: Schema.optional(Schema.Boolean),
		})
	),
	deleteUser: Schema.optional(
		Schema.Struct({
			enabled: Schema.Boolean,
			sendDeleteAccountVerification: Schema.optional(Schema.Any), // Function
			beforeDelete: Schema.optional(Schema.Any), // Function
			afterDelete: Schema.optional(Schema.Any), // Function
		})
	),
});

/**
 * @description Schema for Better Auth account configuration
 */
const AccountOptions = Schema.Struct({
	modelName: Schema.optional(Schema.String),
	fields: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.String })),
	encryptOAuthTokens: Schema.optional(Schema.Boolean),
	storeAccountCookie: Schema.optional(Schema.Boolean),
	accountLinking: Schema.optional(
		Schema.Struct({
			enabled: Schema.Boolean,
			trustedProviders: Schema.optional(Schema.Array(Schema.String)),
			allowDifferentEmails: Schema.optional(Schema.Boolean),
		})
	),
});

/**
 * @description Schema for Better Auth email and password authentication
 */
const EmailAndPasswordOptions = Schema.Struct({
	enabled: Schema.optional(Schema.Boolean),
	disableSignUp: Schema.optional(Schema.Boolean),
	requireEmailVerification: Schema.optional(Schema.Boolean),
	minPasswordLength: Schema.optional(Schema.Number),
	maxPasswordLength: Schema.optional(Schema.Number),
	autoSignIn: Schema.optional(Schema.Boolean),
	sendResetPassword: Schema.optional(Schema.Any), // Function
	resetPasswordTokenExpiresIn: Schema.optional(Schema.Number),
	password: Schema.optional(
		Schema.Struct({
			hash: Schema.Any, // Function
			verify: Schema.Any, // Function
		})
	),
});

/**
 * @description Schema for Better Auth social providers
 */
const SocialProviderOptions = Schema.Struct({
	clientId: Schema.String,
	clientSecret: Schema.String,
	redirectURI: Schema.optional(Schema.String),
	scope: Schema.optional(Schema.Array(Schema.String)),
});

/**
 * @description Schema for Better Auth rate limiting
 */
const RateLimitOptions = Schema.Struct({
	enabled: Schema.optional(Schema.Boolean),
	window: Schema.optional(Schema.Number),
	max: Schema.optional(Schema.Number),
	customRules: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.Any })),
	storage: Schema.optional(Schema.Literal('memory', 'database')),
	modelName: Schema.optional(Schema.String),
});

/**
 * @description Schema for Better Auth email verification
 */
const EmailVerificationOptions = Schema.Struct({
	sendVerificationEmail: Schema.Any, // Function
	sendOnSignUp: Schema.optional(Schema.Boolean),
	sendOnSignIn: Schema.optional(Schema.Boolean),
	autoSignInAfterVerification: Schema.optional(Schema.Boolean),
	expiresIn: Schema.optional(Schema.Number),
});

/**
 * @description Schema for Better Auth advanced options
 */
const AdvancedOptions = Schema.Struct({
	ipAddress: Schema.optional(
		Schema.Struct({
			ipAddressHeaders: Schema.optional(Schema.Array(Schema.String)),
			disableIpTracking: Schema.optional(Schema.Boolean),
		})
	),
	useSecureCookies: Schema.optional(Schema.Boolean),
	disableCSRFCheck: Schema.optional(Schema.Boolean),
	crossSubDomainCookies: Schema.optional(
		Schema.Struct({
			enabled: Schema.Boolean,
			additionalCookies: Schema.optional(Schema.Array(Schema.String)),
			domain: Schema.optional(Schema.String),
		})
	),
	defaultCookieAttributes: Schema.optional(
		Schema.Struct({
			httpOnly: Schema.optional(Schema.Boolean),
			secure: Schema.optional(Schema.Boolean),
			sameSite: Schema.optional(Schema.Literal('lax', 'strict', 'none')),
			domain: Schema.optional(Schema.String),
			path: Schema.optional(Schema.String),
		})
	),
	cookiePrefix: Schema.optional(Schema.String),
});

/**
 * @description Schema for Better Auth logger
 */
const LoggerOptions = Schema.Struct({
	disabled: Schema.optional(Schema.Boolean),
	disableColors: Schema.optional(Schema.Boolean),
	level: Schema.optional(Schema.Literal('error', 'warn', 'info', 'debug')),
	log: Schema.optional(Schema.Any), // Function
});

/**
 * @description Main Schema for BetterAuthOptions
 */
export const BetterAuthOptionsSchema = Schema.Struct({
	appName: Schema.optional(Schema.String),
	baseURL: Schema.optional(Schema.String),
	basePath: Schema.optional(Schema.String),
	secret: Schema.optional(Schema.String),
	database: Schema.optional(DatabaseOptions),
	secondaryStorage: Schema.optional(Schema.Any),
	session: Schema.optional(SessionOptions),
	user: Schema.optional(UserOptions),
	account: Schema.optional(AccountOptions),
	emailAndPassword: Schema.optional(EmailAndPasswordOptions),
	socialProviders: Schema.optional(Schema.Record({ key: Schema.String, value: SocialProviderOptions })),
	plugins: Schema.optional(Schema.Array(Schema.Any)),
	rateLimit: Schema.optional(RateLimitOptions),
	emailVerification: Schema.optional(EmailVerificationOptions),
	advanced: Schema.optional(AdvancedOptions),
	logger: Schema.optional(LoggerOptions),
	trustedOrigins: Schema.optional(Schema.Union(Schema.Array(Schema.String), Schema.Any)), // Array or Function
	onAPIError: Schema.optional(Schema.Any), // Function
});

export type BetterAuthOptionsSchemaType = typeof BetterAuthOptionsSchema.Type;
