/**
 * 缓存类库
 * 包含项目中使用的各种缓存策略
 */

/**
 * LFU (Least Frequently Used) 缓存类
 * 最少使用频率缓存策略
 */
export class LFUCache {
  constructor(capacity = 100) {
    this.capacity = capacity
    this.cache = new Map() // key -> {value, freq}
    this.freqMap = new Map() // freq -> Set of keys
    this.minFreq = 0
    this.hits = 0
    this.misses = 0
  }

  /**
   * 获取缓存值
   * @param {string} key - 缓存键
   * @returns {any|null} 缓存值或 null
   */
  get(key) {
    if (!this.cache.has(key)) {
      this.misses++
      return null
    }
    
    const item = this.cache.get(key)
    // 更新频率
    this.updateFrequency(key, item)
    this.hits++
    return item.value
  }

  /**
   * 设置缓存值
   * @param {string} key - 缓存键
   * @param {any} value - 缓存值
   */
  put(key, value) {
    if (this.capacity === 0) return
    
    if (this.cache.has(key)) {
      const item = this.cache.get(key)
      item.value = value
      this.updateFrequency(key, item)
    } else {
      if (this.cache.size >= this.capacity) {
        this.evict()
      }
      
      const item = { value, freq: 1 }
      this.cache.set(key, item)
      
      if (!this.freqMap.has(1)) {
        this.freqMap.set(1, new Set())
      }
      this.freqMap.get(1).add(key)
      this.minFreq = 1
    }
  }

  /**
   * 更新缓存项频率
   * @param {string} key - 缓存键
   * @param {object} item - 缓存项
   */
  updateFrequency(key, item) {
    const oldFreq = item.freq
    const newFreq = oldFreq + 1
    
    // 从旧频率集合中移除
    this.freqMap.get(oldFreq).delete(key)
    if (this.freqMap.get(oldFreq).size === 0) {
      this.freqMap.delete(oldFreq)
      if (oldFreq === this.minFreq) {
        this.minFreq++
      }
    }
    
    // 添加到新频率集合
    if (!this.freqMap.has(newFreq)) {
      this.freqMap.set(newFreq, new Set())
    }
    this.freqMap.get(newFreq).add(key)
    
    item.freq = newFreq
  }

  /**
   * 淘汰最少使用的缓存项
   */
  evict() {
    const keys = this.freqMap.get(this.minFreq)
    const keyToRemove = keys.values().next().value
    keys.delete(keyToRemove)
    
    if (keys.size === 0) {
      this.freqMap.delete(this.minFreq)
    }
    
    this.cache.delete(keyToRemove)
  }

  /**
   * 清除所有缓存
   */
  clear() {
    this.cache.clear()
    this.freqMap.clear()
    this.minFreq = 0
    this.hits = 0
    this.misses = 0
  }

  /**
   * 获取缓存统计信息
   * @returns {object} 统计信息
   */
  getStats() {
    const hitRate = this.hits + this.misses > 0 
      ? (this.hits / (this.hits + this.misses) * 100).toFixed(2)
      : 0
    
    return {
      size: this.cache.size,
      capacity: this.capacity,
      hits: this.hits,
      misses: this.misses,
      hitRate: `${hitRate}%`,
      minFreq: this.minFreq
    }
  }
}

/**
 * LRU (Least Recently Used) 缓存类
 * 最近最少使用缓存策略
 */
export class LRUCache {
  constructor(capacity = 100) {
    this.capacity = capacity
    this.cache = new Map()
    this.hits = 0
    this.misses = 0
  }

  get(key) {
    if (!this.cache.has(key)) {
      this.misses++
      return null
    }
    
    const value = this.cache.get(key)
    // 移动到最近使用位置
    this.cache.delete(key)
    this.cache.set(key, value)
    this.hits++
    return value
  }

  put(key, value) {
    if (this.capacity === 0) return
    
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.capacity) {
      // 淘汰最久未使用的项
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    this.cache.set(key, value)
  }

  clear() {
    this.cache.clear()
    this.hits = 0
    this.misses = 0
  }

  getStats() {
    const hitRate = this.hits + this.misses > 0 
      ? (this.hits / (this.hits + this.misses) * 100).toFixed(2)
      : 0
    
    return {
      size: this.cache.size,
      capacity: this.capacity,
      hits: this.hits,
      misses: this.misses,
      hitRate: `${hitRate}%`
    }
  }
}

