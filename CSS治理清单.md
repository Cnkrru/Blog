# CSS 治理清单

> 规范依据：`D:\__projects\AL-map\doc\docs\开发规范\2.css要求.md`
> - **2.1** 禁止后代/子代组合选择器（`.a .b`、`.a > .b`）
> - **2.3** 允许 class 下子级标签选择器（`.card p`）
>
> 扫描范围：`D:\__projects\blog\src` 下所有 `.css` 文件与所有 `.vue` 文件的 `<style>` 块。
> 已排除：class 下子级标签（`.card p`）、伪类/伪元素与同元素连写（`.a:hover`、`.a.active`、`::before`）、`var()/@keyframes/过渡曲线` 等属性值、注释与 `:root`。

---

## 治理进度

- **P1 组件内自洽项（变体/状态/交互父类 + 同组件子元素）✅ 已完成**
  通过父级 CSS 变量下发、子元素引用变量、补独立状态类等方式，消除了组件内部的后代/子代组合选择器，提交 `9d85f9b`（17 文件约 60 处）。组件 `src/components`（含页面级 `src/pages`）中已无 `.a .b` / `.a > .b` 残留。
- **P2 主题/布局作用域跨界（`.style-*` / `.layout-*` / `body.dark-theme` + 全局基座类）⏳ 待治理**
  主题 4 文件各 21、布局 card/compact 各 15、minimal 2、`style.css` 3。详见下文第一节 P2 小节。
- **P3 `:deep` scoped 穿透 ✅ 已完成**
  按命中对象分类治理（含此前清单之外的几处）：
  - **① 第三方库渲染 DOM → 拆独立非 scoped `<style>` 块、去 `:deep`**：`KatexRender(.katex)`、`MermaidRender(.mermaid)`、`HighlightRender(.hljs)`、`ShareButton(.a2a_kit)`、`Header` 多个子组件共享的 `.button-style/.emoji-burst/images`（并入已有非 scoped 块 + keyframes + 响应式）。
  - **② `html.dark` 深色态 → 删除死规则**：`JsonTree`、`Comment` 的 `:deep(html.dark)` 从未生效——整个代码库不挂 `html.dark` 类，深色由 `body.dark-theme`（theme store）驱动，直接删除、视觉不变。
  - **③ Vue 子组件/插槽根**：`About` 的 `:deep(.github-container)` 为冗余（GitHub 根无 margin）删除；`Post` 的 `:deep(.center-head-card h2)` 为 self-deep 去掉；`AdmonitionRender` 的 `.admonition-body :deep(p/a/code…)` 为 v-html 动态内容，转非 scoped `.admonition-body p` 等（子级标签，2.3 允许）。
  - **Center.vue** 的布局跨界 `:deep(.center-head-card/.center-card-content)` 与 `slot` 根布局相关，并入 **P2** 一并处理。

---

## 一、后代/子代组合选择器（违反 2.1，需治理）

**合计 295 条出现（按选择器去重约 247 条）**，分布在 **38 个文件** 中。

结构上大致可分为三类耦合模式：
1. **组件内部「变体/状态父类 + 子元素」**：`.admonition-{type} .admonition-header`、`.playing .pause-icon`、`.toc-item.active > .toc-link` —— 父类表示状态/变体，子元素靠 DOM 层级命中，最需要治理。
2. **主题/布局作用域跨界**：`.style-sakura .center-card`、`.layout-card .center-card`、`body.dark-theme .markdown-content`、`.center-header-area :deep(...)` —— 作用域前缀 + 全局基座类（见第二节归档），属于系统性模式。
3. **`:deep` 属性跨界**：`:deep(html.dark) .value-string`、`.math-dark :deep(.katex)` —— scoped 组件穿透命中其他作用域类。

### 按文件分组的完整清单

