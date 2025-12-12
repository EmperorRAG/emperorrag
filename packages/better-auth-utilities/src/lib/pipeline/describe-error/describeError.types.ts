import type { AuthServerError } from '../../errors/authServer.error';

export interface AuthServerErrorDescriptor {
	_tag: 'AuthServerErrorDescriptor';
	authServerErrorType: AuthServerError;
	code: string; // e.g. 'invalid_email', 'password_too_weak'
	message: string; // human-ish, but not necessarily final UI text
	status?: number; // optional HTTP-ish status if you want
	cause?: unknown; // original error for logging
} /**
 * Type guard to check if an error is already a descriptor.
 */
export const isAuthServerErrorDescriptor = (error: unknown): error is AuthServerErrorDescriptor => {
	return typeof error === 'object' && error !== null && '_tag' in error && (error as AuthServerErrorDescriptor)._tag === 'AuthServerErrorDescriptor';
};
