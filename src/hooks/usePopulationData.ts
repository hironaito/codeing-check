import { useState, useCallback } from 'react';
import { fetchPopulationData } from '@/services/api/population';
import { PopulationResponse } from '@/types/api/population';
import { API_ERROR_MESSAGES } from '@/constants/api';
import { cacheStore } from '@/utils/cache';

export interface UsePopulationDataReturn {
  data: Map<number, PopulationResponse>;
  isLoading: boolean;
  error: Error | null;
  fetchData: (prefCode: number) => Promise<void>;
  clearCache: () => void;
  fetchTimeMs: number | null;
  source: 'cache' | 'api' | null;
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
  const [fetchTimeMs, setFetchTimeMs] = useState<number | null>(null);
  const [source, setSource] = useState<'cache' | 'api' | null>(null);

  /**
   * キャッシュをクリア
   */
  const clearCache = useCallback(() => {
    cacheStore.clear();
    setData(new Map());
    setFetchTimeMs(null);
    setSource(null);
  }, []);

  /**
   * 人口データを取得する
   */
  const fetchData = useCallback(async (prefCode: number) => {
    const startTime = performance.now();
    setIsLoading(true);
    setError(null);

    try {
      // キャッシュをチェック
      const cacheKey = generateCacheKey(prefCode);
      const cachedData = cacheStore.get<PopulationResponse>(cacheKey);

      if (cachedData) {
        setData(prev => new Map(prev).set(prefCode, cachedData));
        setSource('cache');
        const endTime = performance.now();
        setFetchTimeMs(Number((endTime - startTime).toFixed(3)));
        setIsLoading(false);
        return;
      }

      // APIからデータを取得
      const response = await fetchPopulationData(prefCode);
      
      // キャッシュに保存
      cacheStore.set(cacheKey, response);
      setData(prev => new Map(prev).set(prefCode, response));
      const endTime = performance.now();
      setFetchTimeMs(Number((endTime - startTime).toFixed(3)));
      setSource('api');
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : API_ERROR_MESSAGES.UNKNOWN;
      setError(new Error(errorMessage));
      setSource(null);
      setFetchTimeMs(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchData,
    clearCache,
    fetchTimeMs,
    source,
  };
}; 