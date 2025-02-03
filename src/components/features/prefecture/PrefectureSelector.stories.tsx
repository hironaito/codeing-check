import { useState } from 'react';
import type { Meta } from '@storybook/react';
import { PrefectureSelector } from './PrefectureSelector';

const meta = {
  title: 'Features/Prefecture/PrefectureSelector',
  component: PrefectureSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PrefectureSelector>;

export default meta;

// インタラクティブな動作確認用（デフォルト）
const PrefectureSelectorStory = () => {
  const [isSelected, setIsSelected] = useState(false);
  
  return (
    <PrefectureSelector
      prefecture={{
        prefCode: 47,
        prefName: '沖縄県',
      }}
      isSelected={isSelected}
      onChange={(prefCode, checked) => {
        setIsSelected(checked);
        console.log(`Prefecture ${prefCode} ${checked ? 'selected' : 'unselected'}`);
      }}
    />
  );
};

export const Default = {
  render: () => <PrefectureSelectorStory />
};

// 選択済み状態からスタートするストーリー
const SelectedPrefectureStory = () => {
  const [isSelected, setIsSelected] = useState(true);
  
  return (
    <PrefectureSelector
      prefecture={{
        prefCode: 13,
        prefName: '東京都',
      }}
      isSelected={isSelected}
      onChange={(prefCode, checked) => {
        setIsSelected(checked);
        console.log(`Prefecture ${prefCode} ${checked ? 'selected' : 'unselected'}`);
      }}
    />
  );
};

export const Selected = {
  render: () => <SelectedPrefectureStory />
};
