/*
 * 文件系统检查与清理：目录创建与过时产物清除
 */
import fs from 'node:fs'
import path from 'node:path'
import { ARTICLE_PATH, CACHE_PATH } from './paths.ts'

/*
 * 文章目录检查：不存在报错，存在则返回 .md 文件列表
 */
export const articlePathChecker = (): string[] | undefined => {
  if (fs.existsSync(ARTICLE_PATH)) {
    console.log('[INFO]:文章文件夹存在')
    const files = fs.readdirSync(ARTICLE_PATH).filter((f) => f.endsWith('.md'))
    if (files.length === 0) {
      console.warn('[WARN]:文章目录下没有文件')
    }
    return files
  } else {
    console.error('[ERR]:文章文件夹不存在')
  }
}

/*
 * 清除已从 docs 删除文章的过时 SFC 产物；仍在用的保留供增量复用
 */
export const vuePathCleaner = (ids: Set<string>): void => {
  if (!fs.existsSync(CACHE_PATH)) return
  for (const file of fs.readdirSync(CACHE_PATH)) {
    if (file.endsWith('.vue') && !ids.has(file.replace(/\.vue$/, ''))) {
      fs.rmSync(path.join(CACHE_PATH, file))
      console.log(`[INFO]:清除过时中间产物${file}`)
    }
  }
}

/*
 * 缓存目录检查：不存在则创建，存在则清理过时产物
 */
export const vuePathChecker = (ids: Set<string>): void => {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      console.log('[INFO]:vue文件夹存在')
      vuePathCleaner(ids)
    } else {
      fs.mkdirSync(CACHE_PATH, { recursive: true })
      if (fs.existsSync(CACHE_PATH)) {
        console.log('[INFO]:原路径无vue文件夹,创建文件夹成功')
      } else {
        console.error('[ERR]:原路径无vue文件夹,创建文件夹失败')
      }
    }
  } catch (e) {
    console.error('[ERR]:vue文件夹操作失败', e)
  }
}
