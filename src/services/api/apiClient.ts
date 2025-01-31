import axios, { AxiosError } from 'axios';
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

// レスポンスインターセプター
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
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