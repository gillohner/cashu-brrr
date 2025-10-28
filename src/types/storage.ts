/**
 * Storage Layer Type Definitions
 * Abstractions for different storage backends
 */

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}

export interface StorageOptions {
  prefix?: string;
  ttl?: number;
}

export interface PubkyConfig {
  homeserver?: string;
  publicKey?: string;
  privateKey?: string;
}

export type StorageType = 'local' | 'pubky' | 'memory';

export interface StorageMetadata {
  type: StorageType;
  version: string;
  lastSync?: number;
}
