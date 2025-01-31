'use client';

import { FC } from 'react';
import { PrefectureSelector } from './PrefectureSelector';

export interface Prefecture {
  prefCode: number;
  prefName: string;
}

interface PrefectureListProps {
  prefectures: Prefecture[];
  selectedPrefCodes: number[];
  onPrefectureChange: (prefCode: number, checked: boolean) => void;
}

export const PrefectureList: FC<PrefectureListProps> = ({
  prefectures,
  selectedPrefCodes,
  onPrefectureChange,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 p-4">
      {prefectures.map((prefecture) => (
        <PrefectureSelector
          key={prefecture.prefCode}
          prefecture={prefecture}
          isSelected={selectedPrefCodes.includes(prefecture.prefCode)}
          onChange={onPrefectureChange}
        />
      ))}
    </div>
  );
}; 