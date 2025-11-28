import * as fs from 'fs';
import * as path from 'path';
import { Effect, Console } from 'effect';

export const loadTsConfigPaths = Effect.gen(function* (_) {
	const tsConfigPath = path.join(process.cwd(), 'tsconfig.base.json');
	if (!fs.existsSync(tsConfigPath)) {
		yield* _(Console.warn('Warning: tsconfig.base.json not found in current directory. Path mapping detection will be disabled.'));
		return [];
	}

	try {
		const content = fs.readFileSync(tsConfigPath, 'utf-8');
		// Simple comment stripping
		const jsonContent = content.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
		const tsConfig = JSON.parse(jsonContent);

		if (tsConfig.compilerOptions && tsConfig.compilerOptions.paths) {
			const paths: string[] = [];
			for (const key in tsConfig.compilerOptions.paths) {
				const values = tsConfig.compilerOptions.paths[key];
				for (const value of values) {
					// Remove wildcards and normalize
					const cleanPath = value.replace(/\*/g, '').replace(/\\/g, '/');
					paths.push(cleanPath);
				}
			}
			return paths;
		}
	} catch (e) {
		yield* _(Console.warn('Warning: Failed to parse tsconfig.base.json', e));
	}
	return [];
});
