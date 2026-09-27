import axios from "axios";
import { n } from "shiki/dist/langs-bundle-full-B4n9xYHw.mjs";
import { computed, ref } from "vue"

const header = () => {
    
    const search_res = ref([]);
    const is_ready = ref(false);
    const is_loading = ref(false)
    const search = () => {
        let search = null;
        let cache = [];
        let build_flag = false;
        
        const computer = () => {
            // 数据清洗
            const cleaner = (raw) => 
                Object.entries(raw).map(([k,v]) => ({
                    id: k,
                    title: v.title,
                    category: v.category,
                    tags: Array.isArray(v.tags),
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

            const init = () => {
                if(build_flag) return;
                is_loading.value = true;

                try {
                    // const raw = ; 暂时留空
                    cache = cleaner(raw);
                    config();
                    console.log('[INFO]:minisearch初始化完成')
                }
                catch {
                    is_loading.value = false;
                    console.error('[ERR]:miniSearch初始化失败')
                }
            }

            return {cleaner,config,init}
        }


        const render = () => {
            const assembler = (key) => {
                const _ = key.trim();
                if(!_)      {search_res.value = [] ; return}
                if(!search) {search_res.value = [] ; return}
                search_res.value = search.search(_).slice(0,10)
            }

            const cleaner = () => search_res.value = []
        
            return {assembler,cleaner}
        }

        return {
            search,cache,build_flag,
            computer,render,
        }
    }

    /* ====================<亮暗切换>==================== */
    let is_light_dark = localStorage.getItem('light_dark') ?? 'dark'                        // 亮暗状态
    const ref_light_dark = ref(true)                                                        // 用来切换图标
    const lightDark = () => {
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
    const is_immersive = ref(true)
    const immersive = () => {
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

    const music = () => {
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

        const computer = () => {
            const current_music = computed(()=> music_list.value[music_index.value]);
            const progress = computed(() => duration.value ? (music_time.value/duration.value) : 0 );

            const formatTime = (time) => {
                const min = Math.floor(time / 60);
                const s   = Math.floor(time % 60);
                return `${min}:${s<10 ? '0' : ''}${s}`
            }

            // 音乐暂停
            const stop = () => {
                if(timer) {
                    clearInterval(timer);
                    timer = null;
                }
            }

            // 音乐开始
            const start = () => {
                if(!howler) return;
                stop();
                timer = setInterval(() => {music_time.value = howler.seek()})
            }

            // 音乐播放器关闭
            const unmount = () => {
                stop();
                if(howler) {
                    howler.unload();
                    howler = null;
                }
            }

            // 初始化音乐播放器
            const mount = (music,autoplay) => {
                unmount();
                if(!music.audio) return
                is_loading.value = true;

                howler = new Howl({
                    src: [music.audio,...(music.backupAudio)],
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

            // 加载index的歌曲
            const loadMusic = (index,autoplay) => {
                const music = music_list.value[index];
                if(!music) return;
                music_index.value = index;
                mount(music,autoplay)
            }

            // 加载歌单
            const loadConfig = async () => {
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

            // 切换歌曲
            const toggleMusic = () => {
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

            // 播放指定index的歌曲
            const play = () => {
                if(howler) {
                    howler.play();
                }
                else if(music_list.value.length) {
                    loadMusic(music_index.value,true);
                }
            }

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
                loadMusic(music,true);
            }

            const setVolume = (vol) => {
                volume.value = vol;
                if(howler) {
                    howler.volume(is_muted ? 0 : volume.value);
                }
            }

            const toggleMuted = () => {
                is_muted.value = !is_muted.value;
                if(howler) {
                    howler.mute(is_muted.value)
                }
            }

         }   

        const render = () => {
            const toggleUi = () => {
                open_control.value = !open_control.value;
                if(open_control.value) {
                    open_list.value = !open_list.value
                }
            }
            
            const 
        }

        return {computer,render}
    }

    return {
        search,

        ref_light_dark,
        lightDark,

        is_immersive,
        immersive,

        music,
    }
}