import { API_CONFIG } from '@/constants/api';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * キャッシュストア
 */
class CacheStore {
  private prefix: string;

  constructor(prefix: string = API_CONFIG.CACHE.PREFIX) {
    this.prefix = prefix;
  }

  /**
   * キャッシュからデータを取得
   */
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;

      const cache: CacheEntry<T> = JSON.parse(item);
      
      // TTLチェック
      if (Date.now() - cache.timestamp > API_CONFIG.CACHE.POPULATION_TTL) {
        this.remove(key);
        return null;
      }

      return cache.data;
    } catch (error) {
      console.error('Cache read error:', error);
      this.remove(key); // エラーの場合はキャッシュを削除
      return null;
    }
  }

  /**
   * キャッシュにデータを保存
   */
  set<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      const cache: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(cache));
    } catch (error) {
      console.error('Cache write error:', error);
      this.remove(key); // エラーの場合はキャッシュを削除
    }
  }

  /**
   * 特定のキーのキャッシュを削除
   */
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }

  /**
   * すべてのキャッシュを削除
   */
  clear(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
}

export const cacheStore = new CacheStore(); 