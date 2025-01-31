import { useState, useCallback, useMemo } from 'react';
import { fetchPopulationData } from '@/services/api/population';
import { PopulationResponse, PopulationComposition } from '@/types/api/population';
import { API_ERROR_MESSAGES } from '@/constants/api';
import { cacheStore } from '@/utils/cache';

interface UsePopulationDataReturn {
  data: PopulationResponse | null;
  isLoading: boolean;
  error: Error | null;
  fetchData: (prefCode: number) => Promise<void>;
  clearCache: () => void;
  totalPopulation: PopulationComposition | null;
  youngPopulation: PopulationComposition | null;
  workingPopulation: PopulationComposition | null;
  elderlyPopulation: PopulationComposition | null;
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
  const [data, setData] = useState<PopulationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * キャッシュをクリア
   */
  const clearCache = useCallback(() => {
    cacheStore.clear();
    setData(null);
  }, []);

  /**
   * 人口データを取得する
   */
  const fetchData = useCallback(async (prefCode: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // キャッシュをチェック
      const cacheKey = generateCacheKey(prefCode);
      const cachedData = cacheStore.get<PopulationResponse>(cacheKey);

      if (cachedData) {
        console.log('Cache hit:', cacheKey);
        setData(cachedData);
        setIsLoading(false);
        return;
      }

      // APIからデータを取得
      console.log('Cache miss:', cacheKey);
      const response = await fetchPopulationData(prefCode);
      
      // キャッシュに保存
      cacheStore.set(cacheKey, response);
      setData(response);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : API_ERROR_MESSAGES.UNKNOWN;
      setError(new Error(errorMessage));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 総人口データを抽出
   */
  const totalPopulation = useMemo(() => {
    if (!data?.result.data) return null;
    return data.result.data.find(item => item.label === '総人口') || null;
  }, [data]);

  /**
   * 年少人口データを抽出
   */
  const youngPopulation = useMemo(() => {
    if (!data?.result.data) return null;
    return data.result.data.find(item => item.label === '年少人口') || null;
  }, [data]);

  /**
   * 生産年齢人口データを抽出
   */
  const workingPopulation = useMemo(() => {
    if (!data?.result.data) return null;
    return data.result.data.find(item => item.label === '生産年齢人口') || null;
  }, [data]);

  /**
   * 老年人口データを抽出
   */
  const elderlyPopulation = useMemo(() => {
    if (!data?.result.data) return null;
    return data.result.data.find(item => item.label === '老年人口') || null;
  }, [data]);

  return {
    data,
    isLoading,
    error,
    fetchData,
    clearCache,
    // 各人口区分のデータ
    totalPopulation,
    youngPopulation,
    workingPopulation,
    elderlyPopulation,
  };
}; 