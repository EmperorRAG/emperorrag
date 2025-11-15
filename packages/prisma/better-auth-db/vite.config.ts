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
	plugins: [nxCopyAssetsPlugin(['*.md', 'package.json']), dts({ entryRoot: './src', tsconfigPath: path.join(__dirname, 'tsconfig.lib.json') })],
	// Uncomment this if you are using workers.
	// worker: {
	//  plugins: [ nxViteTsPaths() ],
	// },
	// Configuration for building your library.
	// See: https://vitejs.dev/guide/build.html#library-mode
	build: {
		outDir: './dist',
		emptyOutDir: true,
		reportCompressedSize: false,
		minify: false,
		sourcemap: true,
		commonjsOptions: {
			transformMixedEsModules: true,
			esmExternals: true,
		},
		lib: {
			entry: {
				index: path.resolve(__dirname, './src/index.ts'),
				client: path.resolve(__dirname, './src/client.ts'),
				server: path.resolve(__dirname, './src/server.ts'),
				types: path.resolve(__dirname, './src/types.ts'),
			},
			fileName: (_format: string, entryName: string) => {
				switch (entryName) {
					case 'client':
						return 'client.js';
					case 'server':
						return 'server.js';
					case 'types':
						return 'types.js';
					default:
						return 'index.js';
				}
			},
			formats: ['es' as const],
		},
		rollupOptions: {
			external: externalizePackages(toExternalizeConfig(externalsJson)),
			output: {
				preserveModules: true,
				preserveModulesRoot: 'src',
				exports: 'named' as const,
				hoistTransitiveImports: false,
			},
			maxParallelFileOps: 20,
			treeshake: {
				moduleSideEffects: false,
				propertyReadSideEffects: false,
				tryCatchDeoptimization: false,
				unknownGlobalSideEffects: false,
			},
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
