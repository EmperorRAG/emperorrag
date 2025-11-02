import type { ReactNode } from 'react';

export interface ScaffoldingDatagridProps {
  readonly data: ReadonlyArray<unknown>;
  readonly columns?: ReadonlyArray<unknown>;
  readonly caption?: string;
  readonly isLoading?: boolean;
  readonly emptyState?: ReactNode;
  readonly errorState?: ReactNode;
}

// TODO(plan §4): Replace placeholder types with the concrete Datagrid exports once the shared package typing is consumed by this app.
declare module '@emperorrag/components' {
  export function Datagrid(props: ScaffoldingDatagridProps): JSX.Element;
}
