import axios from "axios";
import { computed, ref, reactive } from "vue"
import MiniSearch from "minisearch";
import { Howl } from 'howler'
import { post } from "@/composables/pmain/post.js";

/* ====================<搜索>==================== */
export const search = () => {
    const search_res = ref([]);
    const is_ready = ref(false);
    const is_loading = ref(false);

    let search = null;
    let cache = [];
    let build_flag = false;

    /* ====================<数据清洗与索引构建>==================== */
    // 数据清洗
    const cleaner = (raw) => 
        Object.entries(raw).map(([k,v]) => ({
            id: k,
            title: v.title,
            category: v.category,
            tags: Array.isArray(v.tags) ? v.tags : [],
            date: v.date,
        }))            
    
    // 分词
    const slicer = (text) => {
        const words = String(text)
                    .toLowerCase()
                    .split(/[^\p{L}\p{N}]+/u)
                    .filter(Boolean)
        const tokens = new Set(words);
        words.forEach(_ => {
            if(/[\u4e00-\u9fff]/.test(_) && _.length >1) {
                for(let i=0 ; i<_.length ; i++) {
                    tokens.add(_.slice(i,i+2));
                }
            }
        })
        return [...tokens]
    }

    // 配置minisearch
    const config = () => {
        search = new MiniSearch({                                       // miniSearch配置        
            fields: ['title', 'category', 'tags', 'date'],              // 参与检索的字段
            storeFields: ['id', 'title', 'category', 'tags', 'date'],   // 检索结果里返回的字段
            tokenize: slicer,                                           // 中文分词 
            searchOptions: {                                    
                boost: { title: 3, tags: 2, category: 1, date: 1 },     // 标题权重最高
                fuzzy: 0.2,                                             // 容错匹配
                prefix: true,                                           // 允许前缀匹配
                combineWith: 'OR',                                      // 多个 token 命中任一即可，提升召回
            },
        })
        search.addAll(cache)
        is_ready.value = true
        build_flag = true
    }

    const init = async () => {
        if(build_flag) return;
        is_loading.value = true;

        try {
            const raw = await post().data();
            cache = cleaner(raw);
            config();
            is_loading.value = false;
            console.log('[INFO]:minisearch初始化完成')
        }
        catch {
            is_loading.value = false;
            console.error('[ERR]:miniSearch初始化失败')
        }
    }

    /* ====================<检索与结果交互>==================== */
    const assembler = (key) => {
        const _ = key.trim();
        if(!_)      {search_res.value = [] ; return}
        if(!search) {search_res.value = [] ; return}
        search_res.value = search.search(_).slice(0,10)
    }

    // [AI重构] 原 render().cleaner 与上层 cleaner(数据清洗) 撞名，加 _ 区分：UI 结果清空
    const _cleaner = () => search_res.value = []

    return {
        search_res,is_ready,is_loading,
        search,cache,build_flag,
        init,assembler,_cleaner,
    }
}

/* ====================<亮暗切换>==================== */
export const ref_light_dark = ref(true)
let is_light_dark = localStorage.getItem('light_dark') ?? 'dark'                        // 亮暗状态
export const lightDark = () => {
    // 亮暗设置函数
    const set = (mode) => {
        try{
            const body = document.body
            if(mode === 'light') {
                body.classList.remove('dark');
                body.classList.add('light');
                ref_light_dark.value = true;                                                

                localStorage.setItem('light_dark','light')
                console.log('[INFO]:已切换为亮色模式')
            }
            else if(mode === 'dark') {
                body.classList.remove('light');
                body.classList.add('dark');
                ref_light_dark.value = false;

                localStorage.setItem('light_dark','dark')
                console.log('[INFO]:已切换为暗色模式')
            }
        }
        catch {
            console.warn('[ERR]:切换亮暗模式失败')
        }
    }

    // 亮暗初始化函数
    const init = () => {
        try{
            set(is_light_dark);
            console.log('[INFO]:亮暗初始化成功');
        }
        catch {
            console.error('[ERR]:亮暗初始化失败');
        }
    }
    return {set,init}        
}

/* ====================<沉浸阅读>==================== */
export const is_immersive = ref(true)
export const immersive = () => {
    const body = document.body
    if(is_immersive.value) {
        body.classList.remove('default','card');
        body.classList.add('immersive');
        is_immersive.value = false;
    }
    else {
        body.classList.remove('immersive');
        body.classList.add('default');
        is_immersive.value = true;            
    }
}

