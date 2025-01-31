import type { Meta, StoryObj } from '@storybook/react';
import { ChartSkeleton } from './ChartSkeleton';

const meta = {
  title: 'Features/Chart/ChartSkeleton',
  component: ChartSkeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChartSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  render: () => (
    <div className="w-[800px]">
      <ChartSkeleton />
    </div>
  ),
};

export const Loading = {
  render: () => (
    <div className="w-[800px]">
      <ChartSkeleton variant="loading" />
    </div>
  ),
};

export const Empty = {
  render: () => (
    <div className="w-[800px]">
      <ChartSkeleton variant="empty" />
    </div>
  ),
};

export const MultipleLines = {
  render: () => (
    <div className="w-[800px]">
      <ChartSkeleton lineCount={3} />
    </div>
  ),
};

export const EmptyMultipleLines = {
  render: () => (
    <div className="w-[800px]">
      <ChartSkeleton variant="empty" lineCount={3} />
    </div>
  ),
}; 