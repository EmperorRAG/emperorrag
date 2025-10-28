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

// TODO: Add integration story that exercises automatic column inference end-to-end.
// TODO: Provide scenario verifying consumer-specified column ordering renders correctly.
// TODO: Include empty state showcase with `emptyState` content to validate visual fallback wiring.
export const Heading = {
  args: {
  },
  play: async ({ canvas }) => {
    // TODO: Expand interaction test to validate header cells and row rendering per args scenario.
    await expect(canvas.getByText(/Datagrid/gi)).toBeTruthy();
  },
} satisfies Story;
