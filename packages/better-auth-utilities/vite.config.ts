import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import externalsJson from './externals.json' with { type: 'json' };
import { externalizePackages, toExternalizeConfig } from './externalize-packages.js';

export default defineConfig(() => ({
	root: __dirname,
	cacheDir: '../../node_modules/.vite/packages/better-auth-utilities',
	plugins: [
		nxCopyAssetsPlugin(['*.md', 'package.json']),
		dts({
			entryRoot: './src',
			tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
			rollupTypes: true,
			staticImport: true,
		}),
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
				client: path.resolve(__dirname, './src/lib/client/client.ts'),
				server: path.resolve(__dirname, './src/lib/server/server.ts'),
				config: path.resolve(__dirname, './src/lib/config/config.ts'),
			},
			fileName: (_format: string, entryName: string) => {
				switch (entryName) {
					case 'client':
						return 'lib/client/client.js';
					case 'server':
						return 'lib/server/server.js';
					case 'config':
						return 'lib/config/config.js';
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
}));
