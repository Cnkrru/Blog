---
id: 0
name: 个人博客
description: HTML+CSS+TypeScript(Javascript)+Vue的个人博客系统
category: 前端
title: 个人博客项目 - HTML+CSS+TypeScript(Javascript)+Vue实现
keywords: 个人博客, HTML5, CSS3, TypeScript, Vue, 前端项目, 响应式设计, Markdown, 代码高亮, 图片灯箱
---

# 个人博客

使用HTML+CSS+JavaScript制作Version1.0，后用Vue重构Version2.0。

## 功能特点

### 核心功能
1. 返回顶部
2. 沉浸阅读
3. 搜索功能
4. 音乐播放器
5. 天气组件（IP定位获取天气）
6. 网站年龄显示

### Markdown增强
1. Markdown文章渲染
2. 代码高亮
3. 图片灯箱
4. 数学公式支持（KaTeX）
5. Mermaid图表支持
6. 目录导航（TOC）
7. 代码一键复制

### 主题与语言
1. 主题切换（亮色/暗色）
2. 多语言支持（i18n）

### 监控与性能
1. 性能监控面板
2. 内存监控
3. 网络请求监控
4. 热力图（文章发布热力图）
5. 访客地图
6. 实时时钟

### 通知与交互
1. 通知系统
2. 欢迎通知
3. 控制台彩蛋
4. 鼠标轨迹效果
5. 网络粒子效果
6. Easter Egg动画

### 媒体功能
1. 音频可视化
2. 音频特效（空间音效、音量控制、播放列表）
3. Live2D看板娘
4. 图片懒加载

### 文章功能
1. 文章统计
2. 相关文章推荐
3. 文章阅读进度
4. 文章导航（上一篇/下一篇）
5. 文章分享
6. 评论系统

### 工具与页面
1. 工具箱（代码运行器、串口调试工具）
2. 终端命令行
3. 项目展示
4. 友情链接
5. 更新日志
6. 关于页面
7. 归档页面
8. RSS订阅
9. 公告系统

### 其他功能
1. 骨架屏加载
2. 门过渡动画
3. 滚动指示器
4. 标签云
5. 网站统计
6. GitHub API集成
7. 百度/谷歌分析集成

## 技术栈

- HTML5
- CSS3
- TypeScript (ES6+)
- Vue

## 部署与开发

### 开发模式
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

## 项目结构

```
vue-blog/
├── src/
│   ├── components/      # 组件目录
│   ├── pages/          # 页面目录
│   ├── assets/         # 静态资源
│   ├── utils/          # 工具函数
│   ├── stores/         # 状态管理
│   └── router/         # 路由配置
├── public/             # 公开资源
│   └── config/         # 配置文件
└── package.json
```
