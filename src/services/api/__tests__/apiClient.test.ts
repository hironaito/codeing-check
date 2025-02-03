import axios from 'axios';
import { clearCache, cacheStore } from '../apiClient';
import { API_CONFIG } from '@/constants/api';

// Axiosのモック
jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(() => {
      const mockInterceptors = {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      };
      return {
        interceptors: mockInterceptors,
      };
    }),
  };
  return mockAxios;
});

// LocalStorageのモック
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    keys: jest.fn(() => {
      return Object.keys(store);
    }),
    _getStore: () => store, // テスト用のヘルパー
  };
})();

// LocalStorageのモックをグローバルに設定
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
  configurable: true,
});

// インターセプターの型定義
type ResponseInterceptor = (error: {
  response?: { 
    status: number; 
    data?: { message: string } 
  };
  request?: unknown;
  config?: { retryCount: number; method: string; url: string };
  message?: string;
}) => Promise<never>;

// インターセプターのモック関数を保持する変数
let responseInterceptor: ResponseInterceptor;

describe('APIClient', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    jest.clearAllMocks();
    mockLocalStorage.clear();

    // APIクライアントを再インポートして初期化
    jest.isolateModules(async () => {
      await import('../apiClient');
    });

    // レスポンスインターセプターの関数を取得
    const mockAxiosInstance = (axios.create as jest.Mock).mock.results[0].value;
    [[, responseInterceptor]] = mockAxiosInstance.interceptors.response.use.mock.calls;
  });

  afterEach(() => {
    // 各テストの前にモックをリセット
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  describe('Configuration', () => {
    it('should create axios instance with correct configuration', () => {
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY,
          }),
          timeout: expect.any(Number),
        })
      );
    });
  });

  describe('Cache Management', () => {
    const mockData = { test: 'data' };
    const cacheKey = `${API_CONFIG.CACHE.PREFIX}get:test-url:{}`;

    beforeEach(() => {
      mockLocalStorage.clear();
      jest.clearAllMocks();
    });

    it('should clear cache correctly', () => {
      // キャッシュにデータを設定
      const cacheData = {
        data: mockData,
        timestamp: Date.now(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));

      // キャッシュが設定されていることを確認
      expect(localStorage.getItem(cacheKey)).not.toBeNull();

      // keysメソッドのモックを設定
      mockLocalStorage.keys.mockReturnValue([cacheKey]);

      // キャッシュをクリア
      clearCache();

      // キャッシュが削除されていることを確認
      expect(localStorage.keys).toHaveBeenCalled();
      expect(localStorage.removeItem).toHaveBeenCalledWith(cacheKey);
    });

    it('should handle cache errors gracefully', () => {
      // getItemでエラーを発生させる
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      // キャッシュの取得を試みる
      const result = cacheStore.get(cacheKey);

      // エラーがログに記録され、undefinedが返されることを確認
      expect(consoleSpy).toHaveBeenCalledWith('Cache read error:', expect.any(Error));
      expect(result).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle 400 Bad Request error', async () => {
      const mockError = {
        response: {
          status: 400,
          data: { message: 'Bad Request' },
        },
      };

      await expect(responseInterceptor(mockError)).rejects.toMatchObject({
        status: 400,
        code: 'BAD_REQUEST',
      });
    });

    it('should handle 404 Not Found error', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Not Found' },
        },
      };

      await expect(responseInterceptor(mockError)).rejects.toMatchObject({
        status: 404,
        code: 'NOT_FOUND',
      });
    });

    it('should handle network errors', async () => {
      const mockError = {
        request: {},
        message: 'Network Error',
      };

      await expect(responseInterceptor(mockError)).rejects.toMatchObject({
        code: 'NETWORK_ERROR',
      });
    });
  });

  describe('Retry Mechanism', () => {
    it('should retry failed requests up to maximum attempts', async () => {
      const mockConfig = {
        retryCount: 0,
        method: 'get',
        url: '/test',
      };

      const mockError = {
        config: mockConfig,
        response: { status: 500 },
      };

      await expect(responseInterceptor(mockError)).rejects.toThrow();
      expect(mockConfig.retryCount).toBeLessThanOrEqual(API_CONFIG.RETRY.MAX_COUNT);
    });

    it('should not retry if status code is not retryable', async () => {
      const mockConfig = {
        retryCount: 0,
        method: 'get',
        url: '/test',
      };

      const mockError = {
        config: mockConfig,
        response: { status: 400 }, // 400は再試行対象外
      };

      await expect(responseInterceptor(mockError)).rejects.toThrow();
      expect(mockConfig.retryCount).toBe(0);
    });
  });
});
