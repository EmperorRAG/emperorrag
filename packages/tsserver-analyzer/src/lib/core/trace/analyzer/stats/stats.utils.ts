import type { PerformanceStat } from '../trace-analyzer.types.js';

/**
 * Helper function to record performance statistics into a map.
 * Updates count, total duration, and max duration for a given operation key.
 */
export const recordStat =
	(key: string) =>
	(name: string) =>
	(resource: string | undefined) =>
	(durationMicros: number) =>
	(map: Map<string, PerformanceStat>): Map<string, PerformanceStat> =>
		((stat) =>
			new Map(map).set(key, {
				...stat,
				count: stat.count + 1,
				totalDurationMicros: stat.totalDurationMicros + durationMicros,
				maxDurationMicros: Math.max(stat.maxDurationMicros, durationMicros),
			}))(map.get(key) || { name, resource, count: 0, totalDurationMicros: 0, maxDurationMicros: 0 });
