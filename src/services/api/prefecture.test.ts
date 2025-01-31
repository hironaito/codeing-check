import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

import { fetchPrefectures } from './prefecture';

// モックデータ
const mockPrefecturesResponse = {
  message: null,
  result: [
    { prefCode: 1, prefName: '北海道' },
    { prefCode: 2, prefName: '青森県' },
    { prefCode: 3, prefName: '岩手県' },
  ],
};

// グローバルなfetchのモック
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe('fetchPrefectures', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    // 環境変数のモックを設定
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_API_ENDPOINT: 'https://api.example.com',
      NEXT_PUBLIC_API_KEY: 'dummy-api-key'
    };
  });

  afterEach(() => {
    // 環境変数を元に戻す
    process.env = { ...process.env };
  });

  it('都道府県一覧を正しく取得できること', async () => {
    mockFetch.mockResolvedValueOnce(new Response(
      JSON.stringify(mockPrefecturesResponse),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    ));

    const result = await fetchPrefectures();

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/api/v1/prefectures',
      expect.objectContaining({
        headers: {
          'X-API-KEY': 'dummy-api-key',
        },
      })
    );

    expect(result).toEqual(mockPrefecturesResponse.result);
  });

  it('APIエラー時に適切なエラーがスローされること', async () => {
    mockFetch.mockResolvedValueOnce(new Response(
      'Unauthorized',
      {
        status: 401,
        statusText: 'Unauthorized'
      }
    ));

    await expect(fetchPrefectures())
      .rejects
      .toThrow('API request failed with status 401');
  });

  it('ネットワークエラー時に適切なエラーがスローされること', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchPrefectures())
      .rejects
      .toThrow('Failed to fetch prefectures: Network error');
  });

  it('環境変数が設定されていない場合にエラーがスローされること', async () => {
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_API_ENDPOINT: '',
      NEXT_PUBLIC_API_KEY: ''
    };

    await expect(fetchPrefectures())
      .rejects
      .toThrow('API endpoint is not configured');
  });
});
