import { useHead } from '@unhead/vue'
import {
  SITE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_OG_IMAGE,
  SITE_OG_IMAGE_ALT,
} from '../config/site'

type SeoOptions = {
  title?: string
  description?: string
  keywords?: string
  path?: string
  type?: 'website' | 'article'
  publishedTime?: string
  updatedTime?: string
  tags?: string[]
  noindex?: boolean
  // 分享封面：文章可在 frontmatter 用 cover 覆盖；不传则用站点默认图
  image?: string
  imageAlt?: string
}

/** 站内相对路径补齐为绝对地址（社交平台抓取 og:image 要求绝对 URL） */
const toAbsolute = (url: string) => {
  if (/^https?:\/\//i.test(url)) return url
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

/*
* id: useSeo
* fn: 页面级 SEO 元数据，收敛 title/description/keywords/canonical/og/twitter
* 各页在 setup 内调用；title 省略时回退站点标题，description/keywords 省略时回退站点默认值
*/
export const useSeo = (options: SeoOptions = {}) => {
  const title = options.title ? `${options.title} - ${SITE_TITLE}` : SITE_TITLE
  const description = options.description || SITE_DESCRIPTION
  const keywords = options.keywords || SITE_KEYWORDS
  const url = `${SITE_URL}${options.path ?? '/'}`
  const type = options.type ?? 'website'
  const image = toAbsolute(options.image || SITE_OG_IMAGE)
  const imageAlt = options.imageAlt || options.title || SITE_OG_IMAGE_ALT

  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'robots', content: options.noindex ? 'noindex, nofollow' : 'index, follow' },
      { property: 'og:site_name', content: SITE_TITLE },
      { property: 'og:locale', content: 'zh_CN' },
      { property: 'og:type', content: type },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:image:alt', content: imageAlt },
      // 有封面时用大图卡片（summary_large_image），否则退回小图 summary
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: image },
      { name: 'twitter:image:alt', content: imageAlt },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      ...(options.type === 'article' && options.publishedTime
        ? [{ property: 'article:published_time', content: options.publishedTime }]
        : []),
      ...(options.type === 'article' && options.updatedTime
        ? [{ property: 'article:modified_time', content: options.updatedTime }]
        : []),
      ...(options.type === 'article' && options.tags
        ? options.tags.map((tag) => ({ property: 'article:tag', content: tag }))
        : []),
    ],
    link: options.noindex ? [] : [{ rel: 'canonical', href: url }],
  })
}