import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as Effect from 'effect/Effect';
import * as Console from 'effect/Console';

export const findSessionTraceFiles = Effect.gen(function* (_) {
	let logsDir = '';
	if (process.platform === 'win32') {
		logsDir = path.join(process.env.APPDATA || '', 'Code', 'logs');
	} else if (process.platform === 'darwin') {
		logsDir = path.join(os.homedir(), 'Library', 'Application Support', 'Code', 'logs');
	} else {
		logsDir = path.join(os.homedir(), '.config', 'Code', 'logs');
	}

	if (!fs.existsSync(logsDir)) {
		yield* _(Console.log(`Logs directory not found: ${logsDir}`));
		return [];
	}

	// Get all session directories (YYYYMMDDTHHMMSS)
	const sessions = fs
		.readdirSync(logsDir)
		.filter((name) => /^\d{8}T\d{6}$/.test(name))
		.sort()
		.reverse(); // Newest first

	if (sessions.length === 0) {
		yield* _(Console.log(`No session directories found in ${logsDir}`));
		return [];
	}

	// Iterate through sessions until we find one with trace files
	for (const session of sessions) {
		const sessionDir = path.join(logsDir, session);
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
			yield* _(Console.log(`Found ${traceFiles.length} trace files in session ${session}`));
			return traceFiles;
		}
	}

	return [];
});
