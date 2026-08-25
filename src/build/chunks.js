// manualChunks函数用于根据id判断是否需要打包到特定的chunk中
export function manualChunks(id) {
  if (id.includes('node_modules')) {
    if (id.includes('vue') || id.includes('router') || id.includes('pinia')) return 'vendor'
  }
  return undefined
}