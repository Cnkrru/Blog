---
title: Frontend-返回顶部组件
date: 2026-04-19
updated: 2026-09-02 更新vue组件的制作方法
history: 
    - 2026-08-06 更新HTML组件的制作方法
category: 前端
tags: [前端]
description: 详细介绍前端组件——返回顶部，介绍组件如何制作。
keywords: 前端, 组件, 返回顶部, TypeScript
---
## 制作方法
1. 依靠`scroll`API来实现，关于scroll详见于:[Frontend-Scroll-Screen](post-13.md)
2. 如果要实现滚动一定距离再显示，使用CSS变量，JS控制opacity来实现，关于CSS变量详见于:[Frontend-CSS变量](post-14.md)
---
## 代码:
### 1. html版本demo
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>backtotop</title>
    <style>
        :root {
            --btt-opacity: 0;
        }

        .placeholder {
            height: 20000px;
            overflow: auto;
        }
        .backtotop {
            position: fixed;

            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;

            background-color: #007BFF;
            border: none;
            border-radius: 50%;
            cursor: pointer;

            opacity: var(--btt-opacity);
            transition: opacity 0.3s ease;
        }
    </style>
</head>
<body>
    <div class="placeholder"></div>
    <button class="backtotop"></button>

    <script>
        const btt_button = document.querySelector('.backtotop');
        const placeholder = document.querySelector('.placeholder');
        function scrollToTop() {window.scroll({ top: 0, behavior: 'smooth' });}
        function updateButtonVisibility() 
        {
            if (window.scrollY > 300) {
                document.documentElement.style.setProperty('--btt-opacity', 1);
            } 
            else {
                document.documentElement.style.setProperty('--btt-opacity', 0);
            }
        }

        btt_button.addEventListener('click', scrollToTop);
        window.addEventListener('scroll', updateButtonVisibility);

    </script>
</body>
</html>
```
### 2. vue版本
- 该版本组件中引入了pinia，所以分为两部分，通用的`scroll.js`和`back_to_top.vue`
#### 1. scroll.js
```js
import { defineStore } from 'pinia'
// scorll_store
export const useScrollStore = defineStore('scroll', () => {
  /*
  * id: 返回顶部
  * fn: 让中心内容卡片返回顶部
  */
  const scroll_to_top = () => {
      const scroll_area = document.querySelector('.center-card-content')
      if (scroll_area) {
        scroll_area.scrollTo({ top: 0, 'behavior': 'smooth' })
      }
    }

  return {
    // 函数
    scroll_to_top
  }
}
)
```
#### 2. back_to_top.vue
```vue
<script setup>
import VIcon from '@/components/__common/VIcon.vue'
import { useScrollStore, useImmersiveStore } from '../../stores'

const scrollStore = useScrollStore()
const immersiveStore = useImmersiveStore()

</script>

<template>
    <!-- 正常状态下的返回顶部按钮 -->
    <button
        v-if="!immersiveStore.is_immersive"
        class="back-to-top-btn"
        title="返回顶部"
        aria-label="返回顶部"
        @click="scrollStore.scroll_to_top"
    >
        <VIcon :src="'arrow-up.svg'" :size="24" />
    </button>
    <!-- 沉浸阅读状态下的返回顶部按钮 -->
    <Teleport to="body">
        <button
            v-if="immersiveStore.is_immersive"
            class="back-to-top-btn immersive visible"
            title="返回顶部"
            aria-label="返回顶部"
            @click="scrollStore.scroll_to_top"
        >
            <VIcon :src="'arrow-up.svg'" :size="24" />
        </button>
    </Teleport>
</template>

<style scoped>
.back-to-top-btn {
    width: 38px;
    height: 38px;

    border-radius: 50%;
    border: 1px solid var(--common-color-1);
    
    display: flex;
    justify-content: center;
    align-items: center;
    
    cursor: pointer;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
    opacity: 1;
    visibility: visible;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    
    background: var(--common-color-1);

    color: #fff;
    box-shadow: 0 2px 8px color-mix(in srgb, var(--common-color-1) 30%, transparent);
}

.back-to-top-btn.immersive {
    bottom: 24px;
    right: 34px;

    position: fixed;
    z-index: 9998;
}

.back-to-top-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 14px color-mix(in srgb, var(--common-color-1) 40%, transparent);
}

@media (max-width: 768px) {
    .back-to-top-btn.immersive {
        bottom: 16px;
        right: 26px;
        width: 36px;
        height: 36px;
    }

    .back-to-top-btn.immersive img {
        width: 18px;
        height: 18px;
    }
}

@media (max-width: 640px) {
    .back-to-top-btn.immersive {
        bottom: 72px;
        right: 22px;
    }
}
</style>
```
---
> 编辑于2026-04-19

> 作者：Cnkrru

> 联系方式：3253884026@qq.com
