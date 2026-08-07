---
title: Frontend-网站年龄组件设计
date: 2026-04-21
category: 前端
tags: [前端, 组件]
description: 详细介绍前端组件——网站年龄组件，介绍组件如何制作。
keywords: 前端组件, 网站年龄组件, HTML, CSS
---
### 相关
> 如果学过后端语言，比如python，C之类的，应该学习过时间戳，time包相关知识
> JavaScript在前端部分内置了time包，可以直接使用。
> 作者这里称time为包: 作者学过py，C，C++，JavaScript,主要写python代码
> 各个可用于后端的语言，其实都是一样的，只是擅长领域不同，写法稍微有些不同，语言之间是互通的。
> time模块，在python中称为包，在C/C++称为库，在JavaScript称为对象，其实都是一个东西，作者这里按照自己的习惯来称呼：time包

### 网站年龄组件设计思路
> 1. 设置一个网站起始时间戳
> 2. 调用JavaScript的time对象的内置方法，获取当前时间的时间戳。
> 3. 计算时间戳差值，规范化显示(需要用Math包处理数值)

---

### 代码:
```javascript
const updateAge = ()=> {
    // 设置一个网站起始时间戳
    const startTime = new Date('2026-03-28T12:00:00').getTime()
    // 获取当前时间的时间戳
    const now = Date.now()
    const diff = now - startTime

    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(months / 12)

    const displayMonths = months % 12
    const displayDays = days % 30
    const displayHours = hours % 24
    const displayMinutes = minutes % 60 
    const displaySeconds = seconds % 60

    // 显示标准格式：年-月-日 小时:分:秒，使用 i18n 翻译
    websiteAge.value = `${years}年${displayMonths}月${displayDays}天${displayHours}时${displayMinutes}分${displaySeconds}秒`
}

// 调用前端内置的计时器，每秒更新一次网站年龄
let updateInterval = setInterval(updateAge, 1000)

```

---
> 编辑于2026-04-21
> 作者：Cnkrru
> 联系方式：3253884026@qq.com