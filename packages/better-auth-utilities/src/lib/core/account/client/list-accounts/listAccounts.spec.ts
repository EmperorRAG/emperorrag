import { describe, it, expect, vi, afterEach } from 'vitest';
import { Effect } from 'effect';
import { listAccounts } from './listAccounts.service.js';

describe('List Accounts', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should list accounts for a signed-in user', async () => {
		const mockAccounts = [
			{
				id: 'acc_123',
				userId: 'user_123',
				providerId: 'credential',
				accountId: 'user_123',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		const mockListAccounts = vi.fn().mockResolvedValue({
			data: mockAccounts,
			error: null,
		});

		const mockAuthClient = {
			listAccounts: mockListAccounts,
		} as any;

		const result = await Effect.runPromise(Effect.either(listAccounts({ authClient: mockAuthClient })({})));

		expect(mockListAccounts).toHaveBeenCalled();
		expect(result._tag).toBe('Right');
		if (result._tag === 'Right') {
			expect(result.right).toBeDefined();
			expect(result.right).toHaveLength(1);
			expect(result.right?.[0].providerId).toBe('credential');
		}
	});

	it('should handle errors', async () => {
		const mockListAccounts = vi.fn().mockResolvedValue({
			data: null,
			error: { message: 'Failed to fetch accounts', status: 500, statusText: 'Internal Server Error' },
		});

		const mockAuthClient = {
			listAccounts: mockListAccounts,
		} as any;

		const result = await Effect.runPromise(Effect.either(listAccounts({ authClient: mockAuthClient })({})));

		expect(result._tag).toBe('Left');
		if (result._tag === 'Left') {
			expect(result.left.message).toBe('Failed to fetch accounts');
		}
	});
});
