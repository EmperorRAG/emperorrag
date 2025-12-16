import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import type {
  PerformanceStat,
  SlowOperation,
} from "../trace/analyzer/trace-analyzer.types.js";

const OPERATION_DESCRIPTIONS: Record<string, string> = {
  updateGraph: "Re-calculates the project structure and dependencies.",
  findSourceFile: "Locates a source file on disk.",
  finishCachingPerDirectoryResolution:
    "Caches module resolutions for a directory.",
  processRootFiles: "Processes the root files of the project.",
  resolveModuleNamesWorker: "Resolves module imports.",
  processTypeReferenceDirective:
    'Handles /// <reference types="..." /> directives.',
  updateOpen: "Updates the state of an open file.",
  configure: "Sets up the server configuration.",
  definitionAndBoundSpan: "Finds definition and its span.",
  getApplicableRefactors: "Computes code refactorings.",
  projectInfo: "Retrieves project information.",
  documentHighlights: "Highlights references in the document.",
  provideInlayHints: "Computes inlay hints.",
  configurePlugin: "Configures a TS server plugin.",
  compilerOptionsForInferredProjects: "Sets options for inferred projects.",
  getOutliningSpans: "Computes folding ranges.",
  linkedEditingRange: "Computes linked editing ranges.",
  navtree: "Computes the navigation tree.",
  resolveLibrary: "Resolves a library file.",
  getUnresolvedImports: "Finds imports that could not be resolved.",
  checkExpression: "Type checks an expression.",
  parseJsonSourceFileConfigFileContent: "Parses tsconfig.json.",
  loadConfiguredProject: "Loads a configured project.",
  resolveTypeReferenceDirectiveNamesWorker:
    "Resolves type reference directives.",
  getPackageJsonAutoImportProvider:
    "Gets auto-import provider from package.json.",
  tryReuseStructureFromOldProgram: "Attempts to reuse old program structure.",
};

function printStatsTable(statsMap: Map<string, PerformanceStat>) {
  const tableData = Array.from(statsMap.values())
    .map((stat) => ({
      Name: stat.name,
      "File Path": stat.resource || "",
      Description: OPERATION_DESCRIPTIONS[stat.name] || "",
      Count: stat.count,
      "Avg (ms)": (stat.totalDurationMicros / stat.count / 1000).toFixed(2),
      "Max (ms)": (stat.maxDurationMicros / 1000).toFixed(2),
      "Total (ms)": (stat.totalDurationMicros / 1000).toFixed(2),
    }))
    .sort((a, b) => parseFloat(b["Total (ms)"]) - parseFloat(a["Total (ms)"])) // Sort by total time impact
    .slice(0, 50); // Limit to top 50 to prevent console flooding

  console.table(tableData);
}

export const printReport = (stats: {
  commandStats: Map<string, PerformanceStat>;
  internalStats: Map<string, PerformanceStat>;
  slowOps: SlowOperation[];
}) =>
  Effect.gen(function* (_) {
    yield* _(Console.log("=== TSServer Trace Analysis Report ==="));

    yield* _(Console.log("--- Top 10 Slowest Operations (>500ms) ---"));
    stats.slowOps
      .sort((a, b) => b.durationMs - a.durationMs)
      .slice(0, 10)
      .forEach((op) => {
        const resource = op.resource ? ` (${op.resource})` : "";
        console.log(
          `[${(op.timestamp / 1000000).toFixed(2)}s] ${op.name}${resource}: ${op.durationMs.toFixed(2)}ms`,
        );
        if (op.args)
          console.log(`    Args: ${JSON.stringify(op.args).slice(0, 100)}...`);
      });

    yield* _(Console.log("--- Command Statistics (Request/Response) ---"));
    printStatsTable(stats.commandStats);

    yield* _(Console.log("--- Internal Compiler Performance ---"));
    printStatsTable(stats.internalStats);
  });
