/*
 * 文章编译：解析 frontmatter → 渲染 md → 写 SFC + 元数据 JSON
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import {
  ARTICLE_PATH,
  CACHE_PATH,
  JSON_PATH,
  PUBLIC_REL_PATH,
} from './paths.ts'
import {
  setPageKey,
  sfcIsFresh,
  pluginLatestMtime,
  countWords,
} from './tools.ts'
import { createMdInstance } from './markdown.ts'

// 文章元数据：frontmatter 展开 + 编译期派生字段
export type ArticleMeta = {
  order: number
  title: string
  date: string
  updated: string
  tags: string[]
  wordCount: number
  readingTime: number
}

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
 * 解析 md 并写盘：SFC 落 dist/.cache/，元数据落 public/config/post.json
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
      order: frontmatter.order,
      title: frontmatter.title || id,
      date: frontmatter.date ? new Date(frontmatter.date).toISOString().slice(0, 10) : '',
      updated: frontmatter.updated ? new Date(frontmatter.updated).toISOString().slice(0, 10) : '',
      tags: frontmatter.tags || [],
      wordCount,
      readingTime,
    }
  }

  orderChecker(articles)
  fs.writeFileSync(JSON_PATH, JSON.stringify(articles, null, 4), 'utf8')
}
