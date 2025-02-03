import React from 'react';
import { render, renderHook, act, waitFor } from '@testing-library/react';
import { PopulationDataProvider, usePopulationDataContext } from '../PopulationDataContext';
import { fetchPopulationData } from '@/services/api/population';
import { cacheStore } from '@/utils/cache';
import { PopulationResponse } from '@/types/api/population';

// APIモック
jest.mock('@/services/api/population');
const mockFetchPopulationData = fetchPopulationData as jest.MockedFunction<typeof fetchPopulationData>;

// キャッシュモック
jest.mock('@/utils/cache', () => ({
  cacheStore: {
    get: jest.fn(),
    set: jest.fn(),
    clear: jest.fn(),
  },
}));

describe('PopulationDataContext', () => {
  const mockPopulationData: PopulationResponse = {
    message: null,
    result: {
      boundaryYear: 2020,
      data: [
        {
          label: '総人口',
          data: [
            { year: 2015, value: 5000000 },
            { year: 2020, value: 4800000 },
          ],
        },
      ],
    },
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <PopulationDataProvider>{children}</PopulationDataProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchPopulationData.mockResolvedValue(mockPopulationData);
  });

  it('should throw error when used outside of provider', () => {
    expect(() => {
      renderHook(() => usePopulationDataContext());
    }).toThrow('usePopulationDataContext must be used within a PopulationDataProvider');
  });

  it('should fetch and cache population data', async () => {
    const { result } = renderHook(() => usePopulationDataContext(), { wrapper });

    // 初期状態の確認
    expect(result.current.state.data).toEqual({});
    expect(result.current.state.isLoading).toBeFalsy();
    expect(result.current.state.error).toBeNull();

    // データ取得
    await act(async () => {
      await result.current.fetchPopulationDataForPrefecture(1);
    });

    // データ取得後の状態確認
    expect(result.current.state.data[1]).toEqual(mockPopulationData);
    expect(cacheStore.set).toHaveBeenCalledWith(
      'population_1',
      mockPopulationData
    );
  });

  it('should use cached data when available', async () => {
    const cachedData = { ...mockPopulationData };
    (cacheStore.get as jest.Mock).mockReturnValue(cachedData);

    const { result } = renderHook(() => usePopulationDataContext(), { wrapper });

    await act(async () => {
      await result.current.fetchPopulationDataForPrefecture(1);
    });

    expect(mockFetchPopulationData).not.toHaveBeenCalled();
    expect(result.current.state.data[1]).toEqual(cachedData);
  });

  it('should handle prefecture selection', async () => {
    const { result } = renderHook(() => usePopulationDataContext(), { wrapper });

    // 都道府県選択
    await act(async () => {
      await result.current.selectPrefecture(1);
    });

    expect(result.current.state.selectedPrefCodes).toContain(1);
    expect(result.current.state.data[1]).toEqual(mockPopulationData);

    // 都道府県選択解除
    act(() => {
      result.current.deselectPrefecture(1);
    });

    expect(result.current.state.selectedPrefCodes).not.toContain(1);
  });

  it('should handle errors', async () => {
    const error = new Error('API Error');
    mockFetchPopulationData.mockRejectedValue(error);

    const { result } = renderHook(() => usePopulationDataContext(), { wrapper });

    await act(async () => {
      try {
        await result.current.fetchPopulationDataForPrefecture(1);
      } catch (e) {
        // エラーは期待される動作
        expect(mockFetchPopulationData).toHaveBeenCalledWith(1);
        expect(result.current.state.error).toEqual(error);
        expect(result.current.state.isLoading).toBeFalsy();
        expect(result.current.state.data[1]).toBeUndefined();
      }
    });
  });

  it('should clear all data', async () => {
    const { result } = renderHook(() => usePopulationDataContext(), { wrapper });

    // データを設定
    await act(async () => {
      await result.current.selectPrefecture(1);
    });

    // クリア
    act(() => {
      result.current.clearAll();
    });

    expect(result.current.state.data).toEqual({});
    expect(result.current.state.selectedPrefCodes).toEqual([]);
    expect(cacheStore.clear).toHaveBeenCalled();
  });

  it('should get population data by type', async () => {
    const { result } = renderHook(() => usePopulationDataContext(), { wrapper });

    // データを設定
    await act(async () => {
      await result.current.fetchPopulationDataForPrefecture(1);
    });

    const populationData = result.current.getPopulationDataByType(1, '総人口');
    expect(populationData).toEqual(mockPopulationData.result.data[0]);
  });
});
