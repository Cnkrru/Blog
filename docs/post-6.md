---
order: 7
title: blog-2-版权组件
date: 2026-10-25
category: 前端
tags: [blog]
description: 记录blog页脚的版权组件的做法
keywords: blog,copyright
---

## 版权(copyright)

版权组件的话，看需求：

- 一般情况下，一行话就行，比如笔者这个blog，只是一个`div`标签组里写了一段话，然后给它写个样式
- 规范情况下，多个元素组合一下，起始时间+站点所属+备案(中国境内)+……,这种笔者没做过，尤其是备案相关的，这里不说相关内容，之后如果笔者的网站备案了，会补充

下面这个是笔者自己的版权组件,`var()`都是CSS变量,相关变量的样式可以看源码的`src/assets/css/`下的`css`文件

### 版权组件代码

```vue
<script setup lang="ts"></script>

<template>
  <div class="copyright">&copy Cnkrru,power by Vue,All rights reserved</div>
</template>

<style scoped>
.copyright {
  width: 80%;
  height: fit-content;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: var(--radius-full);
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
  padding: var(--space-sm);

  background: color-mix(in srgb, var(--g-color) 15%, transparent);
  color: var(--g-text);
}

@media (max-width: 480px) {
  .copyright {
    width: 100%;
    font-size: 0.9em;
  }
}
</style>
```

```info
`&copy`是一个字符实体，字符实体可以理解为一套符文编码

相关网址:[https://html.spec.whatwg.org/multipage/named-characters.html](https://html.spec.whatwg.org/multipage/named-characters.html)
```
