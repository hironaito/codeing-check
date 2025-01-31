# API仕様書

## 概要

本アプリケーションでは、[ゆめみフロントエンドコーディング試験 API](https://yumemi-frontend-engineer-codecheck-api.vercel.app/api-doc) を使用して都道府県別の人口データを取得します。

## エンドポイント

### 1. 都道府県一覧の取得

```typescript
GET /api/v1/prefectures
```

#### リクエストヘッダー
```
X-API-KEY: <API_KEY>
```

#### レスポンス

```typescript
type Prefecture = {
  prefCode: number;   // 都道府県コード
  prefName: string;   // 都道府県名
};

type Response = Prefecture[];
```

#### レスポンス例

```json
[
  {
    "prefCode": 1,
    "prefName": "北海道"
  },
  {
    "prefCode": 2,
    "prefName": "青森県"
  }
]
```

### 2. 人口構成データの取得

```typescript
GET /api/v1/population/composition/perYear
```

#### クエリパラメータ

- prefCode: 都道府県コード（必須）
- cityCode: 市区町村コード（オプション）

#### リクエストヘッダー
```
X-API-KEY: <API_KEY>
```

#### レスポンス

```typescript
type PopulationData = {
  label: string;          // 人口種別（総人口、年少人口、生産年齢人口、老年人口）
  data: {
    year: number;         // 年
    value: number;        // 人口
    rate?: number;        // 構成比
  }[];
};

type Response = {
  boundaryYear: number;   // 推計開始年
  data: PopulationData[];
};
```

#### レスポンス例

```json
{
  "boundaryYear": 2020,
  "data": [
    {
      "label": "総人口",
      "data": [
        {
          "year": 1980,
          "value": 12817
        },
        {
          "year": 1985,
          "value": 12707
        }
      ]
    }
  ]
}
```

## エラーレスポンス

### エラーコード

- 400: Bad Request - リクエストパラメータが不正
- 401: Unauthorized - APIキーが無効
- 404: Not Found - リソースが存在しない
- 429: Too Many Requests - レート制限超過
- 500: Internal Server Error - サーバーエラー

### エラーレスポンス形式

```typescript
type ErrorResponse = {
  statusCode: number;     // HTTPステータスコード
  message: string;        // エラーメッセージ
  description?: string;   // 詳細な説明（オプション）
};
```

## APIクライアントの実装

```typescript
import axios from 'axios';

const API_BASE_URL = 'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-API-KEY': API_KEY,
  },
});

export const fetchPrefectures = async () => {
  const response = await apiClient.get('/prefectures');
  return response.data;
};

export const fetchPopulation = async (prefCode: number) => {
  const response = await apiClient.get('/population/composition/perYear', {
    params: { prefCode },
  });
  return response.data;
};
```

## 注意事項

1. APIキーの管理
   - 環境変数として管理
   - クライアントサイドでの露出に注意

2. エラーハンドリング
   - 適切なエラーメッセージの表示
   - リトライ処理の実装

3. レート制限
   - 適切なキャッシュ戦略
   - 同時リクエストの制御

4. パフォーマンス
   - データのキャッシュ
   - 不要なリクエストの削減 