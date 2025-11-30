import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
// import * as fs from 'fs';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import externalsJson from './externals.json' with { type: 'json' };
import { externalizePackages, toExternalizeConfig } from './externalize-packages.js';

export default defineConfig(() => ({
	root: __dirname,
	cacheDir: '../../node_modules/.vite/packages/utilities',
	plugins: [
		nxCopyAssetsPlugin(['*.md', 'package.json']),
		dts({
			entryRoot: './src',
			tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
			rollupTypes: false,
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
		reportCompressedSize: true,
		commonjsOptions: {
			transformMixedEsModules: true,
		},
		lib: {
			// Could also be a dictionary or array of multiple entry points.
			entry: {
				utilities: './src/utilities.ts',
				'lib/helper-functions/helperFunctions': './src/lib/helper-functions/helperFunctions.ts',
				'lib/types/types': './src/lib/types/types.ts',
				'lib/helper-functions/object.utils': './src/lib/helper-functions/object.utils.ts',
			},
			name: '@emperorrag/utilities',
			// Change this to the formats you want to support.
			// Don't forget to update your package.json as well.
			formats: ['es' as const],
		},
		rollupOptions: {
			// External packages that should not be bundled into your library.
			external: externalizePackages(toExternalizeConfig(externalsJson)),
			output: {
				preserveModules: true,
				preserveModulesRoot: 'src',
				exports: 'named' as const,
				hoistTransitiveImports: false,
			},
			treeshake: {
				moduleSideEffects: false,
				propertyReadSideEffects: false,
				tryCatchDeoptimization: false,
				unknownGlobalSideEffects: false,
			},
		},
	},
}));
