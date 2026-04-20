/**
 * 优化初始化模块
 * 应用启动时初始化所有后端算法思想的前端优化
 */

import { APMLikeMonitor } from './algorithms'
import { RedisLikeCache } from './cache'

// 全局缓存实例
let globalCache = null

// 全局性能监控实例
let globalMonitor = null

/**
 * 初始化优化系统
 */
export function initOptimizationSystem() {
  console.log('初始化优化系统...')
  
  // 初始化全局缓存
  globalCache = new RedisLikeCache({
    memoryCapacity: 100,
    storageCapacity: 500,
    defaultTTL: 300 // 5分钟
  })
  
  // 初始化全局性能监控
  globalMonitor = new APMLikeMonitor()
  
  // 暴露到全局，供其他组件使用
  if (typeof window !== 'undefined') {
    window.globalCache = globalCache
    window.globalMonitor = globalMonitor
    window.optimizationSystem = {
      cache: globalCache,
      monitor: globalMonitor,
      version: '1.0.0',
      initialized: true
    }
  }
  
  console.log('优化系统初始化完成')
  return { cache: globalCache, monitor: globalMonitor }
}

/**
 * 获取全局缓存实例
 */
export function getGlobalCache() {
  if (!globalCache) {
    initOptimizationSystem()
  }
  return globalCache
}

/**
 * 获取全局性能监控实例
 */
export function getGlobalMonitor() {
  if (!globalMonitor) {
    initOptimizationSystem()
  }
  return globalMonitor
}

/**
 * 应用启动时预加载关键数据
 */
export async function preloadCriticalData(preloadData = []) {
  const cache = getGlobalCache()
  
  if (preloadData.length > 0) {
    console.log('开始预加载关键数据...')
    await cache.warmup(preloadData)
    console.log('关键数据预加载完成')
  }
  
  return cache.getStats()
}

/**
 * 生成优化报告
 */
export function generateOptimizationReport() {
  const monitor = getGlobalMonitor()
  const cache = getGlobalCache()
  
  const report = {
    timestamp: Date.now(),
    cache: cache.getStats(),
    monitor: monitor.getStats(),
    recommendations: []
  }
  
  // 分析缓存性能
  const cacheStats = cache.getStats()
  if (cacheStats.overall.hitRate < 60) {
    report.recommendations.push({
      type: 'cache',
      issue: '缓存命中率较低',
      suggestion: '增加缓存容量或优化缓存策略',
      priority: 'medium'
    })
  }
  
  // 分析搜索性能
  const monitorReport = monitor.generateReport('1h')
  if (monitorReport.summary.search && monitorReport.summary.search.avg > 50) {
    report.recommendations.push({
      type: 'search',
      issue: '搜索响应时间较高',
      suggestion: '优化搜索算法或增加索引',
      priority: 'high'
    })
  }
  
  return report
}

/**
 * 清理优化系统
 */
export function cleanupOptimizationSystem() {
  if (globalCache) {
    globalCache.clear()
  }
  
  if (globalMonitor) {
    globalMonitor.clear()
  }
  
  if (typeof window !== 'undefined') {
    delete window.globalCache
    delete window.globalMonitor
    delete window.optimizationSystem
  }
  
  console.log('优化系统清理完成')
}

/**
 * 导出优化工具
 */
export default {
  initOptimizationSystem,
  getGlobalCache,
  getGlobalMonitor,
  preloadCriticalData,
  generateOptimizationReport,
  cleanupOptimizationSystem
}