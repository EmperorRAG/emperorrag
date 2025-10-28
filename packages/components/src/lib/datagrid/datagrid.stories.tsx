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

type CustomerRecord = {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly active: boolean;
};

const customerDataset: ReadonlyArray<CustomerRecord> = [
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
const customerRowsArgs = customerDataset as ReadonlyArray<Record<string, unknown>>;

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
const orderedColumnsArgs = orderedColumns as unknown as ReadonlyArray<DatagridColumn>;

export const Primary = {
  args: {
    caption: 'Customer Directory',
    data: customerRowsArgs,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = await canvas.findByRole('table', { name: 'Customer Directory' });
    expect(table).toBeTruthy();

    const dataRows = canvas.getAllByRole('row').slice(1);
    expect(dataRows.length).toBe(customerDataset.length);
    customerDataset.forEach((record) => {
      expect(canvas.getByRole('cell', { name: record.email })).toBeTruthy();
      expect(canvas.getByRole('cell', { name: record.firstName })).toBeTruthy();
      expect(canvas.getByRole('cell', { name: record.lastName })).toBeTruthy();
    });
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
    expect(headers.length).toBe(7);
    const headerTexts = headers.map(
      (header) => (header as { textContent: string | null }).textContent ?? ''
    );
    expect(headerTexts).toEqual([
      'Full Name',
      'Email Address',
      'Status',
      'id',
      'firstName',
      'lastName',
      'active'
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = await canvas.findByRole('status', {
      name: 'No customers available',
    });
    expect(status).toBeTruthy();
  },
} satisfies Story;
