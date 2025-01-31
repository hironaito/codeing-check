// 人口データの型定義
export interface PopulationData {
  year: number;
  value: number;
}

// 人口構成データの型定義
export interface PopulationComposition {
  label: string;
  data: PopulationData[];
}

// 人口構成のレスポンス型
export interface PopulationResponse {
  message: null;
  result: {
    boundaryYear: number;
    data: PopulationComposition[];
  };
} 