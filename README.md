# Cnkrru's Blog

基于 Vue 3 + Vite + vite-ssg 的个人技术博客，静态站点生成。

## 技术栈

- Vue 3 + Composition API
- Vue Router 4
- Pinia 3（状态管理）
- Vite + vite-ssg（构建与静态生成）
- vite-plugin-pages（页面路由）
- Markdown（marked.js 渲染 + Prism.js 代码高亮）
- KaTeX（数学公式）
- Mermaid（流程图）
- @vueuse/head（SEO）

## 功能

**内容系统**
- 文章系统（Markdown、代码高亮、数学公式、流程图）
- 项目展示、归档、友链、关于
- 自动生成 OG 封面图、RSS、Sitemap

**侧边栏**
- 头像、欢迎语、天气组件
- 页面导航链接
- 站点统计（不蒜子）

**Header**
- 音乐播放器（播放控制、音量、播放列表）
- 搜索（中文分词）
- 主题切换（自动 + 手动，Ink / Sakura 双风格）
- 樱花/雪花动态效果
- 沉浸式阅读模式

**文章页**
- 目录导航、阅读时间
- 代码复制、代码预览
- 文章分享、赞助
- 相关文章推荐
- 评论区（Giscus）
- 图片灯箱

**其他**
- 懒加载图片
- 骨架屏
- 右键菜单

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发（热更新）
npm run dev

# 同步 Markdown 内容到 JSON 配置
npm run sync

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 目录结构
```
content/           # Markdown 文章源文件
├── posts/         # 博客文章
├── logs/          # 更新日志
├── projects/      # 项目展示
├── about/         # 关于页面
└── announcement/  # 公告

src/
├── assets/        # 静态资源
├── components/    # Vue 组件
│   ├── api/      # 第三方 API 组件（天气、GitHub、评论等）
│   ├── content/  # 内容渲染组件（Markdown、代码高亮等）
│   ├── media/    # 媒体组件（音乐播放器、音效等）
│   ├── p-center/ # 页面中部组件（目录、导航、菜单等）
│   ├── p-footer/ # 页脚组件
│   ├── p-header/ # 页头组件（搜索、主题、菜单等）
│   └── p-sidebar/# 侧边栏组件
├── pages/         # 页面
├── plugins/       # Vite 插件
├── stores/        # Pinia 状态
├── utils/         # 工具函数
└── composables/   # 组合式函数

public/            # 静态资源
├── config/        # 自动生成的 JSON 配置
├── og/            # 自动生成的 OG 封面图
└── js/            # 动态效果脚本

script/            # 构建与同步脚本
```