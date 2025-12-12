import * as fs from 'fs';
import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

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
	cacheDir: '../../node_modules/.vite/packages/tsserver-analyzer',
	plugins: [
		// nxCopyAssetsPlugin(['*.md', 'package.json']),
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
			entry: getEntries(path.join(__dirname, 'src')),
			name: '@emperorrag/tsserver-analyzer',
			// Change this to the formats you want to support.
			// Don't forget to update your package.json as well.
			formats: ['es' as const],
		},
		rollupOptions: {
			// External packages that should not be bundled into your library.
			external: ['fs', 'readline', 'path', 'events', 'stream', 'util', 'os', 'effect'],
		},
	},
}));
