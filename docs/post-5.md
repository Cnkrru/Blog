---
order: 6
title: blog-1-站内年龄组件
date: 2026-10-24
category: 前端
tags: [blog]
description: 记录blog页脚的组件——siteage的做法
keywords: blog,siteage
---

## 建站时长(siteage)

建站时长需要用JS内置的Date库，这里笔者不具体说有哪些函数了，笔者也只是用到了学过一次，知道有这个库，有印象

- Date库MDN文档:[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)
  - 关于这个库，笔者记得有几组函数
    - `get` -> 获取时间
    - `set` -> 设置时间
    - `to` -> 转换时间

```tip
get类函数获取到的年月日时分秒，是从UNIX时间戳起始时间(1970.0.0 00:00:00)开始算的,得到的不是从起始时间开始的计时，而是1970年的，所以不能直接用get类函数,如果想要年月的话，可以用别的库,不过对于建站时长这个组件来说，年月没必要，10年也不过3650+-2(3)而已，100年也才上万，谁能活那么久呢
```

### 建站时长代码

1. vue部分代码

```vue
<script setup lang="ts">
import Clock from '../icon/Clock.vue'
import { onMounted } from 'vue'
import { refWebage, webageStart } from '@/composables/pfooter.ts'
onMounted(() => {
  webageStart()
})
</script>

<template>
  <div class="webage"><Clock class="icon" />{{ refWebage }}</div>
</template>

<style scoped>
.webage {
  width: 80%;
  height: fit-content;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-sm);

  border-radius: var(--radius-full);
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
  padding: var(--space-sm);

  background: color-mix(in srgb, var(--g-color) 15%, transparent);
  color: var(--g-text);
}

@media (max-width: 480px) {
  .webage {
    width: 90%;
    font-size: 0.9em;
  }
}
</style>
```

2. typescript部分代码

```ts
import { ref } from 'vue'

export const refWebage = ref('')
let timer: ReturnType<typeof setInterval> | null = null
export const webageTick = () => {
  const initDate: number = Number(new Date('2026-10-04'))
  const currentDate: number = Number(new Date())
  const diffTime: number = currentDate - initDate

  const totalSeconds = Math.floor(diffTime / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  refWebage.value = `本博客已运行: ${days} 天 ${hours} 时 ${minutes} 分 ${seconds}秒`
}

export const webageStart = () => {
  if (timer) return
  webageTick()
  timer = setInterval(webageTick, 1000)
}
```

1. `const initDate: number = Number(new Date('2026-10-04'))`
   - 创建初始时间
2. `const currentDate: number = Number(new Date())`
   - 获取当前时间
3. `const diffTime: number = currentDate - initDate`
   - 算出差值时间
4. `const totalSeconds = Math.floor(Math.max(diffTime, 0) / 1000)`
   - 获取秒数,把毫秒部分去掉
5. 分别计算出日，时，分，秒

```ts
const days = Math.floor(totalSeconds / 86400)
const hours = Math.floor((totalSeconds % 86400) / 3600)
const minutes = Math.floor((totalSeconds % 3600) / 60)
const seconds = totalSeconds % 60
```

6. `refWebage.value = 本博客已运行: '${days} 天 ${hours} 时 ${minutes} 分 ${seconds}秒'`
   用vue的`{{}}`语法配合`ref`变量，渲染出来

7. setInterval循环

```ts
export const webageStart = () => {
  if (timer) return
  webageTick()
  timer = setInterval(webageTick, 1000)
}
```

```tip
这里`new Date()`函数获取到的是UNIX时间戳,不是直接算出来两者之间差的年月日，时分秒,difftime获取的是毫秒

这里的refWebage接收的字符串应该用反引号包裹,这里因为md->html的限制，用了单引号
```

```info
1. Math.floor(number),在这里是向下取整(floor:地板，地面，数学含义:向下取整)
2. setInterval(handleFunction,timeNum),timeNum(1 -> 1ms)
```
