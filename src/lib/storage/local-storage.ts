/**
 * LocalStorage Adapter
 * Implements StorageAdapter interface for browser localStorage
 */

import type { StorageAdapter } from '@/types/storage';

export class LocalStorageAdapter implements StorageAdapter {
  private prefix: string;

  constructor(prefix: string = 'cashu-brrr:') {
    this.prefix = prefix;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = window.localStorage.getItem(this.getKey(key));
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      window.localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    window.localStorage.removeItem(this.getKey(key));
  }

  async clear(): Promise<void> {
    const keys = await this.keys();
    keys.forEach(key => window.localStorage.removeItem(this.getKey(key)));
  }

  async keys(): Promise<string[]> {
    const allKeys = Object.keys(window.localStorage);
    return allKeys
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.substring(this.prefix.length));
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}
