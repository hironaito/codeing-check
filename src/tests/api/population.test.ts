import { describe, it, expect, beforeEach, vi } from 'vitest';
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

// グローバルなfetchのモック
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('fetchPopulationData', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    mockFetch.mockReset();
  });

  it('正常系: 人口データを正しく取得できること', async () => {
    // fetchのモックを設定
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPopulationResponse,
    });

    const prefCode = 1;
    const apiKey = 'dummy-api-key';

    const result = await fetchPopulationData(prefCode, apiKey);

    // APIが正しく呼び出されたことを確認
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/population/composition/perYear?prefCode=1'),
      expect.objectContaining({
        headers: {
          'X-API-KEY': apiKey,
        },
      })
    );

    // レスポンスが期待通りであることを確認
    expect(result).toEqual(mockPopulationResponse);
  });

  it('エラー系: APIキーが無効な場合にエラーがスローされること', async () => {
    // 401 Unauthorizedのレスポンスをモック
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const prefCode = 1;
    const invalidApiKey = 'invalid-api-key';

    await expect(fetchPopulationData(prefCode, invalidApiKey))
      .rejects
      .toThrow('API request failed with status 401');
  });

  it('エラー系: ネットワークエラーが発生した場合にエラーがスローされること', async () => {
    // ネットワークエラーをシミュレート
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const prefCode = 1;
    const apiKey = 'dummy-api-key';

    await expect(fetchPopulationData(prefCode, apiKey))
      .rejects
      .toThrow('Failed to fetch population data: Network error');
  });
}); 