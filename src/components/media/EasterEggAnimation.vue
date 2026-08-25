<script setup>
import { ref, onUnmounted } from 'vue'

const props = defineProps({
  text: { type: String, default: '欢迎来到我的博客' },
  finalText: { type: String, default: '欢迎来到我的博客' }
})

const isAnimating = ref(false)
const showSeal = ref(false)
const phase = ref('done')

const chars = ref([])

const inkDots = ref([])

const floatingDrops = ref([])

let uid = 0
const timers = []

function sr(seed) {
  return (Math.sin(seed * 9301 + 49297) * 49297) % 1
}

function triggerEasterEgg() {
  if (isAnimating.value) return
  isAnimating.value = true
  showSeal.value = false
  phase.value = 'writing'
  chars.value = []
  inkDots.value = []
  floatingDrops.value = []

  const arr = props.text.split('')
  const vw = window.innerWidth
  const vh = window.innerHeight
  const charSize = Math.min(100, (vw - 60) / arr.length)
  const totalW = arr.length * charSize
  const startX = (vw - totalW) / 2
  const centerY = vh * 0.45

  // 背景墨滴
  for (let i = 0; i < 20; i++) {
    const id = uid++
    floatingDrops.value.push({
      x: sr(i * 47 + 13) * vw,
      y: vh + sr(i * 73 + 29) * 200,
      size: 30 + sr(i * 31 + 7) * 80,
      delay: sr(i * 53 + 19) * 5,
      id
    })
  }

  // 逐个书写字符
  arr.forEach((c, i) => {
    const cx = startX + i * charSize + charSize / 2
    const delay = i * 180 + 300
    const id = uid++
    const tilt = (sr(i * 17 + 41) - 0.5) * 6  // -3° ~ +3°

    const t = setTimeout(() => {
      chars.value.push({ char: c, x: cx, y: centerY, tilt, id })

      // 墨点溅射
      for (let p = 0; p < 8; p++) {
        const angle = (Math.PI * 2 * p) / 8 + sr(i * 100 + p * 37) * 0.5
        const dist = 20 + sr(i * 50 + p * 73) * 50
        const pid = uid++
        inkDots.value.push({
          x: cx, y: centerY,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          size: 2 + sr(i * 20 + p * 41) * 5,
          id: pid
        })
        const t2 = setTimeout(() => {
          inkDots.value = inkDots.value.filter(d => d.id !== pid)
        }, 800)
        timers.push(t2)
      }
    }, delay)
    timers.push(t)
  })

  // 写完后弹出印章
  const totalTime = arr.length * 180 + 300 + 800
  const t3 = setTimeout(() => {
    phase.value = 'seal'
    showSeal.value = true
    // 印章停留后消失
    const t4 = setTimeout(() => {
      showSeal.value = false
      phase.value = 'done'
      isAnimating.value = false
    }, 3500)
    timers.push(t4)
  }, totalTime + 400)
  timers.push(t3)
}

onUnmounted(() => {
  timers.forEach(clearTimeout)
})
</script>

<template>
  <div class="egg-wrap">
    <button class="egg-btn" @click="triggerEasterEgg" :disabled="isAnimating">
      {{ isAnimating ? '...' : '点击一下试试?' }}
    </button>

    <Teleport to="body">
      <div v-if="isAnimating" class="ink-backdrop">
        <!-- 宣纸纹理 -->
        <div class="paper-texture"></div>

        <!-- 背景浮墨 -->
        <div
          v-for="d in floatingDrops"
          :key="d.id"
          class="ink-drop"
          :style="{
            left: d.x + 'px',
            top: d.y + 'px',
            width: d.size + 'px',
            height: d.size + 'px',
            animationDelay: d.delay + 's'
          }"
        ></div>

        <!-- 墨点溅射 -->
        <div
          v-for="d in inkDots"
          :key="d.id"
          class="ink-splash"
          :style="{
            left: d.x + 'px',
            top: d.y + 'px',
            '--sx': d.dx + 'px',
            '--sy': d.dy + 'px',
            '--sz': d.size + 'px'
          }"
        ></div>

        <!-- 逐字书写 -->
        <div
          v-for="ch in chars"
          :key="ch.id"
          class="ink-char"
          :style="{
            left: ch.x + 'px',
            top: ch.y + 'px',
            '--tilt': ch.tilt + 'deg'
          }"
        >{{ ch.char }}</div>

        <!-- 印章 -->
        <div v-if="showSeal" class="ink-seal">
          <div class="seal-border">
            <span class="seal-text">Cnkrru</span>
          </div>
          <div class="seal-border-inner"></div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* ── 按钮 ── */
