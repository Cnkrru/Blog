/*
 * 编译期主入口：docs/*.md → dist/.cache/*.vue + public/config/post.json
 * 统一编排各子模块，作为 vite.config.ts 的 default import 入口
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CACHE_PATH, SIG_FILE_PATH, JSON_PATH } from './paths.ts'
import { compileSignature, pluginLatestMtime, sfcIsFresh } from './tools.ts'
import { configLanguage } from './markdown.ts'
import { mdParser } from './article.ts'
import {
  articlePathChecker,
  vuePathChecker,
  jsonPathChecker,
  vuePathCleaner,
  syncStaticMeta,
} from './files.ts'

/*
 * 主流程：路径检查 → 签名短路 → 缓存清理 → 语言加载 → 文章编译
 */
const compile = async (): Promise<void> => {
  // 1. 读文章列表
  const files = articlePathChecker()
  if (!files || files.length === 0) return

  // 确保缓存目录存在
  fs.mkdirSync(CACHE_PATH, { recursive: true })

  // 2. 签名比对：输入未变时短路复用缓存
  const sig = compileSignature(files)
  const ids = new Set(files.map((f) => f.replace(/\.md$/, '')))
  const postJsonExists = fs.existsSync(JSON_PATH)
  if (postJsonExists && fs.existsSync(SIG_FILE_PATH) && fs.readFileSync(SIG_FILE_PATH, 'utf8') === sig) {
    console.log('[INFO]:输入未变,短路复用dist/.cache编译缓存')
    // 短路分支也要清过时产物，否则被删的文章会成为 includedRoutes 的幻影路由
    vuePathCleaner(ids)
    syncStaticMeta()
    return
  }

  // 3. 缓存/元数据路径检查
  vuePathChecker(ids)
  jsonPathChecker()

  // 4. 有需要重渲染时才初始化高亮器（全量未变时跳过 createHighlighter）
  const pluginMtime = pluginLatestMtime()
  const needRender = files.some((f) => !sfcIsFresh(f, pluginMtime))
  if (needRender) {
    await configLanguage(files)
  }

  // 5. 编译文章
  mdParser(files)
  syncStaticMeta()

  // 落盘签名，供下次构建短路
  fs.writeFileSync(SIG_FILE_PATH, sig, 'utf8')
}

// 直接运行本文件时编译（`node --loader tsx main.ts` 等方式）
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  compile()
}

// 默认导出：vite.config.ts 通过 default import 消费
export default (): Promise<void> => compile()
