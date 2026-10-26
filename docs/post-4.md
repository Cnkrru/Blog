---
order: 5
title: express-3-auth鉴权认证
date: 2026-10-21
category: 后端
tags: [express]
description: 记录express鉴权登入的做法
keywords: express,auth
---

## 简介

---

## 实现步骤

### 1. 安装依赖

```sh
npm install bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
```

```tip
此处安装`bcrypt.js`和`jsonwebtoken(jwt)`

`bcrypt.js`用于密码哈希加密
```

### 2. 数据库user表单增加password字段并迁移

- 数据库加密码字段

```ts
passwordHash: text('password_hash').notNull(),
```

- 数据库迁移

```sh
npx drizzle-kit generate
npx drizzle-kit migrate
```

```terminal
cnkrru@Cnkrru MINGW64 /d/__projects/express
$ npx drizzle-kit generate
$ npx drizzle-kit migrate
No config path provided, using default 'drizzle.config.ts'
Reading config file 'D:\__projects\express\drizzle.config.ts'
1 tables
users 5 columns 1 indexes 0 fks

[✓] Your SQL migration file ➜ drizzle\0001_whole_wind_dancer.sql 🚀
No config path provided, using default 'drizzle.config.ts'
Reading config file 'D:\__projects\express\drizzle.config.ts'
```

- 在`drizzle`文件夹新生成一个`sql`文件
- 给`users`表单增加`password_hash`字段

```sql
ALTER TABLE `users` ADD `password_hash` text NOT NULL;
```
