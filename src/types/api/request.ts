import type { InternalAxiosRequestConfig } from 'axios';

/**
 * キャッシュの設定
 */
export interface CacheConfig {
  /** キャッシュの有効期限（ミリ秒） */
  ttl: number;
}

/**
 * 拡張されたリクエスト設定
 */
export interface ExtendedRequestConfig extends Omit<InternalAxiosRequestConfig, 'headers'> {
  /** キャッシュの設定 */
  cache?: boolean | CacheConfig;
  /** リトライ回数 */
  retryCount?: number;
  /** ヘッダー */
  headers?: Record<string, string>;
}

/**
 * キャッシュエントリの型
 */
export interface CacheEntry {
  /** キャッシュされたデータ */
  data: any;
  /** キャッシュされた時刻 */
  timestamp: number;
}

/**
 * ストレージキャッシュの型
 */
export interface StorageCache {
  /** キャッシュされたデータ */
  data: any;
  /** キャッシュされた時刻 */
  timestamp: number;
} 