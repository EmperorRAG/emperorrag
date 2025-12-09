
'use client';

import { Button } from '../Button';
import styles from './RunAnalyzerForm.module.css';

export interface RunAnalyzerFormProps {
  onRun: () => void;
  isRunning: boolean;
}

export function RunAnalyzerForm({ onRun, isRunning }: RunAnalyzerFormProps) {
  return (
    <div className={styles.container}>
      <Button onClick={onRun} disabled={isRunning}>
        {isRunning ? 'Running...' : 'Run Analyzer'}
      </Button>
    </div>
  );
}

export default RunAnalyzerForm;
