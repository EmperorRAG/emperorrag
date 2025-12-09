
'use client';

import { useAnalyzer } from '../../hooks/useAnalyzer';
import { Header } from '../Header';
import { RunAnalyzerForm } from '../RunAnalyzerForm';
import { ResultsTable } from '../ResultsTable';
import { ErrorBanner } from '../ErrorBanner';
import { JsonViewer } from '../JsonViewer';
import styles from './AnalyzerFeature.module.css';

export function AnalyzerFeature() {
  const { status, result, error, rawError, runAnalysis } = useAnalyzer();

  return (
    <main className={styles.main}>
      <Header />
      <RunAnalyzerForm onRun={runAnalysis} isRunning={status === 'loading'} />

      {status === 'error' && error && (
        <div className={styles.content}>
            <ErrorBanner message={error} rawOutput={rawError || undefined} />
        </div>
      )}

      {status === 'success' && result && (
        <div className={styles.content}>
          {result.tables && Object.entries(result.tables).map(([tableName, tableData]) => (
            <div key={tableName} className={styles.section}>
              <h2 className={styles.subtitle}>{tableName}</h2>
              <ResultsTable data={tableData} />
            </div>
          ))}

          {result.raw && (
             <div className={styles.section}>
                <JsonViewer data={result.raw} />
             </div>
          )}
        </div>
      )}
    </main>
  );
}

export default AnalyzerFeature;
