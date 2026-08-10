---
title: Frontend-Scroll-Screen
date: 2026-08-10
category: 前端
tags: [前端]
description: 介绍前端Web API：scrollAPI以及screen属性
keywords: frontend
---
## Scroll API
> scrollAPI专用于窗口滚动
> MDN文档:[MDN-Scroll](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/scroll)
1. scroll挂载对象
    - CSS选择器
    - window
2. scroll()参数
    - （x,y）：窗口坐标
    - option ：一组json数据`{top:<>,left:<>,behavior:<>}`
        - top对应x，left对应y
        - behavior：smooth（平滑滚动），instant（跳转），auto（计算位移差值自动决定）
---
## Screen属性
> screen属性一般配合scrollAPI使用
1. screenLeft属性
    - 文档:[MDN-screen](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/screenLeft)
    - 浏览器窗口到屏幕左边缘CSS像素的距离
2. screenTop属性
    - 文档:[MDN-screen](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/screenTop)
    - 浏览器窗口到屏幕顶部CSS像素的距离
3. screenX属性
    - 文档:[MDN-screen](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/screenX)
    - 浏览器左边界距离操作系统左边界的距离
4. screenY属性
    - 文档:[MDN-screen](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/screenY)
    - 浏览器顶部距离操作系统上边界的距离
---
## Scroll属性
> scroll属性一般会配合scrollAPI使用
1. scrollX
    - 文档:[MDN-scrollX](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/scrollX)
    - 页面水平方向的滚动值
2. scrollY
    - 文档:[MDN-scrollY](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/scrollY)
    - 页面竖直方向的滚动值
3. scrollTop
    - 文档:[MDN-scrollTop](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollTop)
    - 返回当前滚动位置距离原点的距离(double类型)
4. scrollHeight
    - 文档:[MDN-screen](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/screenHeight)
    - 返回元素高度，包括内边距padding，不包括边界线border和外边距margin，包含伪类选择器的高度
    - 计算时包括元素看不见的区域
5. clientHeight
    - 文档:[MDN-screen](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/clientHeight)
    - 返回元素高度，包含长度与scrollHeight一样
    - 与scrollHeight的关系，当元素展示不需要滚动条（overflow属性）时，两者相等
---
> 编辑于2026-08-10

> 作者：Cnkrru

> 联系方式：3253884026@qq.com