#### src/assets/css/themes/cyan.css（21 个）
> 结构：主题作用域 `.style-cyan`（作用域前缀变体父类）+ 布局/主题基座子类；`.style-cyan body.dark-theme X` 为主题作用域 + 深色态三层跨界。
- `src/assets/css/themes/cyan.css:18 → .style-cyan body.dark-theme { --common-color-1: #22d3ee }`
- `src/assets/css/themes/cyan.css:43 → .style-cyan .text-input { cursor: url(...) }`
- `src/assets/css/themes/cyan.css:57 → .style-cyan body.dark-theme::before { background: rgba(0,0,0,.6) }`
- `src/assets/css/themes/cyan.css:75 → .style-cyan .header-card / .footer-card / .footer-element-card / .left-asider-card / .center-card / .page-list-card { background-color: rgba(var(--glass-*)) }`（同一行多选，下同）
- `src/assets/css/themes/cyan.css:93 → .style-cyan body.dark-theme .header-card / .footer-card / .footer-element-card / .left-asider-card / .center-card / .page-list-card { background-color: rgba(var(--glass-*)) }`
- `src/assets/css/themes/cyan.css:154 → .style-cyan .center-head-card { ... }`
- `src/assets/css/themes/cyan.css:161 → .style-cyan .center-card-content { ... }`
- `src/assets/css/themes/cyan.css:164 → .style-cyan body.dark-theme .center-head-card { ... }`
- `src/assets/css/themes/cyan.css:168 → .style-cyan body.dark-theme .center-card-content { ... }`
- `src/assets/css/themes/cyan.css:171 → .style-cyan .page-card { ... }`
- `src/assets/css/themes/cyan.css:175 → .style-cyan body.dark-theme .page-card { border: 1px solid rgba(6,182,212,.15) }`

#### src/assets/css/themes/ink.css（21 个）
> 结构：同 cyan（主题作用域 `.style-ink` + 基座子类 / 三层跨界）。
- `src/assets/css/themes/ink.css:19 → .style-ink body.dark-theme { --common-color-1: #d25043 }`
- `src/assets/css/themes/ink.css:45 → .style-ink .text-input { cursor: url(...) }`
- `src/assets/css/themes/ink.css:62 → .style-ink body.dark-theme::before { background: ... }`
- `src/assets/css/themes/ink.css:83 → .style-ink .header-card / .footer-card / .footer-element-card / .left-asider-card / .center-card / .page-list-card { background-color: rgba(var(--glass-*)) }`
- `src/assets/css/themes/ink.css:101 → .style-ink body.dark-theme .header-card / ... / .page-list-card { background-color: rgba(var(--glass-*)) }`
- `src/assets/css/themes/ink.css:170 → .style-ink .center-head-card { ... }`
- `src/assets/css/themes/ink.css:177 → .style-ink .center-card-content { ... }`
- `src/assets/css/themes/ink.css:180 → .style-ink body.dark-theme .center-head-card { ... }`
- `src/assets/css/themes/ink.css:184 → .style-ink body.dark-theme .center-card-content { ... }`
- `src/assets/css/themes/ink.css:187 → .style-ink .page-card { ... }`
- `src/assets/css/themes/ink.css:192 → .style-ink body.dark-theme .page-card { border: 1px solid rgba(245,241,232,.10) }`

#### src/assets/css/themes/purple.css（21 个）
> 结构：同 cyan（主题作用域 `.style-purple`）。
- `src/assets/css/themes/purple.css:18 → .style-purple body.dark-theme { --common-color-1: #a78bfa }`
- `src/assets/css/themes/purple.css:43 → .style-purple .text-input { cursor: url(...) }`
- `src/assets/css/themes/purple.css:57 → .style-purple body.dark-theme::before { background: rgba(0,0,0,.6) }`
- `src/assets/css/themes/purple.css:75 → .style-purple .header-card / .footer-card / .footer-element-card / .left-asider-card / .center-card / .page-list-card { background-color: rgba(var(--glass-*)) }`
- `src/assets/css/themes/purple.css:93 → .style-purple body.dark-theme .header-card / ... / .page-list-card { background-color: rgba(var(--glass-*)) }`
- `src/assets/css/themes/purple.css:154 → .style-purple .center-head-card { ... }`
- `src/assets/css/themes/purple.css:161 → .style-purple .center-card-content { ... }`
- `src/assets/css/themes/purple.css:164 → .style-purple body.dark-theme .center-head-card { ... }`
- `src/assets/css/themes/purple.css:168 → .style-purple body.dark-theme .center-card-content { ... }`
- `src/assets/css/themes/purple.css:171 → .style-purple .page-card { ... }`
- `src/assets/css/themes/purple.css:175 → .style-purple body.dark-theme .page-card { border: 1px solid rgba(139,92,246,.15) }`

