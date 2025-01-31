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
  onSelectAll?: () => void;
  onUnselectAll?: () => void;
}

export const PrefectureList: FC<PrefectureListProps> = ({
  prefectures,
  selectedPrefCodes,
  onPrefectureChange,
  onSelectAll,
  onUnselectAll,
}) => {
  const selectedCount = selectedPrefCodes.length;
  const totalCount = prefectures.length;

  return (
    <div className="space-y-4">
      {/* 選択状態の表示と一括選択/解除ボタン */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          選択中: {selectedCount} / {totalCount}
        </div>
        <div className="space-x-2">
          <button
            onClick={onSelectAll}
            className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700"
            disabled={selectedCount === totalCount}
          >
            全て選択
          </button>
          <button
            onClick={onUnselectAll}
            className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700"
            disabled={selectedCount === 0}
          >
            選択解除
          </button>
        </div>
      </div>

      {/* 都道府県リスト */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {prefectures.map((prefecture) => (
          <PrefectureSelector
            key={prefecture.prefCode}
            prefecture={prefecture}
            isSelected={selectedPrefCodes.includes(prefecture.prefCode)}
            onChange={onPrefectureChange}
          />
        ))}
      </div>
    </div>
  );
}; 