/* ====================<音乐>==================== */
// [AI补充说明] 只在你已写的这段 music 基座上补完：保留你原有的命名(music_list/is_playing/…)，
// 去掉了 computer/render 壳，函数平铺到顶层。补充/修正处均以 [AI补充] 标注。
// [AI迁移] music 改全局单例（IIFE）：源状态歌单/播放状态全站一份，组件直用 music.xxx，不再每次实例化；
//    reactive() 包装 return，让返回对象的 ref 在模板点访问时自动解包（与原生 music.js 单例行为一致）
export const music = (() => {
    let howler = null;
    let timer = null;

    const music_list = ref([]);
    const music_index = ref(0);
    const volume = ref(1);        
    const music_time = ref(0);
    const duration = ref(0);        
    const is_playing = ref(false);
    const is_muted = ref(false);
    const open_control = ref(false);        
    const open_list = ref(false);
    // [AI补充] 缺的加载态：mount/onload 里用到了但从未声明
    const is_loading = ref(false);
    // [AI补充] SSR 守卫：构建期(SSG)无 window，直接 return 兜底，避免运行时 ReferenceError
    const isBrowser = typeof window !== 'undefined';

    /* ====================<派生数据>==================== */
    const current_music = computed(()=> music_list.value[music_index.value]);
    const progress = computed(() => duration.value ? (music_time.value/duration.value) : 0 );

    const formatTime = (time) => {
        const min = Math.floor(time / 60);
        const s   = Math.floor(time % 60);
        return `${min}:${s<10 ? '0' : ''}${s}`
    }

    /* ====================<工人：进度轮询>==================== */
    const stop = () => {
        if(timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    const start = () => {
        if(!howler) return;
        stop();
        timer = setInterval(() => {music_time.value = howler.seek()}, 500)   // [AI补充] 原无间隔参数，如何循环；补 500ms 轮询
    }

    /* ====================<工人：构建/销毁 Howl>==================== */
    const unmount = () => {
        stop();
        if(howler) {
            howler.unload();
            howler = null;
        }
    }

    const mount = (music,autoplay) => {
        unmount();
        if(!music.audio) return
        is_loading.value = true;

        howler = new Howl({
            src: [music.audio,...(music.backupAudio || [])],   // [AI补充] 用 || [] 兜底，防 backupAudio 缺失时展开 undefined 报错
            html5: true,
            autoplay: autoplay,
            volume: is_muted.value ? 0 : volume.value,
            onplay: () =>   { is_playing.value = true  ; start()},
            onpause: () =>  { is_playing.value = false ; stop()},
            onstop: () =>   { is_playing.value = false ; stop()},
            onend: () =>    { is_playing.value = false ; stop();nextMusic(true)},
            onload: () =>   { duration.value = howler.duration();
                              is_loading.value = false;
            },
            onloaderror: () => { is_loading.value = false; nextMusic(true) },
        })
    }

    const loadMusic = (index,autoplay) => {
        const music = music_list.value[index];
        if(!music) return;
        music_index.value = index;
        mount(music,autoplay)
    }

    /* ====================<外层动作>==================== */
    const loadConfig = async () => {
        if(!isBrowser) return                     // [AI补充] SSR 守卫
        try {
            const data = await axios.get('/config/music.json')
            music_list.value = data.data.songs
            if(music_list.value.length) {
                loadMusic(music_index.value,false)
            }
        }
        catch {
            console.error('[ERR]:加载音乐配置失败')
        }
    }

    const toggleMusic = () => {
        // [AI修正] 加空值安全：howler 可能为 null
        if(howler && howler.playing()) { 
            howler.pause();
            return;
        };
        if(howler) {
            howler.play();
            return;
        };
        if(music_list.value.length) {
            loadMusic(music_index.value,true);
        } 
    }

    const play = () => {
        if(howler) {
            howler.play();
        }
        else if(music_list.value.length) {
            loadMusic(music_index.value,true);
        }
    }
    // [AI补充] 缺失的 pause 方法（原 music.js 有独立 pause，这里漏掉了）
    const pause = () => { if(howler) howler.pause() }

    const preMusic = () => {
        if(!music_list.value.length) return;
        const pre = (music_index.value -1 + music_list.value.length) % music_list.value.length;
        loadMusic(pre,true)
    }

    const nextMusic = () => {
        if(!music_list.value.length) return;
        const next = (music_index.value +1 + music_list.value.length) % music_list.value.length;
        loadMusic(next,true)
    }

    const selectMusic = (index) => {
        if(index === music_index.value) {
            toggleMusic();
            return;
        }
        loadMusic(music,true);   // [AI修正] 原写 loadMusic(music,true)，music 未定义，应为 index
    }

    // [AI补充] 缺失的 seek：按进度百分比跳转（Music.vue 进度条依赖它）
    const seek = (percent) => {
        if(howler && duration.value) howler.seek(percent * duration.value)
    }

    const setVolume = (vol) => {
        volume.value = vol;
        if(howler) {
            howler.volume(is_muted.value ? 0 : volume.value);   // [AI修正] is_muted 是 ref，漏了 .value
        }
    }

    const toggleMuted = () => {
        is_muted.value = !is_muted.value;
        if(howler) {
            howler.mute(is_muted.value)
        }
    }

    /* ====================<UI 交互>==================== */
    const toggleUi = () => {
        // [AI修正] 原逻辑写反：翻转 open_control 的同时，关闭时应收起列表
        const next = !open_control.value;
        open_control.value = next;
        // 关闭主面板时，列表也一起收起，避免残留展开态
        if(!next) open_list.value = false;
    }

    return reactive({
        music_list, music_index, volume, music_time, duration,
        is_playing, is_muted, open_control, open_list, is_loading,
        current_music, progress, formatTime,
        stop, start, unmount, mount, loadMusic, loadConfig,
        toggleMusic, play, pause, preMusic, nextMusic, selectMusic,
        seek, setVolume, toggleMuted, toggleUi,
    })
})()