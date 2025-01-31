import { describe, it, expect, vi, beforeEach } from 'vitest';
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
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('fetchPrefectures', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // 環境変数のモックを設定
    vi.stubEnv('NEXT_PUBLIC_API_ENDPOINT', 'https://api.example.com');
    vi.stubEnv('NEXT_PUBLIC_API_KEY', 'dummy-api-key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('都道府県一覧を正しく取得できること', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPrefecturesResponse,
    });

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
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

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
    vi.unstubAllEnvs();

    await expect(fetchPrefectures())
      .rejects
      .toThrow('API endpoint is not configured');
  });
}); 