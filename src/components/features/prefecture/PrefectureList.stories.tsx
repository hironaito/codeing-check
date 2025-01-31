import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PrefectureList } from './PrefectureList';

const meta = {
  title: 'Features/Prefecture/PrefectureList',
  component: PrefectureList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PrefectureList>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPrefectures = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 2, prefName: '青森県' },
  { prefCode: 3, prefName: '岩手県' },
  { prefCode: 4, prefName: '宮城県' },
  { prefCode: 5, prefName: '秋田県' },
  { prefCode: 6, prefName: '山形県' },
  { prefCode: 7, prefName: '福島県' },
  { prefCode: 8, prefName: '茨城県' },
  { prefCode: 9, prefName: '栃木県' },
  { prefCode: 10, prefName: '群馬県' },
];

const PrefectureListStory = () => {
  const [selectedPrefCodes, setSelectedPrefCodes] = useState<number[]>([]);

  const handlePrefectureChange = (prefCode: number, checked: boolean) => {
    setSelectedPrefCodes((prev) =>
      checked
        ? [...prev, prefCode]
        : prev.filter((code) => code !== prefCode)
    );
    console.log(`Prefecture ${prefCode} ${checked ? 'selected' : 'unselected'}`);
  };

  return (
    <PrefectureList
      prefectures={mockPrefectures}
      selectedPrefCodes={selectedPrefCodes}
      onPrefectureChange={handlePrefectureChange}
    />
  );
};

export const Default = {
  render: () => <PrefectureListStory />
};

// 選択済み状態のストーリー
const SelectedPrefectureListStory = () => {
  const [selectedPrefCodes, setSelectedPrefCodes] = useState<number[]>([1, 2, 3]);

  const handlePrefectureChange = (prefCode: number, checked: boolean) => {
    setSelectedPrefCodes((prev) =>
      checked
        ? [...prev, prefCode]
        : prev.filter((code) => code !== prefCode)
    );
    console.log(`Prefecture ${prefCode} ${checked ? 'selected' : 'unselected'}`);
  };

  return (
    <PrefectureList
      prefectures={mockPrefectures}
      selectedPrefCodes={selectedPrefCodes}
      onPrefectureChange={handlePrefectureChange}
    />
  );
};

export const WithSelectedPrefectures = {
  render: () => <SelectedPrefectureListStory />
}; 