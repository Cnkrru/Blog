---
order: 11
title: blog-4-vue-router的使用方法
date: 2026-11-06
category: 前端
tags: [blog, vue]
description: 记录vue-router的使用方法
keywords: vue
---

## 简介

> vue-router是vue官方推出的路由插件

- 官网地址:[https://router.vuejs.org/zh/](https://router.vuejs.org/zh/)

```tip
笔者这里记录的使用方法并不全面，笔者用到了哪些，就会在这篇文章记录哪些，多余的笔者不学，也不记录
```

## 使用方法

### 1. 安装依赖

```sh
npm install vue-router
```

```info
一般在初始化vue项目时会询问是否添加这个组件，一般都会添加，还会顺带生成对应的配置文件
```

### 2. 创建配置文件

```filetree
- src/ | 源码文件夹
    - router/ | 路由配置文件夹
        - index.ts | 路由配置文件
```

```info
用vue官方初始化指令初始化时也是这个结构
```

### 3. 修改配置文件

```ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
```

- 以上是vue官方脚手架初始化的配置文件

1. createWebHistory
   - 笔者暂时不知道是干什么的
2. routes数组
   - 配置路由
   - path,name,component三个字段
     - path对应平时看网页时地址栏的内容
     - component对应页面类vue组件
3. 最后导出配置

```info
当前版本，vue项目默认将页面类vue组件放在`src/views`处
```

### 4. 挂载插件

#### 1. main.ts里导入router

```diff
+ import router from ./router/index.js
```

#### 2. main.ts里挂载router

```diff
+ app.use(router)
```

### 5. vue组件内使用

```info
vue组件内需要用vue-router内置组件router-link配合使用
router-link需要配置to属性使用
```

#### 代码示例

```vue
<router-link to="/postlist" class="nav-element">{{ refText.navPost }}</router-link>
<router-link to="/about" class="nav-element">{{ refText.navAbout }}</router-link>
<router-link to="/category" class="nav-element">{{ refText.navArchive }}</router-link>
<router-link to="/tag" class="nav-element">{{ refText.navTag }}</router-link>
<router-link to="/photo" class="nav-element">{{ refText.navPhoto }}</router-link>
<router-link to="/link" class="nav-element">{{ refText.navLink }}</router-link>
<router-link to="/setting" class="nav-element">{{ refText.navSetting }}</router-link>
```

```info
该实例是笔者博客的导航栏，`{{}}`在这里是用来做多语言了
```
