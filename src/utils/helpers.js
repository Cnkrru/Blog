/**
 * 工具函数库
 * 包含项目中常用的工具函数
 */

/**
 * 转义正则表达式特殊字符
 * @param {string} string - 需要转义的字符串
 * @returns {string} 转义后的字符串
 */
export const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|\[\]\\]/g, '\\$&')
}

/**
 * 转义 HTML 特殊字符
 * @param {string} text - 需要转义的文本
 * @returns {string} 转义后的文本
 */
export const escapeHtml = (text) => {
  if (!text) return ''
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>'"]/g, m => map[m])
}

/**
 * 防抖函数
 * @param {Function} fn - 需要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * 节流函数
 * @param {Function} fn - 需要节流的函数
 * @param {number} limit - 限制时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export const throttle = (fn, limit) => {
  let inThrottle
  return (...args) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 格式化时间（秒转分钟:秒）
 * @param {number} time - 时间（秒）
 * @returns {string} 格式化后的时间字符串
 */
export const formatTime = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

/**
 * 高亮匹配文本
 * @param {string} text - 原始文本
 * @param {string} query - 搜索查询
 * @returns {string} 高亮后的 HTML 字符串
 */
export const highlightMatch = (text, query) => {
  if (!text || !query) return escapeHtml(text)
  const escapedQuery = escapeRegex(query)
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  return escapeHtml(text).replace(regex, '<mark style="background-color: rgba(255, 192, 203, 0.3); color: var(--common-color-1); padding: 0 2px; border-radius: 2px;">$1</mark>')
}

/**
 * 生成随机 ID
 * @param {number} length - ID 长度
 * @returns {string} 随机 ID
 */
export const generateId = (length = 8) => {
  return Math.random().toString(36).substring(2, 2 + length)
}

/**
 * 深度克隆对象
 * @param {any} obj - 需要克隆的对象
 * @returns {any} 克隆后的对象
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

/**
 * 检查是否在浏览器环境中
 * @returns {boolean} 是否在浏览器环境中
 */
export const isBrowser = () => {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

/**
 * 安全的 JSON 解析
 * @param {string} jsonString - JSON 字符串
 * @param {any} defaultValue - 解析失败时的默认值
 * @returns {any} 解析后的对象或默认值
 */
export const safeJsonParse = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    return defaultValue
  }
}

/**
 * 安全的 localStorage 操作
 */
export const storage = {
  get: (key, defaultValue = null) => {
    if (!isBrowser()) return defaultValue
    try {
      const value = localStorage.getItem(key)
      return value ? safeJsonParse(value, defaultValue) : defaultValue
    } catch (error) {
      return defaultValue
    }
  },
  
  set: (key, value) => {
    if (!isBrowser()) return false
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      return false
    }
  },
  
  remove: (key) => {
    if (!isBrowser()) return false
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      return false
    }
  },
  
  clear: () => {
    if (!isBrowser()) return false
    try {
      localStorage.clear()
      return true
    } catch (error) {
      return false
    }
  }
}

/**
 * 性能测量工具
 */
export const performance = {
  measure: (name, fn) => {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    const duration = end - start
    
    if (isBrowser() && window.performanceMonitor && typeof window.performanceMonitor.recordMetric === 'function') {
      window.performanceMonitor.recordMetric(name, duration)
    }
    
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
    return { result, duration }
  },
  
  start: (name) => {
    if (!isBrowser()) return
    if (!window.performanceTimers) {
      window.performanceTimers = {}
    }
    window.performanceTimers[name] = performance.now()
  },
  
  end: (name) => {
    if (!isBrowser()) return null
    if (!window.performanceTimers || !window.performanceTimers[name]) {
      return null
    }
    const start = window.performanceTimers[name]
    const end = performance.now()
    const duration = end - start
    
    delete window.performanceTimers[name]
    
    if (window.performanceMonitor && typeof window.performanceMonitor.recordMetric === 'function') {
      window.performanceMonitor.recordMetric(name, duration)
    }
    
    return duration
  }
}