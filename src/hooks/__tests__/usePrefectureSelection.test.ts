import { renderHook, act } from '@testing-library/react';
import { usePrefectureSelection } from '../usePrefectureSelection';
import type { Prefecture } from '@/components/features/prefecture/PrefectureList';

describe('usePrefectureSelection', () => {
  const mockPrefectures: Prefecture[] = [
    { prefCode: 1, prefName: '北海道' },
    { prefCode: 2, prefName: '青森県' },
    { prefCode: 3, prefName: '岩手県' },
  ];

  it('should handle prefecture selection and deselection', () => {
    const { result } = renderHook(() => usePrefectureSelection());

    // 初期状態の確認
    expect(result.current.selectedPrefCodes).toEqual([]);
    expect(result.current.isSelected(1)).toBeFalsy();

    // 都道府県選択
    act(() => {
      result.current.toggleSelection(1, true);
    });

    expect(result.current.selectedPrefCodes).toEqual([1]);
    expect(result.current.isSelected(1)).toBeTruthy();

    // 同じ都道府県の選択解除
    act(() => {
      result.current.toggleSelection(1, false);
    });

    expect(result.current.selectedPrefCodes).toEqual([]);
    expect(result.current.isSelected(1)).toBeFalsy();
  });

  it('should handle multiple prefecture selections', () => {
    const { result } = renderHook(() => usePrefectureSelection());

    // 複数の都道府県を選択
    act(() => {
      result.current.toggleSelection(1, true);
      result.current.toggleSelection(2, true);
    });

    expect(result.current.selectedPrefCodes).toEqual([1, 2]);
    expect(result.current.isSelected(1)).toBeTruthy();
    expect(result.current.isSelected(2)).toBeTruthy();
  });

  it('should select all prefectures', async () => {
    const { result } = renderHook(() => usePrefectureSelection());
    const onSelect = jest.fn().mockResolvedValue(undefined);

    await act(async () => {
      await result.current.selectAll(onSelect);
    });

    // 47都道府県全てが選択されていることを確認
    expect(result.current.selectedPrefCodes).toHaveLength(47);
    expect(onSelect).toHaveBeenCalledTimes(47);
  });

  it('should unselect all prefectures', () => {
    const { result } = renderHook(() => usePrefectureSelection([1, 2, 3]));

    expect(result.current.selectedPrefCodes).toEqual([1, 2, 3]);

    act(() => {
      result.current.unselectAll();
    });

    expect(result.current.selectedPrefCodes).toEqual([]);
  });

  it('should get selected prefectures', () => {
    const { result } = renderHook(() => usePrefectureSelection([1, 2]));

    const selectedPrefectures = result.current.getSelectedPrefectures(mockPrefectures);
    expect(selectedPrefectures).toEqual([
      { prefCode: 1, prefName: '北海道' },
      { prefCode: 2, prefName: '青森県' },
    ]);
  });

  it('should initialize with provided selection', () => {
    const initialSelection = [1, 2];
    const { result } = renderHook(() => usePrefectureSelection(initialSelection));

    expect(result.current.selectedPrefCodes).toEqual(initialSelection);
    expect(result.current.isSelected(1)).toBeTruthy();
    expect(result.current.isSelected(2)).toBeTruthy();
    expect(result.current.isSelected(3)).toBeFalsy();
  });
}); 