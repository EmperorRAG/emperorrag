import { Schema } from 'effect';

/**
 * @description Schema for Better Auth database configuration
 */
export class DatabaseOptions extends Schema.TaggedClass<DatabaseOptions>()('DatabaseOptions', {
	dialect: Schema.optional(Schema.Literal('postgres', 'mysql', 'sqlite', 'mssql')),
	type: Schema.optional(Schema.Literal('postgres', 'mysql', 'sqlite', 'mssql')),
	casing: Schema.optional(Schema.Literal('camel', 'snake')),
	provider: Schema.optional(Schema.String), // For custom providers
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(DatabaseOptions)(input);
	}

	static encode(value: DatabaseOptions) {
		return Schema.encode(DatabaseOptions)(value);
	}
}

/**
 * @description Schema for Better Auth session configuration
 */
export class SessionOptions extends Schema.TaggedClass<SessionOptions>()('SessionOptions', {
	modelName: Schema.optional(Schema.String),
	fields: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.String })),
	expiresIn: Schema.optional(Schema.Number),
	updateAge: Schema.optional(Schema.Number),
	disableSessionRefresh: Schema.optional(Schema.Boolean),
	storeSessionInDatabase: Schema.optional(Schema.Boolean),
	preserveSessionInDatabase: Schema.optional(Schema.Boolean),
	cookieCache: Schema.optional(
		Schema.Struct({
			enabled: Schema.optional(Schema.Boolean),
			maxAge: Schema.optional(Schema.Number),
		})
	),
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(SessionOptions)(input);
	}

	static encode(value: SessionOptions) {
		return Schema.encode(SessionOptions)(value);
	}
}

/**
 * @description Schema for Better Auth user configuration
 */
export class UserOptions extends Schema.TaggedClass<UserOptions>()('UserOptions', {
	modelName: Schema.optional(Schema.String),
	fields: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.String })),
	additionalFields: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.Any })),
	changeEmail: Schema.optional(
		Schema.Struct({
			enabled: Schema.optional(Schema.Boolean),
			sendChangeEmailConfirmation: Schema.optional(Schema.Any), // Function
			updateEmailWithoutVerification: Schema.optional(Schema.Boolean),
		})
	),
	deleteUser: Schema.optional(
		Schema.Struct({
			enabled: Schema.optional(Schema.Boolean),
			sendDeleteAccountVerification: Schema.optional(Schema.Any), // Function
			beforeDelete: Schema.optional(Schema.Any), // Function
			afterDelete: Schema.optional(Schema.Any), // Function
		})
	),
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(UserOptions)(input);
	}

	static encode(value: UserOptions) {
		return Schema.encode(UserOptions)(value);
	}
}

/**
 * @description Schema for Better Auth account configuration
 */
export class AccountOptions extends Schema.TaggedClass<AccountOptions>()('AccountOptions', {
	modelName: Schema.optional(Schema.String),
	fields: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.String })),
	encryptOAuthTokens: Schema.optional(Schema.Boolean),
	storeAccountCookie: Schema.optional(Schema.Boolean),
	accountLinking: Schema.optional(
		Schema.Struct({
			enabled: Schema.optional(Schema.Boolean),
			trustedProviders: Schema.optional(Schema.Array(Schema.String)),
			allowDifferentEmails: Schema.optional(Schema.Boolean),
		})
	),
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(AccountOptions)(input);
	}

	static encode(value: AccountOptions) {
		return Schema.encode(AccountOptions)(value);
	}
}

/**
 * @description Schema for Better Auth email and password authentication
 */
export class EmailAndPasswordOptions extends Schema.TaggedClass<EmailAndPasswordOptions>()('EmailAndPasswordOptions', {
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
			hash: Schema.optional(Schema.Any), // Function
			verify: Schema.optional(Schema.Any), // Function
		})
	),
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(EmailAndPasswordOptions)(input);
	}

	static encode(value: EmailAndPasswordOptions) {
		return Schema.encode(EmailAndPasswordOptions)(value);
	}
}

/**
 * @description Schema for Better Auth social providers
 */
export class SocialProviderOptions extends Schema.TaggedClass<SocialProviderOptions>()('SocialProviderOptions', {
	clientId: Schema.String,
	clientSecret: Schema.String,
	redirectURI: Schema.optional(Schema.String),
	scope: Schema.optional(Schema.Array(Schema.String)),
}) {}

/**
 * @description Schema for Better Auth rate limiting
 */
export class RateLimitOptions extends Schema.TaggedClass<RateLimitOptions>()('RateLimitOptions', {
	enabled: Schema.optional(Schema.Boolean),
	window: Schema.optional(Schema.Number),
	max: Schema.optional(Schema.Number),
	customRules: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.Any })),
	storage: Schema.optional(Schema.Literal('memory', 'database', 'secondary-storage')),
	modelName: Schema.optional(Schema.String),
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(RateLimitOptions)(input);
	}

	static encode(value: RateLimitOptions) {
		return Schema.encode(RateLimitOptions)(value);
	}
}

/**
 * @description Schema for Better Auth email verification
 */
export class EmailVerificationOptions extends Schema.TaggedClass<EmailVerificationOptions>()('EmailVerificationOptions', {
	sendVerificationEmail: Schema.optional(Schema.Any), // Function
	sendOnSignUp: Schema.optional(Schema.Boolean),
	sendOnSignIn: Schema.optional(Schema.Boolean),
	autoSignInAfterVerification: Schema.optional(Schema.Boolean),
	expiresIn: Schema.optional(Schema.Number),
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(EmailVerificationOptions)(input);
	}

	static encode(value: EmailVerificationOptions) {
		return Schema.encode(EmailVerificationOptions)(value);
	}
}

/**
 * @description Schema for Better Auth advanced options
 */
export class AdvancedOptions extends Schema.TaggedClass<AdvancedOptions>()('AdvancedOptions', {
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
			sameSite: Schema.optional(Schema.Literal('lax', 'strict', 'none', 'Lax', 'Strict', 'None')),
			domain: Schema.optional(Schema.String),
			path: Schema.optional(Schema.String),
		})
	),
	cookiePrefix: Schema.optional(Schema.String),
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(AdvancedOptions)(input);
	}

	static encode(value: AdvancedOptions) {
		return Schema.encode(AdvancedOptions)(value);
	}
}

/**
 * @description Schema for Better Auth logger
 */
export class LoggerOptions extends Schema.TaggedClass<LoggerOptions>()('LoggerOptions', {
	disabled: Schema.optional(Schema.Boolean),
	disableColors: Schema.optional(Schema.Boolean),
	level: Schema.optional(Schema.Literal('error', 'warn', 'info', 'debug')),
	log: Schema.optional(Schema.Any), // Function
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(LoggerOptions)(input);
	}

	static encode(value: LoggerOptions) {
		return Schema.encode(LoggerOptions)(value);
	}
}

/**
 * @description Main Schema for BetterAuthOptions
 */
export class BetterAuthOptions extends Schema.TaggedClass<BetterAuthOptions>()('BetterAuthOptions', {
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
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(BetterAuthOptions)(input);
	}

	static encode(value: BetterAuthOptions) {
		return Schema.encode(BetterAuthOptions)(value);
	}
}

export const BetterAuthOptionsSchema = BetterAuthOptions;
export type BetterAuthOptionsSchemaType = typeof BetterAuthOptionsSchema.Type;
