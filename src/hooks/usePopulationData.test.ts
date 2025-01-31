import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { usePopulationData } from './usePopulationData';
import { fetchPopulationData } from '@/services/api/population';
import { cacheStore } from '@/utils/cache';

// APIモックの設定
jest.mock('@/services/api/population', () => ({
  fetchPopulationData: jest.fn()
}));

// モックデータ
const mockPopulationData = {
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
      {
        label: '年少人口',
        data: [
          { year: 2015, value: 800000 },
          { year: 2020, value: 700000 },
        ],
      },
      {
        label: '生産年齢人口',
        data: [
          { year: 2015, value: 3000000 },
          { year: 2020, value: 2800000 },
        ],
      },
      {
        label: '老年人口',
        data: [
          { year: 2015, value: 1200000 },
          { year: 2020, value: 1300000 },
        ],
      },
    ],
  },
};

describe('usePopulationData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cacheStore.clear();
  });

  it('初期状態が正しいこと', () => {
    const { result } = renderHook(() => usePopulationData());

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.totalPopulation).toBeNull();
    expect(result.current.youngPopulation).toBeNull();
    expect(result.current.workingPopulation).toBeNull();
    expect(result.current.elderlyPopulation).toBeNull();
  });

  it('データ取得が成功した場合、正しく状態が更新されること', async () => {
    const mockFetch = jest.mocked(fetchPopulationData);
    mockFetch.mockResolvedValueOnce(mockPopulationData);

    const { result } = renderHook(() => usePopulationData());

    await act(async () => {
      await result.current.fetchData(1);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(mockPopulationData);
    
    // 各人口区分のデータが正しく抽出されていることを確認
    expect(result.current.totalPopulation?.label).toBe('総人口');
    expect(result.current.youngPopulation?.label).toBe('年少人口');
    expect(result.current.workingPopulation?.label).toBe('生産年齢人口');
    expect(result.current.elderlyPopulation?.label).toBe('老年人口');
  });

  it('データ取得が失敗した場合、エラー状態が設定されること', async () => {
    const mockError = new Error('API Error');
    const mockFetch = jest.mocked(fetchPopulationData);
    mockFetch.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => usePopulationData());

    await act(async () => {
      await result.current.fetchData(1);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error?.message).toBe('API Error');
    expect(result.current.data).toBeNull();
    expect(result.current.totalPopulation).toBeNull();
    expect(result.current.youngPopulation).toBeNull();
    expect(result.current.workingPopulation).toBeNull();
    expect(result.current.elderlyPopulation).toBeNull();
  });

  it('ローディング状態が正しく制御されること', async () => {
    const mockFetch = jest.mocked(fetchPopulationData);
    mockFetch.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve(mockPopulationData), 100))
    );

    const { result } = renderHook(() => usePopulationData());

    // fetchDataを呼び出し
    act(() => {
      result.current.fetchData(1);
    });

    // ローディング開始を確認
    expect(result.current.isLoading).toBe(true);

    // データ取得の完了を待機
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    // ローディング終了を確認
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockPopulationData);
  });

  it('キャッシュが正しく機能すること', async () => {
    const mockFetch = jest.mocked(fetchPopulationData);
    mockFetch.mockResolvedValueOnce(mockPopulationData);

    const { result } = renderHook(() => usePopulationData());

    // 1回目の呼び出し（キャッシュミス）
    await act(async () => {
      await result.current.fetchData(1);
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockPopulationData);

    // 2回目の呼び出し（キャッシュヒット）
    await act(async () => {
      await result.current.fetchData(1);
    });

    // APIが呼び出されていないことを確認
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockPopulationData);
  });

  it('キャッシュクリアが正しく機能すること', async () => {
    const mockFetch = jest.mocked(fetchPopulationData);
    mockFetch.mockResolvedValue(mockPopulationData);

    const { result } = renderHook(() => usePopulationData());

    // データを取得してキャッシュに保存
    await act(async () => {
      await result.current.fetchData(1);
    });

    expect(result.current.data).toEqual(mockPopulationData);

    // キャッシュをクリア
    act(() => {
      result.current.clearCache();
    });

    expect(result.current.data).toBeNull();

    // 再度データを取得（キャッシュミス）
    await act(async () => {
      await result.current.fetchData(1);
    });

    // APIが再度呼び出されることを確認
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
