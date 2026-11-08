/*
 * 编译期路径常量：脚本自身 rootPath 推导一次，各消费方 import 即可
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// md 源目录
export const ARTICLE_DIR = 'docs'

// 脚本文件 → node → 项目根
const scriptPath = fileURLToPath(import.meta.url)
const dirPath = path.dirname(scriptPath)
export const ROOT_PATH = path.resolve(dirPath, '../..')

// 关键产物路径
export const ARTICLE_PATH = path.join(ROOT_PATH, ARTICLE_DIR)
export const CACHE_PATH = path.join(ROOT_PATH, 'dist', '.cache')
export const JSON_PATH = path.join(ROOT_PATH, 'public/config/post.json')
export const POST_META_PATH = path.join(CACHE_PATH, 'post.json')
export const LINK_JSON_PATH = path.join(ROOT_PATH, 'public/config/links.json')
export const LINK_META_PATH = path.join(CACHE_PATH, 'links.json')
export const PHOTO_JSON_PATH = path.join(ROOT_PATH, 'public/config/photos.json')
export const PHOTO_META_PATH = path.join(CACHE_PATH, 'photos.json')
export const SIG_FILE_PATH = path.join(CACHE_PATH, '.compile-sig')
export const PLUGINS_DIR = path.join(dirPath, 'plugins')

// md 里写 `../public/`，SFC 落在 CACHE_PATH，按目录深度换算的相对路径
export const PUBLIC_REL_PATH = path
  .relative(CACHE_PATH, path.join(ROOT_PATH, 'public'))
  .replace(/\\/g, '/')
