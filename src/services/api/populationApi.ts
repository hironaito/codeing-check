import { z } from 'zod';
import { apiClient } from './apiClient';
import { API_ENDPOINTS, CACHE_CONFIG } from './constants';
import { APIError } from '@/types/api/error';
import type { PopulationResponse } from '@/types/api/population';
import type { ExtendedRequestConfig } from '@/types/api/request';

// レスポンスのバリデーションスキーマ
const populationDataSchema = z.object({
  year: z.number(),
  value: z.number(),
});

const populationCompositionSchema = z.object({
  label: z.string(),
  data: z.array(populationDataSchema),
});

const populationResponseSchema = z.object({
  message: z.null(),
  result: z.object({
    boundaryYear: z.number(),
    data: z.array(populationCompositionSchema),
  }),
});

/**
 * 人口構成データを取得する
 * @param prefCode 都道府県コード
 * @throws {APIError} APIエラーが発生した場合
 * @returns {Promise<PopulationResponse['result']>} 人口構成データ
 */
export const getPopulation = async (prefCode: number): Promise<PopulationResponse['result']> => {
  try {
    const config: ExtendedRequestConfig = {
      params: {
        prefCode,
      },
      cache: {
        ttl: CACHE_CONFIG.POPULATION_TTL,
      },
    };

    const response = await apiClient.get<PopulationResponse>(API_ENDPOINTS.POPULATION, config);
    console.log('Population API Response:', response);
    
    if (!response.data) {
      throw new APIError('レスポンスデータが存在しません', 500);
    }
    
    // レスポンスのバリデーション
    const validatedData = populationResponseSchema.parse(response.data);
    console.log('Validated Population Data:', validatedData);
    
    return validatedData.result;
  } catch (error) {
    console.error('Population API Error:', error);
    if (error instanceof APIError) {
      throw error;
    }
    if (error instanceof z.ZodError) {
      throw new APIError('レスポンスの形式が不正です', 500);
    }
    throw new APIError('人口データの取得に失敗しました');
  }
}; 