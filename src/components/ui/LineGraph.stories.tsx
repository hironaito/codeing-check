'use client';

import type { Meta, StoryObj } from '@storybook/react';
import { LineGraph } from './LineGraph';

const meta = {
  title: 'UI/LineGraph',
  component: LineGraph,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '800px', height: '400px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof LineGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルデータ
const sampleData = [
  { year: 1980, value: 100000, value2: 50000 },
  { year: 1990, value: 120000, value2: 60000 },
  { year: 2000, value: 150000, value2: 75000 },
  { year: 2010, value: 180000, value2: 90000 },
  { year: 2020, value: 200000, value2: 100000 },
];

// 基本的な使用例
export const Default: Story = {
  args: {
    data: sampleData,
    lines: [
      {
        dataKey: 'value',
        name: '総人口',
        color: '#0ea5e9',
      },
    ],
    xAxisLabel: '年度',
    yAxisLabel: '人口',
    height: 400,
  },
};

// 複数のラインを表示
export const MultipleLines: Story = {
  args: {
    data: sampleData,
    lines: [
      {
        dataKey: 'value',
        name: '総人口',
        color: '#0ea5e9',
      },
      {
        dataKey: 'value2',
        name: '生産年齢人口',
        color: '#6366f1',
      },
    ],
    xAxisLabel: '年度',
    yAxisLabel: '人口',
    height: 400,
  },
};

// カスタム高さ
export const CustomHeight: Story = {
  args: {
    ...Default.args,
    height: 600,
  },
};

// カスタムツールチップ
export const CustomTooltip: Story = {
  args: {
    ...Default.args,
    tooltipFormatter: (value) => `${(value / 10000).toFixed(1)}万人`,
  },
}; 