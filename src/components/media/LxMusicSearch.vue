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

// 搜索状态
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const searchError = ref('')

// 配置
const API_URL = "https://88.lxmusic.xn--fiqs8s"
const API_KEY = "lxmusic"
const MUSIC_SOURCES = ['kw', 'kg', 'tx', 'wy', 'mg'] // 酷我、酷狗、腾讯、网易云、咪咕
const MUSIC_QUALITY = ['128k', '320k', 'flac', 'flac24bit']

// 搜索音乐
const searchMusic = async () => {
  if (!searchQuery.value.trim()) return
  
  isSearching.value = true
  searchError.value = ''
  searchResults.value = []
  
  try {
    // 注意：v4 API 路径与 v3 不同
    const response = await fetch(`${API_URL}/lxmusicv4/search?keyword=${encodeURIComponent(searchQuery.value)}&page=1&limit=20`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Key': API_KEY
      },
      mode: 'cors',
      credentials: 'omit'
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.code === 0 && data.data && data.data.list) {
      searchResults.value = data.data.list.map(item => ({
        id: item.id,
        title: item.name,
        artist: item.artists?.join(' / ') || '未知艺术家',
        album: item.album || '未知专辑',
        source: item.source,
        cover: item.picUrl || '',
        // 为了兼容现有的播放器，我们需要准备 audio 字段
        audio: '', // 稍后通过 getMusicUrl 获取
        backupAudio: []
      }))
    } else {
      searchError.value = data.msg || '搜索失败'
    }
  } catch (error) {
    searchError.value = `搜索失败: ${error.message}`
    console.error('Search error:', error)
  } finally {
    isSearching.value = false
  }
}

// 获取音乐播放链接
const getMusicUrl = async (song, quality = '320k') => {
  try {
    // v4 API 路径
    const response = await fetch(`${API_URL}/lxmusicv4/url/${song.source}/${song.id}/${quality}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Key': API_KEY
      },
      mode: 'cors',
      credentials: 'omit'
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.code === 0 && data.data) {
      return data.data
    } else {
      throw new Error(data.msg || '获取播放链接失败')
    }
  } catch (error) {
    console.error('Get music url error:', error)
    throw error
  }
}

// 添加到播放列表
const addToPlaylist = async (song) => {
  try {
    // 获取播放链接
    const audioUrl = await getMusicUrl(song)
    song.audio = audioUrl
    
    // 添加到播放列表
    musicStore.playlist.push({
      ...song,
      id: song.id,
      title: song.title,
      artist: song.artist,
      cover: song.cover,
      audio: audioUrl,
      backupAudio: []
    })
    
    // 自动播放
    const index = musicStore.playlist.length - 1
    musicStore.selectSong(index)
    
    // 显示成功消息
    alert('添加成功并开始播放')
  } catch (error) {
    alert(`添加失败: ${error.message}`)
  }
}

// 处理键盘回车搜索
const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    searchMusic()
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
          <h3>洛雪音乐搜索</h3>
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
        <div class="search-input-group">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="输入歌曲名、歌手名搜索"
            @keypress="handleKeyPress"
            class="search-input"
            autofocus
          />
          <button 
            @click="searchMusic" 
            :disabled="isSearching"
            class="search-btn"
          >
            {{ isSearching ? '搜索中...' : '搜索' }}
          </button>
        </div>
        <div v-if="searchError" class="search-error">
          {{ searchError }}
        </div>
      </div>
      
      <div class="search-results">
        <div v-if="searchResults.length === 0 && !isSearching" class="no-results">
          请输入关键词搜索音乐
        </div>
        <div v-else-if="isSearching" class="loading">
          搜索中...
        </div>
        <div v-else class="results-list">
          <div 
            v-for="(song, index) in searchResults" 
            :key="index"
            class="song-item"
          >
            <div class="song-info">
              <div class="song-meta">
                <h4 class="song-title">{{ song.title }}</h4>
                <p class="song-artist">{{ song.artist }} - {{ song.album }}</p>
                <span class="song-source">{{ song.source.toUpperCase() }}</span>
              </div>
              <div class="song-actions">
                <button 
                  @click="addToPlaylist(song)"
                  class="add-btn"
                >
                  添加到播放列表
                </button>
              </div>
            </div>
          </div>
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
  padding: 20px;
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
  margin-bottom: 20px;
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

.search-input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid var(--border-color, #ddd);
  border-radius: 25px;
  font-size: 14px;
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

.search-input::placeholder {
  color: var(--text-secondary, #999);
  transition: color 0.3s;
}

.search-input:focus::placeholder {
  color: var(--text-tertiary, #ccc);
}

.search-btn {
  padding: 12px 24px;
  background: var(--primary-color, #409eff);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.3);
  white-space: nowrap;
}

.search-btn:hover:not(:disabled) {
  background: var(--primary-hover, #66b1ff);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
  transform: translateY(-1px);
}

.search-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.3);
}

.search-btn:disabled {
  background: var(--disabled-bg, #ccc);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.search-error {
  color: var(--error-color, #f56c6c);
  font-size: 12px;
  margin-bottom: 15px;
}

.search-results {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}

.no-results,
.loading {
  text-align: center;
  padding: 40px 0;
  color: var(--text-secondary, #999);
  font-size: 14px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.song-item {
  padding: 15px;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 4px;
  transition: all 0.3s;
}

.song-item:hover {
  border-color: var(--primary-color, #409eff);
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.1);
}

.song-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.song-meta {
  flex: 1;
}

.song-title {
  margin: 0 0 5px 0;
  color: var(--text-primary, #333);
  font-size: 16px;
  font-weight: 500;
}

.song-artist {
  margin: 0 0 5px 0;
  color: var(--text-secondary, #999);
  font-size: 14px;
}

.song-source {
  display: inline-block;
  padding: 2px 8px;
  background: var(--primary-light, #ecf5ff);
  color: var(--primary-color, #409eff);
  font-size: 12px;
  border-radius: 10px;
}

.song-actions {
  margin-left: 20px;
}

.add-btn {
  padding: 8px 16px;
  background: var(--success-color, #67c23a);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background: var(--success-hover, #85ce61);
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

body.dark-theme .search-input::placeholder {
  color: var(--text-secondary-dark, #777);
}

body.dark-theme .search-input:focus::placeholder {
  color: var(--text-tertiary-dark, #555);
}

body.dark-theme .search-btn {
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.4);
}

body.dark-theme .search-btn:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.5);
}

body.dark-theme .search-btn:disabled {
  background: var(--disabled-bg-dark, #444);
}

body.dark-theme .song-item {
  border-color: var(--border-color-dark, #3c3c3c);
  background: var(--card-bg-dark, #1f1f1f);
}

body.dark-theme .song-title {
  color: var(--text-primary-dark, #e0e0e0);
}

body.dark-theme .song-artist {
  color: var(--text-secondary-dark, #999);
}

body.dark-theme .close-btn {
  color: var(--text-secondary-dark, #999);
}

body.dark-theme .close-btn:hover {
  background: var(--hover-bg-dark, #3c3c3c);
  color: var(--text-primary-dark, #e0e0e0);
}
</style>