import { apiClient } from './apiClient';
import type { PrefecturesResponse } from '@/types/api/prefecture';

// 都道府県一覧を取得
export const getPrefectures = async () => {
  const { data } = await apiClient.get<PrefecturesResponse>('/api/v1/prefectures');
  return data.result;
}; 