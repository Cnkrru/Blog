---
title: Frontend-网站年龄组件设计
date: 2026-04-20
category: 前端
tags: [前端, 组件]
description: 详细介绍前端组件——网站年龄组件，介绍组件如何制作。
keywords: 前端组件, 网站年龄组件, HTML, CSS
---
### 相关
>如果学过后端语言，比如python，C之类的，应该学习过时间戳，time包相关知识
>JavaScript在前端部分内置了time包，可以直接使用。
>作者这里称time为包: 作者学过py，C，C++，JavaScript,主要写python代码
>各个可用于后端的语言，其实都是一样的，只是擅长领域不同，写法稍微有些不同，语言之间是互通的。
>time模块，在python中称为包，在C/C++称为库，在JavaScript称为对象，其实都是一个东西，作者这里按照自己的习惯来称呼：time包

### 网站年龄组件设计思路
>1. 设置一个网站起始时间戳
>2. 调用JavaScript的time对象的内置方法，获取当前时间的时间戳。
>3. 计算时间戳差值，规范化显示(需要用Math包处理数值)

---

### 代码:
```typescript

const updateAge = (): void => {
    // 设置一个网站起始时间戳
    const startTime : number = new Date('2026-03-28T12:00:00').getTime()
    // 获取当前时间的时间戳
    const now : number = Date.now()
    const diff : number = now - startTime

    const seconds : number = Math.floor(diff / 1000)
    const minutes : number = Math.floor(seconds / 60)
    const hours : number = Math.floor(minutes / 60)
    const days : number = Math.floor(hours / 24)
    const months : number = Math.floor(days / 30)
    const years : number = Math.floor(months / 12)

    const displayMonths : number = months % 12
    const displayDays : number = days % 30
    const displayHours : number = hours % 24
    const displayMinutes : number = minutes % 60
    const displaySeconds : number = seconds % 60

    // 显示标准格式：年-月-日 小时:分:秒，使用 i18n 翻译
    websiteAge.value = `${years}年${displayMonths}月${displayDays}天${displayHours}时${displayMinutes}分${displaySeconds}秒`
}

// 调用前端内置的计时器，每秒更新一次网站年龄
let updateInterval: NodeJS.Timeout | null = setInterval(updateAge, 1000)

```
---
> 如有建议，请联系我,邮箱:3253884026@qq.com
