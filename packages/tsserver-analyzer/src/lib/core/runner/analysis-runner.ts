import * as fs from 'fs';
import * as readline from 'readline';
import * as Effect from 'effect/Effect';
import * as Console from 'effect/Console';
import * as Option from 'effect/Option';
import { TraceAnalyzer } from '../../tsserver-analyzer.js';
import { parseTraceLine } from '../trace/parser/trace-parser.service.js';

export const runAnalysis = (logFilePaths: string[]) =>
	Effect.gen(function* (_) {
		const analyzer = yield* _(TraceAnalyzer);

		for (const logFilePath of logFilePaths) {
			if (!fs.existsSync(logFilePath)) {
				yield* _(Console.warn(`Skipping missing file: ${logFilePath}`));
				continue;
			}

			yield* _(Console.log(`Analyzing ${logFilePath}...`));
			yield* _(analyzer.reset);

			const fileStream = fs.createReadStream(logFilePath);
			const rl = readline.createInterface({
				input: fileStream,
				crlfDelay: Infinity,
			});

			yield* _(
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

		return yield* _(analyzer.getStats);
	});
