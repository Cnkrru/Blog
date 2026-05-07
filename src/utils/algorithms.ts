/**
 * 算法优化工具函数
 * 提供高性能的数据结构和算法实现
 */

// ==================== 数据结构 ====================

/**
 * 最小堆实现
 */
export class MinHeap {
  constructor(compare = (a, b) => a - b) {
    this.heap = [];
    this.compare = compare;
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  push(value) {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.isEmpty()) return null;
    
    const min = this.heap[0];
    const last = this.heap.pop();
    
    if (!this.isEmpty()) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    
    return min;
  }

  peek() {
    return this.isEmpty() ? null : this.heap[0];
  }

  bubbleUp(index) {
    const element = this.heap[index];
    
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      
      if (this.compare(element, parent) >= 0) break;
      
      this.heap[index] = parent;
      this.heap[parentIndex] = element;
      index = parentIndex;
    }
  }

  sinkDown(index) {
    const length = this.heap.length;
    const element = this.heap[index];
    
    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let swapIndex = null;
      let leftChild, rightChild;
      
      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        if (this.compare(leftChild, element) < 0) {
          swapIndex = leftChildIndex;
        }
      }
      
      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if (
          (swapIndex === null && this.compare(rightChild, element) < 0) ||
          (swapIndex !== null && this.compare(rightChild, leftChild) < 0)
        ) {
          swapIndex = rightChildIndex;
        }
      }
      
      if (swapIndex === null) break;
      
      this.heap[index] = this.heap[swapIndex];
      this.heap[swapIndex] = element;
      index = swapIndex;
    }
  }

  toArray() {
    return [...this.heap].sort(this.compare);
  }
}

/**
 * 最大堆实现
 */
export class MaxHeap extends MinHeap {
  constructor(compare = (a, b) => b - a) {
    super(compare);
  }
}

/**
 * 布隆过滤器
 */
export class BloomFilter {
  constructor(size = 1024, hashCount = 3) {
    this.size = size;
    this.hashCount = hashCount;
    this.bitArray = new Array(size).fill(false);
  }

  add(item) {
    for (let i = 0; i < this.hashCount; i++) {
      const hash = this.hash(item, i);
      this.bitArray[hash % this.size] = true;
    }
  }

  mightContain(item) {
    for (let i = 0; i < this.hashCount; i++) {
      const hash = this.hash(item, i);
      if (!this.bitArray[hash % this.size]) {
        return false;
      }
    }
    return true;
  }

  hash(str, seed) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i) + seed;
      hash |= 0; // 转换为32位整数
    }
    return Math.abs(hash);
  }

  clear() {
    this.bitArray.fill(false);
  }
}

// ==================== 搜索算法 ====================

/**
 * BM25 相关性评分算法
 */
export class BM25Scorer {
  constructor(k1 = 1.2, b = 0.75) {
    this.k1 = k1;
    this.b = b;
    this.documents = new Map();
    this.docLengths = new Map();
    this.termDocFreq = new Map();
    this.totalDocs = 0;
    this.avgDocLength = 0;
  }

  addDocument(docId, terms) {
    this.documents.set(docId, terms);
    this.docLengths.set(docId, terms.length);
    
    // 更新统计信息
    this.totalDocs++;
    this.avgDocLength = ((this.avgDocLength * (this.totalDocs - 1)) + terms.length) / this.totalDocs;
    
    // 更新文档频率
    const uniqueTerms = new Set(terms);
    uniqueTerms.forEach(term => {
      this.termDocFreq.set(term, (this.termDocFreq.get(term) || 0) + 1);
    });
  }

