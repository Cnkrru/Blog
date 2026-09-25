<script setup>
// [AI实现] 音乐播放器面板：封面/控制/进度/音量/列表，逻辑走 music store（howler）；开合由 header 按钮驱动 store.isOpen
import { computed, onMounted, onUnmounted } from 'vue'
import { music } from '@/modules/music.js'
import Music from '../icon/Music.vue'
import SkipBack from '../icon/SkipBack.vue'
import Play from '../icon/Play.vue'
import Pause from '../icon/Pause.vue'
import SkipForward from '../icon/SkipForward.vue'
import List from '../icon/List.vue'
import Volume from '../icon/Volume.vue'
import VolumeX from '../icon/VolumeX.vue'
import X from '../icon/X.vue'

const currentSong = computed(() => music.currentSong)
const progress = computed(() => music.progressPercent)

const onSeek = (e) => { music.seek(Number(e.target.value) / 100) }
const onVolume = (e) => { music.setVolume(Number(e.target.value)) }

onMounted(() => { music.loadMusicConfig() })
onUnmounted(() => { music.cleanup() })
</script>

<template>
    <Teleport to="body">
        <Transition name="drop">
            <div v-if="music.isOpen" class="music-player">
                <div class="mp-head">
                    <div class="mp-cover">
                        <img v-if="currentSong?.cover" :src="currentSong.cover" alt="封面" />
                        <Music v-else class="mp-cover-fallback" />
                    </div>
                    <div class="mp-meta">
                        <h4 class="mp-title">{{ currentSong?.title || '未选择歌曲' }}</h4>
                        <p class="mp-artist">{{ currentSong?.artist || '未知艺术家' }}</p>
                    </div>
                    <button class="mp-close" title="关闭" @click="music.isOpen = false"><X class="mp-close-icon" /></button>
                </div>

                <div class="mp-controls">
                    <button class="mp-btn" title="上一首" @click="music.prevSong(true)"><SkipBack class="mp-ctrl-icon" /></button>
                    <button class="mp-play" title="播放/暂停" @click="music.togglePlay()">
                        <Pause v-if="music.isPlaying" class="mp-play-icon" />
                        <Play v-else class="mp-play-icon" />
                    </button>
                    <button class="mp-btn" title="下一首" @click="music.nextSong(true)"><SkipForward class="mp-ctrl-icon" /></button>
                </div>

                <div class="mp-progress">
                    <span class="mp-time">{{ music.formatTime(music.currentTime) }}</span>
                    <input
                        class="mp-range"
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        :value="progress"
                        :disabled="!currentSong"
                        @input="onSeek"
                    />
                    <span class="mp-time">{{ music.formatTime(music.duration) }}</span>
                </div>

                <div class="mp-volume">
                    <button class="mp-btn" title="静音" @click="music.toggleMute()">
                        <VolumeX v-if="music.isMuted || music.volume === 0" class="mp-ctrl-icon" />
                        <Volume v-else class="mp-ctrl-icon" />
                    </button>
                    <input
                        class="mp-range"
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        :value="music.volume"
                        @input="onVolume"
                    />
                </div>

                <div class="mp-listhead">
                    <button class="mp-listtoggle" @click="music.isListOpen = !music.isListOpen">
                        <List class="mp-ctrl-icon" />
                        <span>播放列表 ({{ music.playlist.length }})</span>
                    </button>
                </div>

                <Transition name="drop">
                    <ul v-if="music.isListOpen" class="mp-list">
                        <li
                            v-for="(s, i) in music.playlist"
                            :key="s.id ?? i"
                            class="mp-item"
                            :class="{ on: i === music.currentIndex }"
                            @click="music.selectSong(i)"
                        >
                            <span class="mp-item-title">{{ s.title }}</span>
                            <span class="mp-item-artist">{{ s.artist }}</span>
                        </li>
                    </ul>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
