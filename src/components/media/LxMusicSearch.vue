<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue'
import { useMusicStore } from '../../stores/music.js'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const musicStore = useMusicStore()

// 状态
const songId = ref('')
const source = ref('wy')
const quality = ref('320k')
const isLoading = ref(false)
const error = ref('')
const musicUrl = ref('')

// 配置
const API_URL = "https://88.lxmusic.xn--fiqs8s"
const API_KEY = "lxmusic"
const API_PATH = "/v4" // 正确的 v4 路径
const MUSIC_SOURCES = [
  { value: 'wy', label: '网易云 (wy)' },
  { value: 'kw', label: '酷我 (kw)' },
  { value: 'kg', label: '酷狗 (kg)' },
  { value: 'tx', label: '腾讯 (tx)' },
  { value: 'mg', label: '咪咕 (mg)' }
]
const MUSIC_QUALITY = [
  { value: '128k', label: '128k' },
  { value: '320k', label: '320k' },
  { value: 'flac', label: 'FLAC' },
  { value: 'flac24bit', label: 'FLAC 24bit' }
]

// 使用 Vercel API 代理
const useProxy = true
const proxyUrl = '/api/proxy'

// 获取音乐播放链接
const fetchMusic = async () => {
  if (!songId.value.trim()) {
    error.value = '请输入歌曲 ID'
    return
  }
  
  isLoading.value = true
  error.value = ''
  musicUrl.value = ''
  
  try {
    // 构建 API URL
    const apiUrl = `${API_URL}${API_PATH}/url/${source.value}/${songId.value}/${quality.value}`
    console.log('Fetching music:', apiUrl)
    
    let response
    if (useProxy) {
      // 使用 Vercel 代理
      response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: apiUrl,
          method: 'GET'
        })
      })
    } else {
      // 直接调用 API
      response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'X-Request-Key': API_KEY
        },
        mode: 'cors',
        credentials: 'omit'
      })
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('API response:', data)
    
    if (data.code === 0 && data.data) {
      musicUrl.value = data.data
    } else {
      throw new Error(data.msg || '获取音乐失败')
    }
  } catch (err) {
    console.error('Error fetching music:', err)
    error.value = `获取失败: ${err.message}`
  } finally {
    isLoading.value = false
  }
}

// 播放音乐
  const playMusic = () => {
    if (!musicUrl.value) return
    
    // 创建歌曲信息
    const song = {
      id: songId.value,
      title: `ID: ${songId.value}`,
      artist: `${source.value.toUpperCase()} - ${quality.value}`,
      album: '洛雪音乐',
      cover: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=music%20note%20icon%20minimal%20design&size=512x512',
      audio: musicUrl.value,
      backupAudio: []
    }
    
    // 添加到播放列表
    musicStore.playlist.push(song)
    
    // 自动播放
    const index = musicStore.playlist.length - 1
    musicStore.selectSong(index)
    
    // 显示成功消息
    alert('添加成功并开始播放')
    
    // 关闭面板
    closeSearch()
  }

// 处理键盘回车
const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    fetchMusic()
  }
}

// 关闭搜索面板
const closeSearch = () => {
  emit('close')
}

onMounted(() => {
  // 组件挂载时的初始化
})
</script>

