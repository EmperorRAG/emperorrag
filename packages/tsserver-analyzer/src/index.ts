import * as fs from 'fs';
import * as readline from 'readline';
import { parseTraceLine } from './lib/parser.js';
import { Analyzer } from './lib/analyzer.js';

async function main() {
	const logFilePath = process.argv[2];
	if (!logFilePath || !fs.existsSync(logFilePath)) {
		console.error('Please provide a valid path to trace.json');
		console.error('Usage: npx ts-node packages/tsserver-analyzer/src/index.ts <path-to-trace>');
		process.exit(1);
	}

	console.log(`Analyzing trace ${logFilePath}...`);

	const fileStream = fs.createReadStream(logFilePath);
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	const analyzer = new Analyzer();

	for await (const line of rl) {
		const event = parseTraceLine(line);
		if (event) {
			analyzer.processEvent(event);
		}
	}

	printReport(analyzer);
}

function printReport(analyzer: Analyzer) {
	console.log('=== TSServer Trace Analysis Report ===');

	console.log('--- Top 10 Slowest Operations (>500ms) ---');
	analyzer.slowOps
		.sort((a: any, b: any) => b.durationMs - a.durationMs)
		.slice(0, 10)
		.forEach((op: any) => {
			const desc = op.description ? ` (${op.description})` : '';
			console.log(`[${(op.timestamp / 1000000).toFixed(2)}s] ${op.name}${desc}: ${op.durationMs.toFixed(2)}ms`);
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
			Description: stat.description || '',
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
