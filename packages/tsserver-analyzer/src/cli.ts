import * as Effect from 'effect/Effect';
import * as Console from 'effect/Console';
import * as Layer from 'effect/Layer';
import { TraceAnalyzer, make } from './lib/tsserver-analyzer.js';
import { TSServerAnalyzerService } from './lib/tsserver-analyzer.module.js';

const program = Effect.gen(function* (_) {
	let logFilePaths: string[] = [];

	if (process.argv[2]) {
		logFilePaths = [process.argv[2]];
	} else {
		yield* _(Console.log('No trace file provided. Attempting to find all trace files from the latest VS Code session...'));
		logFilePaths = yield* _(TSServerAnalyzerService.findSessionTraceFiles);
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

	const mappedPaths = yield* _(TSServerAnalyzerService.loadTsConfigPaths);
	yield* _(Console.log(`Loaded ${mappedPaths.length} path mappings from tsconfig.base.json`));

	const analyzerLayer = Layer.effect(TraceAnalyzer, make(mappedPaths));

	yield* _(
		Effect.gen(function* (__) {
			const stats = yield* __(TSServerAnalyzerService.runAnalysis(logFilePaths));
			yield* __(TSServerAnalyzerService.printReport(stats));
		}).pipe(Effect.provide(analyzerLayer))
	);
});

Effect.runPromise(program).catch(console.error);
