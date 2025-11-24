import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import * as fs from 'fs';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import externalsJson from './externals.json' with { type: 'json' };
import { externalizePackages, toExternalizeConfig } from './externalize-packages.js';

function getEntries(dir: string, baseDir: string = dir): Record<string, string> {
	const entries: Record<string, string> = {};
	if (!fs.existsSync(dir)) return entries;

	const files = fs.readdirSync(dir);

	for (const file of files) {
		const fullPath = path.join(dir, file);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory()) {
			if (file === 'test' || file === '__tests__') continue;
			Object.assign(entries, getEntries(fullPath, baseDir));
		} else if (stat.isFile() && file.endsWith('.ts') && !file.endsWith('.d.ts')) {
			if (file.endsWith('.spec.ts') || file.endsWith('.test.ts') || file === 'setup-test-env.ts') continue;

			const relativePath = path.relative(baseDir, fullPath);
			const entryName = relativePath.replace(/\.ts$/, '').replace(/\\/g, '/');
			entries[entryName] = fullPath;
		}
	}
	return entries;
}

export default defineConfig(() => ({
	root: __dirname,
	cacheDir: '../../../node_modules/.vite/packages/prisma/better-auth-db',
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
		reportCompressedSize: false,
		minify: false,
		sourcemap: true,
		commonjsOptions: {
			transformMixedEsModules: true,
			esmExternals: true,
		},
		lib: {
			entry: getEntries(path.resolve(__dirname, 'src')),
			fileName: (_format: string, entryName: string) => `${entryName}.js`,
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
