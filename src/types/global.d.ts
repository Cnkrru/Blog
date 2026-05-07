export {}

declare global {
  interface Window {
    marked: any
    OML2D: any
    globalMonitor: any
    performanceMonitor: any
    performanceTimers: Record<string, number>
    updateGiscusTheme?: (theme: string) => void
    refreshComments?: () => void
    hljs: any
    mermaid: any
    katex: any
    renderMathInElement: any
  }
}

declare module '*.md?raw' {
  const content: string
  export default content
}

declare module '*.md' {
  const content: string
  export default content
}

declare module '@vueuse/head' {
  export function createHead(): any
}

declare module '@vercel/speed-insights/vue' {
  export const SpeedInsights: any
}

declare module '@vercel/analytics/vue' {
  export const Analytics: any
}

declare module 'pinia-plugin-persistedstate' {
  const plugin: any
  export default plugin
}
