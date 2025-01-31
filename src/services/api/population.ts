import { PopulationResponse } from '@/types/api/population';

/**
 * RESAS APIのベースURL
 */
const RESAS_API_BASE_URL = 'https://opendata.resas-portal.go.jp/api/v1';

/**
 * 人口構成APIのエンドポイント
 */
const POPULATION_ENDPOINT = '/population/composition/perYear';

/**
 * 人口構成APIのインターフェース
 */
export const fetchPopulationData = async (
  prefCode: number,
  apiKey: string
): Promise<PopulationResponse> => {
  const url = new URL(`${RESAS_API_BASE_URL}${POPULATION_ENDPOINT}`);
  url.searchParams.append('prefCode', prefCode.toString());
  url.searchParams.append('cityCode', '-');

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'X-API-KEY': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: PopulationResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch population data: ${error.message}`);
    }
    throw new Error('Failed to fetch population data');
  }
}; 