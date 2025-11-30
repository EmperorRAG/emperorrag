import * as Config from './config/config.service.js';
import * as Discovery from './core/discovery/log-finder.service.js';
import * as Reporting from './core/reporting/console-reporter.js';
import * as Runner from './core/runner/analysis-runner.js';

export const TSServerAnalyzerService = {
	...Config,
	...Discovery,
	...Reporting,
	...Runner,
};