/**
 * 增量标签计数器类
 * 用于标签云的增量更新
 */
export class IncrementalTagCounter {
  constructor() {
    this.tagMap = new Map() // 标签 -> 计数
    this.articleTagMap = new Map() // 文章ID -> 标签集合
    this.tagArticlesCache = new Map() // 标签 -> 文章列表缓存
    this.sortedTagsCache = null // 排序后的标签缓存
    this.topTagsCache = null // 热门标签缓存
  }

  /**
   * 添加文章时增量更新
   * @param {object} article - 文章对象
   */
  addArticle(article) {
    const articleId = article.id
    const oldTags = this.articleTagMap.get(articleId) || new Set()
    const newTags = new Set(article.tags || [])
    
    // 移除旧标签的计数
    oldTags.forEach(tag => {
      const count = this.tagMap.get(tag) || 0
      if (count > 1) {
        this.tagMap.set(tag, count - 1)
      } else {
        this.tagMap.delete(tag)
      }
      // 清除相关缓存
      this.tagArticlesCache.delete(tag)
    })
    
    // 添加新标签的计数
    newTags.forEach(tag => {
      this.tagMap.set(tag, (this.tagMap.get(tag) || 0) + 1)
      // 清除相关缓存
      this.tagArticlesCache.delete(tag)
    })
    
    this.articleTagMap.set(articleId, newTags)
    
    // 清除排序缓存
    this.sortedTagsCache = null
    this.topTagsCache = null
  }

  /**
   * 批量添加文章
   * @param {Array} articles - 文章数组
   */
  addArticles(articles) {
    articles.forEach(article => this.addArticle(article))
  }

  /**
   * 获取所有标签（按字母排序）
   * @returns {Array} 标签数组
   */
  getAllTags() {
    if (this.sortedTagsCache) {
      return this.sortedTagsCache
    }
    
    const sortedTags = Array.from(this.tagMap.keys()).sort()
    this.sortedTagsCache = sortedTags
    return sortedTags
  }

  /**
   * 获取标签计数
   * @param {string} tag - 标签
   * @returns {number} 计数
   */
  getTagCount(tag) {
    return this.tagMap.get(tag) || 0
  }

  /**
   * 获取所有标签计数
   * @returns {object} 标签计数对象
   */
  getAllTagCounts() {
    return Object.fromEntries(this.tagMap)
  }

  /**
   * 获取包含某个标签的文章
   * @param {string} tag - 标签
   * @param {Array} allArticles - 所有文章数组
   * @returns {Array} 文章数组
   */
  getArticlesByTag(tag, allArticles) {
    if (this.tagArticlesCache.has(tag)) {
      return this.tagArticlesCache.get(tag)
    }
    
    const articles = allArticles.filter(article => {
      const articleTags = this.articleTagMap.get(article.id) || new Set()
      return articleTags.has(tag)
    })
    
    this.tagArticlesCache.set(tag, articles)
    return articles
  }

  /**
   * 获取热门标签（按频率排序）
   * @param {number} k - 返回的标签数量
   * @returns {Array} 热门标签数组
   */
  getTopTags(k = 20) {
    if (this.topTagsCache && this.topTagsCache.k === k) {
      return this.topTagsCache.tags
    }
    
    const tagEntries = Array.from(this.tagMap.entries())
    const sortedTags = tagEntries
      .sort((a, b) => b[1] - a[1])
      .slice(0, k)
      .map(([tag]) => tag)
    
    this.topTagsCache = { k, tags: sortedTags }
    return sortedTags
  }

  /**
   * 清除所有缓存
   */
  clearCache() {
    this.tagArticlesCache.clear()
    this.sortedTagsCache = null
    this.topTagsCache = null
  }
}

/**
 * 防抖搜索类
 */
export class DebouncedSearch {
  constructor(searchFn, delay = 300) {
    this.searchFn = searchFn
    this.delay = delay
    this.timeoutId = null
  }

  search(query, callback) {
    clearTimeout(this.timeoutId)
    this.timeoutId = setTimeout(() => {
      const results = this.searchFn(query)
      if (callback) callback(results)
    }, this.delay)
  }

  cancel() {
    clearTimeout(this.timeoutId)
  }
}

