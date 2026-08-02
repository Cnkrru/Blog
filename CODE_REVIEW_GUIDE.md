# Vue-Blog 项目代码审查指南

## 项目概况

| 项目 | 说明 |
|------|------|
| **名称** | vue-blog (Cnkrru's Blog) |
| **类型** | 个人技术博客（SSG 静态站点生成） |
| **技术栈** | Vue 3.5 + TypeScript 6.0 + Vite 8.0 + Pinia 3.0 + Vue Router 4.6 |
| **SSG** | vite-ssg + vite-plugin-pages |
| **部署** | Vercel |
| **组件数** | 66 个 .vue 组件 |
| **Store 数** | 22 个 Pinia Store 模块 |
| **文章数** | 12 篇 Markdown 文章 |
| **路由数** | 12 条路由 + 1 条 404 |

---

## 项目完整目录树

```
d:/code_projects/frontend/blog/
│
├── 📄 根目录配置文件
│   ├── index.html                    # 入口 HTML                          →  index.html
│   ├── package.json                  # 依赖 & 脚本 (vue3, pinia, vite)    →  package.json
│   ├── tsconfig.json                 # TS 编译配置 (strict=false)          →  tsconfig.json
│   ├── tsconfig.node.json            # Node 端 TS 配置                     →  tsconfig.node.json
│   ├── vite.config.ts                # Vite 构建配置 + 5 个自定义插件       →  vite.config.ts
│   ├── vercel.json                   # Vercel 部署配置                     →  vercel.json
│   ├── README.md                     # 项目说明                            →  README.md
│   └── LICENSE                       # 开源协议                            →  LICENSE
│
├── 🖥️  desktop/                      # Electron 桌面端
│   ├── main.js                       # Electron 主进程                     →  desktop/main.js
│   ├── index.html                    # 桌面端入口                          →  desktop/index.html
│   └── package.json                  # 桌面端依赖                          →  desktop/package.json
│
├── 🌐 public/                        # 静态资源（不经过构建）
│   ├── rss.xml                       # RSS 订阅源                          →  public/rss.xml
│   ├── sitemap.xml                   # 站点地图                            →  public/sitemap.xml
│   ├── giscus-theme-dark.css         # Giscus 评论暗色主题                  →  public/giscus-theme-dark.css
│   ├── giscus-theme-light.css        # Giscus 评论亮色主题                  →  public/giscus-theme-light.css
│   ├── config/                       # ⭐ 站点配置中心
│   │   ├── routes.json               #   预渲染路由清单                     →  public/config/routes.json
│   │   ├── search.json               #   文章搜索索引                       →  public/config/search.json
│   │   ├── links.json                #   友情链接数据                       →  public/config/links.json
│   │   ├── music.json                #   音乐列表数据                       →  public/config/music.json
│   │   ├── projects.json             #   项目展示数据                       →  public/config/projects.json
│   │   └── sponsor.json              #   赞助者数据                         →  public/config/sponsor.json
│   ├── js/                           # 特效脚本
│   │   ├── sakuraPlus.js             #   樱花飘落特效                       →  public/js/sakuraPlus.js
│   │   └── snowy.js                  #   雪花飘落特效                        →  public/js/snowy.js
│   └── og/                           # Open Graph 封面图
│       ├── default.svg               #   默认封面                          →  public/og/default.svg
│       ├── default-dark.svg          #   暗色默认封面                       →  public/og/default-dark.svg
│       ├── post-0.svg ~ post-11.svg  #   文章封面（含 dark 版）             →  public/og/post-*.svg
│       └── post-changelog.svg        #   更新日志封面                       →  public/og/post-changelog.svg
│
└── 🧠 src/                           # 源码目录
    │
    ├── 🚀 入口层
    │   ├── main.ts                   #   应用入口 (createApp, SSR/client 分支)     →  src/main.ts
    │   ├── App.vue                   #   ⭐ 根组件 (布局编排、路由导航进度条)         →  src/App.vue
    │   ├── style.css                 #   全局样式                                   →  src/style.css
    │   └── vite-env.d.ts             #   Vite 类型声明                              →  src/vite-env.d.ts
    │
    ├── 🗺️  router/                   # 路由层
    │   └── index.ts                  #   12 条路由 + scrollBehavior                 →  src/router/index.ts
    │
    ├── 🗄️  stores/                   # 状态管理层 (22 个 Store)
    │   ├── index.ts                  #   Pinia 实例 & 统一导出                       →  src/stores/index.ts
    │   ├── theme.ts                  #   主题 (dark/light, 自动切换)                  →  src/stores/theme.ts
    │   ├── scroll.ts                 #   滚动位置 & 返回顶部                          →  src/stores/scroll.ts
    │   ├── tag.ts                    #   标签统计 & 排序                              →  src/stores/tag.ts
    │   ├── toc.ts                    #   文章目录                                    →  src/stores/toc.ts
    │   ├── notification.ts           #   全局通知                                    →  src/stores/notification.ts
    │   ├── mouse.ts                  #   鼠标状态                                    →  src/stores/mouse.ts
    │   ├── audio.ts                  #   音频播放                                    →  src/stores/audio.ts
    │   ├── live2d.ts                 #   Live2D 看板娘                               →  src/stores/live2d.ts
    │   ├── dynamicEffects.ts         #   动态特效控制                                →  src/stores/dynamicEffects.ts
    │   ├── math.ts                   #   Katex 数学公式                              →  src/stores/math.ts
    │   ├── mermaid.ts                #   Mermaid 图表                                →  src/stores/mermaid.ts
    │   ├── code.ts                   #   代码渲染                                    →  src/stores/code.ts
    │   ├── clipboard.ts              #   剪贴板                                      →  src/stores/clipboard.ts
    │   ├── user.ts                   #   用户偏好                                    →  src/stores/user.ts
    │   ├── comment.ts                #   评论系统                                    →  src/stores/comment.ts
    │   ├── global.ts                 #   全局状态                                    →  src/stores/global.ts
    │   ├── content.ts                #   内容加载                                    →  src/stores/content.ts
    │   ├── posts.ts                  #   文章列表                                    →  src/stores/posts.ts
    │   ├── articles.ts               #   文章操作                                    →  src/stores/articles.ts
    │   ├── music.ts                  #   音乐播放器                                  →  src/stores/music.ts
    │   └── announcement.ts           #   公告栏                                      →  src/stores/announcement.ts
    │
    ├── 📄  pages/                    # 页面层 (14 页面 + 12 篇文章)
    │   ├── index.vue                 #   首页 (全屏 Hero)                             →  src/pages/index.vue
    │   ├── Home.vue                  #   文章列表主页                                 →  src/pages/Home.vue
    │   ├── Archives.vue              #   归档页                                       →  src/pages/Archives.vue
    │   ├── About/About.vue           #   关于页                                       →  src/pages/About/About.vue
    │   ├── Links.vue                 #   友链页                                       →  src/pages/Links.vue
    │   ├── LinkApply.vue             #   友链申请页                                   →  src/pages/LinkApply.vue
    │   ├── Projects.vue              #   项目页                                       →  src/pages/Projects.vue
    │   ├── Timeline.vue              #   时间线                                       →  src/pages/Timeline.vue
    │   ├── SearchPage.vue            #   搜索页                                       →  src/pages/SearchPage.vue
    │   ├── NotFound.vue              #   404 页                                       →  src/pages/NotFound.vue
    │   ├── log/Changelog.vue         #   更新日志                                     →  src/pages/log/Changelog.vue
    │   ├── post/Posts.vue            #   文章详情页                                   →  src/pages/post/Posts.vue
    │   ├── post/post-0.md ~ post-11.md  # 12 篇 Markdown 文章                        →  src/pages/post/post-*.md
    │   ├── project/Projects.vue      #   项目详情                                     →  src/pages/project/Projects.vue
    │   └── announcement/             #   公告页                                       →  src/pages/announcement/
    │
    ├── 🧩 components/               # 组件层 (66 个 .vue)
    │   │
    │   ├── 🏗️  布局组件
    │   │   ├── Header.vue            #   顶部导航栏       →  src/components/Header.vue
    │   │   ├── Sidebar.vue           #   侧边栏           →  src/components/Sidebar.vue
    │   │   ├── Center.vue            #   内容区容器        →  src/components/Center.vue
    │   │   ├── Footer.vue            #   页脚             →  src/components/Footer.vue
    │   │   └── MobileNav.vue         #   移动端导航        →  src/components/MobileNav.vue
    │   │
    │   ├── 🧭 p-header/              # 顶栏子组件 (8 个)
    │   │   ├── Logo.vue              #   Logo             →  src/components/p-header/Logo.vue
    │   │   ├── Search.vue            #   搜索框            →  src/components/p-header/Search.vue
    │   │   ├── SearchResults.vue     #   搜索结果          →  src/components/p-header/SearchResults.vue
    │   │   ├── ThemeToggle.vue       #   主题切换          →  src/components/p-header/ThemeToggle.vue
    │   │   ├── ImmersiveReading.vue  #   沉浸式阅读        →  src/components/p-header/ImmersiveReading.vue
    │   │   ├── ReadingProgress.vue   #   阅读进度条        →  src/components/p-header/ReadingProgress.vue
    │   │   ├── DynamicEffectControl.vue  # 特效控制面板    →  src/components/p-header/DynamicEffectControl.vue
    │   │   └── MobileMenu.vue        #   移动端菜单        →  src/components/p-header/MobileMenu.vue
    │   │
    │   ├── 📦 p-sidebar/             # 侧栏子组件 (3 个)
    │   │   ├── Avatar.vue            #   头像             →  src/components/p-sidebar/Avatar.vue
    │   │   ├── PageLinks.vue         #   页面链接          →  src/components/p-sidebar/PageLinks.vue
    │   │   └── WelcomeSaying.vue     #   欢迎语            →  src/components/p-sidebar/WelcomeSaying.vue
    │   │
    │   ├── 📰 p-center/              # 内容区子组件 (13 个)
    │   │   ├── Toc.vue               #   文章目录          →  src/components/p-center/Toc.vue
    │   │   ├── TocButton.vue         #   目录按钮          →  src/components/p-center/TocButton.vue
    │   │   ├── ArticleNav.vue        #   文章导航          →  src/components/p-center/ArticleNav.vue
    │   │   ├── PostMenu.vue          #   文章菜单          →  src/components/p-center/PostMenu.vue
    │   │   ├── PageNav.vue           #   分页导航          →  src/components/p-center/PageNav.vue
    │   │   ├── BackToTop.vue         #   返回顶部          →  src/components/p-center/BackToTop.vue
    │   │   ├── ContextMenu.vue       #   右键菜单          →  src/components/p-center/ContextMenu.vue
    │   │   ├── ReadingTime.vue       #   阅读时间          →  src/components/p-center/ReadingTime.vue
    │   │   ├── TagCloud.vue          #   标签云            →  src/components/p-center/TagCloud.vue
    │   │   ├── RelatedArticles.vue   #   相关文章          →  src/components/p-center/RelatedArticles.vue
    │   │   ├── ArticleCount.vue      #   文章统计          →  src/components/p-center/ArticleCount.vue
    │   │   ├── SiteStats.vue         #   站点统计          →  src/components/p-center/SiteStats.vue
    │   │   └── ScrollEasterEgg.vue   #   滚动彩蛋          →  src/components/p-center/ScrollEasterEgg.vue
    │   │
    │   ├── 🖼️  p-footer/             # 页脚子组件 (2 个)
    │   │   ├── CopyRight.vue         #   版权信息          →  src/components/p-footer/CopyRight.vue
    │   │   └── WebsiteAge.vue        #   站点年龄          →  src/components/p-footer/WebsiteAge.vue
    │   │
    │   ├── 📝 content/               # 内容渲染组件 (8 个)
    │   │   ├── ContentRender.vue     #   ⭐ 总调度渲染器    →  src/components/content/ContentRender.vue
    │   │   ├── MarkdownRender.vue    #   Markdown 渲染     →  src/components/content/MarkdownRender.vue
    │   │   ├── CodeRender.vue        #   代码块渲染        →  src/components/content/CodeRender.vue
    │   │   ├── CodePreview.vue       #   代码预览          →  src/components/content/CodePreview.vue
    │   │   ├── HighlightRender.vue   #   语法高亮          →  src/components/content/HighlightRender.vue
    │   │   ├── KatexRender.vue       #   数学公式渲染      →  src/components/content/KatexRender.vue
    │   │   ├── MermaidRender.vue     #   流程图渲染        →  src/components/content/MermaidRender.vue
    │   │   └── NotificationRender.vue #  通知渲染          →  src/components/content/NotificationRender.vue
    │   │
    │   ├── 🎬 page-index/            # 首页子组件 (7 个)
    │   │   ├── HeroContent.vue       #   Hero 区内容       →  src/components/page-index/HeroContent.vue
    │   │   ├── IndexLogo.vue         #   首页 Logo         →  src/components/page-index/IndexLogo.vue
    │   │   ├── IndexNavbar.vue       #   首页导航          →  src/components/page-index/IndexNavbar.vue
    │   │   ├── Heatmap.vue           #   热力图            →  src/components/page-index/Heatmap.vue
    │   │   ├── RealTimeClock.vue     #   实时时钟          →  src/components/page-index/RealTimeClock.vue
    │   │   ├── NetworkParticles.vue  #   粒子网络          →  src/components/page-index/NetworkParticles.vue
    │   │   └── ScrollIndicator.vue   #   滚动指示器        →  src/components/page-index/ScrollIndicator.vue
    │   │
    │   ├── 🎵 media/                 # 多媒体组件 (11 个)
    │   │   ├── MusicPlay.vue         #   音乐播放器主控    →  src/components/media/MusicPlay.vue
    │   │   ├── MusicPlayerStyles.vue #   播放器样式        →  src/components/media/MusicPlayerStyles.vue
    │   │   ├── PlayerControls.vue    #   播放控制          →  src/components/media/PlayerControls.vue
    │   │   ├── PlayerProgress.vue    #   播放进度          →  src/components/media/PlayerProgress.vue
    │   │   ├── PlayerVolume.vue      #   音量控制          →  src/components/media/PlayerVolume.vue
    │   │   ├── PlayerPlaylist.vue    #   播放列表          →  src/components/media/PlayerPlaylist.vue
    │   │   ├── AudioEffects.vue      #   音频特效          →  src/components/media/AudioEffects.vue
    │   │   ├── AudioVisualizer.vue   #   音频可视化        →  src/components/media/AudioVisualizer.vue
    │   │   ├── Live2dWidget.vue      #   Live2D 看板娘     →  src/components/media/Live2dWidget.vue
    │   │   ├── ConsoleEasterEgg.vue  #   控制台彩蛋        →  src/components/media/ConsoleEasterEgg.vue
    │   │   └── EasterEggAnimation.vue #  彩蛋动画          →  src/components/media/EasterEggAnimation.vue
    │   │
    │   └── 🔌 api/                   # 第三方 API 集成 (8 个)
    │       ├── Comment.vue           #   Giscus 评论       →  src/components/api/Comment.vue
    │       ├── GitHub.vue            #   GitHub API        →  src/components/api/GitHub.vue
    │       ├── MouseTrail.vue        #   鼠标拖尾          →  src/components/api/MouseTrail.vue
    │       ├── ShareButton.vue       #   分享按钮          →  src/components/api/ShareButton.vue
    │       ├── Sponsor.vue           #   赞助页面          →  src/components/api/Sponsor.vue
    │       ├── Weather.vue           #   天气组件          →  src/components/api/Weather.vue
    │       ├── WebAnalytics.vue      #   站内统计          →  src/components/api/WebAnalytics.vue
    │       └── WelcomeNotification.vue # 欢迎通知          →  src/components/api/WelcomeNotification.vue
    │
    ├── 🔧 utils/                     # 工具函数层 (6 个)
    │   ├── algorithms.ts             #   算法工具                      →  src/utils/algorithms.ts
    │   ├── cache.ts                  #   缓存工具                      →  src/utils/cache.ts
    │   ├── helpers.ts                #   通用辅助函数                   →  src/utils/helpers.ts
    │   ├── markdown.ts               #   Markdown 解析                  →  src/utils/markdown.ts
    │   ├── useContentLoader.ts       #   内容加载器                     →  src/utils/useContentLoader.ts
    │   └── optimization-init.ts      #   性能优化初始化                  →  src/utils/optimization-init.ts
    │
    ├── 📐 types/                     # 类型定义层                       →  src/types/
    ├── 🎨 assets/                    # 静态资源
    │   ├── css/color.css             #   颜色变量                       →  src/assets/css/color.css
    │   └── imgs/                     #   图片 (头像/背景/42 个 SVG 图标) →  src/assets/imgs/
    │
    └── 🪝 composables/              # 组合式函数                        →  src/composables/
```

---

## 推荐 Code Review 顺序

按**自底向上、从核心到外围**的原则，分为 5 个阶段，共 20 步：

---

### 🔴 第一阶段：基础设施层（优先审查，决定项目质量底线）

| 顺序 | 文件 | 文件位置 | 审查重点 | 预计时间 |
|:----:|------|----------|---------|:--------:|
| **1** | `vite.config.ts` | `vite.config.ts` | 含 **5 个自定义插件**（copyJsFiles、copyVercelConfig、generateOgImages、sitemap 生成、RSS 生成），是构建核心。检查：空 catch 块吞异常、SVG 模板注入风险（title/date 的 XSS 转义是否充分）、`manualChunks` 引用了不存在的 `components/tools` 路径 | 20min |
| **2** | `tsconfig.json` | `tsconfig.json` | `strict: false` — 关闭了严格模式，可能导致未处理的 null/undefined。评估是否可开启 | 5min |
| **3** | `main.ts` | `src/main.ts` | SSR/Client 分支逻辑、优化系统异步初始化未 await（静默失败）、`.ts` 后缀导入写法不一致 | 10min |
| **4** | `router/index.ts` | `src/router/index.ts` | 12 条路由、scrollBehavior 重写逻辑、动态路由 `:id` 的参数校验和不存在处理 | 15min |
| **5** | `stores/index.ts` + 核心 stores | `src/stores/index.ts`、`src/stores/theme.ts`、`src/stores/scroll.ts`、`src/stores/posts.ts`、`src/stores/content.ts` | 先看 **index.ts**（Pinia 实例化），再看 **theme.ts**（直接操作 DOM 与 Vue 响应式的边界）、**scroll.ts**（双滚动容器逻辑）、**posts.ts / content.ts**（文章数据流） | 30min |

**第一阶段小计：约 1.5 小时**

---

### 🟠 第二阶段：布局 & 根组件

| 顺序 | 文件 | 文件位置 | 审查重点 | 预计时间 |
|:----:|------|----------|---------|:--------:|
| **6** | `App.vue` | `src/App.vue` | 根布局编排：进度条实现、首页/终端页的条件渲染、Vercel Analytics 集成、`router.beforeEach` 中的 `requestAnimationFrame` 嵌套 | 15min |
| **7** | `Header.vue` | `src/components/Header.vue` | 导航栏（当前已修改，需关注 diff）、搜索集成、主题切换 | 10min |
| **8** | `Sidebar.vue` | `src/components/Sidebar.vue` | 侧边栏个人信息、友链展示 | 10min |
| **9** | `Center.vue` | `src/components/Center.vue` | 内容区容器（`<slot>` 架构）、`.center-card-content` 滚动容器 | 5min |
| **10** | `Footer.vue` + `MobileNav.vue` | `src/components/Footer.vue`、`src/components/MobileNav.vue` | 页脚信息、移动端导航适配 | 10min |

**第二阶段小计：约 50 分钟**

---

### 🟡 第三阶段：页面层（按用户访问频率排序）

| 顺序 | 文件 | 文件位置 | 审查重点 | 预计时间 |
|:----:|------|----------|---------|:--------:|
| **11** | `index.vue` + `page-index/*` | `src/pages/index.vue`、`src/components/page-index/HeroContent.vue`、`src/components/page-index/IndexLogo.vue`、`src/components/page-index/IndexNavbar.vue`、`src/components/page-index/Heatmap.vue`、`src/components/page-index/RealTimeClock.vue`、`src/components/page-index/NetworkParticles.vue`、`src/components/page-index/ScrollIndicator.vue` | 首页 Hero 区、粒子网络、热力图、实时时钟 | 20min |
| **12** | `Home.vue` + `p-center/*` | `src/pages/Home.vue`、`src/components/p-center/Toc.vue`、`src/components/p-center/TocButton.vue`、`src/components/p-center/ArticleNav.vue`、`src/components/p-center/PostMenu.vue`、`src/components/p-center/PageNav.vue`、`src/components/p-center/BackToTop.vue`、`src/components/p-center/ContextMenu.vue`、`src/components/p-center/ReadingTime.vue`、`src/components/p-center/TagCloud.vue`、`src/components/p-center/RelatedArticles.vue`、`src/components/p-center/ArticleCount.vue`、`src/components/p-center/SiteStats.vue`、`src/components/p-center/ScrollEasterEgg.vue` | 文章列表、分页、标签云、文章统计 | 25min |
| **13** | `post/Posts.vue` + `content/*` | `src/pages/post/Posts.vue`、`src/components/content/ContentRender.vue`、`src/components/content/MarkdownRender.vue`、`src/components/content/CodeRender.vue`、`src/components/content/CodePreview.vue`、`src/components/content/HighlightRender.vue`、`src/components/content/KatexRender.vue`、`src/components/content/MermaidRender.vue`、`src/components/content/NotificationRender.vue` | ⭐ **核心页面**：Markdown → HTML 渲染流程（`ContentRender` → `MarkdownRender` → `CodeRender`/`KatexRender`/`MermaidRender`）、TOC 生成、相关文章推荐 | 30min |
| **14** | 其余页面 | `src/pages/Archives.vue`、`src/pages/Links.vue`、`src/pages/Projects.vue`、`src/pages/project/Projects.vue`、`src/pages/Timeline.vue`、`src/pages/SearchPage.vue`、`src/pages/About/About.vue`、`src/pages/log/Changelog.vue`、`src/pages/LinkApply.vue`、`src/pages/NotFound.vue` | Archives、Links、Projects、Timeline、SearchPage、About、Changelog、LinkApply、404 | 30min |

**第三阶段小计：约 1.75 小时**

---

### 🟢 第四阶段：功能特性层

| 顺序 | 文件 | 文件位置 | 审查重点 | 预计时间 |
|:----:|------|----------|---------|:--------:|
| **15** | `api/*` (8 个) | `src/components/api/Comment.vue`、`src/components/api/GitHub.vue`、`src/components/api/MouseTrail.vue`、`src/components/api/ShareButton.vue`、`src/components/api/Sponsor.vue`、`src/components/api/Weather.vue`、`src/components/api/WebAnalytics.vue`、`src/components/api/WelcomeNotification.vue` | Giscus 评论（已修改，关注 diff）、GitHub API、鼠标拖尾、分享按钮、天气 API、分析统计 | 20min |
| **16** | `media/*` (11 个) | `src/components/media/MusicPlay.vue`、`src/components/media/MusicPlayerStyles.vue`、`src/components/media/PlayerControls.vue`、`src/components/media/PlayerProgress.vue`、`src/components/media/PlayerVolume.vue`、`src/components/media/PlayerPlaylist.vue`、`src/components/media/AudioEffects.vue`、`src/components/media/AudioVisualizer.vue`、`src/components/media/Live2dWidget.vue`、`src/components/media/ConsoleEasterEgg.vue`、`src/components/media/EasterEggAnimation.vue` | 音乐播放器（6 个组件协作）、Live2D、彩蛋系统、音频可视化 | 25min |
| **17** | `p-header/*` (8 个) | `src/components/p-header/Logo.vue`、`src/components/p-header/Search.vue`、`src/components/p-header/SearchResults.vue`、`src/components/p-header/ThemeToggle.vue`、`src/components/p-header/ImmersiveReading.vue`、`src/components/p-header/ReadingProgress.vue`、`src/components/p-header/DynamicEffectControl.vue`、`src/components/p-header/MobileMenu.vue` | 搜索功能（Search + SearchResults）、沉浸式阅读模式、特效控制面板 | 20min |

**第四阶段小计：约 1 小时**

---

### 🔵 第五阶段：工具层 & 数据配置

| 顺序 | 文件 | 文件位置 | 审查重点 | 预计时间 |
|:----:|------|----------|---------|:--------:|
| **18** | `utils/*` (6 个) | `src/utils/algorithms.ts`、`src/utils/cache.ts`、`src/utils/helpers.ts`、`src/utils/markdown.ts`、`src/utils/useContentLoader.ts`、`src/utils/optimization-init.ts` | `markdown.ts`（Markdown 解析逻辑）、`cache.ts`（缓存策略）、`algorithms.ts`、`optimization-init.ts`（性能优化） | 15min |
| **19** | `config/*` (6 个 JSON) | `public/config/routes.json`、`public/config/search.json`、`public/config/links.json`、`public/config/music.json`、`public/config/projects.json`、`public/config/sponsor.json` | 数据准确性：`routes.json`（预渲染路由）、`search.json`（搜索索引）、`links.json`、`projects.json` | 10min |
| **20** | 其余 stores (14 个) | `src/stores/tag.ts`、`src/stores/toc.ts`、`src/stores/notification.ts`、`src/stores/mouse.ts`、`src/stores/audio.ts`、`src/stores/live2d.ts`、`src/stores/dynamicEffects.ts`、`src/stores/math.ts`、`src/stores/mermaid.ts`、`src/stores/code.ts`、`src/stores/clipboard.ts`、`src/stores/user.ts`、`src/stores/comment.ts`、`src/stores/global.ts`、`src/stores/articles.ts`、`src/stores/music.ts`、`src/stores/announcement.ts` | 功能型 stores：音乐播放器、公告栏、剪贴板、代码渲染、图表、Live2D 等 | 20min |

**第五阶段小计：约 45 分钟**

---

## 总审查时间预估

| 阶段 | 内容 | 预计时间 |
|------|------|:--------:|
| 第一阶段 | 基础设施层 | 约 1.5h |
| 第二阶段 | 布局 & 根组件 | 约 50min |
| 第三阶段 | 页面层 | 约 1.75h |
| 第四阶段 | 功能特性层 | 约 1h |
| 第五阶段 | 工具层 & 配置 | 约 45min |
| **合计** | | **约 6 小时** |

---

## 重点关注风险点

| 风险等级 | 问题描述 | 文件位置 |
|:--------:|---------|----------|
| 🔴 **高** | `tsconfig.json` 中 `strict: false`，关闭类型安全检查 | `tsconfig.json` |
| 🔴 **高** | `vite.config.ts` 多个 try-catch 为空 catch 块，构建错误静默丢失 | `vite.config.ts` |
| 🔴 **高** | Markdown 渲染链路复杂（7 个组件协作），需关注 XSS 防护 | `src/components/content/ContentRender.vue` 及相关 7 个文件 |
| 🟠 **中** | Theme Store 直接操作 DOM（`document.body.classList`），绕过 Vue 虚拟 DOM | `src/stores/theme.ts` |
| 🟠 **中** | `main.ts` 中 `optimization-init.js` 动态 import 失败后静默降级，用户无感知 | `src/main.ts` |
| 🟠 **中** | `vite.config.ts` 中 `manualChunks` 引用了 `components/tools` 路径，但项目不存在该目录 | `vite.config.ts` |
| 🟡 **低** | 22 个 Store 模块管理繁琐，部分 Store 功能可合并（如 `posts` + `articles`） | `src/stores/posts.ts`、`src/stores/articles.ts` |
| 🟡 **低** | `public/` 与 `dist/` 同时写入 sitemap/rss/og 文件，构建逻辑耦合 | `vite.config.ts` |

---

## 架构简评

### 优点

- 项目结构分层清晰：`router → stores → pages → components → utils`，职责分明
- 组件拆分粒度合理，`p-header/`、`p-sidebar/`、`p-center/` 等子目录按功能域隔离
- SEO 覆盖全面：SSG 预渲染 + 自动 sitemap + RSS + OG 封面图
- 自定义 Vite 插件实现了编译时 SEO 文件生成，设计思路好

### 改进建议

- 开启 `strict: true` 或在 tsconfig 中逐步启用 `strictNullChecks`
- 构建插件中的空 catch 块应至少输出 `console.warn`
- 建议为 Markdown 渲染链路添加单元测试
- 考虑合并功能相近的 Store（如 `posts` + `articles`、`code` + `clipboard`）

---

> **使用建议**：从第一阶段按顺序推进，每完成一个阶段做一次阶段性总结，确保不遗漏关键问题。
