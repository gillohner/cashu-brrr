/**
 * Pubky Storage Adapter
 * 
 * Provides decentralized storage for note designs using Pubky.
 * 
 * STATUS: Placeholder implementation
 * WAITING FOR: Pubky v0.6.0-rc.6 stable release
 * 
 * TODO: Implement when Pubky v0.6.0 is available:
 * - Install: npm install @synonymdev/pubky@0.6.0-rc.6
 * - Update client initialization
 * - Implement authentication flow
 * - Add conflict resolution
 * - Add offline support with sync
 */

import type { StorageAdapter } from '../../types/storage';

/**
 * Placeholder Pubky storage adapter
 * 
 * This is a stub implementation that will be replaced when Pubky v0.6.0 is available.
 * For now, it throws errors to indicate the feature is not yet implemented.
 */
export class PubkyStorageAdapter implements StorageAdapter {
    private readonly prefix: string;

    constructor(prefix = 'cashu-brrr') {
        this.prefix = prefix;
        console.warn('PubkyStorageAdapter: Using placeholder implementation. Pubky v0.6.0 not yet available.');
    }

    async get<T>(_key: string): Promise<T | null> {
        throw new Error('Pubky storage not yet implemented. Waiting for v0.6.0 release.');
    }

    async set<T>(_key: string, _value: T): Promise<void> {
        throw new Error('Pubky storage not yet implemented. Waiting for v0.6.0 release.');
    }

    async remove(_key: string): Promise<void> {
        throw new Error('Pubky storage not yet implemented. Waiting for v0.6.0 release.');
    }

    async keys(): Promise<string[]> {
        throw new Error('Pubky storage not yet implemented. Waiting for v0.6.0 release.');
    }

    async clear(): Promise<void> {
        throw new Error('Pubky storage not yet implemented. Waiting for v0.6.0 release.');
    }
}

/**
 * Create a Pubky storage adapter
 * 
 * @param prefix - Storage key prefix
 * @returns PubkyStorageAdapter instance (placeholder)
 */
export function createPubkyStorage(prefix = 'cashu-brrr'): PubkyStorageAdapter {
    return new PubkyStorageAdapter(prefix);
}
