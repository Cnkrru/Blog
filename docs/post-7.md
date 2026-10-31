---
order: 8
title: typescript-代码规范工具配置
date: 2026-10-30
category: typescript
tags: [typescript]
description: 记录ts的代码规范工具的配置
keywords: typescript.代码规范工具
---

## 简介

从js转为ts,一方面是为了类型，另一方面是为了ts的代码规范工具，ts的代码规范工具比较好用

## 配置步骤

### 1. 确定代码规范工具对应的typescript版本

```sh
npm i -D typescript@~6.0.3
```

```tip
这一步是因为笔者原本安装的是7.0+的版本，需要的代码规范工具不支持7.0以上的版本
```

### 2. 安装代码规范工具

```sh
npm i -D eslint @eslint/js typescript-eslint globals prettier
```

- elint
- typescript-eslint
- globals
- prettier

### 3. 创建并配置各个配置文件

#### 1. eslint配置文件

- 在根目录创建`eslint.config.mjs`

```mjs
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
  // 产物和迁移文件不检查
  { ignores: ['dist', 'drizzle'] },

  // 基础推荐规则
  js.configs.recommended,

  // TypeScript 推荐规则
  ...tseslint.configs.recommended,

  {
    // 后端：Node 环境
    files: ['server/**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // 未使用变量报错，_ 开头的参数放行
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // 配合 tsconfig 的 verbatimModuleSyntax，强制 import type
      '@typescript-eslint/consistent-type-imports': 'error',
      // 服务端允许打日志
      'no-console': 'off',
    },
  },

  {
    // 前端：浏览器环境，纯 JS
    files: ['web/**/*.js'],
    languageOptions: {
      globals: globals.browser,
    },
  },

  {
    // 测试脚本：Node 环境，console/process 等全局变量在这里声明
    files: ['test/**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.node,
    },
  },
)
```

```tip
这个不要照搬，最好看一下笔者的配置
1. 忽视构建产物(不检查构建产物的代码规范问题)
2. 使用JavaScript默认的规则
3. 使用typescript默认的规则
4. 后端部分的配置
5. 前端部分的配置
  - 如果是前后端分离，前端项目自己管自己的eslint配置文件，不需要在后端配置文件里配置
6. 测试部分的配置
  - 这三部分，主要改一下files对应的路径，按照你的项目的实际情况改，然后就是languageOptions的环境配置也按照你实际的情况改
```

#### 2. prettier配置文件

- 在根目录创建`.prettierrc.json`文件

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": false,
  "singleQuote": true,
  "printWidth": 100
}
```

#### 3. prettier忽视文件

- 在根目录创建`.prettierignore`文件

```text
dist
drizzle
node_modules
app.db
package-lock.json
```

#### 4. 修改package.json

- 在`scripts`部分补充四个配置

```diff
+    "lint": "eslint .",
+    "lint:fix": "eslint . --fix --cache",
+    "format": "prettier --write --no-error-on-unmatched-pattern server web",
+    "format:check": "prettier --check --no-error-on-unmatched-pattern server web"
```

#### 5. 配置editconfig

- 在根目录创建`.editorconfig`

```text
[*.{js,jsx,mjs,cjs,ts,tsx,mts,cts,vue,css,scss,sass,less,styl}]
charset = utf-8
indent_size = 2
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true
end_of_line = lf
max_line_length = 100
```

#### 6. 配置vscode

- 创建`.vscode`文件夹

##### 1. 配置extensions.json

- 创建`.vscode/extensions.json`

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "EditorConfig.EditorConfig",
    "esbenp.prettier-vscode"
  ]
}
```

##### 2. 配置settings.json

- 创建`.vscode/settings.json`

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit"
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "js/ts.tsdk.path": "node_modules/typescript/lib"
}
```

```tip
如果配置完之后发现有问题，比如`console.log() is not defined`，先跑一下，看看是代码问题还是配置问题
```
