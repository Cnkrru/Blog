// 文章信息类型，用于OG封面图生成 / sitemap / RSS
export interface Post {
  id: string
  title: string
  description: string
  date: string
  tags?: string[]
}

// 导出配置
export interface Config {
  domain: string
}

// 导出路径配置
export interface RoutesConfig {
  routes: string[]
}
