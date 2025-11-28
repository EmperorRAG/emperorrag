
'use client';

import * as Collapsible from '@radix-ui/react-collapsible';
import styles from './JsonViewer.module.css';
import { Button } from '../Button';
import { useState } from 'react';

export interface JsonViewerProps {
  data: any;
}

export function JsonViewer({ data }: JsonViewerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className={styles.root}>
      <div className={styles.header}>
        <Collapsible.Trigger asChild>
          <Button variant="secondary">
            {open ? 'Hide Raw JSON' : 'Show Raw JSON'}
          </Button>
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content className={styles.content}>
        <pre className={styles.pre}>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export default JsonViewer;