/**
 * 缓存搜索类
 */
export class CachedSearch {
  constructor(searchFn, cacheCapacity = 100) {
    this.searchFn = searchFn
    this.cache = new LFUCache(cacheCapacity)
  }

  search(query) {
    const cached = this.cache.get(query)
    if (cached !== null) {
      return cached
    }
    
    const results = this.searchFn(query)
    this.cache.put(query, results)
    return results
  }

  clearCache() {
    this.cache.clear()
  }

  getCacheStats() {
    return this.cache.getStats()
  }
}
/**
 * Redis-like 智能缓存类
 * 应用后端Redis缓存思想的前端实现
 */
export class RedisLikeCache {
  constructor(options = {}) {
    // 多级缓存（类似Redis分层）
    this.memoryCache = new Map(); // 内存缓存（最快）
    this.localStorageCache = {   // localStorage缓存（持久化）
      get: (key) => {
        try {
          const item = localStorage.getItem(`cache_${key}`);
          if (item) {
            const { value, expiry } = JSON.parse(item);
            if (expiry && Date.now() > expiry) {
              localStorage.removeItem(`cache_${key}`);
              return null;
            }
            return value;
          }
        } catch (e) {}
        return null;
      },
      set: (key, value, ttl) => {
        try {
          const item = {
            value,
            expiry: ttl ? Date.now() + ttl * 1000 : null
          };
          localStorage.setItem(`cache_${key}`, JSON.stringify(item));
        } catch (e) {}
      }
    };
    
    // 缓存统计（类似Redis INFO）
    this.stats = {
      hits: { memory: 0, storage: 0 },
      misses: 0,
      evictions: 0,
      size: { memory: 0, storage: 0 }
    };
    
    // 缓存预热队列
    this.warmupQueue = new Set();
    
    // 配置
    this.options = {
      memoryCapacity: options.memoryCapacity || 100,
      storageCapacity: options.storageCapacity || 500,
      defaultTTL: options.defaultTTL || 300,
      ...options
    };
  }

  /**
   * 智能获取（先内存，后localStorage）
   * @param {string} key - 缓存键
   * @returns {any|null} 缓存值或null
   */
  get(key) {
    // 1. 检查内存缓存
    if (this.memoryCache.has(key)) {
      this.stats.hits.memory++;
      return this.memoryCache.get(key);
    }
    
    // 2. 检查localStorage缓存
    const storageValue = this.localStorageCache.get(key);
    if (storageValue !== null) {
      this.stats.hits.storage++;
      // 回填到内存缓存
      this.memoryCache.set(key, storageValue);
      return storageValue;
    }
    
    // 3. 缓存未命中
    this.stats.misses++;
    return null;
  }

  /**
   * 智能设置（设置到两级缓存）
   * @param {string} key - 缓存键
   * @param {any} value - 缓存值
   * @param {object} options - 配置选项
   */
  set(key, value, options = {}) {
    const { 
      ttl = this.options.defaultTTL, 
      priority = 'normal',
      persist = priority === 'high' || priority === 'critical'
    } = options;
    
    // 设置内存缓存
    this.memoryCache.set(key, value);
    this.stats.size.memory = this.memoryCache.size;
    
    // 根据优先级决定是否持久化
    if (persist) {
      this.localStorageCache.set(key, value, ttl);
      this.updateStorageSize();
    }
    
    // 智能淘汰（当内存缓存过大时）
    if (this.memoryCache.size > this.options.memoryCapacity) {
      this.evictByPriority();
    }
    
    return true;
  }

  /**
   * 智能淘汰策略（类似Redis淘汰策略）
   */
  evictByPriority() {
    // 计算每个key的访问频率和最后访问时间
    const keyScores = new Map();
    const now = Date.now();
    
    this.memoryCache.forEach((value, key) => {
      // 获取访问历史（模拟）
      const accessHistory = this.getAccessHistory(key) || [];
      const lastAccess = accessHistory[accessHistory.length - 1] || now;
      
      // 综合评分：访问频率 * 0.6 + 新鲜度 * 0.4
      const freqScore = Math.min(accessHistory.length / 10, 1) * 0.6;
      const freshnessScore = Math.max(0, 1 - (now - lastAccess) / (24 * 60 * 60 * 1000)) * 0.4;
      keyScores.set(key, freqScore + freshnessScore);
    });
    
    // 淘汰评分最低的10%
    const sortedKeys = Array.from(keyScores.entries())
      .sort((a, b) => a[1] - b[1]);
    
    const evictCount = Math.ceil(this.memoryCache.size * 0.1);
    for (let i = 0; i < evictCount; i++) {
      const [key] = sortedKeys[i];
      this.memoryCache.delete(key);
      this.stats.evictions++;
    }
    
    this.stats.size.memory = this.memoryCache.size;
  }

