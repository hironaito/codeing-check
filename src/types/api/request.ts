import type { InternalAxiosRequestConfig } from 'axios';

/**
 * キャッシュの設定
 * @description APIレスポンスのキャッシュ動作を制御するための設定
 */
export interface CacheConfig {
  /** キャッシュの有効期限（ミリ秒） */
  ttl: number;
}

/**
 * 拡張されたリクエスト設定
 * @description Axiosのリクエスト設定を拡張し、キャッシュやリトライの設定を追加
 */
export interface ExtendedRequestConfig extends Omit<InternalAxiosRequestConfig, 'headers'> {
  /** 
   * キャッシュの設定
   * - false: キャッシュを無効化
   * - true: デフォルトのキャッシュ設定を使用
   * - CacheConfig: カスタムのキャッシュ設定を使用
   */
  cache?: boolean | CacheConfig;
  /** 
   * リトライ回数
   * @default 0
   */
  retryCount?: number;
  /** 
   * カスタムヘッダー
   * @description リクエストに追加するカスタムヘッダー
   */
  headers?: Record<string, string>;
}

/**
 * キャッシュエントリの型
 * @template T キャッシュするデータの型
 */
export interface CacheEntry<T = unknown> {
  /** キャッシュされたデータ */
  data: T;
  /** キャッシュされた時刻（UNIXタイムスタンプ） */
  timestamp: number;
}

/**
 * ストレージキャッシュの型
 * @template T キャッシュするデータの型
 * @description ローカルストレージに保存するキャッシュデータの形式
 */
export interface StorageCache<T = unknown> {
  /** キャッシュされたデータ */
  data: T;
  /** キャッシュされた時刻（UNIXタイムスタンプ） */
  timestamp: number;
} 