#### src/assets/css/themes/sakura.css（21 个）
> 结构：同 cyan（主题作用域 `.style-sakura`）。
- `src/assets/css/themes/sakura.css:18 → .style-sakura body.dark-theme { --common-color-1: #e58fb0 }`
- `src/assets/css/themes/sakura.css:43 → .style-sakura .text-input { cursor: url(...) }`
- `src/assets/css/themes/sakura.css:57 → .style-sakura body.dark-theme::before { background: rgba(0,0,0,.6) }`
- `src/assets/css/themes/sakura.css:60 → .style-sakura .header-card / .footer-card / .footer-element-card / .left-asider-card / .center-card / .page-list-card { background-color: rgba(var(--glass-*)) }`
- `src/assets/css/themes/sakura.css:78 → .style-sakura body.dark-theme .header-card / ... / .page-list-card { background-color: rgba(var(--glass-*)) }`
- `src/assets/css/themes/sakura.css:139 → .style-sakura .center-head-card { ... }`
- `src/assets/css/themes/sakura.css:146 → .style-sakura .center-card-content { ... }`
- `src/assets/css/themes/sakura.css:149 → .style-sakura body.dark-theme .center-head-card { ... }`
- `src/assets/css/themes/sakura.css:153 → .style-sakura body.dark-theme .center-card-content { ... }`
- `src/assets/css/themes/sakura.css:156 → .style-sakura .page-card { ... }`
- `src/assets/css/themes/sakura.css:160 → .style-sakura body.dark-theme .page-card { border: 1px solid rgba(255,255,255,.08) }`

#### src/assets/css/layouts/card.css（15 个）
> 结构：布局容器 `.layout-card`（变体父类）+ 布局基座/子块 `.header-s/.mid-flex/.center-card/.left-asider-*` 等；`.layout-card .center-card .center-head-card|.center-card-content` 为布局容器 + 嵌套子块。
- `src/assets/css/layouts/card.css:1 → .layout-card .header-s { width: 95% }`
- `src/assets/css/layouts/card.css:6 → .layout-card .mid-flex { width: 100% }`
- `src/assets/css/layouts/card.css:11 → .layout-card .footer-s { width: 95% }`
- `src/assets/css/layouts/card.css:15 → .layout-card .header-flex { padding: 10px }`
- `src/assets/css/layouts/card.css:20 → .layout-card .header-card { margin-bottom: 10px }`
- `src/assets/css/layouts/card.css:24 → .layout-card .footer-flex { padding: 20px 0 }`
- `src/assets/css/layouts/card.css:27 → .layout-card .footer-card { border-radius: 16px }`
- `src/assets/css/layouts/card.css:30 → .layout-card .mid-flex { gap: 24px }`
- `src/assets/css/layouts/card.css:36 → .layout-card .left-asider-s { width: 220px }`
- `src/assets/css/layouts/card.css:39 → .layout-card .left-asider-card { border-radius: 14px }`
- `src/assets/css/layouts/card.css:42 → .layout-card .center-s { width: 1200px }`
- `src/assets/css/layouts/card.css:45 → .layout-card .center-container { max-width: 1200px }`
- `src/assets/css/layouts/card.css:48 → .layout-card .center-card { border-radius: 16px }`
- `src/assets/css/layouts/card.css:51 → .layout-card .center-header-area { gap: 6px }`
- `src/assets/css/layouts/card.css:56 → .layout-card .center-card .center-head-card{/ .center-card-content} { border-radius: 10px }`（57 行下的嵌套块）
- （66~94 行为上述选择器在响应式分支中的重复，未再逐一列出）

