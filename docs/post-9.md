---
order: 10
title: express-4-后端接口初次尝试
date: 2026-11-04
category: 后端
tags: [express, serverPanel]
description: 记录express项目第一次接口实现
keywords: express
---

## 简介

笔者也是第一次写后端接口，水平不行，可能写的不优雅，第一次，能跑通就行

第一个接口笔者准备用`systeminfomation`库获取电脑信息，交给前端渲染出来

## 简单示例

- 在`src/index.ts`直接写一个简单接口

```ts
app.get('/hello', (_req, res) => {
  res.json('hello world')
})
```

然后访问:

```terminal
http://localhost:3000/hello
```

返回数据

```json
"hello world"
```

## 具体步骤

### 1. 用systeminformation库获取数据

笔者先在`test/`下尝试了这个库，关于这个库的详细内容，请看以下文档学习

- 官方文档:[](<>)
- 笔者笔记;[](<>)
- 代码示例,`src/servers/sysinfo.ts`

```ts
import si from 'systeminformation'
import os from 'os'

export const getCpuInfo = async () => {
  const cpuDate = await si.cpu()
  const cpuBrand = cpuDate.brand
  const cpuCores = cpuDate.cores

  const load = await si.currentLoad()
  const cpuLoad = load.currentLoad
  return { cpuBrand, cpuCores, cpuLoad }
}
```

```tip
这里只展示笔者写的其中一个函数,函数写法大家不管是具名函数还是我这种箭头函数都差不多，笔者用箭头函数只是个人习惯，这个文件都是功能实现函数，export一个个导出来
```

### 2. 挂路由

- 代码示例:

1. `src/route/sysinfo.ts`

```ts
import { Router } from 'express'
import { getCpuInfo } from '../servers/sysinfo.js'

const router = Router()

router.get('/cpu', async (_req, res, next) => {
  try {
    res.json(await getCpuInfo())
  } catch (err) {
    next(err)
  }
})
```

2. `src/router/index.ts`

```ts
import { Router } from 'express'
import systemRouter from './sysinfo.js'

const router = Router()
router.use('/system', systemRouter)
export default router
```

3. `src/index.ts`

```diff
+ import router from './router/index.js'

+ app.use('/api', router)
```

```tip
这里`sysinfo.ts`所有需要接口的函数,自己`router.<方法>('router',handleFn)`挂载到`router`,然后统一挂载到`system`上,然后在`index.ts`挂载到`/api`
- /api/system/cpu
```

- 这里最终挂载的路径是:

```terminal
localhost:3000/api/system/cpu
```

- 访问这个地址获取到的结果

```json
{
  "cpuBrand": "Gen Intel® Core™ i7-13650HX",
  "cpuCores": 20,
  "cpuLoad": 7.66576030119222
}
```
