---
title: Frontend-返回顶部组件
date: 2026-04-19
category: 前端
tags: [前端, 组件]
description: 详细介绍前端组件——返回顶部，介绍组件如何制作。
keywords: 前端, 组件, 返回顶部, TypeScript
---
### 返回顶部的制作思路
1. 绑定监听阅读进度的区域
2. 绑定点击事件
3. 利用浏览器的API`scrollTo()`方法,将指定区域/整个页面(Window)滚动到顶部

   - 如果想在阅读一定距离出现，通过监听滚动距离，用布局来决定是否显示(block/none)
   - 本篇文章并没有涉及HTML和CSS，示例中的选择器大家根据自己代码里的实际情况来修改
## 代码:

### 固定位置的返回顶部按钮
```ts

// 选择监听sample-card区域=>作为滚动的区域
// 选择返回顶部按钮的容器=>用于绑定click事件
const backTopArea = document.querySelector('.sample-card') as HTMLElement | null;
const backTopBtn = document.querySelector('.back-to-top') as HTMLElement | null;

const backToTop = (): void=> {
  // 绑定click事件
  backTopBtn.addEventListener('click', (): void => {
    // 使用scrollTo()返回顶部
    backTopArea.scrollTo({
      top: 0,
      behavior: 'smooth'
      })
  })
}
```

### 阅读指定px后，在特定位置出现返回顶部按钮
```ts

// 设置的出现高度
// 选择返回顶部按钮的容器=>用于绑定click事件
// 选择文章内容的容器=>用于监听滚动距离
const height : number = 1000
const backTopBtn : HTMLElement | null = document.querySelector('.back-to-top') as HTMLElement | null;
const backTopArea : HTMLElement | null = document.querySelector('.sample-card') as HTMLElement | null;

// 显示
const btnShow = (): void=> {
  if (backTopArea.scrollTop > height)
  {
    backTopBtn.style.display = 'block'
  }
  else
  {
    backTopBtn.style.display = 'none'
  }
}

// 滚动
const backToTop = (): void=> {
  backTopBtn.addEventListener('click', (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
      })
  })
}
```
----------------------------------------------------------------
- 如有建议，请联系我,邮箱:3253884026@qq.com
