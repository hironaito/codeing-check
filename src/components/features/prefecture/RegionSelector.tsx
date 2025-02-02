'use client';

import { FC } from 'react';
import { Prefecture } from '@/types/api/prefecture';
import { groupPrefecturesByRegion } from '@/utils/prefecture';

interface RegionSelectorProps {
  prefectures: Prefecture[];
  selectedPrefCodes: number[];
  onPrefectureChange: (prefCode: number, checked: boolean) => void;
}

export const RegionSelector: FC<RegionSelectorProps> = ({
  prefectures,
  selectedPrefCodes,
  onPrefectureChange,
}) => {
  const regionGroups = groupPrefecturesByRegion(prefectures);

  const handleRegionSelect = (regionPrefs: Prefecture[]) => {
    const allSelected = regionPrefs.every(pref => 
      selectedPrefCodes.includes(pref.prefCode)
    );

    regionPrefs.forEach(pref => {
      onPrefectureChange(pref.prefCode, !allSelected);
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">地域から選択</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(regionGroups).map(([region, prefs]) => {
          const selectedCount = prefs.filter(pref => 
            selectedPrefCodes.includes(pref.prefCode)
          ).length;
          const isAllSelected = selectedCount === prefs.length;
          const isPartiallySelected = selectedCount > 0 && !isAllSelected;

          return (
            <div key={region} className="space-y-2">
              <button
                onClick={() => handleRegionSelect(prefs)}
                className={`w-full px-4 py-2 text-sm font-medium rounded-lg border transition-colors
                  ${isAllSelected 
                    ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100' 
                    : isPartiallySelected
                      ? 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {region}
                <span className="ml-2 text-xs text-gray-500">
                  ({selectedCount}/{prefs.length})
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 