// 站点级常量：SEO 与 RSS/sitemap 生成共用，换域名/站名只改这一处
export const SITE_URL = 'https://blog.cnkrru.top'
export const SITE_TITLE = 'Cnkrru'
export const SITE_DESCRIPTION = 'Cnkrru 的个人博客，分享前端、后端与硬件相关的学习笔记、项目实践与技术思考。'
export const SITE_KEYWORDS = 'Cnkrru,个人博客,前端,后端,Vue3,TypeScript,硬件'
// 分享封面：社交平台抓取 og:image 用（Facebook/Twitter 不支持 SVG，必须是 png/jpg）
// 换图只需替换 public/og-cover.png；文章可在 frontmatter 用 cover 字段单独指定
export const SITE_OG_IMAGE = '/og-cover.png'
export const SITE_OG_IMAGE_ALT = 'Cnkrru 的个人博客'