import { useState, useCallback } from 'react';
import type { Prefecture } from '@/components/features/prefecture/PrefectureList';

interface UsePrefectureSelectionReturn {
  selectedPrefCodes: number[];
  isSelected: (prefCode: number) => boolean;
  toggleSelection: (prefCode: number, checked: boolean) => void;
  selectAll: () => void;
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
    () => {
      setSelectedPrefCodes((prev) => {
        if (prev.length === 47) return prev; // 既に全て選択されている場合は何もしない
        return Array.from({ length: 47 }, (_, i) => i + 1);
      });
    },
    []
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