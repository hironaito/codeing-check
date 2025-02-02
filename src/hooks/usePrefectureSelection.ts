import { useState, useCallback } from 'react';
import type { Prefecture } from '@/components/features/prefecture/PrefectureList';

interface UsePrefectureSelectionReturn {
  selectedPrefCodes: number[];
  isSelected: (prefCode: number) => boolean;
  toggleSelection: (prefCode: number, checked: boolean) => void;
  selectAll: (onSelect?: (prefCode: number) => Promise<void>) => void;
  unselectAll: () => void;
  getSelectedPrefectures: (prefectures: Prefecture[]) => Prefecture[];
}

export const usePrefectureSelection = (
  initialSelection: number[] = []
): UsePrefectureSelectionReturn => {
  const [selectedPrefCodes, setSelectedPrefCodes] = useState<number[]>(initialSelection);

  const isSelected = useCallback(
    (prefCode: number) => selectedPrefCodes.includes(prefCode),
    [selectedPrefCodes]
  );

  const toggleSelection = useCallback(
    (prefCode: number, checked: boolean) => {
      setSelectedPrefCodes((prev) =>
        checked
          ? [...prev, prefCode]
          : prev.filter((code) => code !== prefCode)
      );
    },
    []
  );

  const selectAll = useCallback(
    async (onSelect?: (prefCode: number) => Promise<void>) => {
      const allPrefCodes = Array.from({ length: 47 }, (_, i) => i + 1);
      
      // 既に選択されていないコードのみを抽出
      const newPrefCodes = allPrefCodes.filter(code => !selectedPrefCodes.includes(code));
      
      // 新しく選択する都道府県のデータを取得
      if (onSelect) {
        await Promise.all(newPrefCodes.map(code => onSelect(code)));
      }
      
      setSelectedPrefCodes(allPrefCodes);
    },
    [selectedPrefCodes]
  );

  const unselectAll = useCallback(
    () => {
      setSelectedPrefCodes([]);
    },
    []
  );

  const getSelectedPrefectures = useCallback(
    (prefectures: Prefecture[]) => {
      return prefectures.filter((pref) => selectedPrefCodes.includes(pref.prefCode));
    },
    [selectedPrefCodes]
  );

  return {
    selectedPrefCodes,
    isSelected,
    toggleSelection,
    selectAll,
    unselectAll,
    getSelectedPrefectures,
  };
}; 