import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { AnalysisResult } from './types';

export async function runAnalyzerCli(): Promise<AnalysisResult> {
	return new Promise((resolve, reject) => {
		// We assume the command is run from the workspace root where 'packages' folder is located.
		// If running via 'nx serve', CWD is usually the workspace root.
		let analyzerScriptPath = path.join(process.cwd(), 'packages', 'tsserver-analyzer', 'dist', 'cli.js');

		if (!fs.existsSync(analyzerScriptPath)) {
			// If not found, try to resolve relative to the workspace root assuming we are in apps/ts-analyzer-next
			const workspaceRoot = path.resolve(process.cwd(), '..', '..');
			const altPath = path.join(workspaceRoot, 'packages', 'tsserver-analyzer', 'dist', 'cli.js');
			if (fs.existsSync(altPath)) {
				analyzerScriptPath = altPath;
			}
		}

		const child = spawn('node', [analyzerScriptPath, '--json'], {
			stdio: ['ignore', 'pipe', 'pipe'],
		});

		let stdout = '';
		let stderr = '';

		const timeout = setTimeout(() => {
			child.kill();
			reject(new Error('Analyzer process timed out after 30s'));
		}, 30000);

		child.stdout.on('data', (data) => {
			stdout += data.toString();
		});

		child.stderr.on('data', (data) => {
			stderr += data.toString();
		});

		child.on('close', (code) => {
			clearTimeout(timeout);
			if (code !== 0) {
				reject({
					message: `Analyzer process exited with code ${code}`,
					raw: stderr || stdout,
				});
				return;
			}

			try {
				const result = JSON.parse(stdout) as AnalysisResult;
				resolve(result);
			} catch (error) {
				reject({
					message: 'Failed to parse analyzer output as JSON',
					raw: stdout,
					error,
				});
			}
		});

		child.on('error', (error) => {
			clearTimeout(timeout);
			reject({
				message: 'Failed to spawn analyzer process',
				error,
			});
		});
	});
}
