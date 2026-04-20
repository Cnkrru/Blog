# Cnkrru's Blog

基于 Vue 3 的个人技术博客。

## 技术栈

- Vue 3 + Composition API
- Vue Router 4
- Pinia 3（状态管理）
- Vue I18n（国际化）
- Vite + vite-ssg（构建与静态生成）
- vite-plugin-pages（页面路由）
- ECharts（访客地图、热力图、标签云）
- Three.js（音频可视化）
- CodeMirror 5（代码编辑器）
- Web Audio API（3D 环绕音效）
- Web Workers（代码安全执行）
- @vueuse/head（SEO）

## 功能

**内容**
- 文章系统（Markdown、代码高亮、数学公式、流程图）
- 项目展示、归档、友链、关于
- 工具集页面（Serial Tool、Code Runner）
- 终端页面

**Header**
- 音乐播放器（播放控制、进度条、音量、播放列表）
- 3D 环绕音效
- 搜索（中文分词）
- 主题切换（自动 + 手动）
- 樱花/雪花动态效果
- 语言选择器
- 阅读进度条

**Center**
- 性能监控（Memory、Fetch API）
- 音频可视化
- 鼠标跟随特效
- 控制台彩蛋
- 标签云
- 代码复制、分享、目录导航
- 评论区
- Live2D 看板娘
- 分页

**Index**
- 实时时钟
- GitHub 风格热力图
- 访客地图
- 网络粒子背景

**其他**
- 懒加载图片
- 骨架屏
- RSS 订阅

## 目录结构

```
src/
├── assets/          # 静态资源
├── components/      # Vue 组件
│   ├── api/        # API 组件（天气等）
│   ├── commands/   # 终端命令
│   ├── functions/  # 功能组件
│   ├── index/      # 首页组件
│   └── tools/      # 工具页面组件
├── pages/           # 页面
├── router/          # 路由
├── stores/         # Pinia 状态
├── utils/          # 工具函数
├── i18n/           # 国际化
└── composables/     # 组合式函数
```
