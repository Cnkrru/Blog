# Node.js `url` 模块常用 API 速查

> 来源：[Node.js v26.5.0 官方文档](https://nodejs.org/api/url.html)

## 导入方式

```ts
import { fileURLToPath, pathToFileURL } from 'node:url'
// 或
import url from 'node:url'
```

---

## 一、核心函数（本项目中用到的）

### 1. `fileURLToPath(url[, options])`

将 `file://` URL 转为操作系统本地文件路径。**ESM 中替代 `__filename` 的关键函数**。

```ts
import { fileURLToPath } from 'node:url'

fileURLToPath('file:///D:/project/vite.config.ts')
// → 'D:\\project\\vite.config.ts'        (Windows)

fileURLToPath('file:///home/user/file.ts')
// → '/home/user/file.ts'                 (POSIX)
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `url` | `URL \| string` | file:// 协议 URL |
| `options.windows` | `boolean \| undefined` | 强制按 Windows/POSIX 方式解析，默认跟随当前系统 |

> ⚠️ 该函数会解码百分号编码（如 `%2e` → `.`），可能引起路径穿越，需要对输入做校验。

---

### 2. `pathToFileURL(path[, options])`

`fileURLToPath` 的逆操作：将本地文件路径转为 `file://` URL。

```ts
import { pathToFileURL } from 'node:url'

pathToFileURL('/home/user/file.ts')
// → URL { href: 'file:///home/user/file.ts' }

pathToFileURL('D:\\project\\config.ts')
// → URL { href: 'file:///D:/project/config.ts' }
```

---

## 二、WHATWG URL API（推荐，新标准）

### 3. `new URL(input[, base])`

创建 WHATWG URL 对象，**解析 URL 的首选方式**。

```ts
const url = new URL('/path?q=123', 'https://example.org')

url.href       // → 'https://example.org/path?q=123'
url.protocol   // → 'https:'
url.hostname   // → 'example.org'
url.port       // → ''
url.pathname   // → '/path'
url.search     // → '?q=123'
url.hash       // → ''
url.origin     // → 'https://example.org'
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `input` | `string` | 绝对或相对 URL |
| `base` | `string`（可选） | 当 input 为相对 URL 时的基础 URL |

---

### 4. `URL.canParse(input[, base])`

判断能否解析为合法 URL（返回 `boolean`，不抛异常）。

```ts
URL.canParse('https://example.com')   // → true
URL.canParse('not-a-url')             // → false
```

---

### 5. `URL.parse(input[, base])`

安全解析 URL，失败返回 `null`（不抛异常）。

```ts
URL.parse('https://example.com')   // → URL 对象
URL.parse('bad://url')             // → null
```

---

### 6. `url.format(URL[, options])`

将 WHATWG URL 对象格式化为字符串，可定制输出内容。

```ts
const url = new URL('https://user:pass@example.com:8080/path?a=1#top')

url.format(url, { auth: false, fragment: false, search: false })
// → 'https://example.com:8080/path'
```

---

## 三、URLSearchParams（查询参数操作）

### 7. `new URLSearchParams(input)`

四种构造方式：

```ts
// 1. 空对象
new URLSearchParams()

// 2. 查询字符串
new URLSearchParams('q=hello&page=1')

// 3. 普通对象
new URLSearchParams({ q: 'hello', tags: ['js', 'ts'] })
// → 'q=hello&tags=js%2Cts'

// 4. 可迭代键值对
new URLSearchParams([['q', 'hello'], ['page', '1']])
```

### 常用方法

```ts
const params = new URLSearchParams('q=hello&page=1')

params.get('q')             // → 'hello'
params.has('page')          // → true
params.set('page', '2')     // 修改
params.append('tag', 'js')  // 追加
params.delete('q')          // 删除
params.toString()           // → 'page=2&tag=js'
params.sort()               // 按 key 排序
```

### 与 URL 对象配合

```ts
const url = new URL('https://example.com/path')
url.searchParams.set('q', 'hello')
url.searchParams.append('page', '1')
url.href  // → 'https://example.com/path?q=hello&page=1'
```

---

## 四、已废弃的遗留 API（不推荐使用）

| 废弃函数 | 替代方案 |
|---------|---------|
| `url.parse(str)` | `new URL(str)` |
| `url.resolve(from, to)` | `new URL(to, new URL(from, 'resolve://'))` |
| `url.format(urlString)` | `new URL(urlString).toString()` |

---

## 五、本项目中实际用法

```ts
// vite.config.ts 第 8 行
const __dirname = dirname(fileURLToPath(import.meta.url))
```

### 执行过程拆解

```
① import.meta.url
   → 'file:///D:/code_projects/frontend/blog/vite.config.ts'

② fileURLToPath(...)
   → 'D:\\code_projects\\frontend\\blog\\vite.config.ts'
   （file:// URL  →  文件系统路径）

③ dirname(...)
   → 'D:\\code_projects\\frontend\\blog'
   （取出文件所在目录）
```

### 更精确的中文注释

```ts
// 将 file:// URL 转为文件系统路径，再取其所在目录路径（ESM 中替代 __dirname）
const __dirname = dirname(fileURLToPath(import.meta.url))
```

---

## 速记对比

| 函数 | 方向 | 输入 | 输出 |
|------|:---:|------|------|
| `fileURLToPath` | URL → 路径 | `file:///foo/bar.ts` | `/foo/bar.ts` |
| `pathToFileURL` | 路径 → URL | `/foo/bar.ts` | `file:///foo/bar.ts` |
| `new URL(str)` | 解析 URL | `https://a.com/p?q=1` | URL 对象 |
| `url.format(obj)` | URL → 字符串 | URL 对象 | `https://a.com/p?q=1` |