.egg-wrap { display: flex; justify-content: center; padding: 10px 0; }
.egg-btn {
  padding: 8px 28px; border-radius: 24px; border: 1px solid;
  font-size: 14px; font-weight: 500; cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s, background-color 0.2s;
  background: color-mix(in srgb, var(--common-color-1) 20%, transparent);
  border-color: color-mix(in srgb, var(--common-color-1) 35%, transparent);
  color: var(--common-text);
}
.egg-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  background: color-mix(in srgb, var(--common-color-1) 40%, transparent);
  box-shadow: 0 4px 12px var(--common-shadow);
}
.egg-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

/* ── 全屏背景 ── */
.ink-backdrop {
  position: fixed; inset: 0; z-index: 99998; pointer-events: none;
  background: radial-gradient(ellipse at 50% 40%, #f5f0e8 0%, #ede4d3 40%, #e0d5c0 75%, #d4c8b0 100%);
  animation: ink-fade-in 0.6s ease;
  overflow: hidden;
}
@keyframes ink-fade-in { from { opacity: 0; } to { opacity: 1; } }

/* ── 宣纸纤维纹理 ── */
.paper-texture {
  position: absolute; inset: 0;
  opacity: 0.06;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 119, 90, 0.5) 2px, rgba(139, 119, 90, 0.5) 3px),
    repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(139, 119, 90, 0.4) 3px, rgba(139, 119, 90, 0.4) 4px);
}

/* ── 背景浮墨 ── */
.ink-drop {
  position: fixed; z-index: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(40, 30, 20, 0.12) 0%, rgba(40, 30, 20, 0.04) 50%, transparent 70%);
  animation: ink-drop-float 6s ease-in infinite;
  transform: translate(-50%, -50%);
}
@keyframes ink-drop-float {
  0%   { transform: translate(-50%, -50%) translateY(0) scale(1); opacity: 0.3; }
  50%  { transform: translate(-50%, -50%) translateY(-40px) scale(1.15); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) translateY(-80px) scale(0.9); opacity: 0; }
}

/* ── 墨点溅射 ── */
.ink-splash {
  position: fixed; z-index: 8;
  width: var(--sz); height: var(--sz);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(30, 20, 10, 0.7) 0%, rgba(50, 35, 20, 0.3) 50%, transparent 70%);
  transform: translate(-50%, -50%);
  animation: ink-splash-burst 0.8s ease-out forwards;
}
@keyframes ink-splash-burst {
  0%   { transform: translate(-50%, -50%) translate(0, 0); opacity: 0.9; }
  100% { transform: translate(-50%, -50%) translate(var(--sx), var(--sy)); opacity: 0; }
}

/* ── 逐字书写 ── */
.ink-char {
  position: fixed; z-index: 10;
  font-size: clamp(48px, 8.5vw, 105px);
  font-weight: 900;
  color: #2a1f14;
  font-family: 'STKaiti', 'KaiTi', '楷体', 'Noto Serif CJK SC', 'SimSun', serif;
  transform: translate(-50%, -50%) rotate(var(--tilt));
  animation: ink-write 2.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
  filter: blur(6px);
  opacity: 0;
  letter-spacing: 0.04em;
}
@keyframes ink-write {
  0%   { filter: blur(6px); opacity: 0; }
  15%  { filter: blur(3px); opacity: 0.35; }
  35%  { filter: blur(1px); opacity: 0.75; }
  60%  { filter: blur(0.2px); opacity: 0.92; }
  100% { filter: blur(0); opacity: 1; }
}

/* ── 印章 ── */
.ink-seal {
  position: fixed; top: 48%; left: 55%; z-index: 20;
  transform: translate(-50%, -50%) rotate(-15deg);
  animation: ink-seal-stamp 0.6s cubic-bezier(0.34, 1.56, 0.2, 1) forwards;
}
.seal-border {
  position: relative;
  border: 3px solid #c41e3a;
  padding: 14px 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}
.seal-border-inner {
  position: absolute;
  inset: 4px;
  border: 1px solid rgba(196, 30, 58, 0.5);
}
.seal-text {
  font-size: clamp(18px, 3vw, 36px);
  font-weight: 900;
  color: #c41e3a;
  font-family: 'STKaiti', 'KaiTi', '楷体', 'Noto Serif CJK SC', 'SimSun', serif;
  white-space: nowrap;
  letter-spacing: 0.12em;
  opacity: 0.85;
}
@keyframes ink-seal-stamp {
  0%   { transform: translate(-50%, -50%) rotate(-25deg) scale(3); opacity: 0; }
  50%  { transform: translate(-50%, -50%) rotate(-12deg) scale(0.95); opacity: 0.9; }
  70%  { transform: translate(-50%, -50%) rotate(-16deg) scale(1.03); opacity: 0.95; }
  100% { transform: translate(-50%, -50%) rotate(-15deg) scale(1); opacity: 0.85; }
}
</style>