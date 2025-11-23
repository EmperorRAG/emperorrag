import { describe, it, expect, vi, afterEach } from 'vitest';
import { Effect } from 'effect';
import { unlinkAccount } from './unlinkAccount.service.js';

describe('Unlink Account', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should unlink a provider', async () => {
		const mockUnlinkAccount = vi.fn().mockResolvedValue({
			data: { success: true },
			error: null,
		});

		const mockAuthClient = {
			unlinkAccount: mockUnlinkAccount,
		} as any;

		const result = await Effect.runPromise(
			Effect.either(
				unlinkAccount({ authClient: mockAuthClient })({
					providerId: 'google',
				})
			)
		);

		expect(mockUnlinkAccount).toHaveBeenCalledWith(
			expect.objectContaining({
				providerId: 'google',
			})
		);
		expect(result._tag).toBe('Right');
		if (result._tag === 'Right') {
			expect(result.right.success).toBe(true);
		}
	});

	it('should handle errors', async () => {
		const mockUnlinkAccount = vi.fn().mockResolvedValue({
			data: null,
			error: { message: 'Cannot unlink last provider', status: 400, statusText: 'Bad Request' },
		});

		const mockAuthClient = {
			unlinkAccount: mockUnlinkAccount,
		} as any;

		const result = await Effect.runPromise(
			Effect.either(
				unlinkAccount({ authClient: mockAuthClient })({
					providerId: 'credential',
				})
			)
		);

		expect(result._tag).toBe('Left');
		if (result._tag === 'Left') {
			expect(result.left.message).toBe('Cannot unlink last provider');
		}
	});
});
