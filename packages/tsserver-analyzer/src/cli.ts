import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import * as os from 'os';
import { Effect, Console, Layer, Option } from 'effect';
import { TraceAnalyzer, make, parseTraceLine, PerformanceStat, SlowOperation } from './lib/tsserver-analyzer.js';

function loadTsConfigPaths(): string[] {
	const tsConfigPath = path.join(process.cwd(), 'tsconfig.base.json');
	if (!fs.existsSync(tsConfigPath)) {
		console.warn('Warning: tsconfig.base.json not found in current directory. Path mapping detection will be disabled.');
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
		console.warn('Warning: Failed to parse tsconfig.base.json', e);
	}
	return [];
}

function findSessionTraceFiles(): string[] {
	let logsDir = '';
	if (process.platform === 'win32') {
		logsDir = path.join(process.env.APPDATA || '', 'Code', 'logs');
	} else if (process.platform === 'darwin') {
		logsDir = path.join(os.homedir(), 'Library', 'Application Support', 'Code', 'logs');
	} else {
		logsDir = path.join(os.homedir(), '.config', 'Code', 'logs');
	}

	if (!fs.existsSync(logsDir)) {
		console.log(`Logs directory not found: ${logsDir}`);
		return [];
	}

	// Get all session directories (YYYYMMDDTHHMMSS)
	const sessions = fs
		.readdirSync(logsDir)
		.filter((name) => /^\d{8}T\d{6}$/.test(name))
		.sort()
		.reverse(); // Newest first

	if (sessions.length === 0) {
		console.log(`No session directories found in ${logsDir}`);
		return [];
	}

	// Iterate through sessions until we find one with trace files
	for (const session of sessions) {
		const sessionDir = path.join(logsDir, session);
		// console.log(`Checking session: ${sessionDir}`);
		const traceFiles: string[] = [];

		// Look for window folders
		const windows = fs.readdirSync(sessionDir).filter((name) => name.startsWith('window'));

		for (const window of windows) {
			const tsLogDir = path.join(sessionDir, window, 'exthost', 'vscode.typescript-language-features');
			if (fs.existsSync(tsLogDir)) {
				// Look for tsserver-log-* folders
				const serverLogs = fs.readdirSync(tsLogDir).filter((name) => name.startsWith('tsserver-log-'));

				for (const serverLog of serverLogs) {
					const traceDir = path.join(tsLogDir, serverLog);
					const files = fs.readdirSync(traceDir).filter((name) => name.startsWith('trace.') && name.endsWith('.json'));

					for (const file of files) {
						traceFiles.push(path.join(traceDir, file));
					}
				}
			}
		}

		if (traceFiles.length > 0) {
			console.log(`Found ${traceFiles.length} trace files in session ${session}`);
			return traceFiles;
		}
	}

	return [];
}

const OPERATION_DESCRIPTIONS: Record<string, string> = {
	updateGraph: 'Re-calculates the project structure and dependencies.',
	findSourceFile: 'Locates a source file on disk.',
	finishCachingPerDirectoryResolution: 'Caches module resolutions for a directory.',
	processRootFiles: 'Processes the root files of the project.',
	resolveModuleNamesWorker: 'Resolves module imports.',
	processTypeReferenceDirective: 'Handles /// <reference types="..." /> directives.',
	updateOpen: 'Updates the state of an open file.',
	configure: 'Sets up the server configuration.',
	definitionAndBoundSpan: 'Finds definition and its span.',
	getApplicableRefactors: 'Computes code refactorings.',
	projectInfo: 'Retrieves project information.',
	documentHighlights: 'Highlights references in the document.',
	provideInlayHints: 'Computes inlay hints.',
	configurePlugin: 'Configures a TS server plugin.',
	compilerOptionsForInferredProjects: 'Sets options for inferred projects.',
	getOutliningSpans: 'Computes folding ranges.',
	linkedEditingRange: 'Computes linked editing ranges.',
	navtree: 'Computes the navigation tree.',
	resolveLibrary: 'Resolves a library file.',
	getUnresolvedImports: 'Finds imports that could not be resolved.',
	checkExpression: 'Type checks an expression.',
	parseJsonSourceFileConfigFileContent: 'Parses tsconfig.json.',
	loadConfiguredProject: 'Loads a configured project.',
	resolveTypeReferenceDirectiveNamesWorker: 'Resolves type reference directives.',
	getPackageJsonAutoImportProvider: 'Gets auto-import provider from package.json.',
	tryReuseStructureFromOldProgram: 'Attempts to reuse old program structure.',
};

