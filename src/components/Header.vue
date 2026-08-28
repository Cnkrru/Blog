<script setup>
import { onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

import Logo from './p-header/Logo.vue'
import ThemeToggle from './p-header/ThemeToggle.vue'
import ImmersiveReading from './p-header/ImmersiveReading.vue'
import ReadingProgress from './p-header/ReadingProgress.vue'
import Search from './p-header/Search.vue'
const MusicPlay = defineAsyncComponent(() => import('./media/MusicPlay.vue'))
import MobileMenu from './p-header/MobileMenu.vue'
import DynamicEffectControl from './p-header/DynamicEffectControl.vue'

const router = useRouter()
</script>


<template>
  <div>
    <!-- 阅读进度条 -->
    <ReadingProgress />
    
    <header class="header-flex">
      <div class="header-s">
        <nav class="header-container">
          <div class="header-card">
            <!-- Logo -->
            <Logo />
            
            <!-- 搜索框 -->
            <Search />
            
            <!-- 功能按钮 -->
            <div class="button-card">
              
              <!-- 移动端菜单按钮 -->
              <MobileMenu />
              
              <!-- 动态效果控制按钮 -->
              <DynamicEffectControl />
              
              <!-- 主题切换按钮 -->
              <ThemeToggle />
              
              <!-- 沉浸式阅读按钮 -->
              <ImmersiveReading />
              
              <!-- 音乐播放器按钮 -->
              <MusicPlay />
              
              
            </div>
          </div>
        </nav>
      </div>
    </header>
  </div>
</template>

<!-- 布局样式 -->
<style scoped>
    /* 页眉启用flex布局 */
.header-flex {
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

    /* 页眉面积分配 */
.header-s {
    max-width: 1800px;
    margin: 0 auto;
    width: 95%;
}

    /* 页眉版心设计 */
.header-container {
    width: 100%;
    height: 100%;
    margin: 0 auto;
}

    /* 页眉卡片设计 */
.header-card {
    position: relative;
    z-index: 100;
    width: 100%;
    height: 100%;

    padding: 10px 20px;
    margin-bottom: 10px;
    border-radius: 14px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;

    overflow: visible;
}

/*==========功能按钮设计==========*/
    /* 功能按钮卡片设计 */
.button-card {
    width: fit-content;
    height: 40px;

    margin: 0;
    padding: 4px;
    border-radius: 8px;
    
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    
    flex-shrink: 0;
}

/* ===== 响应式设计媒体查询 ===== */
@media (max-width: 480px) {
  .header-flex {
    flex-direction: row;
    justify-content: center;
    padding: 4px;
  }

  .header-card {
    flex-direction: column;
    justify-content: center;
    flex-wrap: nowrap;
    gap: 4px;
    padding: 6px;
  }

  .button-card {
    justify-content: center;
    gap: 4px;
  }
}

@media (max-width: 768px) {
  .header-card {
    flex-direction: column;
    justify-content: center;
    padding: 10px;
    gap: 10px;
  }

  .button-card {
    justify-content: center;
  }
}

@media (max-width: 1024px) {
  .header-flex {
    padding: 12px;
  }
  .header-card {
    padding: 10px 20px;
  }
}

@media (min-width: 1280px) {
  .header-s {
    max-width: 1400px;
  }
}
</style>

<style>
.button-style {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    transition:
        transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.2s ease,
        background-color 0.2s ease;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    background: var(--common-color-1);
    border: 1px solid var(--common-color-1);
    color: #fff;
    box-shadow: 0 2px 8px color-mix(in srgb, var(--common-color-1) 30%, transparent);
}

.button-style:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 14px color-mix(in srgb, var(--common-color-1) 40%, transparent);
}

.button-style.animating {
    animation: buttonSpinBounce 0.4s ease;
}

.emoji-burst {
    position: absolute;
    font-size: 20px;
    animation: emojiBurst 0.4s ease;
    pointer-events: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

@keyframes buttonSpinBounce {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.2); }
    100% { transform: rotate(360deg) scale(1); }
}

@keyframes emojiBurst {
    0% {
  opacity: 1;
   transform: translate(-50%, -50%) scale(1);
   
}
    100% {
  opacity: 0;
   transform: translate(-50%, calc(-50% - 20px)) scale(1.5);
   
}
}

.button-style img {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
}

@media (max-width: 480px) {
  .button-style {
    width: 30px;
    height: 30px;
  }
  .button-style img {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 768px) {
  .button-style {
    width: 32px;
    height: 32px;
  }
  .button-style img {
    width: 16px;
    height: 16px;
  }
}
</style>
