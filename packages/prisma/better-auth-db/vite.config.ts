/// <reference types='vitest' />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import externalsJson from './externals.json' with { type: 'json' };
import { externalizePackages, toExternalizeConfig } from './externalize-packages.js';

export default defineConfig(() => ({
	root: __dirname,
	cacheDir: '../../../node_modules/.vite/packages/prisma/better-auth-db',
	plugins: [
		nxCopyAssetsPlugin([
			'*.md',
			'package.json',
			{
				input: 'src/lib/prisma/generated/client',
				glob: '**/*',
				output: 'lib/prisma/generated/client',
				includeIgnoredFiles: true,
			},
			{
				input: 'src/lib/prisma/generated/schemas',
				glob: '**/*',
				output: 'lib/prisma/generated/schemas',
				includeIgnoredFiles: true,
			},
		]),
		dts({ entryRoot: './src', tsconfigPath: path.join(__dirname, 'tsconfig.lib.json') }),
	],
	// Uncomment this if you are using workers.
	// worker: {
	//  plugins: [ nxViteTsPaths() ],
	// },
	// Configuration for building your library.
	// See: https://vitejs.dev/guide/build.html#library-mode
	build: {
		outDir: './dist',
		emptyOutDir: true,
		reportCompressedSize: true,
		commonjsOptions: {
			transformMixedEsModules: true,
		},
		lib: {
			entry: {
				index: path.resolve(__dirname, './src/index.ts'),
				client: path.resolve(__dirname, './src/client.ts'),
				schemas: path.resolve(__dirname, './src/schemas.ts'),
				types: path.resolve(__dirname, './src/types.ts'),
			},
			fileName: (_format: string, entryName: string) => {
				switch (entryName) {
					case 'client':
						return 'lib/prisma/generated/client/index.js';
					case 'schemas':
						return 'lib/prisma/generated/schemas/index.js';
					case 'types':
						return 'lib/prisma/generated/types/index.d.ts';
					default:
						return 'index.js';
				}
			},
			formats: ['es' as const],
		},
		rollupOptions: {
			external: externalizePackages(toExternalizeConfig(externalsJson)),
		},
	},
	test: {
		name: 'prisma-better-auth-db',
		watch: false,
		globals: true,
		environment: 'node',
		include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		reporters: ['default'],
		coverage: {
			reportsDirectory: './test-output/vitest/coverage',
			provider: 'v8' as const,
		},
	},
}));
