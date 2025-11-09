/**
 * @file libs/better-auth-utilities/src/lib/better-auth-utilities.ts
 * @description Main export file for better-auth-utilities library
 */

// Export configuration utilities
export { defineConfig, createClientConfig, createServerConfig } from './config.js';
export type {
	AuthProvider,
	AvailablePlugins,
	BetterAuthConfig,
	ClientConfig,
	DEFAULT_CLIENT_CONFIG,
	DEFAULT_SERVER_CONFIG,
	OAuthProviderId,
	PluginConfigRegistry,
	ServerConfig,
} from './config.ts';

// Export server instance creation
export { createAuthServer } from './server.js';
export type { AuthServerOf, AuthServerSessionOf } from './server.ts';

// Export client instance creation
export { createAuthClient } from './client.js';
export type {
	InferAuthClient,
	AuthClient,
	AuthClientOf,
	AuthClientApiOf,
	AuthClientApiEndpointKeyOf,
	AuthClientApiEndpointOf,
	AuthClientApiEndpointParametersOf,
	AuthClientApiEndpointFirstParameter,
	AuthClientApiEndpointArgsOf,
	AuthClientSessionOf,
	AuthClientSessionUserSessionOf,
	AuthClientSessionUserOf,
} from './client.ts';

// Export NestJS adapter modules and services
// (Adapters are not exported to avoid naming conflicts)
export { AdminModule } from './adapters/admin/admin-nestjs.module.js';
export { AdminService } from './adapters/admin/admin-nestjs.service.js';

export { APIKeyModule } from './adapters/api-key/api-key-nestjs.module.js';
export { APIKeyService } from './adapters/api-key/api-key-nestjs.service.js';

export { BearerModule } from './adapters/bearer/bearer-nestjs.module.js';
export { BearerService } from './adapters/bearer/bearer-nestjs.service.js';

export { EmailOTPModule } from './adapters/email-otp/email-otp-nestjs.module.js';
export { EmailOTPService } from './adapters/email-otp/email-otp-nestjs.service.js';

export { GenericOAuthModule } from './adapters/generic-oauth/generic-oauth-nestjs.module.js';
export { GenericOAuthService } from './adapters/generic-oauth/generic-oauth-nestjs.service.js';

export { JWTModule } from './adapters/jwt/jwt-nestjs.module.js';
export { JWTService } from './adapters/jwt/jwt-nestjs.service.js';

export { OrganizationModule } from './adapters/organization/organization-nestjs.module.js';
export { OrganizationService } from './adapters/organization/organization-nestjs.service.js';

export { TwoFactorModule } from './adapters/two-factor/two-factor-nestjs.module.js';
export { TwoFactorService } from './adapters/two-factor/two-factor-nestjs.service.js';

export { UsernameModule } from './adapters/username/username-nestjs.module.js';
export { UsernameService } from './adapters/username/username-nestjs.service.js';

// Export base adapter interface for typing
export type { AdapterContext, AdapterResponse } from './adapters/base/plugin-adapter.interface.ts';

export type { User } from './core/users/users.utils.js';
