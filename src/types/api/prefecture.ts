// 都道府県の型定義
export interface Prefecture {
  prefCode: number;
  prefName: string;
}

// 都道府県一覧のレスポンス型
export interface PrefecturesResponse {
  message: null;
  result: Prefecture[];
} 