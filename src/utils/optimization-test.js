/**
 * 优化功能测试
 * 验证所有后端算法思想的前端优化实现
 */

import { 
  ElasticsearchLikeScorer, 
  DatabaseLikeAggregator, 
  RedisLikeCache,
  APMLikeMonitor 
} from './algorithms'

// 测试数据
const testDocuments = [
  {
    id: '1',
    title: 'Vue 3 高级教程',
    category: '前端',
    tags: ['Vue', 'JavaScript', '前端'],
    description: '深入学习Vue 3的高级特性和最佳实践'
  },
  {
    id: '2',
    title: 'React Hooks 完全指南',
    category: '前端',
    tags: ['React', 'JavaScript', '前端'],
    description: '掌握React Hooks的所有用法和技巧'
  },
  {
    id: '3',
    title: 'Node.js 性能优化',
    category: '后端',
    tags: ['Node.js', 'JavaScript', '后端'],
    description: 'Node.js应用性能优化的各种方法'
  },
  {
    id: '4',
    title: 'Python 数据分析',
    category: '数据科学',
    tags: ['Python', '数据分析', '数据科学'],
    description: '使用Python进行数据分析和可视化'
  },
  {
    id: '5',
    title: 'TypeScript 类型系统',
    category: '前端',
    tags: ['TypeScript', 'JavaScript', '前端'],
    description: '深入理解TypeScript的类型系统和高级类型'
  }
]

/**
 * 测试Elasticsearch-like评分器
 */
export function testElasticsearchScorer() {
  console.log('=== 测试Elasticsearch-like评分器 ===')
  
  const scorer = new ElasticsearchLikeScorer()
  scorer.buildInvertedIndex(testDocuments)
  
  console.log('索引统计:', scorer.getIndexStats())
  
  // 测试搜索
  const queries = ['Vue', 'JavaScript', '前端教程', '数据分析']
  queries.forEach(query => {
    const results = scorer.search(query, testDocuments, 3)
    console.log(`搜索 "${query}":`, results.map(r => r.title))
  })
  
  return scorer
}

/**
 * 测试Database-like聚合器
 */
export function testDatabaseAggregator() {
  console.log('=== 测试Database-like聚合器 ===')
  
  const aggregator = new DatabaseLikeAggregator()
  
  // 模拟标签使用
  const tagUses = [
    ['Vue', 'JavaScript', '前端'],
    ['React', 'JavaScript', '前端'],
    ['Node.js', 'JavaScript', '后端'],
    ['Python', '数据分析', '数据科学'],
    ['TypeScript', 'JavaScript', '前端'],
    ['Vue', '前端'],
    ['React', '前端'],
    ['Python', '数据科学']
  ]
  
  // 模拟时间戳（最近7天）
  const now = Date.now()
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000
  
  tagUses.forEach((tags, index) => {
    const timestamp = sevenDaysAgo + (index * 24 * 60 * 60 * 1000) // 每天一次
    aggregator.updateTags(tags, timestamp)
  })
  
  console.log('标签统计:', aggregator.getStats())
  
  // 测试不同排序方式
  const sortMethods = ['frequency', 'count', 'recent', 'trending']
  sortMethods.forEach(method => {
    const popularTags = aggregator.getPopularTags({ sortBy: method, limit: 5 })
    console.log(`${method}排序的热门标签:`, popularTags.map(t => t.tag))
  })
  
  // 测试相关标签
  const relatedTags = aggregator.getRelatedTags('JavaScript', 3)
  console.log('JavaScript的相关标签:', relatedTags)
  
  return aggregator
}

/**
 * 测试Redis-like缓存
 */
export async function testRedisCache() {
  console.log('=== 测试Redis-like缓存 ===')
  
  const cache = new RedisLikeCache({
    memoryCapacity: 10,
    storageCapacity: 50,
    defaultTTL: 60 // 1分钟
  })
  
  // 测试基本操作
  cache.set('key1', 'value1', { ttl: 30 })
  cache.set('key2', 'value2', { priority: 'high', ttl: 300 })
  cache.set('key3', 'value3')
  
  console.log('获取key1:', cache.get('key1'))
  console.log('获取key2:', cache.get('key2'))
  console.log('获取不存在的key:', cache.get('key4'))
  
  // 测试缓存预热
  const warmupData = testDocuments.map(doc => ({
    key: `doc_${doc.id}`,
    value: doc,
    options: { priority: 'high', ttl: 600 }
  }))
  
  await cache.warmup(warmupData)
  console.log('缓存预热后的统计:', cache.getStats())
  
  // 测试键模式匹配
  console.log('匹配doc_*的键:', cache.keys('doc_*'))
  
  return cache
}

/**
 * 测试APM-like监控器
 */
export function testAPMMonitor() {
  console.log('=== 测试APM-like监控器 ===')
  
  const monitor = new APMLikeMonitor()
  
  // 模拟性能数据
  const operations = ['search', 'render', 'api_call', 'cache_hit']
  const now = Date.now()
  
  // 生成正常性能数据（平均50ms）
  for (let i = 0; i < 50; i++) {
    operations.forEach(op => {
      const duration = 30 + Math.random() * 40 // 30-70ms
      monitor.recordMetric(op, duration, {
        timestamp: now - (50 - i) * 60000, // 每分钟一次
        user: `user${i % 5}`
      })
    })
  }
  
  // 生成一些异常数据（> 150ms）
  operations.forEach(op => {
    monitor.recordMetric(op, 150 + Math.random() * 100, {
      timestamp: now,
      user: 'test_user',
      isAnomaly: true
    })
  })
  
  // 生成性能报告
  const report = monitor.generateReport('1h')
  console.log('性能报告摘要:', {
    operations: Object.keys(report.summary),
    anomalies: report.anomalies.length,
    recommendations: report.recommendations.length
  })
  
  // 显示详细统计
  console.log('监控统计:', monitor.getStats())
  
  return monitor
}

/**
 * 运行所有测试
 */
export async function runAllTests() {
  console.log('开始运行优化功能测试...')
  
  try {
    // 1. 测试Elasticsearch-like评分器
    const scorer = testElasticsearchScorer()
    
    // 2. 测试Database-like聚合器
    const aggregator = testDatabaseAggregator()
    
    // 3. 测试Redis-like缓存
    const cache = await testRedisCache()
    
    // 4. 测试APM-like监控器
    const monitor = testAPMMonitor()
    
    console.log('所有测试完成!')
    
    return {
      scorer,
      aggregator,
      cache,
      monitor,
      success: true
    }
  } catch (error) {
    console.error('测试失败:', error)
    return { success: false, error }
  }
}

// 如果直接运行此文件
if (typeof window !== 'undefined' && window.location.href.includes('test=optimization')) {
  runAllTests().then(result => {
    console.log('测试结果:', result)
  })
}

export default {
  testElasticsearchScorer,
  testDatabaseAggregator,
  testRedisCache,
  testAPMMonitor,
  runAllTests
}