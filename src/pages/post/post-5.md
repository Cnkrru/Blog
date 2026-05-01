---
title: Frontend-沉浸阅读组件
date: 2026-04-19
category: 前端
tags: [前端, 组件]
description: 详细介绍前端组件——沉浸阅读，介绍组件如何制作。
keywords: 前端组件, 沉浸阅读, TypeScript
---
### 沉浸阅读制作思路
>1. 选择内容区域
>2. 更改内容区域样式
    - 沉浸阅读：实际上就是把样式改变一下
    - 把想隐藏的用display:none隐藏起来
    - 把想放大的设计新尺寸，用transform放大
建议直接操作body，方便些

---

### 代码:
```typescript

const toggleReading = (): void=> {
  document.body.classList.toggle('immersive-reading')
}
```

```css

    //隐藏的元素（left-blank, left-asider-S, left-center-blank, footer-blank, footer-flex, footer-S）
    body.immersive-reading .left-blank,
    body.immersive-reading .left-asider-S,
    body.immersive-reading .left-center-blank,
    body.immersive-reading .footer-blank,
    body.immersive-reading .footer-flex,
    body.immersive-reading .footer-S
    {
        display: none;
    }
    //放大的元素（center-S）
    body.immersive-reading .center-S
    {
    width: 1400px;
    max-width: 1400px;
    }
    //添加过渡效果(所有改动的元素)
    .left-blank, .left-asider-S, .left-center-blank,
    .footer-blank, .footer-flex, .footer-S,
    .center-S
    {
        transition: all 0.3s ease;
    }
```
---
> 如有建议，请联系我,邮箱:3253884026@qq.com
