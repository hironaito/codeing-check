import axios from 'axios';

// APIクライアントの基本設定
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY,
  },
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT),
});

// レスポンスインターセプター
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // エラーハンドリング
    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error('リクエストが不正です');
        case 403:
          throw new Error('APIキーが無効です');
        case 404:
          throw new Error('リソースが見つかりません');
        case 500:
          throw new Error('サーバーエラーが発生しました');
        default:
          throw new Error('予期せぬエラーが発生しました');
      }
    }
    throw error;
  }
); 