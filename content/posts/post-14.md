---
title: Frontend-CSS变量
date: 2026-08-10
category: 前端
tags: [前端]
description: 介绍前端CSS属性
keywords: frontend
---
## CSS变量相关知识
> 使用CSS变量可以减少相同CSS属性的重复次数，统一UI风格
1. 写法
    - `--<>-<>-<>:<属性>`，--开头
    - 属性可以是任何CSS属性
2. 挂载
    - 一般挂载到伪类选择器`:root`上
3. 调用
    - `var(<css属性>,备用值)`
4. JS修改CSS
    - 获取：`element.style.getPropertyValue(<CSS变量>)`
    - 设置：`element.style.setProperty(<CSS变量>)`
    - 改类：`<选择器>.classList.toggle`
---
> 编辑于2026-08-10

> 作者：Cnkrru

> 联系方式：3253884026@qq.com