#### src/assets/css/layouts/compact.css（15 个）
> 结构：布局容器 `.layout-compact` + 布局基座/子块；含嵌套子块 `.center-card .center-head-card|.center-card-content`。
- `src/assets/css/layouts/compact.css:1 → .layout-compact .header-s / .mid-flex / .footer-s { width: 100% }`
- `src/assets/css/layouts/compact.css:10 → .layout-compact .header-flex { padding: 0 }`
- `src/assets/css/layouts/compact.css:15 → .layout-compact .header-card { margin-bottom: 0 }`
- `src/assets/css/layouts/compact.css:19 → .layout-compact .footer-flex { padding: 0 }`
- `src/assets/css/layouts/compact.css:22 → .layout-compact .footer-card { border-radius: 0 0 18px 18px }`
- `src/assets/css/layouts/compact.css:25 → .layout-compact .mid-flex { gap: 0 }`
- `src/assets/css/layouts/compact.css:31 → .layout-compact .left-asider-s { width: 220px }`
- `src/assets/css/layouts/compact.css:34 → .layout-compact .left-asider-card { width: 100% }`
- `src/assets/css/layouts/compact.css:39 → .layout-compact .center-s { width: auto }`
- `src/assets/css/layouts/compact.css:43 → .layout-compact .center-container { max-width: none }`
- `src/assets/css/layouts/compact.css:46 → .layout-compact .center-card { border-radius: 0 }`
- `src/assets/css/layouts/compact.css:49 → .layout-compact .center-header-area { gap: 0 }`
- `src/assets/css/layouts/compact.css:54 → .layout-compact .center-card .center-head-card{/.center-card-content} { border-radius: 0 }`（59 行下同类）
- （66~135 行为响应式分支重复，未逐一列出）

#### src/assets/css/layouts/minimal.css（2 个）
> 结构：布局容器 `.layout-minimal` + 布局基座子块。
- `src/assets/css/layouts/minimal.css:0 → .layout-minimal .mid-flex { display: none !important }`
- `src/assets/css/layouts/minimal.css:5 → .layout-minimal .footer-s { display: none !important }`（17/20 行响应式重复）

#### src/components/content/AdmonitionRender.vue（28 个，最集中）
> 结构：变体父类 `.admonition-{info|success|tip|warning|error|danger|note}` + 子元素 `.admonition-header/.admonition-body`；三层 `:deep(code/a)`。
- `src/components/content/AdmonitionRender.vue:103 → .admonition-info .admonition-header`
- `src/components/content/AdmonitionRender.vue:108 → .admonition-info .admonition-body`
- `src/components/content/AdmonitionRender.vue:111,114 → .admonition-info .admonition-body :deep(code) / :deep(a)`
- `src/components/content/AdmonitionRender.vue:123 → .admonition-success / .admonition-tip .admonition-header`
- `src/components/content/AdmonitionRender.vue:129,133,137 → .admonition-success/.admonition-tip .admonition-body` 及其 `:deep(code) / :deep(a)`
- `src/components/content/AdmonitionRender.vue:146,151,154,157 → .admonition-warning .admonition-header/.admonition-body` 及 `:deep(code)/:deep(a)`
- `src/components/content/AdmonitionRender.vue:166,172,176,180 → .admonition-error/.admonition-danger ...`（同构）
- `src/components/content/AdmonitionRender.vue:189,194,197,200 → .admonition-note ...`（同构）

#### src/components/p-center/TocTreeItem.vue（15 个）
> 结构：父级树节点 + 子元素，含**子代 `>`** 与嵌套自引用。
- `src/components/p-center/TocTreeItem.vue:100 → .toc-item.active > .toc-link`
- `src/components/p-center/TocTreeItem.vue:107,110-114 → .lv-1..lv-6 > .toc-link`
- `src/components/p-center/TocTreeItem.vue:126 → .toc-item .toc-item`（嵌套子块）
- `src/components/p-center/TocTreeItem.vue:153,155-159 → .lv-1..lv-6 .toc-arrow`
- `src/components/p-center/TocTreeItem.vue:185 → .toc-item.active .toc-num`

