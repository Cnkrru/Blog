/**
 * 算法优化测试
 * 用于验证各种算法优化的效果
 */

import algorithms from './algorithms.js'

// 测试数据
const testDocuments = [
  { id: '1', title: 'Vue.js 入门教程', category: '前端', tags: ['Vue', 'JavaScript', '前端'] },
  { id: '2', title: 'React 高级指南', category: '前端', tags: ['React', 'JavaScript', '前端'] },
  { id: '3', title: 'Node.js 后端开发', category: '后端', tags: ['Node.js', 'JavaScript', '后端'] },
  { id: '4', title: 'Python 数据分析', category: '数据科学', tags: ['Python', '数据分析', '机器学习'] },
  { id: '5', title: 'TypeScript 类型系统', category: '前端', tags: ['TypeScript', 'JavaScript', '前端'] },
  { id: '6', title: 'Docker 容器化部署', category: '运维', tags: ['Docker', 'DevOps', '容器'] },
  { id: '7', title: '算法与数据结构', category: '计算机科学', tags: ['算法', '数据结构', '编程'] },
  { id: '8', title: 'Web 性能优化', category: '前端', tags: ['性能优化', '前端', 'Web'] },
  { id: '9', title: '数据库设计原理', category: '数据库', tags: ['数据库', 'SQL', '设计'] },
  { id: '10', title: '微服务架构', category: '架构', tags: ['微服务', '架构', '分布式'] }
]

// 测试搜索算法
function testSearchAlgorithms() {
  console.log('=== 搜索算法测试 ===')
  
  // 1. BM25 测试
  const bm25 = new algorithms.BM25Scorer()
  
  testDocuments.forEach(doc => {
    const terms = [
      ...doc.title.toLowerCase().split(/\s+/),
      ...doc.category.toLowerCase().split(/\s+/),
      ...doc.tags.map(tag => tag.toLowerCase())
    ]
    bm25.addDocument(doc.id, terms)
  })
  
  const queryTerms = ['前端', 'javascript']
  console.log('BM25 评分测试:')
  testDocuments.forEach(doc => {
    const score = bm25.score(doc.id, queryTerms)
    console.log(`  ${doc.title}: ${score.toFixed(4)}`)
  })
  
  // 2. 编辑距离测试
  console.log('\n编辑距离测试:')
  const str1 = 'kitten'
  const str2 = 'sitting'
  const distance = algorithms.levenshteinDistance(str1, str2)
  console.log(`  "${str1}" 和 "${str2}" 的编辑距离: ${distance}`)
  
  // 3. Jaccard 相似度测试
  console.log('\nJaccard 相似度测试:')
  const set1 = new Set(['a', 'b', 'c'])
  const set2 = new Set(['b', 'c', 'd'])
  const similarity = algorithms.jaccardSimilarity(set1, set2)
  console.log(`  Set1: ${Array.from(set1)}, Set2: ${Array.from(set2)}`)
  console.log(`  相似度: ${similarity.toFixed(4)}`)
}

// 测试数据结构
function testDataStructures() {
  console.log('\n=== 数据结构测试 ===')
  
  // 1. 最小堆测试
  console.log('最小堆测试:')
  const minHeap = new algorithms.MinHeap()
  const nums = [5, 3, 8, 1, 9, 2]
  nums.forEach(num => minHeap.push(num))
  
  console.log('  插入顺序:', nums)
  console.log('  弹出顺序:')
  while (!minHeap.isEmpty()) {
    console.log(`    ${minHeap.pop()}`)
  }
  
  // 2. 最大堆测试
  console.log('\n最大堆测试:')
  const maxHeap = new algorithms.MaxHeap()
  nums.forEach(num => maxHeap.push(num))
  
  console.log('  插入顺序:', nums)
  console.log('  弹出顺序:')
  while (!maxHeap.isEmpty()) {
    console.log(`    ${maxHeap.pop()}`)
  }
  
  // 3. 布隆过滤器测试
  console.log('\n布隆过滤器测试:')
  const bloomFilter = new algorithms.BloomFilter(100, 3)
  const testItems = ['apple', 'banana', 'cherry']
  testItems.forEach(item => bloomFilter.add(item))
  
  console.log('  添加项:', testItems)
  console.log('  检查 "apple":', bloomFilter.mightContain('apple'))
  console.log('  检查 "orange":', bloomFilter.mightContain('orange'))
  console.log('  检查 "banana":', bloomFilter.mightContain('banana'))
}

