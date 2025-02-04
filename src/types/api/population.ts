/**
 * 人口構成APIのレスポンス型定義
 * @see https://opendata.resas-portal.go.jp/docs/api/v1/population/composition/perYear.html
 */

/**
 * 人口データの年次情報
 */
export interface PopulationData {
  /** 年度（西暦） */
  year: number;
  /** 人口数（人） */
  value: number;
}

/**
 * 人口構成の種別データ
 * @description 総人口、年少人口（0-14歳）、生産年齢人口（15-64歳）、老年人口（65歳以上）の4種類
 */
export interface PopulationComposition {
  /** データ種別のラベル（例：総人口、年少人口） */
  label: string;
  /** 年次ごとの人口データ配列 */
  data: PopulationData[];
}

/**
 * 都道府県の人口構成データ
 */
export interface PrefecturePopulation {
  /** 実績値と推計値の区切り年 */
  boundaryYear: number;
  /** 人口構成データの配列 */
  data: PopulationComposition[];
}

/**
 * 人口構成APIのレスポンス
 * RESAS APIのレスポンス形式に準拠
 */
export interface PopulationResponse {
  /** レスポンスメッセージ（正常時はnull） */
  message: null | string;
  /** 人口構成データ */
  result: PrefecturePopulation;
} 