import { renderHook, act } from '@testing-library/react';
import { usePrefectureData } from '../usePrefectureData';
import { fetchPrefectures } from '@/services/api/prefecture';
import { Prefecture } from '@/types/api/prefecture';

// APIモック
jest.mock('@/services/api/prefecture');
const mockFetchPrefectures = fetchPrefectures as jest.MockedFunction<typeof fetchPrefectures>;

describe('usePrefectureData', () => {
  const mockPrefectures: Prefecture[] = [
    { prefCode: 1, prefName: '北海道' },
    { prefCode: 2, prefName: '青森県' },
    { prefCode: 3, prefName: '岩手県' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchPrefectures.mockResolvedValue(mockPrefectures);
    localStorage.clear();
  });

  it('should fetch prefecture data', async () => {
    const { result } = renderHook(() => usePrefectureData());

    // 初期状態の確認
    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBeNull();

    // データ取得
    await act(async () => {
      await result.current.fetchData();
    });

    // データ取得後の状態確認
    expect(result.current.data).toEqual(mockPrefectures);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBeNull();
    expect(result.current.source).toBe('api');
  });

  it('should handle fetch error', async () => {
    const error = new Error('API Error');
    mockFetchPrefectures.mockRejectedValue(error);

    const { result } = renderHook(() => usePrefectureData());

    await act(async () => {
      try {
        await result.current.fetchData();
      } catch (error) {
        // エラーハンドリングの検証
        expect(error).toBe(error);
      }
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.data).toEqual([]);
  });

  it('should use cached data when available', async () => {
    // キャッシュデータを設定
    const cacheData = {
      data: mockPrefectures,
      timestamp: Date.now(),
    };
    localStorage.setItem('prefecture_data', JSON.stringify(cacheData));

    const { result } = renderHook(() => usePrefectureData());

    // データ取得
    await act(async () => {
      const source = await result.current.fetchData();
      expect(source).toBe('cache');
    });

    expect(result.current.data).toEqual(mockPrefectures);
    expect(mockFetchPrefectures).not.toHaveBeenCalled();
    expect(result.current.source).toBe('cache');
  });

  it('should clear cache', () => {
    // キャッシュデータを設定
    const cacheData = {
      data: mockPrefectures,
      timestamp: Date.now(),
    };
    localStorage.setItem('prefecture_data', JSON.stringify(cacheData));

    const { result } = renderHook(() => usePrefectureData());

    // キャッシュクリア
    act(() => {
      result.current.clearCache();
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.source).toBeNull();
    expect(localStorage.getItem('prefecture_data')).toBeNull();
  });
});
