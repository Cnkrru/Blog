/**
 * 智能缓存类 — Redis-like 前端缓存
 * 应用后端Redis缓存思想的前端实现
 */

export class RedisLikeCache {
  memoryCache
  localStorageCache
  stats
  options

  constructor(options = {}) {
    this.memoryCache = new Map()
    this.localStorageCache = {
      get: (key) => {
        try {
          const item = localStorage.getItem(`cache_${key}`)
          if (item) {
            const { value, expiry } = JSON.parse(item)
            if (expiry && Date.now() > expiry) {
              localStorage.removeItem(`cache_${key}`)
              return null
            }
            return value
          }
        } catch (e) {}
        return null
      },
      set: (key, value, ttl) => {
        try {
          const item = {
            value,
            expiry: ttl ? Date.now() + ttl * 1000 : null
          }
          localStorage.setItem(`cache_${key}`, JSON.stringify(item))
        } catch (e) {}
      }
    }

    this.stats = {
      hits: { memory: 0, storage: 0 },
      misses: 0,
      evictions: 0,
      size: { memory: 0, storage: 0 }
    }

    this.options = {
      memoryCapacity: options.memoryCapacity || 100,
      storageCapacity: options.storageCapacity || 500,
      defaultTTL: options.defaultTTL || 300,
      ...options
    }
  }

  get(key) {
    if (this.memoryCache.has(key)) {
      this.stats.hits.memory++
      return this.memoryCache.get(key)
    }

    const storageValue = this.localStorageCache.get(key)
    if (storageValue !== null) {
      this.stats.hits.storage++
      this.memoryCache.set(key, storageValue)
      return storageValue
    }

    this.stats.misses++
    return null
  }

  set(key, value, options = {}) {
    const {
      ttl = this.options.defaultTTL,
      priority = 'normal',
      persist = priority === 'high' || priority === 'critical'
    } = options

    this.memoryCache.set(key, value)
    this.stats.size.memory = this.memoryCache.size

    if (persist) {
      this.localStorageCache.set(key, value, ttl)
      this.updateStorageSize()
    }

    if (this.memoryCache.size > this.options.memoryCapacity) {
      this.evictByPriority()
    }

    return true
  }

  evictByPriority() {
    const evictCount = Math.ceil(this.memoryCache.size * 0.1)
    const keys = Array.from(this.memoryCache.keys()).slice(0, evictCount)
    keys.forEach(key => {
      this.memoryCache.delete(key)
      this.stats.evictions++
    })
    this.stats.size.memory = this.memoryCache.size
  }

  updateStorageSize() {
    try {
      let count = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('cache_')) count++
      }
      this.stats.size.storage = count
    } catch (e) {
      this.stats.size.storage = 0
    }
  }

  clear() {
    this.memoryCache.clear()

    try {
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('cache_') || key.startsWith('cache_history_'))) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
    } catch (e) {}

    this.stats = {
      hits: { memory: 0, storage: 0 },
      misses: 0,
      evictions: 0,
      size: { memory: 0, storage: 0 }
    }

    return true
  }

  getStats() {
    const totalHits = this.stats.hits.memory + this.stats.hits.storage
    const totalAccesses = totalHits + this.stats.misses
    const hitRate = totalAccesses > 0
      ? ((totalHits / totalAccesses) * 100).toFixed(2)
      : 0

    return {
      memory: {
        size: this.stats.size.memory,
        capacity: this.options.memoryCapacity,
        hits: this.stats.hits.memory
      },
      storage: {
        size: this.stats.size.storage,
        capacity: this.options.storageCapacity,
        hits: this.stats.hits.storage
      },
      overall: {
        hits: totalHits,
        misses: this.stats.misses,
        evictions: this.stats.evictions,
        hitRate: `${hitRate}%`,
        totalAccesses
      }
    }
  }
}