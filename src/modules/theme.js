import { ref, reactive } from "vue"       // [AI改造] reactive: 让返回对象的 ref 点访问时自动解包（等效原 pinia 行为）
import bgVideo from '@/assets/media/bg.mp4'

/* [AI改造] IIFE 立即执行，模块加载时只建一次，theme 全局单例（等效原 pinia 的 useThemeStore 单例）
*   注意：SSG mock 下 localStorage 依旧可用，与 pinia setup 执行时机一致
*/
export const theme = (()=> { 
    /* ====================<主题切换>==================== */
    let is_theme = localStorage.getItem('theme') ?? 'ink'               // 实际改主题的
    const ref_theme = ref(''??'ink')                                     // 改按钮颜色，增加btn-on的

    // 主题map
    const theme_map = {
        ink:'ink',
        blue:'blue',
        cyan:'cyan',
        sakura:'sakura',
        purple:'purple',
    }    
    
    // 背景设置函数
    const set_theme = (theme) => {
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

    // 背景初始化函数
    const init_theme = () => {
        try{
            set_theme(is_theme)                      
            console.log('[INFO]:主题切换成功')
        }
        catch {
            console.error('[ERR]:主题切换失败')
        }
    }


    /* ====================<亮暗切换>==================== */
    let is_light_dark = localStorage.getItem('light_dark') ?? 'dark'                        // 亮暗状态
    const ref_light_dark = ref(true)                                                        // 用来切换图标

    // 亮暗设置函数
    const set_light_dark = (layout) => {
        try{
            const body = document.body
            if(layout === 'light') {
                body.classList.remove('dark');
                body.classList.add('light');
                ref_light_dark.value = true;                                                

                localStorage.setItem('light_dark','light')
                console.log('[INFO]:已切换为亮色模式')
            }
            else if(layout === 'dark') {
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
    const init_light_dark = () => {
        try{
            set_light_dark(is_light_dark);
            console.log('[INFO]:亮暗初始化成功');
        }
        catch {
            console.error('[ERR]:亮暗初始化失败');
        }
    }

    /* ====================<布局切换>==================== */
    let is_layout = localStorage.getItem('layout') ?? 'default'                            
    const ref_layout = ref(''??'default')

    // 布局map
    const layout_map = {
        default:'default',
        card:'card',
        immersive:'immersive'
    }

    // 布局设置函数
    const set_layout = (layout) => {
        try {
            const body = document.body;
            body.classList.remove('default','card','immersive')
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
    const init_layout = () => {
        try {
            set_layout(is_layout);
            console.log('[INFO]:背景初始化成功')
        }
        catch{
            console.error('[ERR]:背景初始化失败')
        }
    }  

    /* ====================<背景切换>==================== */
    let is_bg = localStorage.getItem('bg') ?? 'photo'               // 背景设置持久化存储
    const ref_bg = ref(''??'photo')                                       // 改背景设置的按钮颜色的

    // 背景设置函数
    const set_bg = (bg) => {
        try {
            const body = document.body
            if(bg === 'photo') {
                document.querySelector('.bg-video')?.remove()
                body.classList.add('bg-img')
                ref_bg.value = 'photo'
                
                localStorage.setItem('bg','photo')
            }
            else if(bg === 'video') {
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
            console.log(`[INFO]:背景已设置为${bg}`)
        }
        catch {
            console.error('[ERR]:背景设置失败')
        }
    }
       
    // 背景初始化函数
    const init_bg = () => {
        try {
            set_bg(is_bg);
            console.log('[INFO]:背景初始化成功');
        }
        catch{
            console.error('[ERR]:背景初始化失败');
        }
    }
    
    /* ====================<透明度参数>==================== */
    let is_opacity = localStorage.getItem('opacity') ?? '1'
    let ref_opacity = ref(1)

    // 透明度修改函数
    const set_opacity = () => {
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
    const init_opacity = () => {
        try {
            document.documentElement.style.setProperty('--glass-opacity', is_opacity)
            document.documentElement.style.setProperty('--progress', String((parseFloat(is_opacity) * 100)) + '%')        
            console.log('[INFO]:透明度初始化成功')      
        }
        catch {
            console.error('[ERR]:透明度初始化失败')
        }
    } 

    return reactive({
        is_theme,
        ref_theme,
        set_theme,
        init_theme, 

        is_light_dark,
        ref_light_dark,
        set_light_dark,
        init_light_dark,

        is_layout,
        ref_layout,
        set_layout,
        init_layout, 
        
        is_bg,
        ref_bg,
        set_bg,
        init_bg,

        is_opacity,
        ref_opacity,
        set_opacity,
        init_opacity,       
    })
})() 

