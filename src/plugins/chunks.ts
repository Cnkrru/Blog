// manualChunks函数用于根据id判断是否需要打包到特定的chunk中
export function manualChunks(id: string): string | undefined {
  if (id.includes('node_modules')) {
    if (id.includes('vue') || id.includes('router') || id.includes('pinia')) {return 'vendor'}
    if (id.includes('vue-i18n')) {return 'i18n'}
    if (id.includes('echarts')) {return 'charts'}
  }
  
  // if (id.includes('components/tools')) {return 'tools'}，遗留，工具页面 -> AI遗留垃圾代码
  return undefined
}
