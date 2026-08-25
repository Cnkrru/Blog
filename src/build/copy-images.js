// 插件id：复制文章图片
// 插件fn：将 content/images 下的文章图片递归复制到构建目录 dist/images

import { resolve, dirname, join } from 'path'
import { readdirSync, copyFileSync, mkdirSync, existsSync, statSync } from 'fs'
import { fileURLToPath } from 'node:url'

// file:///D:/__projects/blog/src/build/copy-images.js，用于推导相对路径
const __dirname = dirname(fileURLToPath(import.meta.url))

// 源码目录：content/images
const srcDir = resolve(__dirname, '../../content/images')
// 输出目录：dist/images（与 public 复制到 dist 根目录的效果一致，保证 /images/xxx 可访问）
const destDir = resolve(__dirname, '../../dist/images')

// 递归复制目录，保留子目录层级
function copyDir(src, dest) {
  if (!existsSync(src)) return
  mkdirSync(dest, { recursive: true })
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry)
    const destPath = join(dest, entry)
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}

export default function copyImagesPlugin() {
  return {
    name: 'copy-images',
    buildEnd() {
      copyDir(srcDir, destDir)
      console.info('[info]复制 content/images → dist/images 完成')
    }
  }
}