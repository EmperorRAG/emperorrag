import * as Config from './config/config.service.js';
import * as Discovery from './discovery/log-finder.service.js';
import * as Reporting from './reporting/console-reporter.js';
import * as Runner from './runner/analysis-runner.js';

export const TSServerAnalyzerService = {
	...Config,
	...Discovery,
	...Reporting,
	...Runner,
};