  /**
   * 获取访问历史（模拟）
   */
  getAccessHistory(key) {
    try {
      const history = localStorage.getItem(`cache_history_${key}`);
      return history ? JSON.parse(history) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * 记录访问历史
   */
  recordAccess(key) {
    try {
      const history = this.getAccessHistory(key);
      history.push(Date.now());
      // 只保留最近100次访问
      if (history.length > 100) history.shift();
      localStorage.setItem(`cache_history_${key}`, JSON.stringify(history));
    } catch (e) {}
  }

  /**
   * 更新存储大小统计
   */
  updateStorageSize() {
    try {
      let count = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cache_')) {
          count++;
        }
      }
      this.stats.size.storage = count;
    } catch (e) {
      this.stats.size.storage = 0;
    }
  }

  /**
   * 缓存预热（应用启动时预加载）
   * @param {Array} preloadData - 预加载数据 [{key, value, options}]
   * @returns {Promise} 预热完成Promise
   */
  async warmup(preloadData) {
    console.log('开始缓存预热...');
    
    // 分批预热，避免阻塞
    const batchSize = 10;
    const promises = [];
    
    for (let i = 0; i < preloadData.length; i += batchSize) {
      const batch = preloadData.slice(i, i + batchSize);
      
      const promise = new Promise(resolve => {
        // 使用requestIdleCallback避免阻塞主线程
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            batch.forEach(({ key, value, options = {} }) => {
              this.set(key, value, { 
                priority: 'high', 
                ttl: 3600,
                ...options 
              });
            });
            resolve();
          });
        } else {
          // 降级方案
          setTimeout(() => {
            batch.forEach(({ key, value, options = {} }) => {
              this.set(key, value, { 
                priority: 'high', 
                ttl: 3600,
                ...options 
              });
            });
            resolve();
          }, 0);
        }
      });
      
      promises.push(promise);
    }
    
    await Promise.all(promises);
    console.log('缓存预热完成，预热了', preloadData.length, '个项目');
    return this.getStats();
  }

  /**
   * 清除所有缓存
   */
  clear() {
    this.memoryCache.clear();
    
    // 清除localStorage中的缓存
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('cache_') || key.startsWith('cache_history_'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (e) {}
    
    // 重置统计
    this.stats = {
      hits: { memory: 0, storage: 0 },
      misses: 0,
      evictions: 0,
      size: { memory: 0, storage: 0 }
    };
    
    return true;
  }

  /**
   * 获取缓存统计信息（类似Redis INFO）
   * @returns {object} 统计信息
   */
  getStats() {
    const totalHits = this.stats.hits.memory + this.stats.hits.storage;
    const totalAccesses = totalHits + this.stats.misses;
    const hitRate = totalAccesses > 0 
      ? ((totalHits / totalAccesses) * 100).toFixed(2)
      : 0;
    
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
    };
  }

  /**
   * 获取缓存键列表（类似Redis KEYS）
   * @param {string} pattern - 匹配模式
   * @returns {Array} 匹配的键列表
   */
  keys(pattern = '*') {
    const keys = [];
    
    // 内存缓存键
    this.memoryCache.forEach((value, key) => {
      if (this.matchPattern(key, pattern)) {
        keys.push(key);
      }
    });
    
    // localStorage缓存键
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cache_')) {
          const cacheKey = key.replace('cache_', '');
          if (this.matchPattern(cacheKey, pattern)) {
            keys.push(cacheKey);
          }
        }
      }
    } catch (e) {}
    
    return [...new Set(keys)]; // 去重
  }

  /**
   * 模式匹配
   */
  matchPattern(key, pattern) {
    if (pattern === '*') return true;
    
    // 简单通配符匹配
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    
    try {
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(key);
    } catch (e) {
      return key.includes(pattern);
    }
  }
}