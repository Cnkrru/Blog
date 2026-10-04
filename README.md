[中文](#中文) | [English](#english)

---

## 中文

- 该仓库用于存放我的个人博客，用于分享编程知识以及日后见闻
- 该博客基于Vue+vue-router+vite-ssg+markdown-it+其他第三方库，用起来与常见SSG类似

---

### 其他

- 如果你想用我这套模板:
  1. 克隆仓库
  2. 配置环境:安装node.js(javascript运行时)与npm(javascript包管理器)
  3. 安装依赖:`npm install`
  4. 运行预览:`npm run dev`
- 注意:
  1. 文章请放在`docs`文件夹下,如果想更改，请看`src/.build/parseArticle.ts`的路径，里面`ARTICLE_DIR`这个常量可以改文件夹名
     - 想改路径，最好会一些后端知识
  2. 部署这块，很多选择，cloudflare，vercel都行，GitHub page不行(不支持vue框架)
  - 作者本人用的是cloudflare，vercel的话也用过，都可以，用cf方便些

---

## English

- This repository hosts my personal blog, where I share programming knowledge and notes on what I come across along the way.
- The blog is built on Vue + vue-router + vite-ssg + markdown-it and other third-party libraries, and it works much like a typical SSG.

---

### Misc

- If you want to use this template:
  1. Clone the repository
  2. Set up the environment: install Node.js (JavaScript runtime) and npm (JavaScript package manager)
  3. Install dependencies: `npm install`
  4. Start a preview: `npm run dev`
- Notes:
  1. Put your articles in the `docs` folder. To change that, look at the path in `src/.build/parseArticle.ts` — the `ARTICLE_DIR` constant there controls the folder name.
     - If you want to change the path, you'd better have some backend knowledge.
  2. For deployment there are many options — Cloudflare and Vercel both work, but GitHub Pages does not (it doesn't support the Vue framework).
  - I personally use Cloudflare. I've used Vercel as well; both are fine, and Cloudflare is a bit more convenient.