<template>
  <div v-if="isVisible" class="lx-music-search-overlay" @click.self="closeSearch">
    <div class="lx-music-search">
      <div class="search-header">
        <div class="search-title">
          <h3>洛雪音乐 ID 输入</h3>
          <button 
            @click="closeSearch"
            class="close-btn"
            aria-label="关闭"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </button>
        </div>
        
        <div class="input-group">
          <input
            v-model="songId"
            type="text"
            placeholder="输入歌曲 ID（例如：1869042078）"
            @keypress="handleKeyPress"
            class="search-input"
            autofocus
          />
          
          <div class="select-group">
            <select v-model="source" class="source-select">
              <option v-for="item in MUSIC_SOURCES" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
            
            <select v-model="quality" class="quality-select">
              <option v-for="item in MUSIC_QUALITY" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </div>
          
          <button 
            @click="fetchMusic" 
            :disabled="isLoading"
            class="fetch-btn"
          >
            {{ isLoading ? '获取中...' : '获取音乐' }}
          </button>
        </div>
        
        <div v-if="error" class="search-error">
          {{ error }}
        </div>
        
        <div v-if="musicUrl" class="music-info">
          <div class="music-details">
            <h4>音乐准备就绪</h4>
            <p>ID: {{ songId }}</p>
            <p>音源: {{ source.toUpperCase() }}</p>
            <p>音质: {{ quality }}</p>
          </div>
          <button 
            @click="playMusic"
            class="play-btn"
          >
            播放音乐
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lx-music-search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.lx-music-search {
  background: var(--card-bg, #ffffff);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
}

.search-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.search-title h3 {
  margin: 0;
  color: var(--text-primary, #333);
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary, #999);
  padding: 5px;
  border-radius: 4px;
  transition: all 0.3s;
}

.close-btn:hover {
  background: var(--hover-bg, #f5f5f5);
  color: var(--text-primary, #333);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.search-input {
  padding: 12px 20px;
  border: 2px solid var(--border-color, #ddd);
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--input-bg, #ffffff);
  color: var(--text-primary, #333);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  border-color: var(--primary-color, #409eff);
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1), 0 2px 8px rgba(64, 158, 255, 0.2);
  transform: translateY(-1px);
}

.select-group {
  display: flex;
  gap: 10px;
}

.source-select,
.quality-select {
  flex: 1;
  padding: 10px 16px;
  border: 2px solid var(--border-color, #ddd);
  border-radius: 20px;
  font-size: 14px;
  background: var(--input-bg, #ffffff);
  color: var(--text-primary, #333);
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.source-select:focus,
.quality-select:focus {
  border-color: var(--primary-color, #409eff);
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

.fetch-btn {
  padding: 12px 24px;
  background: var(--primary-color, #409eff);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  white-space: nowrap;
}

.fetch-btn:hover:not(:disabled) {
  background: var(--primary-hover, #66b1ff);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
  transform: translateY(-2px);
}

.fetch-btn:disabled {
  background: var(--disabled-bg, #ccc);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.search-error {
  color: var(--error-color, #f56c6c);
  font-size: 14px;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(245, 108, 108, 0.1);
  border-radius: 4px;
  border-left: 4px solid var(--error-color, #f56c6c);
}

.music-info {
  margin-top: 20px;
  padding: 20px;
  background: rgba(64, 158, 255, 0.1);
  border-radius: 8px;
  border: 1px solid var(--primary-color, #409eff);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.music-details {
  flex: 1;
}

.music-details h4 {
  margin: 0 0 8px 0;
  color: var(--text-primary, #333);
  font-size: 16px;
  font-weight: 600;
}

.music-details p {
  margin: 4px 0;
  color: var(--text-secondary, #666);
  font-size: 14px;
}

.play-btn {
  padding: 10px 20px;
  background: var(--success-color, #67c23a);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3);
  white-space: nowrap;
  margin-left: 20px;
}

.play-btn:hover {
  background: var(--success-hover, #85ce61);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.4);
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 深色模式适配 */
body.dark-theme .lx-music-search {
  background: var(--card-bg-dark, #1f1f1f);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

body.dark-theme .search-input {
  background: var(--input-bg-dark, #2c2c2c);
  border-color: var(--border-color-dark, #3c3c3c);
  color: var(--text-primary-dark, #e0e0e0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

body.dark-theme .search-input:focus {
  border-color: var(--primary-color, #409eff);
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2), 0 2px 8px rgba(64, 158, 255, 0.3);
}

body.dark-theme .source-select,
body.dark-theme .quality-select {
  background: var(--input-bg-dark, #2c2c2c);
  border-color: var(--border-color-dark, #3c3c3c);
  color: var(--text-primary-dark, #e0e0e0);
}

body.dark-theme .music-info {
  background: rgba(64, 158, 255, 0.15);
}

body.dark-theme .music-details h4 {
  color: var(--text-primary-dark, #e0e0e0);
}

body.dark-theme .music-details p {
  color: var(--text-secondary-dark, #999);
}

body.dark-theme .close-btn {
  color: var(--text-secondary-dark, #999);
}

body.dark-theme .close-btn:hover {
  background: var(--hover-bg-dark, #3c3c3c);
  color: var(--text-primary-dark, #e0e0e0);
}

@media (max-width: 768px) {
  .lx-music-search {
    padding: 20px;
  }
  
  .select-group {
    flex-direction: column;
  }
  
  .music-info {
    flex-direction: column;
    gap: 12px;
  }
  
  .play-btn {
    margin-left: 0;
    align-self: flex-start;
  }
}
</style>