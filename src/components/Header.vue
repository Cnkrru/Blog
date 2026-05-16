<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Logo from './p-header/Logo.vue'
import ThemeToggle from './p-header/ThemeToggle.vue'
import ImmersiveReading from './p-header/ImmersiveReading.vue'
import ReadingProgress from './p-header/ReadingProgress.vue'
import Search from './p-header/Search.vue'
import MusicPlay from './media/MusicPlay.vue'
import MobileMenu from './p-header/MobileMenu.vue'

import DynamicEffectControl from './p-header/DynamicEffectControl.vue'

const router = useRouter()


// 初始化功能
onMounted(() => {
  // 组件挂载时的初始化逻辑
})

</script>


<template>
  <div>
    <!-- 阅读进度条 -->
    <ReadingProgress />
    
    <header class="header-flex">
      <div class="header-S">
        <nav class="header-container">
          <div class="header-card">
            <!-- Logo -->
            <Logo />
            
            <!-- 搜索框 -->
            <Search />
            
            <!-- 功能按钮 -->
            <div class="button-class-card">
              
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
.header-S {
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
    width: 100%;
    height: 100%;

    padding: 10px 20px;
    margin-bottom: 10px;
    border-radius: 8px;
    border: 3px solid var(--common-color-1);
    
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    
    overflow: visible;
}

/*==========功能按钮设计==========*/
    /* 功能按钮卡片设计 */
.button-class-card {
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

/* vue的deep特性：父子间可用，在父级组件里直接定义子级组件的CSS，提高代码复用率 */

/* 功能按钮设计 */
:deep(.button-style) {
    width:40px;
    height: 40px;
    border-radius: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    transition: all 0.3s ease;
}

:deep(.button-style:hover) {
    transform: scale(1.15);
    box-shadow: 0 4px 12px var(--common-shadow);
}

:deep(.button-style.animating) {
    animation: buttonSpinBounce 0.4s ease;
}

:deep(.emoji-burst) {
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
    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, calc(-50% - 20px)) scale(1.5); }
}

:deep(.button-style img) {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
}
</style>

<!-- 颜色样式 -->
<style>
.button-style {
    background-color: var(--common-color-1);
    border-color: var(--common-color-1);
}

.button-style img {
    filter: invert(1);
}

body.dark-theme .button-style img {
    filter: invert(0);
}
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
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

  .button-class-card {
    justify-content: center;
    gap: 4px;
  }

  :deep(.button-style) {
    width: 32px;
    height: 32px;
  }

  :deep(.button-style img) {
    width: 16px;
    height: 16px;
  }
}

@media (max-width: 768px) {
  .header-card {
    flex-direction: column;
    justify-content: center;
    padding: 10px;
    gap: 10px;
  }

  .button-class-card {
    justify-content: center;
  }

  :deep(.button-style) {
    width: 36px;
    height: 36px;
  }

  :deep(.button-style img) {
    width: 18px;
    height: 18px;
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
  .header-S {
    max-width: 1400px;
  }
}
</style>
