'use client';

import { FC } from 'react';
import { PrefectureSelector } from './PrefectureSelector';
import { RegionSelector } from './RegionSelector';

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
  isLoading?: boolean;
}

export const PrefectureList: FC<PrefectureListProps> = ({
  prefectures,
  selectedPrefCodes,
  onPrefectureChange,
  onSelectAll,
  onUnselectAll,
  isLoading = false,
}) => {
  const selectedCount = selectedPrefCodes.length;
  const totalCount = prefectures.length;

  if (isLoading) {
    return (
      <div className="space-y-4" role="status" aria-label="読み込み中">
        <div className="flex items-center justify-between p-3 sm:px-4 sm:py-2 bg-gray-50 rounded-lg animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="flex gap-2 sm:space-x-2">
            <div className="h-10 sm:h-8 w-20 bg-gray-200 rounded" />
            <div className="h-10 sm:h-8 w-20 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-1.5 sm:gap-2">
          {[...Array(47)].map((_, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md animate-pulse"
            >
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div className="h-4 flex-1 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 地域選択 */}
      <RegionSelector
        prefectures={prefectures}
        selectedPrefCodes={selectedPrefCodes}
        onPrefectureChange={onPrefectureChange}
      />

      {/* 選択状態の表示と一括選択/解除ボタン */}
      <div className="flex items-center justify-between p-3 sm:px-4 sm:py-2 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          選択中: {selectedCount} / {totalCount}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="h-10 sm:h-8 px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700 disabled:active:scale-100"
            disabled={selectedCount === totalCount}
          >
            全て選択
          </button>
          <button
            onClick={onUnselectAll}
            className="h-10 sm:h-8 px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700 disabled:active:scale-100"
            disabled={selectedCount === 0}
          >
            選択解除
          </button>
        </div>
      </div>

      {/* 都道府県リスト */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-1.5 sm:gap-2 p-0.5">
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