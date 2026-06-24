/**
 * Asset Cache Layer for Campaign Media
 * Caches Lottie animations, WebP, and other media files
 * Reduces network requests and improves campaign loading performance
 */

import * as FileSystem from 'expo-file-system';

interface CacheEntry {
  uri: string;
  localPath: string;
  timestamp: number;
  size: number;
}

class AssetCacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private cacheDir: string;
  private maxCacheSize = 50 * 1024 * 1024; // 50MB
  private maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

  constructor() {
    this.cacheDir = `${FileSystem.cacheDirectory}campaign-assets/`;
    this.initCache();
  }

  /**
   * Initialize cache directory
   */
  private async initCache() {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.cacheDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.cacheDir, { intermediates: true });
        if (__DEV__) {
          console.log('[AssetCache] Cache directory created');
        }
      }
    } catch (error) {
      console.error('[AssetCache] Failed to initialize cache:', error);
    }
  }

  /**
   * Get cached asset or download if not cached
   */
  async getAsset(url: string): Promise<string> {
    // Check if already cached
    const cached = this.cache.get(url);
    if (cached) {
      // Check if cache is still valid
      const age = Date.now() - cached.timestamp;
      if (age < this.maxAge) {
        const fileInfo = await FileSystem.getInfoAsync(cached.localPath);
        if (fileInfo.exists) {
          if (__DEV__) {
            console.log('[AssetCache] ✅ Cache hit:', url);
          }
          return cached.localPath;
        }
      }
      // Cache expired or file missing, remove entry
      this.cache.delete(url);
    }

    // Download and cache
    return await this.downloadAndCache(url);
  }

  /**
   * Download asset and add to cache
   */
  private async downloadAndCache(url: string): Promise<string> {
    try {
      const filename = this.getFilenameFromUrl(url);
      const localPath = `${this.cacheDir}${filename}`;

      if (__DEV__) {
        console.log('[AssetCache] ⬇️ Downloading:', url);
      }

      // Download file
      const downloadResult = await FileSystem.downloadAsync(url, localPath);

      // Get file size
      const fileInfo = await FileSystem.getInfoAsync(downloadResult.uri);
      const size = fileInfo.exists && 'size' in fileInfo ? fileInfo.size : 0;

      // Add to cache
      const entry: CacheEntry = {
        uri: url,
        localPath: downloadResult.uri,
        timestamp: Date.now(),
        size,
      };

      this.cache.set(url, entry);

      if (__DEV__) {
        console.log('[AssetCache] ✅ Downloaded and cached:', filename);
      }

      // Check cache size and cleanup if needed
      await this.cleanupIfNeeded();

      return downloadResult.uri;
    } catch (error) {
      console.error('[AssetCache] Download failed:', error);
      // Return original URL as fallback
      return url;
    }
  }

  /**
   * Generate filename from URL
   */
  private getFilenameFromUrl(url: string): string {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop() || 'asset';
    // Add hash of full URL to prevent collisions
    const hash = this.simpleHash(url);
    return `${hash}-${filename}`;
  }

  /**
   * Simple string hash function
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Get total cache size
   */
  private getTotalCacheSize(): number {
    let total = 0;
    for (const entry of this.cache.values()) {
      total += entry.size;
    }
    return total;
  }

  /**
   * Cleanup old/large cache entries
   */
  private async cleanupIfNeeded() {
    const totalSize = this.getTotalCacheSize();

    if (totalSize > this.maxCacheSize) {
      if (__DEV__) {
        console.log('[AssetCache] 🧹 Cache size exceeded, cleaning up...');
      }

      // Sort by timestamp (oldest first)
      const entries = Array.from(this.cache.entries()).sort(
        ([, a], [, b]) => a.timestamp - b.timestamp
      );

      // Remove oldest entries until under limit
      let removedSize = 0;
      for (const [url, entry] of entries) {
        try {
          await FileSystem.deleteAsync(entry.localPath, { idempotent: true });
          this.cache.delete(url);
          removedSize += entry.size;

          if (this.getTotalCacheSize() <= this.maxCacheSize * 0.8) {
            break; // Reduce to 80% of max
          }
        } catch (error) {
          console.error('[AssetCache] Failed to delete cached file:', error);
        }
      }

      if (__DEV__) {
        console.log(`[AssetCache] Cleaned up ${(removedSize / 1024 / 1024).toFixed(2)}MB`);
      }
    }
  }

  /**
   * Preload assets for a campaign
   */
  async preloadCampaignAssets(urls: string[]): Promise<void> {
    if (__DEV__) {
      console.log(`[AssetCache] Preloading ${urls.length} assets...`);
    }

    const promises = urls.map((url) => this.getAsset(url));
    await Promise.all(promises);

    if (__DEV__) {
      console.log('[AssetCache] ✅ Preload complete');
    }
  }

  /**
   * Clear all cache
   */
  async clearCache(): Promise<void> {
    try {
      await FileSystem.deleteAsync(this.cacheDir, { idempotent: true });
      await FileSystem.makeDirectoryAsync(this.cacheDir, { intermediates: true });
      this.cache.clear();

      if (__DEV__) {
        console.log('[AssetCache] Cache cleared');
      }
    } catch (error) {
      console.error('[AssetCache] Failed to clear cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      entries: this.cache.size,
      totalSize: this.getTotalCacheSize(),
      maxSize: this.maxCacheSize,
      maxAge: this.maxAge,
    };
  }
}

// Singleton instance
export const assetCache = new AssetCacheManager();
