// 配置，如果vite环境变量(vite-end.d.ts)中没有VITE_DOMAIN，则使用默认的https://cnkrru.top
export const siteConfig = {
  domain: process.env.VITE_DOMAIN || 'https://cnkrru.top'
}