# Node.js `path` 模块常用函数速查

> 来源：[Node.js v26.5.0 官方文档](https://nodejs.org/api/path.html)

## 导入方式

```ts
import path from 'node:path'
```

---

## 函数一览

### 1. `path.basename(path[, suffix])`

返回路径的最后一部分（文件名），类似 Unix 的 `basename` 命令。

```ts
path.basename('/foo/bar/baz.html')          // → 'baz.html'
path.basename('/foo/bar/baz.html', '.html') // → 'baz'
path.basename('/foo/bar/')                  // → 'bar'
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `path` | `string` | 路径字符串 |
| `suffix` | `string`（可选） | 要移除的后缀，区分大小写 |

---

### 2. `path.dirname(path)`

返回路径的目录部分，类似 Unix 的 `dirname` 命令。

```ts
path.dirname('/foo/bar/baz.html')  // → '/foo/bar'
path.dirname('/foo/bar/')          // → '/foo'
```

---

### 3. `path.extname(path)`

返回路径的扩展名（从最后一个 `.` 到结尾）。

```ts
path.extname('/foo/bar/baz.html')  // → '.html'
path.extname('/foo/bar.baz.md')    // → '.md'
path.extname('/foo/bar')           // → ''（无扩展名）
path.extname('/foo/.hidden')       // → ''（以 . 开头的文件不算扩展名）
```

---

### 4. `path.join([...paths])`

使用平台特定分隔符拼接路径片段，并规范化结果。

```ts
path.join('/foo', 'bar', 'baz/')       // → '/foo/bar/baz/'
path.join('/foo', '..', 'bar')         // → '/bar'
path.join('foo', 'bar')                // → 'foo/bar'
path.join('/foo', '/bar')              // → '/foo/bar'
```

> 这是最常用的路径拼接方法，**会自动处理多余的斜杠和 `..`**。

---

### 5. `path.resolve([...paths])`

从右到左处理路径片段，**构造绝对路径**。如果最终不是绝对路径，会拼接当前工作目录。

```ts
path.resolve('/foo', '/bar', 'baz')    // → '/bar/baz'（'/bar' 是绝对路径，重置）
path.resolve('foo', 'bar')             // → '/current/work/dir/foo/bar'
path.resolve('/foo', './bar')          // → '/foo/bar'
path.resolve()                         // → 当前工作目录的绝对路径
```

> **`join` vs `resolve` 的核心区别**：`resolve` 一定返回绝对路径，遇到绝对路径片段会重置前面的所有路径。

---

### 6. `path.relative(from, to)`

返回从 `from` 到 `to` 的相对路径。

```ts
path.relative('/foo/bar', '/foo/baz')      // → '../baz'
path.relative('/foo/bar', '/foo/bar/baz')  // → 'baz'
path.relative('/foo/bar', '/other')        // → '../../other'
```

---

### 7. `path.normalize(path)`

规范化路径，解析 `..` 和 `.`，合并多余分隔符。

```ts
path.normalize('/foo/bar//baz/..')    // → '/foo/bar'
path.normalize('/foo/./bar/')         // → '/foo/bar/'
path.normalize('foo/../../bar')       // → '../bar'
```

---

### 8. `path.parse(path)`

将路径解析为包含各个组成部分的对象。

```ts
path.parse('/home/user/docs/file.txt')
// → {
//   root: '/',
//   dir:  '/home/user/docs',
//   base: 'file.txt',
//   name: 'file',
//   ext:  '.txt'
// }
```

| 属性 | 说明 |
|------|------|
| `root` | 根目录 |
| `dir` | 完整目录路径（root + 各级目录） |
| `base` | 文件名 + 扩展名 |
| `name` | 纯文件名（不含扩展名） |
| `ext` | 扩展名（含点） |

---

### 9. `path.format(pathObject)`

`path.parse()` 的逆操作，从对象构造路径字符串。

```ts
path.format({
  root: '/',
  name: 'file',
  ext:  '.txt'
})
// → '/file.txt'

path.format({
  dir:  '/home/user',
  base: 'file.txt'
})
// → '/home/user/file.txt'（有 base 时忽略 name + ext）
```

---

### 10. `path.isAbsolute(path)`

判断路径是否为绝对路径。

```ts
path.isAbsolute('/foo/bar')   // → true  (POSIX)
path.isAbsolute('C:\\foo')    // → true  (Windows)
path.isAbsolute('foo/bar')    // → false
path.isAbsolute('.')          // → false
```

---

### 11. `path.matchesGlob(path, pattern)`

> v22.5.0 新增，v24.8.0 稳定

检查路径是否匹配 glob 模式。

```ts
path.matchesGlob('/foo/bar', '/foo/*')    // → true
path.matchesGlob('/foo/bar', '/foo/b*')   // → true
path.matchesGlob('/foo/baz', '/foo/b*r')  // → false
```

---

### 12. `path.toNamespacedPath(path)`

仅 Windows 平台有效，返回等价命名空间前缀路径（如 `\\?\`）。POSIX 上原样返回。

---

## 属性

| 属性 | POSIX | Windows | 说明 |
|------|-------|---------|------|
| `path.sep` | `/` | `\` | 路径片段分隔符 |
| `path.delimiter` | `:` | `;` | 环境变量 PATH 分隔符 |
| `path.posix` | — | — | POSIX 实现对象，跨平台处理 POSIX 路径 |
| `path.win32` | — | — | Windows 实现对象，跨平台处理 Windows 路径 |

```ts
path.sep           // Linux/macOS: '/' , Windows: '\'
path.delimiter     // Linux/macOS: ':' , Windows: ';'

// 无论运行在什么平台，固定用 POSIX 方式处理路径
path.posix.join('a', 'b')    // → 'a/b'

// 无论运行在什么平台，固定用 Windows 方式处理路径
path.win32.join('a', 'b')    // → 'a\\b'
```

---

## 本项目中用到的方法

在 `vite.config.ts` 中使用了以下 `path` 模块 API：

```ts
import { resolve, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// resolve — 拼接路径并返回绝对路径
resolve(__dirname, 'src/assets/js')
resolve(__dirname, 'dist')
resolve(__dirname, 'public/config/search.json')
```

---

## 速记对比表

| 函数 | 作用 | 返回绝对路径？ |
|------|------|:---:|
| `join` | 拼接路径片段 | ❌ |
| `resolve` | 拼接 + 转为绝对路径 | ✅ |
| `basename` | 取文件名 | ❌ |
| `dirname` | 取目录名 | ❌ |
| `extname` | 取扩展名 | ❌ |
| `relative` | 计算相对路径 | ❌ |
| `normalize` | 规范化路径 | ❌ |
| `parse` | 拆解路径为对象 | ❌ |
| `format` | 从对象拼回路径 | ❌ |
| `isAbsolute` | 判断是否绝对路径 | ❌ |
