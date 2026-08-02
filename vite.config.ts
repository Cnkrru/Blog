// 导入ts工具函数
import { defineConfig } from 'vite'
// 导入vue
import vue from '@vitejs/plugin-vue'
// 导入vite插件，根据页面自动生成路由
import Pages from 'vite-plugin-pages'
// 构建node依赖包
import { dirname } from 'path'
import { fileURLToPath, URL } from 'node:url'

// 导入自定义插件
import copyJsFilesPlugin from './src/plugins/copy-js-files'
import copyVercelConfigPlugin from './src/plugins/copy-vercel-config'
import generateOgImagesPlugin from './src/plugins/generate-og-images'

// 导入构建工具函数
import { manualChunks } from './src/plugins/chunks'
import { getIncludedRoutes } from './src/plugins/routes'
import { onSsgFinished } from './src/plugins/seo'

// 将文件url协议file://转为路径再获取文件路径
// import.meta.url表示一个文件的路径,file:///D:/code_projects/frontend/vite.config.ts，在不同环境（node/brower值不同）
const __dirname = dirname(fileURLToPath(import.meta.url))
const includedRoutes = getIncludedRoutes(__dirname)


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
      
      // vite预处理配置，构建时排除md文件，文件md由插件vite-ssg构建
      optimizeDeps: {
        exclude: ['*.md']
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
        vue(),
        Pages({
          dirs: 'src/pages',
          extensions: ['vue'],
          importMode: 'sync',
          exclude: ['**/*.md']
        }),
        copyJsFilesPlugin(),
        copyVercelConfigPlugin(),
        generateOgImagesPlugin()
      ],

      // SSG选项
      ssgOptions: {
        script: 'async',
        formatting: 'minify',
        includedRoutes: () => {
          return includedRoutes
        },
        onFinished() {
          onSsgFinished(__dirname)
        }
      }
    }
  )