  score(docId, queryTerms) {
    const docTerms = this.documents.get(docId);
    if (!docTerms) return 0;
    
    const docLength = this.docLengths.get(docId);
    let score = 0;
    
    queryTerms.forEach(term => {
      // 计算词频
      const tf = docTerms.filter(t => t === term).length;
      if (tf === 0) return;
      
      // 计算逆文档频率
      const df = this.termDocFreq.get(term) || 0;
      const idf = Math.log((this.totalDocs - df + 0.5) / (df + 0.5) + 1);
      
      // BM25 公式
      const numerator = tf * (this.k1 + 1);
      const denominator = tf + this.k1 * (1 - this.b + this.b * (docLength / this.avgDocLength));
      score += idf * (numerator / denominator);
    });
    
    return score;
  }
}

/**
 * 编辑距离计算（Levenshtein距离）
 */
export function levenshteinDistance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  
  if (len1 === 0) return len2;
  if (len2 === 0) return len1;
  
  // 使用滚动数组优化空间复杂度
  let prevRow = new Array(len2 + 1).fill(0).map((_, i) => i);
  let currRow = new Array(len2 + 1);
  
  for (let i = 1; i <= len1; i++) {
    currRow[0] = i;
    
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      currRow[j] = Math.min(
        prevRow[j] + 1,      // 删除
        currRow[j - 1] + 1,  // 插入
        prevRow[j - 1] + cost // 替换
      );
    }
    
    // 滚动数组
    [prevRow, currRow] = [currRow, prevRow];
  }
  
  return prevRow[len2];
}

/**
 * Jaccard 相似度计算
 */
export function jaccardSimilarity(set1, set2) {
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

// ==================== 排序算法 ====================

/**
 * 快速选择算法（找到第k小的元素）
 */
export function quickSelect(arr, k, left = 0, right = arr.length - 1) {
  if (left === right) return arr[left];
  
  const pivotIndex = partition(arr, left, right);
  
  if (k === pivotIndex) {
    return arr[k];
  } else if (k < pivotIndex) {
    return quickSelect(arr, k, left, pivotIndex - 1);
  } else {
    return quickSelect(arr, k, pivotIndex + 1, right);
  }
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left;
  
  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  
  [arr[i], arr[right]] = [arr[right], arr[i]];
  return i;
}

/**
 * 归并排序（稳定排序）
 */
export function mergeSort(arr, compare = (a, b) => a - b) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), compare);
  const right = mergeSort(arr.slice(mid), compare);
  
  return merge(left, right, compare);
}

function merge(left, right, compare) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (compare(left[i], right[j]) <= 0) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}

// ==================== 字符串算法 ====================

/**
 * KMP 字符串匹配算法
 */
