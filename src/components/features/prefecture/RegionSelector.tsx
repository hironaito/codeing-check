'use client';

import { FC, useState } from 'react';
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
  const [clickedRegion, setClickedRegion] = useState<string | null>(null);

  const handleRegionSelect = (region: string, regionPrefs: Prefecture[]) => {
    setClickedRegion(region);
    setTimeout(() => setClickedRegion(null), 300); // リップルエフェクトの後にリセット

    const allSelected = regionPrefs.every(pref => 
      selectedPrefCodes.includes(pref.prefCode)
    );

    regionPrefs.forEach(pref => {
      onPrefectureChange(pref.prefCode, !allSelected);
    });
  };

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-gray-900">地域から選択</h2>
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-1.5 sm:gap-2">
        {Object.entries(regionGroups).map(([region, prefs]) => {
          const selectedCount = prefs.filter(pref => 
            selectedPrefCodes.includes(pref.prefCode)
          ).length;
          const isAllSelected = selectedCount === prefs.length;
          const isPartiallySelected = selectedCount > 0 && !isAllSelected;
          const isClicked = clickedRegion === region;

          return (
            <div key={region} className="w-full">
              <button
                onClick={() => handleRegionSelect(region, prefs)}
                className={`relative w-full h-8 px-2 text-xs sm:text-sm font-medium rounded-md border transition-all duration-200 overflow-hidden touch-manipulation
                  transform ${isClicked ? 'scale-95' : 'scale-100 hover:scale-[1.02]'}
                  ${isAllSelected 
                    ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100' 
                    : isPartiallySelected
                      ? 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {/* リップルエフェクト */}
                {isClicked && (
                  <span
                    className="absolute inset-0 bg-current opacity-20 transform scale-0 animate-ripple"
                    style={{
                      animationDuration: '300ms',
                    }}
                  />
                )}
                <span className="flex items-center justify-center gap-1">
                  <span className="truncate">{region}</span>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    ({selectedCount}/{prefs.length})
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 