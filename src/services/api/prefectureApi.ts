import { z } from 'zod';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './constants';
import { APIError } from '@/types/api/error';
import type { AxiosRequestConfig } from 'axios';
import type { Prefecture, PrefecturesResponse } from '@/types/api/prefecture';

// キャッシュの設定
const PREFECTURE_CACHE_TTL = 30 * 60 * 1000; // 30分

// 拡張されたリクエスト設定の型
interface CacheConfig {
  ttl: number;
}

interface ExtendedRequestConfig extends AxiosRequestConfig {
  cache?: boolean | CacheConfig;
}

// レスポンスのバリデーションスキーマ
const prefectureSchema = z.object({
  prefCode: z.number(),
  prefName: z.string(),
});

const prefecturesResponseSchema = z.object({
  message: z.string().nullable(),
  result: z.array(prefectureSchema),
});

/**
 * 都道府県一覧を取得する
 * @throws {APIError} APIエラーが発生した場合
 * @returns {Promise<Prefecture[]>} 都道府県一覧
 */
export const getPrefectures = async (): Promise<Prefecture[]> => {
  try {
    const config: ExtendedRequestConfig = {
      cache: {
        ttl: PREFECTURE_CACHE_TTL,
      },
    };

    const response = await apiClient.get<PrefecturesResponse>(API_ENDPOINTS.PREFECTURES, config);
    console.log('API Response:', response);
    
    if (!response.data) {
      throw new APIError('レスポンスデータが存在しません', 500);
    }
    
    // レスポンスのバリデーション
    const validatedData = prefecturesResponseSchema.parse(response.data);
    console.log('Validated Data:', validatedData);
    
    return validatedData.result;
  } catch (error) {
    console.error('Prefecture API Error:', error);
    if (error instanceof APIError) {
      throw error;
    }
    if (error instanceof z.ZodError) {
      throw new APIError('レスポンスの形式が不正です', 500);
    }
    throw new APIError('都道府県データの取得に失敗しました');
  }
}; 