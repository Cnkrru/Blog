<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Logo from './functions/header/Logo.vue'
import ThemeToggle from './functions/header/ThemeToggle.vue'
import Reading from './functions/header/Reading.vue'
import ReadingProgress from './functions/header/ReadingProgress.vue'
import Search from './functions/header/Search.vue'
import MusicPlay from './functions/header/MusicPlay.vue'
import MobileMenu from './functions/header/MobileMenu.vue'
import LanguageSelector from './functions/header/LanguageSelector.vue'
import DynamicEffectControl from './functions/header/DynamicEffectControl.vue'

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
              <Reading />
              
              <!-- 音乐播放器按钮 -->
              <MusicPlay />
              
              <!-- 语言选择按钮 -->
              <LanguageSelector />
            </div>
          </div>
        </nav>
      </div>
    </header>
  </div>
</template>
