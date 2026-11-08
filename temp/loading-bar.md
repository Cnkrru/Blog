## 路由进度条实现说明

整体思路和 nprogress 一致：用一个 0–100 的进度值驱动一条 `transform: scaleX()` 的横条，再配上防闪烁的时序控制。

### 组件层

`src/components/pheader/LoadingBar.vue` 只有外层容器和内层条。内层用

```css
transform: scaleX(percent / 100);
transform-origin: left center;
```

而不是改 `width`。transform 走合成层，不触发重排重绘。显隐用 `opacity` 而非 `v-if`，因为淡出动画需要元素留在 DOM 里；容器加了 `pointer-events: none`，2px 的条不会挡住顶部点击。

### 状态层

`src/composables/pheader.ts` 里两个模块级 ref：

- `refRouteLoading` 控制显隐
- `refProgress` 控制长度

放在这里是因为要跨组件共享，并且需要挂在 router 实例上。

### 钩子挂载

`src/main.ts` 中调用 `bindLoading(router)`，内部挂三个钩子：

- `beforeEach` 调 `start()`，但跳过 `from === START_LOCATION`，首屏是 SSG hydration，不是真实路由跳转
- `afterEach` 调 `finish()`，成功、取消、重定向都会走到这里
- `onError` 调 `reset()`，路由异常时强制收尾

### pending 计数

重定向一次导航会触发多轮 `beforeEach`，所以 `start()` 里 `pending++`、`finish()` 里 `pending--`，归零才真正结束，避免提前收尾。

### 三个时间常量

- `SHOW_DELAY = 150`：150ms 内完成的导航压根不显示，避免快页面每次闪一下
- `MIN_VISIBLE = 300`：一旦显示了就至少停留 300ms，立刻消失比不显示更难看
- `LEAVE_DURATION = 200`：补到 100% 后停留 200ms 再淡出，让完成这个动作有视觉反馈

`finish()` 里的 `Math.max(0, MIN_VISIBLE - 已显示时长) + LEAVE_DURATION` 就是在补齐最短停留。

### 进度为什么是假的

懒加载 chunk 的真实加载进度在浏览器里拿不到，因此不做定时器递增，改成两段跳：

- 开始：0 → 80。借助 `transition: transform 0.3s`，看起来是平滑爬升
- 结束：80 → 100，停留后淡出

两段式的好处是不会卡在 99%。代价是慢路由会在 80% 停很久，视觉上像卡住。要更真实就得用定时器按时间递增（每 200ms 加递减增量，封顶 90），用复杂度换观感。

### 两个防护

- `bindLoading` 开头 `typeof window === 'undefined'` 直接返回。SSG 构建期会真的跑一遍路由，不拦会在 Node 里留下定时器
- `SAFE_TIMEOUT = 10000`：守卫抛异常导致 `afterEach` 永不到来时，10 秒强制复位

### 连续导航的处理

`start()` 处理了上一轮还没淡出就开始下一轮的情况：直接复用现有条并回落到 80%，不重新从 0 开始。这是连续点导航时进度条不会突然缩回去的原因。
