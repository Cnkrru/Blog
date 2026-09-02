---
title: Vue-1-vue介绍以及初始化
date: 2026-08-25
category: 前端
tags: [前端]
description: 记录vue初始化
keywords: vue
---
> vue官方文档:[https://cn.vuejs.org/](https://cn.vuejs.org/)
## vue介绍
- vue是一个前端JavaScript框架，组件化设计，作者是尤雨溪，挺好用的，本博客就是用vue做的
- vue有一些很好的特性：响应式数据，watch监听，组件生命周期，HTML+CSS+JS用三个标签在一个文件中隔离，一个vue文件就是一个组件
- 挺好用，中文文档也比较丰富，生态也强
---
## vue初始化
### 1. 环境准备
- 需要node.js，因为vue会编译为HTML+CSS+js，编译需要在node.js运行vue框架转译来实现
---
### 2. 快速开始
```shell
npm create vue@latest
```

![vue初始化](../images/post-27/vue-init.png)

> 官网的文档可能不是最新版，官网的初始化询问过程不一定和你实操时见到的一样，不过无所谓
---
### 3. 预览
- 经典三步走：
    1. cd <项目>    和很多项目一样，初始化在当前文件夹的子文件夹里
    2. npm install  安装依赖
    3. npm run dev  预览
---
### 4. 效果

![vue初始化站点](../images/post-27/vue-project.png)

> 可能不一样，作者第一次用vue时和这次再初始化，看到的已经不一样了，最初的好像是vite相关的，比较炫
- 现在创建新项目还会安装vue-devtools，现在3.6版本变化了一些，作者第一次使用应该是在3.5版本
---
### 5. APP.vue
> 初始化的`App.vue`作为组件树的根，使用id选择器`#app`，与`index.html`绑定
- main.js
    - 导入全局css(用vue的话，看人习惯，作者本人使用vue时，全局css只有两三个文件，组件样式更喜欢写在style代码块里)
    - 导包，导入vue的createApp函数
    - 导入根组件
    - `调用函数createApp`
        - 根组件和挂载的选择器都可以修改，不过一般也懒得改，没必要
```js
import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```
---
## vue API
### 6. 挂载子组件
> 官方文档的写法不一定是最新的，本篇记录的也不一定是最新的
> 作者使用的版本`vue3.5`
- 创建子vue组件
- 父组件导包`import <子组件路径>`
- 父组件`templete区域挂载</子组件名>`
---
### 7. 组合式API与选项式API
- 习惯用啥用啥，vue2是选项式API，vue3新出的组合式API
- 作者用的都是组合式API
- 选项式API数据与方法是分开的，不好看，组合式一个功能是一块儿
    - 而且选项式API的`data`,`methods`和`script setup`有访问权限的问题
    - `data`和`methods`可以访问全局`script setup`，反过来则不行
---
### 8. ref与reactive响应式数据
> 这两个主要是剩下了数据更新实时刷新页面的步骤，让你少写点JavaScript
> 本质上是把数据都弄成对象了，通过`.value`取数据
- ref -> reference 引用(作者英语一般)
- 解构：
    - toRef/toRefs
---
### 9. computed
> 这个是处理响应式数据的，`get`,`set`函数收发数据，支持JS的前端原生能力，天生同步，有缓存区
- 给响应式数据处理数据用这个
---
### 10. watch与watchEffect
> 监听响应式数据的，监听钩子，根据数据变化干对应的活
- 给响应式数据做回调函数用这个
---
### 11. 标签属性：ref
> 在原有标签属性上加了一个ref，让标签具有响应式特性
- 给标签做响应式变化用的
---
### 12. hook API
> 给响应式数据写工具函数用的
---
### 13. props
> 父子组件传参数用的
---
### 14. 生命周期
> 生命周期在做App时可以会遇到这个概念，主要是用来管理事件顺序的
- 不管做什么项目，项目结构都像树一样，开关有顺序，先有父再有子，子取消了父才能取消
    - 这个顺序像是栈吗，也差不多
    - 不过vue这个生命周期只管vue的部分，vue以外的js活动管不了

| 阶段 | 钩子 |
|------|------|
| 创建阶段 | `setup` |
| 挂载阶段 | `onBeforeMount`、`onMounted` |
| 更新阶段 | `onBeforeUpdate`、`onUpdated` |
| 卸载阶段 | `onBeforeUnmount`、`onUnmounted` |

---
### 15. vue-router
> vue官方插件，配套vue组件和一个配置文件
> 官方文档:[https://router.vuejs.org/zh/](https://router.vuejs.org/zh/)
- 配置文件:`router/index.js`
    - 在里面写的内容跟后端框架写的路由挺像的，就是给不同页面类型绑定一下对应的vue文件
    - ```js
        const routes = [
            {   path:`<路径>`,
                name:`<页面id>`,
                components:`<组件路径>`
            }
        ]
      ```
- vue组件
    - Router-Link:会被编译成一个`<a>`
    > 说了跟没说一样，肯定编译成a标签，不过好处时不用写ajax，避免白屏切换页面
---
### 16. 组件注册
> 官网说要component方法注册一下，不过不注册也行，一个vue文件就是一个组件，直接import+</>标签挂载就行
- 官方那种是一次注册，全局不用import，随便挂载
---
### 各种`:`属性
> :语法是vue的编译期语法，有的用来增强原本html属性，有的用于vue自身特性
- :class:
    - 对应原本js的`classList.add/remove`        
    - > 对应class切换
- :style
    - 对应原本js的`<选择器>.style.<样式>`        
    - > 对应选择器样式修改
- :title
    - html原生title属性，用:将其转换为js语句，增强title的能力
    - > 对应鼠标悬浮提示
- :key
    - v-for的标识符
- :is
    - component组件配套
#### props属性
- 自定义的各种props属性在使用时，也要+`:`
> 编辑于2026-08-11

> 作者：Cnkrru

> 联系方式：3253884026@qq.com