// 测试缓存算法
function testCacheAlgorithms() {
  console.log('\n=== 缓存算法测试 ===')
  
  // LRU 缓存测试
  console.log('LRU 缓存测试 (容量: 3):')
  const lruCache = new algorithms.LRUCache(3)
  
  const operations = [
    { type: 'put', key: 'a', value: 1 },
    { type: 'put', key: 'b', value: 2 },
    { type: 'put', key: 'c', value: 3 },
    { type: 'get', key: 'a' },
    { type: 'put', key: 'd', value: 4 }, // 这会淘汰 b
    { type: 'get', key: 'b' } // 应该返回 null
  ]
  
  operations.forEach(op => {
    if (op.type === 'put') {
      lruCache.put(op.key, op.value)
      console.log(`  插入: ${op.key}=${op.value}`)
    } else {
      const value = lruCache.get(op.key)
      console.log(`  获取 ${op.key}: ${value}`)
    }
  })
  
  console.log('  缓存大小:', lruCache.size())
}

// 测试排序算法
function testSortingAlgorithms() {
  console.log('\n=== 排序算法测试 ===')
  
  // 1. 快速选择测试
  console.log('快速选择测试:')
  const arr1 = [3, 2, 1, 5, 6, 4]
  const k = 2 // 找第3小的元素（0-indexed）
  const kthSmallest = algorithms.quickSelect([...arr1], k)
  console.log(`  数组: ${arr1}`)
  console.log(`  第${k + 1}小的元素: ${kthSmallest}`)
  
  // 2. 归并排序测试
  console.log('\n归并排序测试:')
  const arr2 = [38, 27, 43, 3, 9, 82, 10]
  const sorted = algorithms.mergeSort([...arr2])
  console.log(`  原始数组: ${arr2}`)
  console.log(`  排序后: ${sorted}`)
}

// 测试字符串算法
function testStringAlgorithms() {
  console.log('\n=== 字符串算法测试 ===')
  
  // 1. KMP 字符串匹配
  console.log('KMP 字符串匹配测试:')
  const text = 'ABABDABACDABABCABAB'
  const pattern = 'ABABCABAB'
  const matches = algorithms.kmpSearch(text, pattern)
  console.log(`  文本: ${text}`)
  console.log(`  模式: ${pattern}`)
  console.log(`  匹配位置: ${matches}`)
  
  // 2. 模糊匹配测试
  console.log('\n模糊匹配测试:')
  const testCases = [
    { text: 'hello world', pattern: 'helo', maxErrors: 1 },
    { text: 'algorithm', pattern: 'algorith', maxErrors: 1 },
    { text: 'test', pattern: 'text', maxErrors: 1 }
  ]
  
  testCases.forEach(({ text, pattern, maxErrors }) => {
    const result = algorithms.fuzzyMatch(text, pattern, maxErrors)
    console.log(`  "${text}" ~ "${pattern}" (最大错误: ${maxErrors}): ${result}`)
  })
}

// 性能对比测试
function performanceComparison() {
  console.log('\n=== 性能对比测试 ===')
  
  const largeArray = Array.from({ length: 10000 }, (_, i) => Math.random() * 10000)
  
  // 原生排序 vs 归并排序
  console.log('排序性能对比 (10000个随机数):')
  
  const start1 = performance.now()
  const nativeSorted = [...largeArray].sort((a, b) => a - b)
  const end1 = performance.now()
  console.log(`  原生排序: ${(end1 - start1).toFixed(2)}ms`)
  
  const start2 = performance.now()
  const mergeSorted = algorithms.mergeSort([...largeArray])
  const end2 = performance.now()
  console.log(`  归并排序: ${(end2 - start2).toFixed(2)}ms`)
  
  // 验证排序正确性
  const isCorrect = nativeSorted.every((val, idx) => Math.abs(val - mergeSorted[idx]) < 0.0001)
  console.log(`  排序结果正确: ${isCorrect}`)
}

// 运行所有测试
function runAllTests() {
  console.log('开始算法优化测试...\n')
  
  const tests = [
    testSearchAlgorithms,
    testDataStructures,
    testCacheAlgorithms,
    testSortingAlgorithms,
    testStringAlgorithms,
    performanceComparison
  ]
  
  tests.forEach((test, index) => {
    try {
      test()
      console.log(`\n测试 ${index + 1}/${tests.length} 完成\n`)
    } catch (error) {
      console.error(`测试 ${index + 1} 失败:`, error)
    }
  })
  
  console.log('所有测试完成!')
}

// 导出��试函数
export {
  testSearchAlgorithms,
  testDataStructures,
  testCacheAlgorithms,
  testSortingAlgorithms,
  testStringAlgorithms,
  performanceComparison,
  runAllTests
}

// 如果直接运行此文件，则执行所有测试
if (typeof window !== 'undefined') {
  // 在浏览器中运行时，添加到全局对象
  window.runAlgorithmTests = runAllTests
  console.log('算法测试已加载，使用 window.runAlgorithmTests() 运行测试')
}