/* ============================== 浮层面板 ============================== */
.music-player {
    position: fixed;
    top: 64px;
    right: 20px;
    z-index: 1000;
    width: 320px;
    max-width: calc(100vw - 32px);
    padding: 14px;
    border-radius: var(--space-lg);
    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
    background: color-mix(in srgb, var(--glass-r), var(--glass-g), var(--glass-b)) 90%;
    backdrop-filter: blur(20px) saturate(180%);
    box-shadow: 0 8px 24px var(--g-shadow);
    color: var(--g-text);
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* ----- 头部：封面 + 信息 ----- */
.mp-head { display: flex; align-items: center; gap: 12px; }
.mp-cover {
    width: 56px; height: 56px;
    flex-shrink: 0;
    border-radius: var(--space-md);
    background-color: color-mix(in srgb, var(--g-color) 12%, transparent);
    display: flex; justify-content: center; align-items: center;
    overflow: hidden;
}
.mp-cover img { width: 100%; height: 100%; object-fit: cover; }
.mp-cover-fallback { width: 26px; height: 26px; color: var(--g-color); }
.mp-meta { flex: 1; min-width: 0; }
.mp-title { margin: 0; font-size: 14px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mp-artist { margin: 2px 0 0; font-size: 12px; opacity: 0.6; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mp-close {
    flex-shrink: 0;
    width: 28px; height: 28px;
    display: flex; justify-content: center; align-items: center;
    border: none; border-radius: var(--radius-full);
    background-color: transparent; color: var(--g-text); cursor: pointer;
    transition: background-color 0.2s ease;
}
.mp-close:hover { background-color: color-mix(in srgb, var(--g-color) 12%, transparent); }
.mp-close-icon { width: 16px; height: 16px; }

/* ----- 控制条 ----- */
.mp-controls { display: flex; justify-content: center; align-items: center; gap: 16px; }
.mp-btn {
    width: 32px; height: 32px;
    display: flex; justify-content: center; align-items: center;
    border: none; border-radius: var(--radius-full);
    background-color: transparent; color: var(--g-text); cursor: pointer;
    transition: background-color 0.2s ease;
}
.mp-btn:hover { background-color: color-mix(in srgb, var(--g-color) 12%, transparent); }
.mp-ctrl-icon { width: 20px; height: 20px; }
.mp-play {
    width: 44px; height: 44px;
    display: flex; justify-content: center; align-items: center;
    border: none; border-radius: var(--radius-full);
    background-color: var(--g-color); color: #fff; cursor: pointer;
    box-shadow: 0 2px 8px color-mix(in srgb, var(--g-color) 30%, transparent);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.mp-play:hover { transform: scale(1.08); }
.mp-play-icon { width: 22px; height: 22px; }

/* ----- 进度 / 音量 ----- */
.mp-progress, .mp-volume { display: flex; align-items: center; gap: 8px; }
.mp-time { font-size: 11px; opacity: 0.6; min-width: 32px; text-align: center; }
.mp-range {
    flex: 1;
    -webkit-appearance: none;
    appearance: none;
    height: 4px;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--g-text) 18%, transparent);
    outline: none;
    cursor: pointer;
}
.mp-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px; height: 12px;
    border-radius: var(--radius-full);
    background: var(--g-color);
    border: none;
}
.mp-range:disabled::-webkit-slider-thumb { opacity: 0.4; }

/* ----- 列表 ----- */
.mp-listhead { border-top: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent); padding-top: 10px; }
.mp-listtoggle {
    display: flex; align-items: center; gap: 6px;
    border: none; background-color: transparent; color: var(--g-text);
    font-size: 12px; font-weight: 600; cursor: pointer; padding: 2px 4px;
}
.mp-list {
    margin: 0; padding: 0; list-style: none;
    max-height: 200px; overflow-y: auto;
    display: flex; flex-direction: column; gap: 2px;
}
.mp-item {
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
    padding: 8px 10px; border-radius: var(--space-sm); cursor: pointer;
    transition: background-color 0.2s ease;
}
.mp-item:hover { background-color: color-mix(in srgb, var(--g-color) 12%, transparent); }
.mp-item.on { background-color: color-mix(in srgb, var(--g-color) 20%, transparent); }
.mp-item.on .mp-item-title { color: var(--g-color); font-weight: 600; }
.mp-item-title { font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mp-item-artist { font-size: 11px; opacity: 0.6; flex-shrink: 0; }

/* ----- 过渡 ----- */
.drop-enter-active, .drop-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-6px); }

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
    /* [响应式-lg] 大屏 */
}

@media (max-width: 1024px) {
    /* [响应式-md] 平板 */
}

@media (max-width: 768px) {
    /* [响应式-sm] 手机 */
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
}

</style>