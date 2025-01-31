import type { Meta, StoryObj } from '@storybook/react';
import { PopulationChart } from './PopulationChart';

const meta = {
  title: 'Features/Chart/PopulationChart',
  component: PopulationChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PopulationChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルデータ
const samplePrefectures = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 2, prefName: '青森県' },
  { prefCode: 3, prefName: '岩手県' },
];

const samplePopulationData = [
  {
    prefCode: 1,
    data: {
      boundaryYear: 2020,
      data: [
        {
          label: '総人口',
          data: [
            { year: 1980, value: 5500000 },
            { year: 1990, value: 5700000 },
            { year: 2000, value: 5600000 },
            { year: 2010, value: 5400000 },
            { year: 2020, value: 5200000 },
          ],
        },
      ],
    },
  },
  {
    prefCode: 2,
    data: {
      boundaryYear: 2020,
      data: [
        {
          label: '総人口',
          data: [
            { year: 1980, value: 1500000 },
            { year: 1990, value: 1600000 },
            { year: 2000, value: 1550000 },
            { year: 2010, value: 1450000 },
            { year: 2020, value: 1300000 },
          ],
        },
      ],
    },
  },
];

export const Default: Story = {
  args: {
    prefectures: samplePrefectures,
    populationData: samplePopulationData,
  },
};

export const SinglePrefecture: Story = {
  args: {
    prefectures: [samplePrefectures[0]],
    populationData: [samplePopulationData[0]],
  },
};

export const CustomClassName: Story = {
  args: {
    ...Default.args,
    className: 'bg-gray-100 p-4 rounded-lg',
  },
}; 