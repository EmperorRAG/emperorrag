
import styles from './datagrid.module.css';
import { deriveColumns, projectRows } from './datagrid.helpers';
import type { DatagridProps } from './datagrid.types';

/**
 * TODO: Replace placeholder implementation with full datagrid orchestration.
 */
export const Datagrid = (props: DatagridProps) => {
  // TODO: Move memoization into `useMemo` once logic is implemented to avoid expensive recompute.
  const columns = deriveColumns({
    initialColumns: props.columns,
    records: props.data,
  });

  const rows = projectRows({
    columns,
    records: props.data,
    rowId: props.rowId,
  });

  const hasColumns = columns.length > 0;
  const hasRows = rows.length > 0;

  // TODO: Replace placeholder branching with declarative Match once states are implemented.
  return (
    <div className={styles['container']}>
      {/* TODO: Render loading indicator when `props.isLoading` is true. */}
      {/* TODO: Render error state leveraging `props.errorState` or fallback copy. */}
      {/* TODO: Render empty state when no rows are available and not loading. */}
      <table className={styles['table']}>
        {/* TODO: Surface `props.caption` inside a <caption> when provided. */}
        <thead>
          <tr>
            {/* TODO: Map `columns` to <th> elements with stable keys and alignment classes. */}
            {hasColumns ? null : null}
          </tr>
        </thead>
        <tbody>
          {/* TODO: Map `rows` to <tr> elements and render cells using semantic <td>. */}
          {/* TODO: Include aria attributes to describe row/column relationships for accessibility. */}
          {hasRows ? null : null}
        </tbody>
      </table>
    </div>
  );
};

export default Datagrid;
