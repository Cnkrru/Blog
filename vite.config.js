// ============================================================
// Cnkrru's Blog — Vite 构建配置
// ============================================================

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

import { createSsgOptions } from './src/_build/ssg'


// 手动分包：把 Vue 框架依赖聚合成独立 vendor chunk，优化浏览器长期缓存
function manualChunks(id) {
  if (id.includes('node_modules')) {
    if (id.includes('vue') || id.includes('router') || id.includes('pinia')) return 'vendor'
  }
  return undefined
}


/*
* id：vite配置
*/ 
export default defineConfig(
    {
      // 公共基础路径，服务器查询代码文件夹的根路径
      base: '/',

      // 服务器选项，false表示使用http协议，本地预览一般使用http
      server: {https: false},
      
      // vue的文件查询路径，将src作为根目录，一般把APP.vue所在文件夹作为根目录
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url))
        }
      },
      
      // vite预处理配置，构建时排除md文件，md文件由插件vite-ssg构建
      // 另排除 Vue 生态依赖（vue/vue-router/pinia）：@vercel/analytics、@vercel/speed-insights
      // 内部也依赖 vue-router，若让其参与预打包会在开发模式产生重复实例，导致
      // App.vue 中 useRouter() 拿不到注入（router===undefined）。排除后强制走单一 source。
      // __VUE_VERSION__ 是 @vue/repl 期待宿主注入的构建期常量（官方 play.vuejs.org 用 define 注入），
      // 缺失会让其在 semver 版本比较时报 undefined.startsWith
      define: {
        __VUE_VERSION__: JSON.stringify('3.5.32'),
      },
      optimizeDeps: {
        // 显式预打包 @vue/repl，避免懒加载时才触发依赖预构建导致 504「Outdated Optimize Dep」
        include: ['@vue/repl', '@vue/compiler-sfc'],
        exclude: ['*.md', 'vue', 'vue-router', 'pinia']
      },

      // 构建配置
      // 1. 排除md文件，md文件用自定义函数manualchunks处理
      // 2. CSS优化
      // 3. JS压缩优化
      // 4. CSS压缩优化
      // 5. 构建时不生成sourcemap文件，减少构建时间
      // 6. chunk大小警告限制，默认1500kb，太大会导致页面加载缓慢
      build: {
        rollupOptions: {
          external: ['**/*.md'],
          output: {manualChunks}
        },
        cssCodeSplit: true,
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        },
        cssMinify: 'esbuild',
        sourcemap: false,
        chunkSizeWarningLimit: 1000
      },
      
      // 插件配置
      // 一般和该文件的头部导入一样
      plugins: [
        vue()
      ],

      // SSG选项：统一由 src/_build/ssg.js 组装
      ssgOptions: createSsgOptions()
    }
  )