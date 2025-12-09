import { TraceEvent } from '../../parser/trace-parser.types.js';
import type { AnalyzerState } from '../trace-analyzer.types.js';
import { isPathMapped } from '../trace-analyzer.utils.js';

/**
 * Enriches the resource string with context from chat blocks.
 */
export const enrichWithChatContext =
	(event: TraceEvent) =>
	(state: AnalyzerState) =>
	(resource: string): string =>
		state.lastChatBlockTimestamp >= event.ts && state.lastChatBlockTimestamp <= event.ts + (event.dur || 0)
			? resource + ' (Triggered by Chat Code Block)'
			: resource;

/**
 * Enriches the resource string with context from inferred project files.
 */
export const enrichWithInferredFiles =
	(state: AnalyzerState) =>
	(resource: string): string =>
		((files) =>
			files && files.length > 0
				? resource + ` (Contains: ${files[0].split('/').pop() || files[0]}${files.length > 1 ? ' + ' + (files.length - 1) + ' more' : ''})`
				: resource)(state.inferredProjectFiles.get(resource));

/**
 * Enriches the resource string with context from recent findSourceFile events.
 */
export const enrichWithRecentFiles =
	(event: TraceEvent) =>
	(state: AnalyzerState) =>
	(resource: string): string =>
		state.inferredProjectFiles.has(resource)
			? resource
			: ((containedFiles) =>
					containedFiles.length === 0
						? resource
						: ((uniqueFiles) =>
								resource +
								` (Contains: ${uniqueFiles[0].split('/').pop() || uniqueFiles[0]}${uniqueFiles.length > 1 ? ' + ' + (uniqueFiles.length - 1) + ' more' : ''})`)(
								Array.from(new Set(containedFiles))
							))(state.recentFindSourceFiles.filter((f) => f.ts >= event.ts && f.ts <= event.ts + (event.dur || 0)).map((f) => f.file));

/**
 * Enriches the resource string with context from path mappings.
 */
export const enrichWithPathMapping =
	(event: TraceEvent) =>
	(state: AnalyzerState) =>
	(resource: string): string =>
		event.name === 'findSourceFile' && isPathMapped(state.pathMappedFiles)(resource) ? resource + ' (Triggered by tsconfig paths)' : resource;

/**
 * Applies all enrichment logic to the resource string.
 */
export const enrichResource =
	(event: TraceEvent) =>
	(state: AnalyzerState) =>
	(resource: string): string =>
		event.name === 'updateGraph' && resource?.includes('inferredProject')
			? ((chatEnriched) =>
					chatEnriched !== resource
						? chatEnriched
						: ((inferredEnriched) => (inferredEnriched !== resource ? inferredEnriched : enrichWithRecentFiles(event)(state)(resource)))(
								enrichWithInferredFiles(state)(resource)
							))(enrichWithChatContext(event)(state)(resource))
			: enrichWithPathMapping(event)(state)(resource);
