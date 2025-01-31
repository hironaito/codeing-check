import type { Meta, StoryObj } from '@storybook/react';
import { LineGraph } from './LineGraph';

const meta = {
  title: 'UI/LineGraph',
  component: LineGraph,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LineGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルデータ
const sampleData = [
  { year: 1980, value: 100, value2: 50 },
  { year: 1990, value: 120, value2: 60 },
  { year: 2000, value: 150, value2: 75 },
  { year: 2010, value: 180, value2: 90 },
  { year: 2020, value: 200, value2: 100 },
];

export const Default: Story = {
  args: {
    data: sampleData,
    lines: [
      {
        dataKey: 'value',
        name: '総人口',
      },
    ],
    xAxisLabel: '年度',
    yAxisLabel: '人口',
  },
};

export const MultipleLines: Story = {
  args: {
    data: sampleData,
    lines: [
      {
        dataKey: 'value',
        name: '総人口',
      },
      {
        dataKey: 'value2',
        name: '生産年齢人口',
        color: '#6366f1',
      },
    ],
    xAxisLabel: '年度',
    yAxisLabel: '人口',
  },
};

export const CustomHeight: Story = {
  args: {
    ...Default.args,
    height: 600,
  },
};

export const CustomTooltip: Story = {
  args: {
    ...Default.args,
    tooltipFormatter: (value) => `${value}万人`,
  },
}; 