#### src/components/p-header/ImmersiveReading.vue（11 个）
> 结构：`body.immersive-reading`（body 状态守卫变体父类）+ 布局基座/子块；`.layout-compact body.immersive-reading X` 为布局容器 + body 态三层跨界。
- `src/components/p-header/ImmersiveReading.vue:38 → body.immersive-reading .left-blank / .left-asider-s / .left-center-blank / .footer-blank / .footer-flex / .footer-s { display: none }`
- `src/components/p-header/ImmersiveReading.vue:47 → body.immersive-reading .center-s { width: 1400px }`
- `src/components/p-header/ImmersiveReading.vue:52 → body.immersive-reading .mid-flex { padding-left: 20px }`
- `src/components/p-header/ImmersiveReading.vue:58 → .layout-compact body.immersive-reading .center-s { width: auto }`
- `src/components/p-header/ImmersiveReading.vue:65 → .layout-compact body.immersive-reading .mid-flex { padding-left: 0 }`
- `src/components/p-header/ImmersiveReading.vue:69 → body.immersive-reading .center-card { max-height: none !important }`
- `src/components/p-header/ImmersiveReading.vue:84,88,92 → body.immersive-reading .center-s/.mid-flex 及 .layout-compact 变体（响应式）`

#### src/components/media/MusicPlayerStyles.vue（10 个）
> 结构：状态父类 `.playing/.muted/.volume-low` + 子元素图标；交互态 `.volume-bar:hover .volume-handle`；`.playlist-items li.active ...` 容器+子元素（状态）。
- `src/components/media/MusicPlayerStyles.vue:182 → .volume-bar:hover .volume-handle`
- `src/components/media/MusicPlayerStyles.vue:227 → .progress-bar:hover .progress-fill::after`
- `src/components/media/MusicPlayerStyles.vue:248 → .playing .pause-icon / .muted .mute-icon / .volume-low .volume-low-icon`
- `src/components/media/MusicPlayerStyles.vue:254 → .playing .play-icon / .muted .volume-icon / .volume-low .volume-icon`
- `src/components/media/MusicPlayerStyles.vue:373 → .playlist-items li.active .playlist-item-status`
- `src/components/media/MusicPlayerStyles.vue:502 → .playlist-items li.active`

#### src/components/content/CodeRender.vue（5 个）
> 结构：状态/交互父类 + 子元素。
- `src/components/content/CodeRender.vue:214 → .copy-button.loading .loading-spinner`
- `src/components/content/CodeRender.vue:226 → .status-text .copy-icon / .check-icon`
- `src/components/content/CodeRender.vue:232 → .copy-button:hover .copy-icon`
- `src/components/content/CodeRender.vue:236 → .copy-button.copied-success .check-icon`

#### src/components/content/ArticleCover.vue（2 个）
> 结构：卡片 hover 态 + 封面容器 + 装饰子元素（三层）。
- `src/components/content/ArticleCover.vue:195,201 → .post-card:hover .article-cover .deco-1 / .deco-2`（208/211 响应式重复）

#### src/components/content/MarkdownRender.vue（5 个）
> 结构：过渡/交互状态父类 + 子元素。
- `src/components/content/MarkdownRender.vue:909 → .lightbox-overlay:hover .lightbox-nav`
- `src/components/content/MarkdownRender.vue:1057,1063,1069,1075 → .lightbox-(enter|leave)-(active|from|to) .lightbox-img`

#### src/components/content/NotificationRender.vue（4 个）
> 结构：变体父类 `.notification.{type}` + 子元素 `.notif-icon`。
- `src/components/content/NotificationRender.vue:214,216,217,218 → .notification.success/.error/.warning/.info .notif-icon`

#### src/components/content/HighlightRender.vue（2 个）
> 结构：容器/状态父类 + 子元素。
- `src/components/content/HighlightRender.vue:298 → .fold-toggle .fold-icon`
- `src/components/content/HighlightRender.vue:327 → .code-container.show-lines .code-content`

#### src/components/content/JsonTree.vue（4 个）
> 结构：深色模式守卫 `:deep(html.dark)` + 子元素 value-*。
- `src/components/content/JsonTree.vue:313,318,322,326 → :deep(html.dark) .value-string / .value-number / .value-boolean / .value-null`

#### src/components/content/KatexRender.vue（3 个）
> 结构：深色态父类 + deep 子组件。
- `src/components/content/KatexRender.vue:146 → .math-dark .loading-spinner`
- `src/components/content/KatexRender.vue:164,168,196,201 → .math-dark :deep(.katex) / :deep(.katex-display)`

