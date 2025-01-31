import { z } from 'zod';
import { apiClient } from './apiClient';
import { API_ENDPOINTS, API_CONFIG } from '@/constants/api';
import type { Prefecture, PrefecturesResponse } from '@/types/api/prefecture';
import type { ExtendedRequestConfig } from '@/types/api/request';
import { handleAPIError } from '@/utils/error';

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
        ttl: API_CONFIG.CACHE.PREFECTURE_TTL,
      },
    };

    const response = await apiClient.get<PrefecturesResponse>(API_ENDPOINTS.PREFECTURES, config);
    console.log('API Response:', response);
    
    if (!response.data) {
      throw new Error('レスポンスデータが存在しません');
    }
    
    // レスポンスのバリデーション
    const validatedData = prefecturesResponseSchema.parse(response.data);
    console.log('Validated Data:', validatedData);
    
    return validatedData.result;
  } catch (error) {
    return handleAPIError(error, '都道府県データの取得に失敗しました');
  }
}; 