/*
 * 文件系统检查与清理：目录创建、过时产物清除、静态资源同步
 */
import fs from 'node:fs'
import path from 'node:path'
import {
  ARTICLE_PATH,
  CACHE_PATH,
  JSON_PATH,
  POST_META_PATH,
  LINK_JSON_PATH,
  LINK_META_PATH,
  PHOTO_JSON_PATH,
  PHOTO_META_PATH,
} from './paths.ts'

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

/*
 * post.json 存在性检查：不存在则创建空对象占位
 */
export const jsonPathChecker = (): void => {
  try {
    if (fs.existsSync(JSON_PATH)) {
      console.log('[INFO]:post.json存在')
    } else {
      fs.writeFileSync(JSON_PATH, '{}', 'utf8')
      if (fs.existsSync(JSON_PATH)) {
        console.log('[INFO]:原路径无post.json,创建文件成功')
      } else {
        console.error('[ERR]:原路径无post.json,创建文件失败')
      }
    }
  } catch (e) {
    console.error('[ERR]:post.json操作失败', e)
  }
}

/*
 * public/ 下的静态资源不进 Vite 模块图，无法 import；
 * 把 post.json / links.json / photos.json 原样复制到 dist/.cache/，
 * 得到可 import 的同源副本，供各页面 SSR/客户端同步取数据
 */
export const syncStaticMeta = (): void => {
  if (fs.existsSync(JSON_PATH)) {
    fs.copyFileSync(JSON_PATH, POST_META_PATH)
  }
  if (fs.existsSync(LINK_JSON_PATH)) {
    fs.copyFileSync(LINK_JSON_PATH, LINK_META_PATH)
  }
  if (fs.existsSync(PHOTO_JSON_PATH)) {
    fs.copyFileSync(PHOTO_JSON_PATH, PHOTO_META_PATH)
  }
}