#### src/components/content/MermaidRender.vue（2 个）
> 结构：深色态父类 + deep 子组件。
- `src/components/content/MermaidRender.vue:167 → .mermaid-dark .loading-spinner`
- `src/components/content/MermaidRender.vue:191,219 → .mermaid-dark :deep(.mermaid)`

#### src/components/Center.vue（3 个）
> 结构：布局容器 `.center-header-area` + `:deep` 跨界子块 `.center-head-card/.center-card-content`。
- `src/components/Center.vue:54,66,131,139,159,170 → .center-header-area :deep(.center-head-card) / :deep(.center-card-content)`
- `src/components/Center.vue:136,166 → .center-header-area :deep(.center-head-card h2)`

#### src/components/api/Comment.vue（2 个）
> 结构：深色守卫 `:deep(html.dark)` + 子元素。
- `src/components/api/Comment.vue:234 → :deep(html.dark) .loading-spinner`
- `src/components/api/Comment.vue:240 → :deep(html.dark) .error-text`

#### src/components/api/Sponsor.vue（4 个）
> 结构：过渡状态父类 `.modal-fade-(enter|leave|from|to)-active` + 主元素 `.sponsor-modal`。
- `src/components/api/Sponsor.vue:127,130,132 → .modal-fade-enter-active / -leave-active / -enter-from / -leave-to .sponsor-modal`

#### src/components/p-center/ArticleNav.vue（3 个）
> 结构：变体/交互父类 + 子元素。
- `src/components/p-center/ArticleNav.vue:145,150 → .nav-btn.prev/.next .nav-text`
- `src/components/p-center/ArticleNav.vue:193 → .nav-btn:not(.disabled):hover .nav-icon`

#### src/components/p-center/PostMenu.vue / ContextMenu.vue / FontSizeControl.vue / PageNav.vue / Search.vue / SkeletonScreen.vue / ArticleFeedback.vue / EditHistory.vue（各 1 个）
> 结构：交互/状态父类 + 子元素；EditHistory 为 `svg.rotated` 标签+状态。
- `src/components/p-center/PostMenu.vue:466 → .list-item:hover .post-title`
- `src/components/p-center/ContextMenu.vue:175 → .menu-item:hover .menu-icon`
- `src/components/p-center/FontSizeControl.vue:117 → .size-display:hover .size-value`
- `src/components/p-center/PageNav.vue:215 → .showCategoryDropdown .dropdown-arrow`
- `src/components/p-header/Search.vue:182 → .search-card:focus-within .search-icon`
- `src/components/content/SkeletonScreen.vue:97 → .skeleton-container.dark-theme .skeleton-block::after`
- `src/components/p-center/ArticleFeedback.vue:283 → .feedback-btn.active .btn-count`
- `src/components/p-center/EditHistory.vue:184 → .history-toggle svg.rotated`

#### src/components/page-index/IndexNavbar.vue（2 个）
> 结构：交互状态父类 + 子元素。
- `src/components/page-index/IndexNavbar.vue:93,148,152 → .nav-link:hover / .nav-link:active .nav-link-underline`

#### src/components/content/JsonTree 已列；src/pages/Links.vue（3 个）
> 结构：分页容器 + 子元素（状态）。
- `src/pages/Links.vue:259,263,268,412,418,424 → .pagination .active a / .pagination .disabled a`

#### src/pages/Projects.vue（4 个）
> 结构：卡片交互状态父类 + 子元素。
- `src/pages/Projects.vue:182,235,277,293 → .project-card:hover .card-accent / .card-title / .card-tag / .card-arrow`

#### src/pages/Settings.vue（2 个）
> 结构：状态父类 `.toggle-switch.active` + 子元素。
- `src/pages/Settings.vue:348,365 → .toggle-switch.active .toggle-track / .toggle-thumb`

#### src/pages/Tag.vue（5 个）
> 结构：交互态父类 + 子元素；骨架容器 + 子元素。
- `src/pages/Tag.vue:444,628 → .tl-card:hover .tl-connector / .tl-card-body`
- `src/pages/Tag.vue:586 → .tag-item.active .tag-num`
- `src/pages/Tag.vue:650,653 → .skeleton-container .dot-skel / .card-skel`

#### src/pages/About.vue（1 个）
> 结构：scoped 容器 + `:deep` 跨界子块。
- `src/pages/About.vue:117 → .github-section :deep(.github-container)`

