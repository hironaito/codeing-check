import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

import { fetchPopulationData } from '@/services/api/population';
import { PopulationResponse } from '@/types/api/population';

// モックデータ
const mockPopulationResponse: PopulationResponse = {
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

// 環境変数のモック
const mockEnv = {
  NEXT_PUBLIC_API_ENDPOINT: 'https://yumemi-frontend-engineer-codecheck-api.vercel.app',
  NEXT_PUBLIC_API_KEY: 'dummy-api-key',
};

// グローバルなfetchのモック
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe('fetchPopulationData', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    jest.resetAllMocks();
    // 環境変数のモックを設定
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_API_ENDPOINT: mockEnv.NEXT_PUBLIC_API_ENDPOINT,
      NEXT_PUBLIC_API_KEY: mockEnv.NEXT_PUBLIC_API_KEY
    };
  });

  afterEach(() => {
    // 環境変数を元に戻す
    process.env = { ...process.env };
  });

  it('正常系: 人口データを正しく取得できること', async () => {
    // fetchのモックを設定
    mockFetch.mockResolvedValueOnce(new Response(
      JSON.stringify(mockPopulationResponse),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    ));

    const prefCode = 1;
    const result = await fetchPopulationData(prefCode);

    // APIが正しく呼び出されたことを確認
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/population/composition/perYear?prefCode=1'),
      expect.objectContaining({
        headers: {
          'X-API-KEY': mockEnv.NEXT_PUBLIC_API_KEY,
        },
      })
    );

    // レスポンスが期待通りであることを確認
    expect(result).toEqual(mockPopulationResponse);
  });

  it('エラー系: APIキーが無効な場合にエラーがスローされること', async () => {
    // 401 Unauthorizedのレスポンスをモック
    mockFetch.mockResolvedValueOnce(new Response(
      'Unauthorized',
      {
        status: 401,
        statusText: 'Unauthorized'
      }
    ));

    const prefCode = 1;
    await expect(fetchPopulationData(prefCode))
      .rejects
      .toThrow('API request failed with status 401');
  });

  it('エラー系: ネットワークエラーが発生した場合にエラーがスローされること', async () => {
    // ネットワークエラーをシミュレート
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const prefCode = 1;
    await expect(fetchPopulationData(prefCode))
      .rejects
      .toThrow('Failed to fetch population data: Network error');
  });

  it('エラー系: 環境変数が設定されていない場合にエラーがスローされること', async () => {
    // 環境変数をクリア
    const originalEnv = process.env;
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_API_ENDPOINT: '',
      NEXT_PUBLIC_API_KEY: ''
    };

    const prefCode = 1;
    await expect(fetchPopulationData(prefCode))
      .rejects
      .toThrow('API endpoint is not configured');
  });
});
