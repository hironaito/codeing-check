/**
 * 人口構成APIのレスポンス型定義
 */

/**
 * 人口データの年次情報
 */
export interface PopulationData {
  year: number;
  value: number;
}

/**
 * 人口構成の種別（総人口、年少人口、生産年齢人口、老年人口）
 */
export interface PopulationComposition {
  label: string;
  data: PopulationData[];
}

/**
 * 都道府県の人口構成データ
 */
export interface PrefecturePopulation {
  boundaryYear: number;
  data: PopulationComposition[];
}

/**
 * 人口構成APIのレスポンス
 */
export interface PopulationResponse {
  message: null | string;
  result: PrefecturePopulation;
} 