import type { Meta, StoryObj } from '@storybook/react-vite';
import { Datagrid  } from './datagrid';
import { expect } from 'storybook/test';

const meta = {
  component: Datagrid,
  title: 'Datagrid',
} satisfies Meta<typeof Datagrid>;
export default meta;

type Story = StoryObj<typeof Datagrid>;

export const Primary = {
  args: {
  },
} satisfies Story;

export const Heading = {
  args: {
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Datagrid/gi)).toBeTruthy();
  },
} satisfies Story;

