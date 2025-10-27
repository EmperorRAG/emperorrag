/**
 * @file services/my-nest-js-auth-microservice/src/app/auth/auth.module.ts
 * @description Auth module using @thallesp/nestjs-better-auth integration
 * with better-auth-utilities adapter modules for type-safe plugin access.
 */

import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '../../lib/auth';

/**
 * Auth Module
 *
 * Combines @thallesp/nestjs-better-auth for core authentication
 * by mounting the generated Better Auth handler and exporting
 * the configured module for use throughout the application.
 */
@Module({
  imports: [BetterAuthModule.forRoot({ auth })],
  exports: [BetterAuthModule],
})
export class AuthModule {}