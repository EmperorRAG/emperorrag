
'use client';

import * as Collapsible from '@radix-ui/react-collapsible';
import styles from './ErrorBanner.module.css';
import { useState } from 'react';

export interface ErrorBannerProps {
  message: string;
  rawOutput?: string;
}

export function ErrorBanner({ message, rawOutput }: ErrorBannerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.message}>{message}</div>
      {rawOutput && (
        <Collapsible.Root open={open} onOpenChange={setOpen}>
          <Collapsible.Trigger className={styles.trigger}>
            {open ? 'Hide Details' : 'Show Details'}
          </Collapsible.Trigger>
          <Collapsible.Content className={styles.content}>
            <pre className={styles.pre}>{rawOutput}</pre>
          </Collapsible.Content>
        </Collapsible.Root>
      )}
    </div>
  );
}

export default ErrorBanner;
