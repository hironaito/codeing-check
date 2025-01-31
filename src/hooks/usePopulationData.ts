import { useState, useCallback, useMemo } from 'react';
import { fetchPopulationData } from '@/services/api/population';
import { PopulationResponse, PopulationComposition } from '@/types/api/population';
import { API_ERROR_MESSAGES } from '@/constants/api';
import { cacheStore } from '@/utils/cache';

interface UsePopulationDataReturn {
  data: Map<number, PopulationResponse>;
  isLoading: boolean;
  error: Error | null;
  fetchData: (prefCode: number) => Promise<void>;
  clearCache: () => void;
}

/**
 * キャッシュキーを生成
 */
const generateCacheKey = (prefCode: number): string => {
  return `population_${prefCode}`;
};

/**
 * 人口データを取得・管理するカスタムフック
 */
export const usePopulationData = (): UsePopulationDataReturn => {
  const [data, setData] = useState<Map<number, PopulationResponse>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * キャッシュをクリア
   */
  const clearCache = useCallback(() => {
    cacheStore.clear();
    setData(new Map());
  }, []);

  /**
   * 人口データを取得する
   */
  const fetchData = useCallback(async (prefCode: number) => {
    // すでにデータがある場合はスキップ
    if (data.has(prefCode)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // キャッシュをチェック
      const cacheKey = generateCacheKey(prefCode);
      const cachedData = cacheStore.get<PopulationResponse>(cacheKey);

      if (cachedData) {
        console.log('Cache hit:', cacheKey);
        setData(prev => new Map(prev).set(prefCode, cachedData));
        setIsLoading(false);
        return;
      }

      // APIからデータを取得
      console.log('Cache miss:', cacheKey);
      const response = await fetchPopulationData(prefCode);
      
      // キャッシュに保存
      cacheStore.set(cacheKey, response);
      setData(prev => new Map(prev).set(prefCode, response));
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : API_ERROR_MESSAGES.UNKNOWN;
      setError(new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  return {
    data,
    isLoading,
    error,
    fetchData,
    clearCache,
  };
}; 