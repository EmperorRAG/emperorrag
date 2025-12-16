import effectPlugin from '@effect/eslint-plugin';
import nx from '@nx/eslint-plugin';

export default [
	...nx.configs['flat/base'],
	...nx.configs['flat/typescript'],
	...nx.configs['flat/javascript'],
	{
		ignores: ['**/dist', '**/node_modules', '**/build', '**/coverage', '**/generated', '**/out-tsc'],
	},
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		plugins: {
			'@effect': effectPlugin,
		},
		rules: {
			'@effect/dprint': 'error',
			'@effect/no-import-from-barrel-package': 'error',
		},
	},
];
