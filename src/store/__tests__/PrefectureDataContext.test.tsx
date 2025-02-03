import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { PrefectureDataProvider, usePrefectureDataContext } from '../PrefectureDataContext';
import { fetchPrefectures } from '@/services/api/prefecture';
import { Prefecture } from '@/types/api/prefecture';

// APIモック
jest.mock('@/services/api/prefecture');
const mockFetchPrefectures = fetchPrefectures as jest.MockedFunction<typeof fetchPrefectures>;

describe('PrefectureDataContext', () => {
  const mockPrefectureData: Prefecture[] = [
    { prefCode: 1, prefName: '北海道' },
    { prefCode: 2, prefName: '青森県' },
  ];

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <PrefectureDataProvider>{children}</PrefectureDataProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchPrefectures.mockResolvedValue(mockPrefectureData);
  });

  it('should throw error when used outside of provider', () => {
    expect(() => {
      renderHook(() => usePrefectureDataContext());
    }).toThrow('usePrefectureDataContext must be used within a PrefectureDataProvider');
  });

  it('should fetch prefecture data', async () => {
    const { result } = renderHook(() => usePrefectureDataContext(), { wrapper });

    // 初期状態の確認
    expect(result.current.state.prefectures).toEqual([]);
    expect(result.current.state.isLoading).toBeFalsy();
    expect(result.current.state.error).toBeNull();

    // データ取得
    await act(async () => {
      await result.current.fetchPrefectures();
    });

    // データ取得後の状態確認
    expect(result.current.state.prefectures).toEqual(mockPrefectureData);
    expect(result.current.state.isLoading).toBeFalsy();
    expect(result.current.state.error).toBeNull();
  });

  it('should handle errors', async () => {
    const error = new Error('API Error');
    mockFetchPrefectures.mockRejectedValue(error);

    const { result } = renderHook(() => usePrefectureDataContext(), { wrapper });

    await act(async () => {
      try {
        await result.current.fetchPrefectures();
      } catch (error) {
        // エラーハンドリングの検証
        expect(error).toBe(error);
        expect(mockFetchPrefectures).toHaveBeenCalled();
        expect(result.current.state.error).toEqual(error);
        expect(result.current.state.isLoading).toBeFalsy();
        expect(result.current.state.prefectures).toEqual([]);
      }
    });
  });

  it('should get prefecture by id', async () => {
    const { result } = renderHook(() => usePrefectureDataContext(), { wrapper });

    // データ取得
    await act(async () => {
      await result.current.fetchPrefectures();
    });

    // 都道府県の取得
    const prefecture = result.current.getPrefectureById(1);
    expect(prefecture).toEqual(mockPrefectureData[0]);

    // 存在しない都道府県の取得
    const notFoundPrefecture = result.current.getPrefectureById(999);
    expect(notFoundPrefecture).toBeUndefined();
  });

  it('should clear prefectures', async () => {
    const { result } = renderHook(() => usePrefectureDataContext(), { wrapper });

    // データ取得
    await act(async () => {
      await result.current.fetchPrefectures();
    });

    // クリア前の確認
    expect(result.current.state.prefectures).toEqual(mockPrefectureData);

    // データクリア
    act(() => {
      result.current.clearPrefectures();
    });

    // クリア後の確認
    expect(result.current.state.prefectures).toEqual([]);
    expect(result.current.state.isLoading).toBeFalsy();
    expect(result.current.state.error).toBeNull();
  });

  it('should handle loading state', async () => {
    const { result } = renderHook(() => usePrefectureDataContext(), { wrapper });

    // データ取得を遅延させる
    mockFetchPrefectures.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockPrefectureData), 100))
    );

    // データ取得開始
    let promise: Promise<void>;
    act(() => {
      promise = result.current.fetchPrefectures();
    });

    // ローディング状態の確認
    expect(result.current.state.isLoading).toBeTruthy();

    // データ取得完了を待つ
    await act(async () => {
      await promise;
    });

    // ローディング状態の解除を確認
    expect(result.current.state.isLoading).toBeFalsy();
  });
});
