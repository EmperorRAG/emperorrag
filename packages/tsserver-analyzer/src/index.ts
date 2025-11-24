import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import * as os from 'os';
import { parseTraceLine } from './lib/parser.js';
import { Analyzer } from './lib/analyzer.js';

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

function findLatestTraceFile(): string | null {
	let logsDir = '';
	if (process.platform === 'win32') {
		logsDir = path.join(process.env.APPDATA || '', 'Code', 'logs');
	} else if (process.platform === 'darwin') {
		logsDir = path.join(os.homedir(), 'Library', 'Application Support', 'Code', 'logs');
	} else {
		logsDir = path.join(os.homedir(), '.config', 'Code', 'logs');
	}

	if (!fs.existsSync(logsDir)) {
		return null;
	}

	// Get all session directories (YYYYMMDDTHHMMSS)
	const sessions = fs
		.readdirSync(logsDir)
		.filter((name) => /^\d{8}T\d{6}$/.test(name))
		.sort()
		.reverse(); // Newest first

	for (const session of sessions) {
		const sessionDir = path.join(logsDir, session);
		// Look for window folders
		const windows = fs.readdirSync(sessionDir).filter((name) => name.startsWith('window'));

		for (const window of windows) {
			const tsLogDir = path.join(sessionDir, window, 'exthost', 'vscode.typescript-language-features');
			if (fs.existsSync(tsLogDir)) {
				// Look for tsserver-log-* folders
				const serverLogs = fs
					.readdirSync(tsLogDir)
					.filter((name) => name.startsWith('tsserver-log-'))
					.sort()
					.reverse();

				for (const serverLog of serverLogs) {
					const traceDir = path.join(tsLogDir, serverLog);
					const traceFiles = fs.readdirSync(traceDir).filter((name) => name.startsWith('trace.') && name.endsWith('.json'));

					if (traceFiles.length > 0) {
						// Return the first one found in the newest session
						return path.join(traceDir, traceFiles[0]);
					}
				}
			}
		}
	}
	return null;
}

async function main() {
	let logFilePath = process.argv[2];

	if (!logFilePath) {
		console.log('No trace file provided. Attempting to find the latest VS Code TSServer trace...');
		const latestTrace = findLatestTraceFile();
		if (latestTrace) {
			logFilePath = latestTrace;
			console.log(`Found latest trace file: ${logFilePath}`);
		}
	}

	if (!logFilePath || !fs.existsSync(logFilePath)) {
		console.error('Please provide a valid path to trace.json');
		console.error('Usage: npx ts-node packages/tsserver-analyzer/src/index.ts <path-to-trace>');
		process.exit(1);
	}

	console.log(`Analyzing trace ${logFilePath}...`);

	const mappedPaths = loadTsConfigPaths();
	console.log(`Loaded ${mappedPaths.length} path mappings from tsconfig.base.json`);

	const fileStream = fs.createReadStream(logFilePath);
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	const analyzer = new Analyzer(mappedPaths);

	for await (const line of rl) {
		const event = parseTraceLine(line);
		if (event) {
			analyzer.processEvent(event);
		}
	}

	printReport(analyzer);
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

function printReport(analyzer: Analyzer) {
	console.log('=== TSServer Trace Analysis Report ===');

	console.log('--- Top 10 Slowest Operations (>500ms) ---');
	analyzer.slowOps
		.sort((a: any, b: any) => b.durationMs - a.durationMs)
		.slice(0, 10)
		.forEach((op: any) => {
			const resource = op.resource ? ` (${op.resource})` : '';
			console.log(`[${(op.timestamp / 1000000).toFixed(2)}s] ${op.name}${resource}: ${op.durationMs.toFixed(2)}ms`);
			if (op.args) console.log(`    Args: ${JSON.stringify(op.args).slice(0, 100)}...`);
		});

	console.log('--- Command Statistics (Request/Response) ---');
	printStatsTable(analyzer.commandStats);

	console.log('--- Internal Compiler Performance ---');
	printStatsTable(analyzer.internalStats);
}

function printStatsTable(statsMap: Map<string, any>) {
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

main().catch(console.error);