#### src/style.css（3 个）
> 结构：布局容器 + 子块；深色态 + 渲染容器 + 标签。
- `src/style.css:80,93 → .mid-flex .center-s { width: 100% !important }`
- `src/style.css:148 → body.dark-theme .markdown-content img { filter: brightness(.85) }`
- `src/style.css:154 → body.dark-theme .markdown-content img:hover { ... }`

---

## 二、跨文件全局类（规范允许，归档说明）

> **这些是布局/主题基座，非耦合，规范不禁止。** 它们分散在 4 主题 + 3 布局 + `style.css` + 组件之间被复用作全局布局/主题词汇。它们本身（挂在元素上的 class）不构成后代组合耦合；造成耦合的是第一节中「作用域前缀 `.style-*` / `.layout-*` / `body.dark-theme` + 这些基座类」的**跨界写法**，需在治理时保留基座类词汇、只改命中方式。

**布局基座类（16，去重 15 个）**
`center-card-content`、`center-head-card`、`center-card`、`footer-card`、`header-card`、`left-asider-card`、`mid-flex`、`footer-s`、`center-s`、`left-asider-s`、`footer-flex`、`header-s`、`center-container`、`header-flex`、`center-header-area`（`center-s` 在参考列表中出现两次）

**主题/系统类（7 个）**
`dark-theme`、`page-card`、`text-input`、`w3`、`org`、`footer-element-card`、`page-list-card`

合计去重 **22 个** 跨文件共享类。

---

## 三、建议优先级

治理按「改动小、收益大」排序，分三级：

1. **P1：组件内部「变体/状态父类 + 子元素」（最集中、最易修）**
   直接给子元素补独立 class，去掉 `.a .b` / `.a > .b`。涉及条目最多、收效最明显：
   - `AdmonitionRender.vue`（28）、`TocTreeItem.vue`（15）、`MusicPlayerStyles.vue`（10）、`CodeRender.vue`（5）、`ArticleCover.vue`（2）、`MarkdownRender.vue`（5）、`NotificationRender.vue`（4）、`Projects.vue`（4）、`Tag.vue`（5）、`Settings.vue`（2）、`Links.vue`（3）、`IndexNavbar.vue`（2）及多文件中的单条 `hover/active` 子元素命中。

2. **P2：`body.dark-theme` / `.style-*` / `.layout-*` 主题与布局作用域跨界（系统性，需先定约定）**
   _主题 4 文件各 21、card/compact 布局各 15、minimal 2、`style.css` 3、`ImmersiveReading.vue` 11。_ 这类全部命中「作用域前缀 + 第二节基座类」。建议先在规范上裁决：是（a）把作用域前缀作为可接受的作用域替代方案（一次例外声明），还是（b）改为在根元素挂 `data-theme` 后用更彻底的自定义属性（CSS 变量已大量使用 `--common-*`，可让组件类直接消费变量，从而不再需要跨界挂选择器）。这是本文档最大的单点治理面。

3. **P3：`:deep` 属性跨界（scoped 穿透）**
   `Center.vue`、`KatexRender.vue`、`MermaidRender.vue`、`JsonTree.vue`、`Comment.vue`、`About.vue` 中的 `:deep(...)`。属 scoped 组件穿透命中外层/子组件类，伴随后代组合。建议改由子组件自收样式，或通过 `props`/插槽传递类名，减少 `:deep(.a .b)` 三层命中。

**最集中的 5 个文件（按去重条目排序）**
| 排序 | 文件 | 去重条目 |
|---|---|---|
| 1 | `src/components/content/AdmonitionRender.vue` | 28 |
| 2 | `src/assets/css/themes/cyan.css` | 21 |
| 3 | `src/assets/css/themes/ink.css` | 21 |
| 4 | `src/assets/css/themes/purple.css` | 21 |
| 5 | `src/assets/css/themes/sakura.css` | 21 |

> 相邻次高点：`src/assets/css/layouts/card.css`、`src/assets/css/layouts/compact.css`、`src/components/p-center/TocTreeItem.vue`（各 15）。四个主题文件结构完全相同，治理可一次脚本统一处理。