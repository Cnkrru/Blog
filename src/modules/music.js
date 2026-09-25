// 音乐播放器 store：基于 howler.js，UI 逻辑仿 blog-map
// 歌单来自 /config/music.json 的 songs[]，backupAudio 由 Howl 的 src 数组自动回退
import { ref, reactive, computed } from 'vue'
import axios from 'axios'
import { Howl } from 'howler'

/* [AI改造] IIFE 立即执行，模块加载时只建一次，music 全局单例（等效原 pinia 的 useMusicStore 单例）
*   reactive 包裹 return：让返回对象的 ref 点访问时自动解包（等效原 pinia 行为）
*/
export const music = (() => {

const isBrowser = typeof window !== 'undefined'

    /* ====================<顶层响应式状态>==================== */
    const playlist = ref([])        // 歌单（songs 数组）
    const currentIndex = ref(0)     // 当前曲目下标
    const isPlaying = ref(false)    // 是否播放中
    const isMuted = ref(false)      // 是否静音
    const volume = ref(0.7)         // 音量 0~1
    const currentTime = ref(0)      // 当前播放秒数
    const duration = ref(0)         // 总时长秒数
    const isLoading = ref(false)    // 是否加载中
    const isOpen = ref(false)       // [AI新增] 面板开合（按钮与面板共享）
    const isListOpen = ref(false)   // [AI新增] 列表开合

    /* ====================<运行时私有（闭包持有，非响应式）>==================== */
    let player = null               // 当前 Howl 实例（工人）
    let poll_timer = null           // 进度轮询计时器

    /* ====================<派生数据>==================== */
    const currentSong = computed(() => playlist.value[currentIndex.value] || null)
    const progressPercent = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0)

    const formatTime = (time) => {
        const m = Math.floor(time / 60)
        const s = Math.floor(time % 60)
        return `${m}:${s < 10 ? '0' : ''}${s}`
    }

    /* ====================<工人：进度轮询>==================== */
    // howler 的 seek() 需轮询读，播时开、暂停/停止时关
    const stop_poll = () => {
        if (poll_timer) { clearInterval(poll_timer); poll_timer = null }
    }
    const start_poll = () => {
        if (!player) return
        stop_poll()
        poll_timer = setInterval(() => { currentTime.value = player.seek() || 0 }, 500)
    }

    /* ====================<工人：构建/销毁 Howl>==================== */
    const destroy_player = () => {
        stop_poll()
        if (player) { player.unload(); player = null }
    }
    const make_player = (song, autoplay) => {
        destroy_player()
        if (!song?.audio) return
        isLoading.value = true
        player = new Howl({
            // backupAudio 一并传入，howler 自动按序回退到能播的源
            src: [song.audio, ...(song.backupAudio || [])],
            html5: true,
            autoplay: !!autoplay,
            volume: isMuted.value ? 0 : volume.value,
            onplay: () => { isPlaying.value = true; start_poll() },
            onpause: () => { isPlaying.value = false; stop_poll() },
            onstop: () => { isPlaying.value = false; stop_poll() },
            onend: () => { isPlaying.value = false; stop_poll(); nextSong(true) },
            onload: () => {
                duration.value = player?.duration() || 0
                isLoading.value = false
            },
            onloaderror: () => { isLoading.value = false; nextSong(true) },
        })
    }
    const load_song = (index, autoplay) => {
        const song = playlist.value[index]
        if (!song) return
        currentIndex.value = index
        make_player(song, autoplay)
    }

    /* ====================<外层动作>==================== */
    const loadMusicConfig = async () => {
        if (!isBrowser) return
        try {
            const { data } = await axios.get('/config/music.json')
            playlist.value = data.songs || []
            if (playlist.value.length) load_song(currentIndex.value, false)   // 预热第一首，不自动播（浏览器限制）
        } catch (e) {
            console.error('[music] 加载音乐配置失败:', e)
        }
    }

    const togglePlay = () => {
        if (player && player.playing()) { player.pause(); return }
        if (player) { player.play(); return }
        if (playlist.value.length) load_song(currentIndex.value, true)
    }
    const play = () => {
        if (player) player.play()
        else if (playlist.value.length) load_song(currentIndex.value, true)
    }
    const pause = () => { if (player) player.pause() }

    const prevSong = (autoplay = true) => {
        if (!playlist.value.length) return
        const n = (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
        load_song(n, autoplay)
    }
    const nextSong = (autoplay = true) => {
        if (!playlist.value.length) return
        const n = (currentIndex.value + 1) % playlist.value.length
        load_song(n, autoplay)
    }

    const selectSong = (index, autoplay = true) => {
        if (index === currentIndex.value) { togglePlay(); return }
        load_song(index, autoplay)
    }

    const seek = (percent) => { if (player && duration.value) player.seek(percent * duration.value) }

    const setVolume = (p) => {
        volume.value = p
        if (player) player.volume(isMuted.value ? 0 : p)
        isMuted.value = (p === 0)
    }
    const toggleMute = () => {
        isMuted.value = !isMuted.value
        if (player) player.mute(isMuted.value)
    }

    const cleanup = destroy_player

    const toggleOpen = () => {
        isOpen.value = !isOpen.value
        if (!isOpen.value) isListOpen.value = false
    }

    return reactive({
        playlist, currentIndex, isPlaying, isMuted, volume, currentTime, duration, isLoading,
        currentSong, progressPercent, formatTime,
        loadMusicConfig, togglePlay, play, pause, prevSong, nextSong, selectSong,
        seek, setVolume, toggleMute, cleanup, toggleOpen, isOpen, isListOpen,
    })
})()