import { ref, reactive } from 'vue'
import bgVideo from '@/assets/media/bg.mp4'

/* ====================<共享状态>====================
* [AI改造] 主题/布局/透明度/背景 的响应式状态提升到模块级单例，
* 设置页/App/Comment 共用同一份 ref，才能实时联动（等效原 pinia/theme IIFE 单例）。
* set()/init() 只是闭包，调用多少次都读写同一批状态。
*/
const is_theme = localStorage.getItem('theme') ?? 'ink'
export const ref_theme = ref(is_theme)
const is_layout = localStorage.getItem('layout') ?? 'default'
export const ref_layout = ref(is_layout)
const is_opacity = localStorage.getItem('opacity') ?? '1'
export const ref_opacity = ref(parseFloat(is_opacity))      // [AI修复] 初值同步存档透明度，进页面滑块不再停在满格
const is_bg = localStorage.getItem('bg') ?? 'photo'
export const ref_bg = ref(is_bg)

// 主题 map：类名 ← → 语义名
const theme_map = {
    ink:'ink',
    blue:'blue',
    cyan:'cyan',
    sakura:'sakura',
    purple:'purple',
}

// 布局 map：类名 ← → 语义名（[AI迁移] immersive 已迁走，此处只留本页可选的）
const layout_map = {
    default:'default',
    card:'card',
}

/* ====================<theme>==================== */
// 主题设置函数
export const theme = () => {
    // 主题设置函数
    const set = (theme) => {
        try{
            const body = document.body;
            body.classList.remove('ink','blue','sakura','purple','cyan');
            body.classList.add(theme_map[theme]);
            ref_theme.value = theme_map[theme];

            localStorage.setItem('theme',theme_map[theme]);
            console.log(`[INFO]:主题已设置为${theme}`)
        }
        catch {
            console.error('[ERR]:主题设置失败')
        }
    }

    // 主题初始化函数
    const init = () => {
        try{
            set(is_theme)
            console.log('[INFO]:主题切换成功')
        }
        catch {
            console.error('[ERR]:主题切换失败')
        }
    }

    // [AI修复] 返回包 reactive：嵌套在普通对象里的 ref 模板不会自动解包，导致按钮选中态/滑块 v-model 失效
    return reactive({ref_theme,set,init})
}

/* ====================<layout>==================== */
// 布局设置函数
export const layout = () => {
    // 布局设置函数
    const set = (layout) => {
        try {
            const body = document.body;
            body.classList.remove('default','card')
            body.classList.add(layout_map[layout])
            ref_layout.value = (layout_map[layout])

            localStorage.setItem('layout',layout_map[layout])
            console.log('[INFO]:布局设置成功')
        }
        catch {
            console.error('[ERR]:布局设置失败')
        }
    }

    // 布局初始化函数
    const init = () => {
        try {
            set(is_layout);
            console.log('[INFO]:背景初始化成功')
        }
        catch{
            console.error('[ERR]:背景初始化失败')
        }
    }

    return reactive({ref_layout,set,init})
}

/* ====================<opacity>==================== */
// 透明度修改函数
export const opacity = () => {
    // 透明度修改函数
    const set = () => {
        try {
            document.documentElement.style.setProperty('--glass-opacity', ref_opacity.value)                    // 修改透明度CSS
            document.documentElement.style.setProperty('--progress', String(ref_opacity.value * 100) + '%')     // 修改进度条CSS
            localStorage.setItem('opacity',String(ref_opacity.value))                                           // 持久化存储
            console.log('[INFO]:透明度修改成功')
        }
        catch {
            console.error('[ERR]:透明度修改失败')
        }
    }

    // 透明度初始化函数
    const init = () => {
        try {
            document.documentElement.style.setProperty('--glass-opacity', is_opacity)
            document.documentElement.style.setProperty('--progress', String((parseFloat(is_opacity) * 100)) + '%')
            console.log('[INFO]:透明度初始化成功')
        }
        catch {
            console.error('[ERR]:透明度初始化失败')
        }
    }
    return reactive({ref_opacity,set,init})
}

/* ====================<bg>==================== */
// 背景设置函数
export const bg = () => {
    // 背景设置函数
    const set = (_bg) => {
        try {
            const body = document.body
            if(_bg === 'photo') {
                document.querySelector('.bg-video')?.remove()
                body.classList.add('bg-img')
                ref_bg.value = 'photo'

                localStorage.setItem('bg','photo')
            }
            else if(_bg === 'video') {
                const video = document.createElement('video')
                body.classList.remove('bg-img')

                video.className = 'bg-video'
                video.src = bgVideo
                video.autoplay = true
                video.muted = true
                video.loop = true
                video.playsInline = true
                video.load()                            // 立即触发下载/解码
                video.play().catch(() => {})            // autoplay 被策略拦时静默
                document.body.appendChild(video)

                ref_bg.value = 'video'

                localStorage.setItem('bg','video')
            }
            console.log(`[INFO]:背景已设置为${_bg}`)
        }
        catch {
            console.error('[ERR]:背景设置失败')
        }
    }

    // 背景初始化函数
    const init = () => {
        try {
            set(is_bg);
            console.log('[INFO]:背景初始化成功');
        }
        catch{
            console.error('[ERR]:背景初始化失败');
        }
    }

    return reactive({ref_bg,set,init})
}