function printReport(stats: { commandStats: Map<string, PerformanceStat>; internalStats: Map<string, PerformanceStat>; slowOps: SlowOperation[] }) {
	console.log('=== TSServer Trace Analysis Report ===');

	console.log('--- Top 10 Slowest Operations (>500ms) ---');
	stats.slowOps
		.sort((a, b) => b.durationMs - a.durationMs)
		.slice(0, 10)
		.forEach((op) => {
			const resource = op.resource ? ` (${op.resource})` : '';
			console.log(`[${(op.timestamp / 1000000).toFixed(2)}s] ${op.name}${resource}: ${op.durationMs.toFixed(2)}ms`);
			if (op.args) console.log(`    Args: ${JSON.stringify(op.args).slice(0, 100)}...`);
		});

	console.log('--- Command Statistics (Request/Response) ---');
	printStatsTable(stats.commandStats);

	console.log('--- Internal Compiler Performance ---');
	printStatsTable(stats.internalStats);
}

function printStatsTable(statsMap: Map<string, PerformanceStat>) {
	const tableData = Array.from(statsMap.values())
		.map((stat) => ({
			Name: stat.name,
			'File Path': stat.resource || '',
			Description: OPERATION_DESCRIPTIONS[stat.name] || '',
			Count: stat.count,
			'Avg (ms)': (stat.totalDurationMicros / stat.count / 1000).toFixed(2),
			'Max (ms)': (stat.maxDurationMicros / 1000).toFixed(2),
			'Total (ms)': (stat.totalDurationMicros / 1000).toFixed(2),
		}))
		.sort((a, b) => parseFloat(b['Total (ms)']) - parseFloat(a['Total (ms)'])) // Sort by total time impact
		.slice(0, 50); // Limit to top 50 to prevent console flooding

	console.table(tableData);
}

const program = Effect.gen(function* (_) {
	let logFilePaths: string[] = [];

	if (process.argv[2]) {
		logFilePaths = [process.argv[2]];
	} else {
		yield* _(Console.log('No trace file provided. Attempting to find all trace files from the latest VS Code session...'));
		logFilePaths = findSessionTraceFiles();
		if (logFilePaths.length > 0) {
			yield* _(Console.log(`Found ${logFilePaths.length} trace files.`));
			logFilePaths.forEach((p) => console.log(` - ${p}`));
		}
	}

	if (logFilePaths.length === 0) {
		yield* _(Console.error('Please provide a valid path to trace.json or ensure VS Code logs exist.'));
		yield* _(Console.error('Usage: npx ts-node packages/tsserver-analyzer/src/index.ts [path-to-trace]'));
		return;
	}

	const mappedPaths = loadTsConfigPaths();
	yield* _(Console.log(`Loaded ${mappedPaths.length} path mappings from tsconfig.base.json`));

	const analyzerLayer = Layer.effect(TraceAnalyzer, make(mappedPaths));

	yield* _(
		Effect.gen(function* (__) {
			const analyzer = yield* __(TraceAnalyzer);

			for (const logFilePath of logFilePaths) {
				if (!fs.existsSync(logFilePath)) {
					yield* __(Console.warn(`Skipping missing file: ${logFilePath}`));
					continue;
				}

				yield* __(Console.log(`Analyzing ${logFilePath}...`));
				yield* __(analyzer.reset);

				const fileStream = fs.createReadStream(logFilePath);
				const rl = readline.createInterface({
					input: fileStream,
					crlfDelay: Infinity,
				});

				yield* __(
					Effect.promise(async () => {
						for await (const line of rl) {
							const eventOption = parseTraceLine(line);
							if (Option.isSome(eventOption)) {
								await Effect.runPromise(analyzer.processEvent(eventOption.value));
							}
						}
					})
				);
			}

			const stats = yield* __(analyzer.getStats);
			printReport(stats);
		}).pipe(Effect.provide(analyzerLayer))
	);
});

Effect.runPromise(program).catch(console.error);
