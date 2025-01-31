import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_ERROR_MESSAGES } from './constants';
import { APIError, type ErrorResponse } from '@/types/api/error';

// APIクライアントの基本設定
const baseURL = process.env.NEXT_PUBLIC_API_ENDPOINT;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const timeout = Number(process.env.NEXT_PUBLIC_API_TIMEOUT);

console.log('API Client Config:', {
  baseURL,
  timeout,
  hasApiKey: !!apiKey,
});

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': apiKey,
  },
  timeout,
});

// リトライ設定
const MAX_RETRIES = Number(process.env.NEXT_PUBLIC_API_RETRY_COUNT) || 3;
const RETRY_DELAY = Number(process.env.NEXT_PUBLIC_API_RETRY_DELAY) || 1000;

// リトライ可能なステータスコード
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];

// 拡張された設定の型定義
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  cache?: boolean | CacheConfig;
  retryCount?: number;
}

// カスタムエラーの型定義
interface CacheError extends AxiosError<ErrorResponse> {
  isCache?: boolean;
}

// キャッシュの型定義
interface CacheEntry {
  data: any;
  timestamp: number;
}

interface CacheConfig {
  ttl: number; // キャッシュの有効期限（ミリ秒）
}

// キャッシュストア
interface StorageCache {
  data: any;
  timestamp: number;
}

const CACHE_PREFIX = 'api_cache_';
const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5分

// キャッシュ操作をエクスポート
export const clearCache = (): void => {
  cacheStore.clear();
};

const cacheStore = {
  get: (key: string): CacheEntry | undefined => {
    try {
      const item = localStorage.getItem(CACHE_PREFIX + key);
      if (!item) return undefined;

      const cache: StorageCache = JSON.parse(item);
      return {
        data: cache.data,
        timestamp: cache.timestamp,
      };
    } catch (error) {
      console.error('Cache read error:', error);
      return undefined;
    }
  },

  set: (key: string, value: CacheEntry): void => {
    try {
      const cache: StorageCache = {
        data: value.data,
        timestamp: value.timestamp,
      };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cache));
    } catch (error) {
      console.error('Cache write error:', error);
    }
  },

  clear: (): void => {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(CACHE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
};

// キャッシュキーの生成
const generateCacheKey = (config: any): string => {
  const { url, params, method } = config;
  return `${method}:${url}:${JSON.stringify(params || {})}`;
};

// キャッシュの有効性チェック
const isCacheValid = (entry: CacheEntry, ttl: number): boolean => {
  return Date.now() - entry.timestamp < ttl;
};

// リトライ処理
const retryRequest = async (error: AxiosError): Promise<void> => {
  const config = error.config;
  if (!config) return Promise.reject(error);

  config.retryCount = config.retryCount || 0;

  if (
    config.retryCount >= MAX_RETRIES ||
    !RETRYABLE_STATUS_CODES.includes(error.response?.status || 0)
  ) {
    return Promise.reject(error);
  }

  config.retryCount += 1;
  console.log(`Retrying request (${config.retryCount}/${MAX_RETRIES})...`);

  // 指数バックオフ
  const delay = RETRY_DELAY * Math.pow(2, config.retryCount - 1);
  await new Promise((resolve) => setTimeout(resolve, delay));

  return apiClient(config);
};

// リクエストインターセプター
apiClient.interceptors.request.use(
  async (config: ExtendedAxiosRequestConfig) => {
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      params: config.params,
      headers: config.headers,
    });

    // キャッシュの確認（GETリクエストのみ）
    if (config.method?.toLowerCase() === 'get' && config.cache !== false) {
      const cacheKey = generateCacheKey(config);
      const cached = cacheStore.get(cacheKey);
      const ttl = (config.cache as CacheConfig)?.ttl || DEFAULT_CACHE_TTL;

      if (cached && isCacheValid(cached, ttl)) {
        console.log('Cache Hit:', cacheKey);
        return Promise.reject({
          config,
          response: { data: cached.data },
          isCache: true,
        } as CacheError);
      }
    }

    // リクエストヘッダーの共通設定
    if (config.headers) {
      config.headers.Accept = 'application/json';
      config.headers['Cache-Control'] = 'no-cache';
    }

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
apiClient.interceptors.response.use(
  (response) => {
    // キャッシュの保存（GETリクエストのみ）
    const config = response.config as ExtendedAxiosRequestConfig;
    if (config.method?.toLowerCase() === 'get' && config.cache !== false) {
      const cacheKey = generateCacheKey(config);
      cacheStore.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
      console.log('Cache Set:', cacheKey);
    }
    return response;
  },
  async (error: CacheError) => {
    // キャッシュからのレスポンス
    if (error.isCache) {
      return error.response as AxiosResponse;
    }

    console.log('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      config: error.config,
    });

    try {
      // リトライ処理
      if (error.config) {
        return await retryRequest(error);
      }
    } catch (retryError) {
      error = retryError as AxiosError<ErrorResponse>;
    }

    // エラーハンドリング
    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new APIError(API_ERROR_MESSAGES.BAD_REQUEST, 400, 'BAD_REQUEST');
        case 401:
        case 403:
          throw new APIError(API_ERROR_MESSAGES.UNAUTHORIZED, error.response.status, 'UNAUTHORIZED');
        case 404:
          throw new APIError(API_ERROR_MESSAGES.NOT_FOUND, 404, 'NOT_FOUND');
        case 408:
          throw new APIError(API_ERROR_MESSAGES.TIMEOUT, 408, 'TIMEOUT');
        case 500:
          throw new APIError(API_ERROR_MESSAGES.SERVER_ERROR, 500, 'SERVER_ERROR');
        default:
          throw new APIError(API_ERROR_MESSAGES.UNKNOWN, error.response.status);
      }
    }

    if (error.request) {
      throw new APIError(API_ERROR_MESSAGES.NETWORK_ERROR, 0, 'NETWORK_ERROR');
    }

    throw new APIError(API_ERROR_MESSAGES.UNKNOWN);
  },
); 