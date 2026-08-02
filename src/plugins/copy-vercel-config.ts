// 插件id：复制函数-vercel.json
// 插件fn：用于将源码中vercel的配置json复制到构建目录

// 构建node依赖包
import { resolve, dirname } from 'path'
import { copyFileSync } from 'fs'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

// 将文件url协议file://转为路径再获取文件路径
// import.meta.url表示一个文件的路径,file:///D:/code_projects/frontend/vite.config.ts，在不同环境（node/brower值不同）
const __dirname = dirname(fileURLToPath(import.meta.url))

export default function copyVercelConfigPlugin(): Plugin {
  return {
    name: 'copy-vercel-config',
    buildEnd() {
      const srcFile = resolve(__dirname, '../../../vercel.json')
      const destFile = resolve(__dirname, '../../../dist/vercel.json')

      try {
        copyFileSync(srcFile, destFile)
        console.log('[info]vercel.json 已复制到 dist 目录')
      } catch (error) {
        console.warn('[error]复制 vercel.json 失败:', error)
      }
    }
  }
}
