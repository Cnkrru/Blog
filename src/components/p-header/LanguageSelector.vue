<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const isOpen = ref(false)

const languages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' }
]

const currentLanguage = ref(locale.value)

watch(locale, (newLocale) => {
  currentLanguage.value = newLocale
})

const selectLanguage = (lang) => {
  locale.value = lang
  currentLanguage.value = lang
  isOpen.value = false
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  const dropdown = event.target.closest('.language-selector')
  if (!dropdown) {
    isOpen.value = false
  }
}

// 监听点击事件
onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<template>
  <div class="language-selector">
    <button 
      class="language-button" 
      @click="toggleDropdown"
    >
      {{ currentLanguage === 'zh' ? '中文' : 'English' }}
      <span class="dropdown-arrow"></span>
    </button>
    
    <div 
      class="language-dropdown" 
      v-show="isOpen"
    >
      <div 
        v-for="lang in languages" 
        :key="lang.code"
        class="language-item"
        :class="{ active: lang.code === currentLanguage }"
        @click="selectLanguage(lang.code)"
      >
        {{ lang.name }}
        <span v-if="lang.code === currentLanguage" class="current-indicator">当前</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.language-selector {
  position: relative;
  margin-left: 10px;
}

.language-button {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: var(--button-bg, #f8f9fa);
  border: 1px solid var(--button-border, #dee2e6);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  color: var(--button-text, #333);
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.language-button:hover {
  background-color: var(--button-hover-bg, #e9ecef);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.dropdown-arrow {
  margin-left: 5px;
  font-size: 10px;
}

.language-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 5px;
  background-color: var(--card-bg);
  border: 1px solid var(--button-border, #dee2e6);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 120px;
  overflow: hidden;
}

.language-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.language-item:hover {
  background-color: var(--button-hover-bg, #e9ecef);
}

.language-item.active {
  background-color: var(--button-bg, #f8f9fa);
  font-weight: bold;
  color: var(--button-text, #333);
}

.current-indicator {
  margin-left: 10px;
  color: var(--accent-fg, #007bff);
  font-weight: bold;
}

@media (max-width: 768px) {
  .language-button {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .language-dropdown {
    min-width: 100px;
  }
  
  .language-item {
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>