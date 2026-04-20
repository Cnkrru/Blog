---
title: Frontend-主题切换
date: 2026-04-20
category: 前端
tags: [前端, 主题]
description: 详细介绍前端组件——主题切换，介绍组件如何制作。
keywords: 前端组件, 主题切换, TypeScript
---
### 主题切换制作思路
制作主题切换功能，一个主题对应一套配色，所以只需要更改CSS属性里和颜色相关的变量就行。

常见的做法是用CSS变量的形式，即给颜色相关的属性定义变量，然后在需要使用的地方引用这些变量

### 代码:
```typescript

const toggleTheme = (): void=> {
  document.body.classList.toggle('dark-theme')
}
```
```css

:root {
  --color-primary: #007bff;
}
.dark-theme {
  --color-primary: #000000;
}
body {
  background-color: var(--color-primary);
}
```

### 注意：
- CSS变量使用时只能用var，不能用let或const
- CSS变量命名时建议使用短横线命名法，例如--color-primary
- CSS变量可以控制任何CSS属性，主题切换只是常见用法
- 一般情况下，两套主题在两个选择器下，:root选择器用于定义亮色主题，dark-theme用于定义暗黑主题的变量
- 个人制作习惯是将用到的颜色放一个CSS文件里，如果其他文件需要，就引用这个文件的变量

### 拓展
1. 根据时间自动切换主题
2. 默认主题配置
-----------------------------------------------------------------
- 如有建议，请联系我,邮箱:3253884026@qq.com
