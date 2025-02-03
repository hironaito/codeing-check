import type { Meta } from '@storybook/react';
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

// サンプルデータ
const sampleData = [
  { year: 1980, value1: 100, value2: 50, value3: 75 },
  { year: 1990, value1: 120, value2: 60, value3: 85 },
  { year: 2000, value1: 150, value2: 75, value3: 95 },
  { year: 2010, value1: 180, value2: 90, value3: 105 },
  { year: 2020, value1: 200, value2: 100, value3: 115 },
];

export const Default = {
  render: () => (
    <div className="w-[800px]">
      <ChartSkeleton
        variant="empty"
        data={sampleData}
        lineCount={1}
      />
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
      <ChartSkeleton
        variant="empty"
        data={sampleData}
        lineCount={3}
      />
    </div>
  ),
};

export const LoadingMultipleLines = {
  render: () => (
    <div className="w-[800px]">
      <ChartSkeleton
        variant="loading"
        lineCount={3}
      />
    </div>
  ),
};