export function kmpSearch(text, pattern) {
  const lps = computeLPSArray(pattern);
  const result = [];
  let i = 0, j = 0;
  
  while (i < text.length) {
    if (pattern[j] === text[i]) {
      i++;
      j++;
    }
    
    if (j === pattern.length) {
      result.push(i - j);
      j = lps[j - 1];
    } else if (i < text.length && pattern[j] !== text[i]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }
  
  return result;
}

function computeLPSArray(pattern) {
  const lps = new Array(pattern.length).fill(0);
  let length = 0;
  let i = 1;
  
  while (i < pattern.length) {
    if (pattern[i] === pattern[length]) {
      length++;
      lps[i] = length;
      i++;
    } else {
      if (length !== 0) {
        length = lps[length - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }
  
  return lps;
}

/**
 * 字符串模糊匹配（带容错）
 */
export function fuzzyMatch(text, pattern, maxErrors = 2) {
  const n = text.length;
  const m = pattern.length;
  
  if (Math.abs(n - m) > maxErrors) return false;
  
  // 使用动态规划计算编辑距离
  const dp = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = pattern[i - 1] === text[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  
  return dp[m][n] <= maxErrors;
}

// ==================== 性能监控 ====================

/**
 * 性能测量装饰器
 */
export function measurePerformance(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args) {
    const startTime = performance.now();
    const result = originalMethod.apply(this, args);
    const endTime = performance.now();
    
    console.log(`${propertyKey} 执行时间: ${(endTime - startTime).toFixed(2)}ms`);
    
    return result;
  };
  
  return descriptor;
}

/**
 * 节流函数
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 防抖函数
 */
export function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// ==================== 导出所有工具 ====================

export default {
  // 数据结构
  MinHeap,
  MaxHeap,
  BloomFilter,
  
  // 搜索算法
  BM25Scorer,
  levenshteinDistance,
  jaccardSimilarity,
  
  // 排序算法
  quickSelect,
  mergeSort,
  
  // 字符串算法
  kmpSearch,
  fuzzyMatch,
  
  // 性能监控
  measurePerformance,
  throttle,
  debounce
};
// ==================== 后端算法思想前端实现 ====================

/**
 * Elasticsearch-like 搜索评分器
 * 将Elasticsearch的搜索算法思想应用到前端
 */
export class ElasticsearchLikeScorer {
  constructor() {
    // 字段权重配置（类似Elasticsearch的field boosting）
    this.fieldWeights = {
      title: 3.0,     // 标题权重最高
      tags: 2.0,      // 标签次之
      category: 1.5,  // 分类
      description: 1.0 // 描述
    };
    
    // BM25参数优化
    this.bm25Params = {
      k1: 1.2,
      b: 0.75,
      avgFieldLengths: new Map() // 各字段平均长度
    };
    
    // 倒排索引（类似Elasticsearch）
    this.invertedIndex = new Map(); // term -> {docId: {field: freq}}
    this.fieldLengths = new Map(); // docId -> {field: length}
    this.totalDocs = 0;
    this.fieldDocFreq = new Map(); // field -> term -> doc frequency
  }

  // 构建倒排索引（类似Elasticsearch索引过程）
  buildInvertedIndex(documents) {
    this.totalDocs = documents.length;
    
    documents.forEach(doc => {
      const docId = doc.id;
      this.fieldLengths.set(docId, {});
      
      // 为每个字段建立索引
      Object.keys(this.fieldWeights).forEach(field => {
        if (doc[field]) {
          const terms = this.tokenizeField(doc[field], field);
          const fieldLength = terms.length;
          
          // 记录字段长度
          this.fieldLengths.get(docId)[field] = fieldLength;
          
          // 更新平均长度
          this.updateAvgFieldLength(field, fieldLength);
          
          // 构建倒排索引
          terms.forEach(term => {
            if (!this.invertedIndex.has(term)) {
              this.invertedIndex.set(term, new Map());
            }
            const termDocs = this.invertedIndex.get(term);
            if (!termDocs.has(docId)) {
              termDocs.set(docId, {});
            }
            if (!termDocs.get(docId)[field]) {
              termDocs.get(docId)[field] = 0;
            }
            termDocs.get(docId)[field]++;
            
            // 更新文档频率
            this.updateDocumentFrequency(term, field, docId);
          });
        }
      });
    });
    
    console.log(`倒排索引构建完成，文档数: ${this.totalDocs}，术语数: ${this.invertedIndex.size}`);
  }

  // 字段分词
  tokenizeField(text, field) {
    // 不同字段使用不同的分词策略
    if (field === 'tags' && Array.isArray(text)) {
      return text.map(tag => tag.toLowerCase());
    }
    
    const textStr = text.toString().toLowerCase();
    
    // 检测是否包含中文字符
    const hasChinese = /[\u4e00-\u9fa5]/.test(textStr);
    
    if (hasChinese) {
      // 中文分词：按字符分割（单字分词）
      // 同时保留完整的中文词汇作为补充
      const chars = textStr.split('').filter(char => /[\u4e00-\u9fa5]/.test(char));
      const words = [];
      
      // 添加单字
      chars.forEach(char => {
        if (char.length > 0) {
          words.push(char);
        }
      });
      
      // 添加完整的中文短语（长度大于1的连续中文字符）
      let currentPhrase = '';
      for (let i = 0; i < textStr.length; i++) {
        const char = textStr[i];
        if (/[\u4e00-\u9fa5]/.test(char)) {
          currentPhrase += char;
        } else {
          if (currentPhrase.length > 1) {
            words.push(currentPhrase);
          }
          currentPhrase = '';
        }
      }
      if (currentPhrase.length > 1) {
        words.push(currentPhrase);
      }
      
      return words;
    } else {
      // 英文分词：按空格、连字符、下划线分割
      return textStr
        .split(/[\s\-\_]+/)
        .filter(word => word.length > 1);
    }
  }

  // 更新字段平均长度
  updateAvgFieldLength(field, length) {
    if (!this.bm25Params.avgFieldLengths.has(field)) {
      this.bm25Params.avgFieldLengths.set(field, { sum: 0, count: 0 });
    }
    
    const stats = this.bm25Params.avgFieldLengths.get(field);
    stats.sum += length;
    stats.count++;
  }

  // 更新文档频率
  updateDocumentFrequency(term, field, docId) {
    const fieldKey = `${field}:${term}`;
    if (!this.fieldDocFreq.has(field)) {
      this.fieldDocFreq.set(field, new Map());
    }
    
    const termMap = this.fieldDocFreq.get(field);
    if (!termMap.has(term)) {
      termMap.set(term, new Set());
    }
    
    termMap.get(term).add(docId);
  }

  // 计算文档频率
  calculateDocumentFrequency(term, field) {
    const termMap = this.fieldDocFreq.get(field);
    if (!termMap || !termMap.has(term)) {
      return 0;
    }
    return termMap.get(term).size;
  }

  // 改进的BM25评分（考虑字段权重）
  score(docId, queryTerms) {
    let totalScore = 0;
    
    queryTerms.forEach(({ term, weight }) => {
      const termDocs = this.invertedIndex.get(term);
      if (!termDocs || !termDocs.has(docId)) return;
      
      const docStats = termDocs.get(docId);
      const docLengths = this.fieldLengths.get(docId);
      
      // 计算每个字段的贡献
      Object.keys(docStats).forEach(field => {
        const tf = docStats[field];
        const fieldLength = docLengths[field] || 1;
        const avgStats = this.bm25Params.avgFieldLengths.get(field);
        const avgFieldLength = avgStats ? avgStats.sum / avgStats.count : 1;
        const fieldWeight = this.fieldWeights[field] || 1.0;
        
        // 计算逆文档频率（考虑全局）
        const df = this.calculateDocumentFrequency(term, field);
        const idf = Math.log((this.totalDocs - df + 0.5) / (df + 0.5) + 1);
        
        // BM25公式
        const numerator = tf * (this.bm25Params.k1 + 1);
        const denominator = tf + this.bm25Params.k1 * 
          (1 - this.bm25Params.b + 
           this.bm25Params.b * (fieldLength / avgFieldLength));
        
        totalScore += fieldWeight * weight * idf * (numerator / denominator);
      });
    });
    
    return totalScore;
  }

  // 搜索方法
  search(query, documents, limit = 20) {
    const queryTerms = this.tokenizeField(query, 'query')
      .map(term => ({ term, weight: 1.0 }));
    
    // 计算每个文档的分数
    const scoredDocs = documents.map(doc => {
      const score = this.score(doc.id, queryTerms);
      return { doc, score };
    });
    
    // 按分数排序并限制结果数量
    return scoredDocs
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.doc);
  }

  // 获取索引统计信息
  getIndexStats() {
    let totalTerms = 0;
    this.invertedIndex.forEach(docs => {
      totalTerms += docs.size;
    });
    
    return {
      totalDocs: this.totalDocs,
      totalTerms: this.invertedIndex.size,
      avgTermsPerDoc: totalTerms / this.totalDocs,
      fieldWeights: this.fieldWeights,
      avgFieldLengths: Object.fromEntries(this.bm25Params.avgFieldLengths)
    };
  }
}

/**
 * 数据库-like 聚合器
 * 将数据库聚合思想应用到前端
 */
export class DatabaseLikeAggregator {
  constructor() {
    // 标签统计（类似数据库聚合）
    this.tagStats = new Map(); // tag -> {count, lastUsed, frequency, history}
    
    // 时间衰减因子（类似时间序列数据库）
    this.decayFactor = 0.9; // 每天衰减10%
    
    // 滑动窗口统计
    this.timeWindows = {
      '24h': { size: 24, unit: 'hour' },
      '7d': { size: 7, unit: 'day' },
      '30d': { size: 30, unit: 'day' }
    };
  }

  // 增量更新带时间衰减
  updateTag(tag, timestamp = Date.now()) {
    const now = timestamp;
    const stats = this.tagStats.get(tag) || { 
      count: 0, 
      lastUsed: now,
      frequency: 0,
      history: [] // 使用历史记录
    };
    
    // 应用时间衰减
    const hoursSinceLastUse = (now - stats.lastUsed) / (1000 * 60 * 60);
    const decay = Math.pow(this.decayFactor, hoursSinceLastUse / 24);
    
    stats.count = stats.count * decay + 1;
    stats.lastUsed = now;
    stats.frequency = this.calculateFrequency(stats.history, now);
    
    // 记录使用历史（保留最近100次）
    stats.history.push(now);
    if (stats.history.length > 100) {
      stats.history.shift();
    }
    
    this.tagStats.set(tag, stats);
    return stats;
  }

  // 批量更新标签
  updateTags(tags, timestamp = Date.now()) {
    tags.forEach(tag => this.updateTag(tag, timestamp));
  }

  // 计算实时频率（类似实时分析）
  calculateFrequency(history, now) {
    if (history.length === 0) return 0;
    
    const oneHourAgo = now - 3600000;
    const oneDayAgo = now - 86400000;
    const oneWeekAgo = now - 604800000;
    
    const hourly = history.filter(t => t > oneHourAgo).length;
    const daily = history.filter(t => t > oneDayAgo).length;
    const weekly = history.filter(t => t > oneWeekAgo).length;
    
    // 加权频率：最近的使用权重更高
    return hourly * 0.5 + daily * 0.3 + weekly * 0.2;
  }

  // 获取热门标签（带多种排序选项）
  getPopularTags(options = {}) {
    const { 
      sortBy = 'frequency', 
      timeRange = '7d',
      limit = 20 
    } = options;
    
    const tags = Array.from(this.tagStats.entries());
    
    // 根据时间范围过滤
    const filteredTags = tags.filter(([tag, stats]) => {
      if (timeRange === '24h') {
        return stats.history.some(t => t > Date.now() - 86400000);
      } else if (timeRange === '7d') {
        return stats.history.some(t => t > Date.now() - 604800000);
      }
      return true;
    });
    
    // 多种排序方式
    let sortedTags;
    switch(sortBy) {
      case 'frequency':
        sortedTags = filteredTags.sort((a, b) => 
          b[1].frequency - a[1].frequency
        );
        break;
      case 'count':
        sortedTags = filteredTags.sort((a, b) => 
          b[1].count - a[1].count
        );
        break;
      case 'recent':
        sortedTags = filteredTags.sort((a, b) => 
          b[1].lastUsed - a[1].lastUsed
        );
        break;
      case 'trending': // 趋势标签（近期增长快）
        sortedTags = filteredTags.sort((a, b) => {
          const trendA = this.calculateTrend(a[1].history);
          const trendB = this.calculateTrend(b[1].history);
          return trendB - trendA;
        });
        break;
      default:
        sortedTags = filteredTags;
    }
    
    return sortedTags.slice(0, limit).map(([tag, stats]) => ({
      tag,
      count: Math.round(stats.count),
      frequency: stats.frequency,
      lastUsed: stats.lastUsed
    }));
  }

  // 计算趋势（近期使用增长）
  calculateTrend(history) {
    if (history.length < 10) return 0;
    
    const now = Date.now();
    const recent = history.filter(t => t > now - 86400000).length; // 最近24小时
    const previous = history.filter(t => t > now - 172800000 && t <= now - 86400000).length; // 24-48小时前
    
    if (previous === 0) return recent > 0 ? 1 : 0;
    return (recent - previous) / previous;
  }

  // 标签相关性分析（类似协同过滤）
  getRelatedTags(targetTag, limit = 10) {
    const targetStats = this.tagStats.get(targetTag);
    if (!targetStats) return [];
    
    const related = new Map();
    
    // 找出与目标标签使用时间相近的标签
    this.tagStats.forEach((stats, tag) => {
      if (tag !== targetTag) {
        // 计算时间相关性（共同出现的时间点）
        const similarity = this.calculateTimeSimilarity(targetStats.history, stats.history);
        if (similarity > 0.1) {
          related.set(tag, similarity);
        }
      }
    });
    
    return Array.from(related.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag, similarity]) => ({ tag, similarity }));
  }

  // 计算时间相似度
  calculateTimeSimilarity(history1, history2) {
    if (history1.length === 0 || history2.length === 0) return 0;
    
    // 找出共同的时间窗口
    const windowSize = 3600000; // 1小时窗口
    const windows1 = new Set(history1.map(t => Math.floor(t / windowSize)));
    const windows2 = new Set(history2.map(t => Math.floor(t / windowSize)));
    
    const intersection = new Set([...windows1].filter(x => windows2.has(x)));
    const union = new Set([...windows1, ...windows2]);
    
    return intersection.size / union.size;
  }

  // 获取标签统计报告
  getStatsReport() {
    const totalTags = this.tagStats.size;
    const totalUses = Array.from(this.tagStats.values())
      .reduce((sum, stats) => sum + stats.history.length, 0);
    
    const popularTags = this.getPopularTags({ limit: 5 });
    const trendingTags = this.getPopularTags({ sortBy: 'trending', limit: 5 });
    
    return {
      totalTags,
      totalUses,
      avgUsesPerTag: totalUses / totalTags,
      popularTags,
      trendingTags,
      timestamp: Date.now()
    };
  }

  // 兼容 getStats 方法（为了 TagCloud 组件）
  getStats() {
    return this.getStatsReport();
  }
}

/**
 * APM-like 性能监控器
 * 将APM监控思想应用到前端
 */
export class APMLikeMonitor {
  constructor() {
    // 性能指标存储（类似APM数据存储）
    this.metrics = new Map();
    
    // 性能基线（类似APM基线）
    this.baselines = new Map();
    
    // 异常检测器
    this.anomalyDetector = new AnomalyDetector();
    
    // 性能报告历史
    this.reports = [];
    
    // 初始化默认指标
    this.initDefaultMetrics();
  }

  initDefaultMetrics() {
    const defaultMetrics = ['search', 'render', 'cache', 'network'];
    defaultMetrics.forEach(metric => {
      this.metrics.set(metric, {
        responseTimes: [],
        throughput: 0,
        errorCount: 0,
        successCount: 0
      });
    });
  }

  // 记录指标（简化版，用于直接记录单个指标值）
  recordMetric(name, value, metadata = {}) {
    const startTime = performance.now() - value;
    const endTime = performance.now();
    return this.recordSpan(name, startTime, endTime, metadata);
  }

  // 记录详细指标（类似APM span）
  recordSpan(operation, startTime, endTime, metadata = {}) {
    const duration = endTime - startTime;
    const timestamp = Date.now();
    
    const span = {
      operation,
      duration,
      startTime,
      endTime,
      metadata,
      timestamp,
      success: !metadata.error
    };
    
    // 获取或创建指标
    let metric = this.metrics.get(operation);
    if (!metric) {
      metric = { responseTimes: [], throughput: 0, errorCount: 0, successCount: 0 };
      this.metrics.set(operation, metric);
    }
    
    // 更新指标
    metric.responseTimes.push({ duration, timestamp });
    
    if (metadata.error) {
      metric.errorCount++;
    } else {
      metric.successCount++;
    }
    
    // 计算吞吐量（操作/秒）
    const lastMinute = metric.responseTimes.filter(rt => 
      rt.timestamp > timestamp - 60000
    );
    metric.throughput = lastMinute.length / 60;
    
    // 保持历史数据大小
    if (metric.responseTimes.length > 1000) {
      metric.responseTimes = metric.responseTimes.slice(-1000);
    }
    
    // 异常检测
    const isAnomaly = this.anomalyDetector.detect(operation, duration);
    if (isAnomaly) {
      this.recordAnomaly(operation, span);
    }
    
    return span;
  }

  // 记录异常
  recordAnomaly(operation, span) {
    const anomaly = {
      type: 'performance_anomaly',
      operation,
      duration: span.duration,
      timestamp: span.timestamp,
      metadata: span.metadata
    };
    
    console.warn('性能异常检测:', anomaly);
    
    // 存储异常记录
    if (!this.metrics.has('anomalies')) {
      this.metrics.set('anomalies', []);
    }
    this.metrics.get('anomalies').push(anomaly);
    
    // 保持异常记录大小
    if (this.metrics.get('anomalies').length > 100) {
      this.metrics.get('anomalies').shift();
    }
  }

  // 计算性能基线（类似APM基线计算）
  calculateBaseline(operation, timeRange = '1h') {
    const metric = this.metrics.get(operation);
    if (!metric || metric.responseTimes.length < 10) return null;
    
    const now = Date.now();
    let startTime;
    
    switch(timeRange) {
      case '1h': startTime = now - 3600000; break;
      case '6h': startTime = now - 21600000; break;
      case '24h': startTime = now - 86400000; break;
      default: startTime = now - 3600000;
    }
    
    const recentTimes = metric.responseTimes
      .filter(rt => rt.timestamp > startTime)
      .map(rt => rt.duration);
    
    if (recentTimes.length < 10) return null;
    
    // 计算百分位数
    const sorted = [...recentTimes].sort((a, b) => a - b);
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p90 = sorted[Math.floor(sorted.length * 0.9)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];
    
    const baseline = { p50, p90, p95, p99, sampleSize: recentTimes.length };
    this.baselines.set(operation, baseline);
    
    return baseline;
  }

  // 获取操作统计
  getOperationStats(operation, timeRange = '1h') {
    const metric = this.metrics.get(operation);
    if (!metric) return null;
    
    const now = Date.now();
    let startTime;
    
    switch(timeRange) {
      case '1h': startTime = now - 3600000; break;
      case '6h': startTime = now - 21600000; break;
      case '24h': startTime = now - 86400000; break;
      default: startTime = now - 3600000;
    }
    
    const recentData = metric.responseTimes.filter(rt => rt.timestamp > startTime);
    const durations = recentData.map(rt => rt.duration);
    
    if (durations.length === 0) return null;
    
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    const max = Math.max(...durations);
    const min = Math.min(...durations);
    
    // 计算错误率
    const total = metric.successCount + metric.errorCount;
    const errorRate = total > 0 ? (metric.errorCount / total) * 100 : 0;
    
    return {
      operation,
      timeRange,
      count: durations.length,
      avg: parseFloat(avg.toFixed(2)),
      max: parseFloat(max.toFixed(2)),
      min: parseFloat(min.toFixed(2)),
      throughput: parseFloat(metric.throughput.toFixed(2)),
      errorRate: parseFloat(errorRate.toFixed(2)),
      timestamp: now
    };
  }

  // 生成性能报告（类似APM报告）
  generateReport(timeRange = '1h') {
    const now = Date.now();
    
    const report = {
      timestamp: now,
      timeRange,
      summary: {},
      anomalies: this.metrics.get('anomalies') || [],
      recommendations: []
    };
    
    // 分析每个操作
    Array.from(this.metrics.keys()).forEach(operation => {
      if (operation === 'anomalies') return;
      
      const stats = this.getOperationStats(operation, timeRange);
      if (stats) {
        report.summary[operation] = stats;
        
        // 生成优化建议
        const baseline = this.baselines.get(operation);
        if (baseline && stats.avg > baseline.p95 * 1.5) {
          report.recommendations.push({
            operation,
            issue: `性能下降：当前平均${stats.avg}ms，超过P95基线${baseline.p95.toFixed(2)}ms`,
            severity: 'high',
            suggestion: '考虑优化算法或增加缓存'
          });
        }
        
        if (stats.errorRate > 5) {
          report.recommendations.push({
            operation,
            issue: `错误率过高：${stats.errorRate}%`,
            severity: 'medium',
            suggestion: '检查错误处理逻辑'
          });
        }
      }
    });
    
    // 存储报告
    this.reports.push(report);
    if (this.reports.length > 50) {
      this.reports.shift();
    }
    
    return report;
  }

  // 获取历史报告
  getHistoricalReports(limit = 10) {
    return this.reports.slice(-limit);
  }

  // 重置指标
  resetMetrics(operation = null) {
    if (operation) {
      this.metrics.delete(operation);
    } else {
      this.metrics.clear();
      this.initDefaultMetrics();
    }
    this.baselines.clear();
  }

  // 获取监控统计
  getStats() {
    const stats = {
      totalOperations: 0,
      totalSpans: 0,
      totalAnomalies: 0,
      operations: {}
    };

    // 统计每个操作的指标
    this.metrics.forEach((metric, operation) => {
      if (operation === 'anomalies') {
        stats.totalAnomalies = metric.length;
      } else {
        stats.totalOperations++;
        stats.totalSpans += metric.responseTimes.length;
        
        const durations = metric.responseTimes.map(rt => rt.duration);
        const avg = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
        const max = durations.length > 0 ? Math.max(...durations) : 0;
        const min = durations.length > 0 ? Math.min(...durations) : 0;
        
        stats.operations[operation] = {
          count: metric.responseTimes.length,
          avg: parseFloat(avg.toFixed(2)),
          max: parseFloat(max.toFixed(2)),
          min: parseFloat(min.toFixed(2)),
          throughput: parseFloat(metric.throughput.toFixed(2)),
          errorCount: metric.errorCount,
          successCount: metric.successCount,
          errorRate: metric.errorCount + metric.successCount > 0 ? 
            parseFloat(((metric.errorCount / (metric.errorCount + metric.successCount)) * 100).toFixed(2)) : 0
        };
      }
    });

    return stats;
  }
}

/**
 * 异常检测器（类似APM异常检测）
 */
class AnomalyDetector {
  constructor() {
    this.history = new Map();
    this.thresholds = new Map();
    this.config = {
      windowSize: 100,      // 历史窗口大小
      sigma: 3,            // 3σ原则
      minSamples: 20       // 最小样本数
    };
  }

  detect(operation, value) {
    if (!this.history.has(operation)) {
      this.history.set(operation, []);
    }
    
    const history = this.history.get(operation);
    history.push({ value, timestamp: Date.now() });
    
    // 保持窗口大小
    if (history.length > this.config.windowSize) {
      history.shift();
    }
    
    // 计算动态阈值
    if (history.length >= this.config.minSamples) {
      const values = history.map(h => h.value);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);
      
      const threshold = mean + this.config.sigma * stdDev;
      this.thresholds.set(operation, threshold);
      
      // 检测异常
      return value > threshold;
    }
    
    return false;
  }

  getThreshold(operation) {
    return this.thresholds.get(operation);
  }
}

