/*
 * 全站共享类型：跨模块复用的数据结构统一在此定义，各模块只 import，不重复声明
 */

/* ====================<post>==================== */
export type PostMeta = {
  order: number
  title: string
  date: string
  updated: string
  category: string
  tags: string[]
  history: string[]
  description: string
  keywords: string
  wordCount: number
  readingTime: number
}

// key 为文章 slug，value 为文章元信息
export type PostData = Record<string, PostMeta>

export type CleanData = {
  key: string
  title: string
  date: string
  category: string
  tags: string[]
}

/* ====================<category>==================== */
export type CategoryGroup = {
  name: string
  items: CleanData[]
}

/* ====================<link>==================== */
export type LinkData = {
  id: string
  name: string
  category: string
  description: string
  url: string
}

export type LinkGroup = {
  name: string
  links: LinkData[]
}

/* ====================<photo>==================== */
export type PhotoImage = {
  src: string // 原图，灯箱展示用
  thumb?: string // 缩略图，列表/瀑布流用，缺省回退 src
  alt?: string // 无障碍描述
  caption?: string // 灯箱图注
  shotAt?: string // 拍摄时间
  location?: string // 拍摄地点
}

export type PhotoAlbum = {
  id: string
  name: string
  description?: string
  cover?: string // 相册封面，缺省取第一张图的 thumb，再回退 src
  images: PhotoImage[]
}

/* ====================<music>==================== */
export type Song = {
  id: number // 用于排序
  title: string // 歌曲名
  artist: string // 艺术家
  cover: string // 封面地址
  audio: string // 歌曲地址
}

/* ====================<setting>==================== */
export type LD = 'light' | 'dark'

export type Theme = 'ink' | 'blue' | 'cyan' | 'sakura' | 'purple'

export type Layout = 'default' | 'card'

export type Bg = 'img' | 'video'

/* ====================<seo>==================== */
export type SeoOptions = {
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

// 文章页 SEO 数据：来自构建期 post.json 元信息
export type PostSeo = {
  title?: string
  description?: string
  keywords?: string
  date?: string
  updated?: string
  category?: string
  tags?: string[]
  cover?: string
}

/* ====================<search>==================== */
export type SearchDoc = {
  id: string
  title: string
  category: string
  tags: string[]
  date: string
}

/* ====================<share>==================== */
export type Platform = 'weibo' | 'qq' | 'facebook' | 'x' | 'tg'

/* ====================<toast>==================== */
export type Level = 'success' | 'info' | 'warning' | 'error'

/* ====================<postEdit>==================== */
export type HistoryItem = {
  date: string
  text: string
}

/* ====================<postToc>==================== */
export type HeadingItem = {
  id: string
  text: string
  level: number
}

/* ====================<hitmap>==================== */
export type DayData = {
  date: string
  activity: number
  publish: number
}

export type MonthData = {
  year: number
  month: number
  days: DayData[]
}

export type DateCounter = {
  publish: number
  updated: number
  history: number
}

/* ====================<particle>==================== */
export type Particle = {
  x: number
  y: number
  vX: number
  vY: number
  radius: number
}

export type MousePoint = {
  x: number
  y: number
}

export type Ripple = {
  x: number
  y: number
  radius: number
}
