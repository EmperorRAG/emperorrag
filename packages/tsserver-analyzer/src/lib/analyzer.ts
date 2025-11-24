import { TraceEvent, PerformanceStat, SlowOperation } from './types.js';

export class Analyzer {
	// Map request seq -> start timestamp (micros)
	private pendingRequests = new Map<number, number>();
	private lastChatBlockTimestamp = 0;
	private pathMappedFiles = new Set<string>();
	private inferredProjectFiles = new Map<string, string[]>();
	private recentFindSourceFiles: { ts: number; file: string }[] = [];

	constructor(pathMappedFiles: string[] = []) {
		// Normalize paths to lowercase for case-insensitive comparison on Windows
		this.pathMappedFiles = new Set(pathMappedFiles.map((p) => p.toLowerCase().replace(/\\/g, '/')));
	}

	public commandStats = new Map<string, PerformanceStat>();
	public internalStats = new Map<string, PerformanceStat>();
	public slowOps: SlowOperation[] = [];

	processEvent(event: TraceEvent) {
		// Track chat block activity
		if (this.isChatBlock(event.args)) {
			this.lastChatBlockTimestamp = event.ts;
		}

		// Track files in inferred projects
		if (event.name === 'projectInfo' && event.args?.projectName?.includes('inferredProject')) {
			if (event.args.fileNames && Array.isArray(event.args.fileNames)) {
				this.inferredProjectFiles.set(event.args.projectName, event.args.fileNames);
			}
		}

		// 1. Handle Request/Response Pairs (Latency)
		if (event.name === 'request' && event.args?.seq !== undefined) {
			this.pendingRequests.set(event.args.seq, event.ts);
		} else if (event.name === 'response' && event.args?.seq !== undefined) {
			// Note: response args usually have 'seq' (its own) and 'request_seq' (the match)
			// But in some traces, the 'seq' in args IS the request seq.
			// We check 'request_seq' first, then fallback to 'seq' if it matches a pending request.
			const reqSeq = event.args.request_seq ?? event.args.seq;

			if (this.pendingRequests.has(reqSeq)) {
				const startTs = this.pendingRequests.get(reqSeq)!;
				const durationMicros = event.ts - startTs;
				const command = event.args.command || 'unknown';
				const resource = this.getResource(event.args);
				const key = resource ? `${command} (${resource})` : command;

				this.recordStat(this.commandStats, key, command, resource, durationMicros);

				if (durationMicros > 500000) {
					// > 500ms
					this.slowOps.push({
						name: `Command: ${command}`,
						resource: this.getResource(event.args),
						durationMs: durationMicros / 1000,
						timestamp: event.ts,
						args: event.args,
					});
				}
				this.pendingRequests.delete(reqSeq);
			}
		}

		// 2. Handle Internal Trace Events (ph: 'X' has duration)
		if (event.ph === 'X' && event.dur !== undefined) {
			let resource = this.getResource(event.args);

			// Special handling for updateGraph on Inferred Projects triggered by Chat
			if (event.name === 'updateGraph' && resource?.includes('inferredProject')) {
				if (this.lastChatBlockTimestamp >= event.ts && this.lastChatBlockTimestamp <= event.ts + event.dur) {
					resource += ' (Triggered by Chat Code Block)';
				} else {
					// Try to find what files are in this inferred project
					// Strategy 1: Check projectInfo (if available)
					const files = this.inferredProjectFiles.get(resource);
					if (files && files.length > 0) {
						const firstFile = files[0];
						const fileName = firstFile.split('/').pop() || firstFile;
						resource += ` (Contains: ${fileName}${files.length > 1 ? ' + ' + (files.length - 1) + ' more' : ''})`;
					} else {
						// Strategy 2: Check recent findSourceFile events within this updateGraph window
						const duration = event.dur || 0;
						const containedFiles = this.recentFindSourceFiles.filter((f) => f.ts >= event.ts && f.ts <= event.ts + duration).map((f) => f.file);

						if (containedFiles.length > 0) {
							// Deduplicate
							const uniqueFiles = Array.from(new Set(containedFiles));
							const firstFile = uniqueFiles[0];
							const fileName = firstFile.split('/').pop() || firstFile;
							resource += ` (Contains: ${fileName}${uniqueFiles.length > 1 ? ' + ' + (uniqueFiles.length - 1) + ' more' : ''})`;
						}
					}
				}
			}

			// Check if this file is a path-mapped file from tsconfig
			if (event.name === 'findSourceFile' && resource) {
				if (this.isPathMapped(resource)) {
					resource += ' (Triggered by tsconfig paths)';
				}
				// Track for inferred project correlation
				this.recentFindSourceFiles.push({ ts: event.ts, file: resource });
				// Prune old events (older than 10 seconds to keep memory low, assuming updateGraph isn't longer than that)
				const pruneThreshold = event.ts - 10000000;
				if (this.recentFindSourceFiles.length > 0 && this.recentFindSourceFiles[0].ts < pruneThreshold) {
					this.recentFindSourceFiles = this.recentFindSourceFiles.filter((f) => f.ts >= pruneThreshold);
				}
			}

			const key = resource ? `${event.name} (${resource})` : event.name;

			this.recordStat(this.internalStats, key, event.name, resource, event.dur);

			if (event.dur > 500000) {
				// > 500ms
				this.slowOps.push({
					name: `Internal: ${event.name}`,
					resource: resource,
					durationMs: event.dur / 1000,
					timestamp: event.ts,
					args: event.args,
				});
			}
		}
	}

	private isChatBlock(args: any): boolean {
		if (!args) return false;
		const candidates = [args.name, args.file, args.fileName, args.path, args.projectName];
		for (const c of candidates) {
			if (typeof c === 'string' && c.includes('vscode-chat-code-block')) return true;
		}
		return false;
	}

	private getResource(args: any): string | undefined {
		if (this.isChatBlock(args)) return '[VS Code Chat Code Block]';

		if (!args) return undefined;
		if (typeof args.name === 'string') return args.name;
		if (typeof args.file === 'string') return args.file;
		if (typeof args.fileName === 'string') return args.fileName;
		if (typeof args.path === 'string') return args.path;
		if (typeof args.projectName === 'string') return args.projectName;
		return undefined;
	}

	private recordStat(map: Map<string, PerformanceStat>, key: string, name: string, resource: string | undefined, durationMicros: number) {
		const stat = map.get(key) || { name, resource, count: 0, totalDurationMicros: 0, maxDurationMicros: 0 };
		stat.count++;
		stat.totalDurationMicros += durationMicros;
		stat.maxDurationMicros = Math.max(stat.maxDurationMicros, durationMicros);
		map.set(key, stat);
	}

	private isPathMapped(filePath: string): boolean {
		// Normalize slashes for comparison
		const normalizedPath = filePath.replace(/\\/g, '/');
		for (const mappedPath of this.pathMappedFiles) {
			if (normalizedPath.includes(mappedPath)) {
				return true;
			}
		}
		return false;
	}
}
