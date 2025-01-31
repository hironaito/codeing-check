declare namespace NodeJS {
  interface ProcessEnv {
    // API設定
    readonly NEXT_PUBLIC_API_ENDPOINT: string;
    readonly NEXT_PUBLIC_API_KEY: string;

    // アプリケーション設定
    readonly NEXT_PUBLIC_APP_NAME: string;
    readonly NEXT_PUBLIC_APP_DESCRIPTION: string;
    readonly NEXT_PUBLIC_APP_URL: string;

    // キャッシュ設定
    readonly NEXT_PUBLIC_CACHE_MAX_AGE: string;
    readonly NEXT_PUBLIC_STALE_WHILE_REVALIDATE: string;

    // API設定
    readonly NEXT_PUBLIC_API_TIMEOUT: string;
    readonly NEXT_PUBLIC_API_RETRY_COUNT: string;
    readonly NEXT_PUBLIC_API_RETRY_DELAY: string;

    // ログ設定
    readonly NEXT_PUBLIC_LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  }
} 