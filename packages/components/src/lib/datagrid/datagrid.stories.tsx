import type { Meta, StoryObj } from '@storybook/react-vite';
import { Datagrid } from './datagrid';
import type { DatagridColumn } from './datagrid.types';
import { expect, within } from 'storybook/test';

const meta = {
  component: Datagrid,
  title: 'Datagrid',
} satisfies Meta<typeof Datagrid>;
export default meta;

type Story = StoryObj<typeof Datagrid>;

type CustomerRecord = Readonly<{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
}>;

const customerRows: ReadonlyArray<CustomerRecord> = [
  {
    id: 'cust-001',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    active: true,
  },
  {
    id: 'cust-002',
    firstName: 'Grace',
    lastName: 'Hopper',
    email: 'grace@example.com',
    active: true,
  },
];

const orderedColumns: ReadonlyArray<DatagridColumn<CustomerRecord>> = [
  {
    id: 'full-name',
    header: 'Full Name',
    accessor: (row) => `${row.firstName} ${row.lastName}`,
  },
  {
    id: 'email',
    header: 'Email Address',
    accessor: (row) => row.email,
  },
  {
    id: 'status',
    header: 'Status',
    accessor: (row) => (row.active ? 'Active' : 'Inactive'),
  },
];

const customerRowsArgs = customerRows as unknown as ReadonlyArray<Record<string, unknown>>;
const orderedColumnsArgs = orderedColumns as unknown as ReadonlyArray<DatagridColumn>;

export const Primary = {
  args: {
    caption: 'Customer Directory',
    data: customerRowsArgs,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const headers = await canvas.findAllByRole('columnheader');

    expect(headers.length).toBe(5);
    const headerTexts = headers.map(
    (header) => (header as { textContent: string | null }).textContent ?? ''
  );
    expect(headerTexts).toEqual([
    'id',
    'firstName',
    'lastName',
    'email',
    'active',
  ]);

    const dataRows = canvas.getAllByRole('row').slice(1);
    expect(dataRows.length).toBe(customerRows.length);
    expect(canvas.getByRole('cell', { name: customerRows[0].email })).toBeTruthy();
    expect(canvas.getByRole('cell', { name: 'True' })).toBeTruthy();
  },
} satisfies Story;

export const CustomColumnOrder = {
  args: {
    caption: 'Custom Column Order',
    data: customerRowsArgs,
    columns: orderedColumnsArgs,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const headers = canvas.getAllByRole('columnheader');
    expect(headers.length).toBe(3);
    const headerTexts = headers.map(
      (header) => (header as { textContent: string | null }).textContent ?? ''
    );
    expect(headerTexts).toEqual([
      'Full Name',
      'Email Address',
      'Status',
    ]);
  },
} satisfies Story;

export const EmptyState = {
  args: {
    caption: 'Empty Customers',
    data: [],
    emptyState: <div role="status">No customers available</div>,
    columns: orderedColumnsArgs,
  },
} satisfies Story;
