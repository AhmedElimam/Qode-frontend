interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class Cache {
  private storage = new Map<string, CacheItem<any>>()

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.storage.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get<T>(key: string): T | null {
    const item = this.storage.get(key)
    
    if (!item) {
      return null
    }

    const isExpired = Date.now() - item.timestamp > item.ttl
    if (isExpired) {
      this.storage.delete(key)
      return null
    }

    return item.data
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): boolean {
    return this.storage.delete(key)
  }

  clear(): void {
    this.storage.clear()
  }

  size(): number {
    return this.storage.size
  }
}

export const cache = new Cache()

export const cacheKeys = {
  categories: 'categories',
  sources: 'sources',
  userPreferences: 'user_preferences',
  articles: (page: number) => `articles_page_${page}`,
  searchResults: (query: string) => `search_${query}`,
  article: (id: number) => `article_${id}`
} as const
