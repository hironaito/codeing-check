import type { Meta, StoryObj } from '@storybook/react';
import { PopulationChart } from './PopulationChart';

const meta = {
  title: 'Features/Chart/PopulationChart',
  component: PopulationChart,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '800px', height: '500px' }}>
        <Story />
      </div>
    ),
  ],
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
        {
          label: '年少人口',
          data: [
            { year: 1980, value: 1300000 },
            { year: 1990, value: 1100000 },
            { year: 2000, value: 900000 },
            { year: 2010, value: 700000 },
            { year: 2020, value: 500000 },
          ],
        },
        {
          label: '生産年齢人口',
          data: [
            { year: 1980, value: 3600000 },
            { year: 1990, value: 3800000 },
            { year: 2000, value: 3700000 },
            { year: 2010, value: 3500000 },
            { year: 2020, value: 3200000 },
          ],
        },
        {
          label: '老年人口',
          data: [
            { year: 1980, value: 600000 },
            { year: 1990, value: 800000 },
            { year: 2000, value: 1000000 },
            { year: 2010, value: 1200000 },
            { year: 2020, value: 1500000 },
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
        {
          label: '年少人口',
          data: [
            { year: 1980, value: 400000 },
            { year: 1990, value: 350000 },
            { year: 2000, value: 300000 },
            { year: 2010, value: 250000 },
            { year: 2020, value: 200000 },
          ],
        },
        {
          label: '生産年齢人口',
          data: [
            { year: 1980, value: 900000 },
            { year: 1990, value: 950000 },
            { year: 2000, value: 900000 },
            { year: 2010, value: 850000 },
            { year: 2020, value: 750000 },
          ],
        },
        {
          label: '老年人口',
          data: [
            { year: 1980, value: 200000 },
            { year: 1990, value: 300000 },
            { year: 2000, value: 350000 },
            { year: 2010, value: 350000 },
            { year: 2020, value: 350000 },
          ],
        },
      ],
    },
  },
];

// ストーリー
export const Default: Story = {
  args: {
    prefectures: samplePrefectures,
    populationData: samplePopulationData,
    selectedType: '総人口',
  },
};

export const YouthPopulation: Story = {
  args: {
    prefectures: samplePrefectures,
    populationData: samplePopulationData,
    selectedType: '年少人口',
  },
};

export const WorkingAgePopulation: Story = {
  args: {
    prefectures: samplePrefectures,
    populationData: samplePopulationData,
    selectedType: '生産年齢人口',
  },
};

export const ElderlyPopulation: Story = {
  args: {
    prefectures: samplePrefectures,
    populationData: samplePopulationData,
    selectedType: '老年人口',
  },
};

export const Empty: Story = {
  args: {
    prefectures: [],
    populationData: [],
    selectedType: '総人口',
  },
}; 