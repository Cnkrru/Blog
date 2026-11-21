/*
 * 文章编译：解析 frontmatter → 渲染 md → 写 SFC + 元数据模块
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import {
  ARTICLE_PATH,
  CACHE_PATH,
  POST_CONFIG_PATH,
  POST_META_PATH,
  PUBLIC_REL_PATH,
} from './paths.ts'
import {
  setPageKey,
  sfcIsFresh,
  pluginLatestMtime,
  countWords,
} from './tools.ts'
import { createMdInstance } from './markdown.ts'
import type { CleanData, PostMeta } from '../composables/common/type.ts'

// 文章元数据：frontmatter 全字段 + 编译期派生字段
export type ArticleMeta = PostMeta

/*
 * 校验 order 唯一：运行期 order→key 映射是"后写覆盖先写"，重复会静默吞掉文章，
 * 故在写盘前拦下，既不落脏元数据也不让问题藏到列表页
 */
export const orderChecker = (articles: Record<string, ArticleMeta>): void => {
  const owner = new Map<number, string>()
  const conflicts: string[] = []
  for (const [id, meta] of Object.entries(articles)) {
    if (owner.has(meta.order)) {
      conflicts.push(`order=${meta.order} 被 ${owner.get(meta.order)} 与 ${id} 同时占用`)
      continue
    }
    owner.set(meta.order, id)
  }
  if (conflicts.length > 0) {
    console.error(`[ERR]:文章 order 重复，已中止编译：\n  ${conflicts.join('\n  ')}`)
    throw new Error(`文章 order 重复：${conflicts.join('；')}`)
  }
}

/*
 * 解析 md 并写盘：SFC 落 dist/.cache/，元数据生成 src/composables/config/post.config.ts
 * mtime 增量：SFC 产物已新于源/脚本/插件时跳过重渲染
 */
export const mdParser = (files: string[]): void => {
  const md = createMdInstance()
  const pluginMtime = pluginLatestMtime()

  const articles: Record<string, ArticleMeta> = {}

  for (const file of files) {
    const id = file.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(ARTICLE_PATH, file), 'utf-8')
    const content = matter(raw).content
    const frontmatter = matter(raw).data

    const sfcPath = path.join(CACHE_PATH, `${id}.vue`)

    if (!sfcIsFresh(file, pluginMtime)) {
      setPageKey(id)
      const rendered = md.render(content)
      // 把 src/href 里的 ../public/ 换成相对 SFC 所在目录的路径
      const withPublicRel = rendered.replace(
        /(src|href)="\.\.\/public\//g,
        `$1="${PUBLIC_REL_PATH}/`,
      )
      const vue = `<template>${withPublicRel}</template>`
      fs.writeFileSync(sfcPath, vue, 'utf8')
    }

    const wordCount = countWords(content)
    const readingTime = Math.max(1, Math.ceil(wordCount / 300))

    articles[id] = {
      ...frontmatter,
      order: Number(frontmatter.order),
      title: frontmatter.title || id,
      date: frontmatter.date ? new Date(frontmatter.date).toISOString().slice(0, 10) : '',
      updated: frontmatter.updated ? new Date(frontmatter.updated).toISOString().slice(0, 10) : '',
      category: frontmatter.category ?? '',
      tags: frontmatter.tags || [],
      description: frontmatter.description ?? '',
      keywords: frontmatter.keywords ?? '',
      wordCount,
      readingTime,
    }
  }

  orderChecker(articles)

  // 清洗数据：按 order 升序，只保留组件实际用到的字段
  const cleanList: CleanData[] = Object.entries(articles)
    .sort((a, b) => a[1].order - b[1].order)
    .map(([key, meta]) => ({
      key,
      title: meta.title,
      date: meta.date,
      updated: meta.updated,
      category: meta.category,
      tags: meta.tags,
      history: meta.history,
      wordCount: meta.wordCount,
      readingTime: meta.readingTime,
    }))

  // 客户端数据源：生成可直接 import 的 ts 模块
  const banner = '// 该文件由编译管线自动生成，请勿手动修改\n'
  const rawBody = JSON.stringify(articles, null, 2)
  const cleanBody = JSON.stringify(cleanList, null, 2)
  const ts = `${banner}import type { CleanData, PostData } from '../common/type'\n\n// 原始数据：frontmatter 全字段 + 编译期派生，仅文章页 SEO 使用\nexport const rawPostData: PostData = ${rawBody}\n\n// 清洗数据：只保留组件需要的字段，数组顺序 = order 升序\nexport const postData: CleanData[] = ${cleanBody}\n`
  // 先写临时文件再 rename，避免 dev 下 Vite 读到写了一半的内容
  const tmpPath = `${POST_CONFIG_PATH}.tmp`
  fs.writeFileSync(tmpPath, ts, 'utf8')
  fs.renameSync(tmpPath, POST_CONFIG_PATH)

  // 构建期元数据副本：供 sitemap 读取，始终是本次最新结果
  fs.writeFileSync(POST_META_PATH, rawBody, 'utf8')
}
