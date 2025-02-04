/**
 * 都道府県の型定義
 * @see https://opendata.resas-portal.go.jp/docs/api/v1/prefectures.html
 */
export interface Prefecture {
  /** 都道府県コード（1-47の整数） */
  prefCode: number;
  /** 都道府県名（例：東京都、大阪府） */
  prefName: string;
}

/**
 * 都道府県一覧のレスポンス型
 * RESAS APIのレスポンス形式に準拠
 */
export interface PrefecturesResponse {
  /** レスポンスメッセージ（正常時はnull） */
  message: string | null;
  /** 都道府県一覧データ */
  result: Prefecture[];
} 