---
order: 3
title: express-2-drizzle+sqlite配置
date: 2026-10-19
category: 后端
tags: [express, 后端]
description: 记录给ts项目配置drizzleORM和sqlite数据库
keywords: express
---

## 配置drizzle

### 1. 安装依赖

```sh
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3
```

```tip
这里笔者用的数据库是SQLite，其他的暂时没用过

sqlite驱动用的是better-sqlite3，而不是node官方库node:sqlite
```

### 2. 定义表结构

- 在src/db下创建一个表结构文件`schema.ts`,定义表结构
- 这里定义了一个users表，id，name，email，，createdAt几列

```ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// 导出类型，路由里可以直接用
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

### 3. 初始化drizzle

- 在src/db下创建一个初始化文件`index.ts`,初始化drizzle实例

```ts
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema.js'

const sqlite = new Database('app.db')
// 开启 WAL 模式，提升并发读性能（可选但推荐）
sqlite.pragma('journal_mode = WAL')

export const db = drizzle(sqlite, { schema })
```

### 4. 修改drizzle配置文件

- 在项目根目录创建`drizzle.config.ts`

```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: './app.db',
  },
})
```

### 5. 生成迁移文件

- 运行`npx drizzle-kit generate`

```terminal
$ npx drizzle-kit generate
No config path provided, using default 'drizzle.config.ts'
Reading config file 'D:\__projects\express\drizzle.config.ts'
1 tables
users 4 columns 1 indexes 0 fks

[✓] Your SQL migration file ➜ drizzle\0000_outgoing_mandrill.sql 🚀
```

- 这个指令会在`drizzle/`下生成几个文件，json+sql

### 6. 创建数据库

- 运行`npx drizzle-kit migrate`

```terminal
$ npx drizzle-kit migrate
No config path provided, using default 'drizzle.config.ts'
Reading config file 'D:\__projects\express\drizzle.config.ts'
```

- 这里说没配置路径，用了配置文件默认的路径的位置，直接在根目录生成了一个`app.db`
