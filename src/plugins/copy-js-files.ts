// 插件id：复制函数-动态效果js
// 插件fn：用于将源码中引入的js复制到构建目录，主要是复制两个动态效果的源码

// 构建node依赖包
import { resolve, dirname } from 'path'
import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

// 将文件url协议file://转为路径再获取文件路径
// import.meta.url表示一个文件的路径,file:///D:/code_projects/frontend/vite.config.ts，在不同环境（node/brower值不同）
const __dirname = dirname(fileURLToPath(import.meta.url))

export default function copyJsFilesPlugin(): Plugin {
  return {
    // 插件名
    name: 'copy-js-files',
    buildEnd() {
      // 源码路径
      const srcDir = resolve(__dirname, '../assets/js')
      // 输出路径
      const destDir = resolve(__dirname, '../../../dist/assets/js')

      // 如果输出路径不存在，创建对应文件夹，参数recursive用于自动创建父级目录
      if (!existsSync(destDir)) { mkdirSync(destDir, { recursive: true }) }

      // 要复制的文件
      const files = ['sakuraPlus.js', 'snowy.js']
      // 文件复制函数
      files.forEach(file => {
        const srcFile = resolve(srcDir, file)
        const destFile = resolve(destDir, file)
        if (existsSync(srcFile)) {
          try {
            copyFileSync(srcFile, destFile)
            console.info(`[info]复制${file}成功`)
          } catch (error) {
            console.warn(` 复制 ${file} 失败:`, error)
          }
        }
      })
    }
  }
}
