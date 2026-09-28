import axios from 'axios'
import { ref } from 'vue'
import QRCode from 'qrcode'

export const post = () => {

    // 拉整表 + 缓存（全模块共享同一缓存）
    let cache = null   // post.json缓存
    const data = async () => {
        if(cache) return cache     // 有缓存直接读缓存
        try{
            const meta = await axios.get('/config/post.json')
            cache = meta.data
            if(cache) {
                console.log('[INFO]:已经获取到post.json的数据')
            }
        }
        catch {
            console.error('[ERR]:未获取到post.json全表')
        }
        return cache ?? {}
    }

    // 数据清洗：按 order 排序并抽取列表所需的精简字段
    const clean = (raw) => {
        // 步骤1：将数据kv反转存入中间对象
        const order_map = Object.create(null);                              // 创建空对象
        Object.entries(raw).forEach(([k,v]) => {order_map[v.order] = k});   // 遍历原始数据，将value的order字段与key交换
        // 步骤2：遍历中间对象，将values取出来压入数组里
        const keys = Object.values(order_map).filter(Boolean);              // 把order_map的values取出来存到keys中间值，过滤掉空值
        return keys.map(key => {                                            // 遍历keys
            const meta = raw[key]                                           // 把keys每个子项的数据取出来，存在meta
            return {                                                        // 把meta的数据压入数组，一组数据为一个子{}
                key,
                title: meta.title,
                date: meta.date,            // [AI修复] 字段名应为 date（原data）
                category: meta.category,
                tags: meta.tags             // [AI修复] 原数组丢失，改为整传标签数组（原错写 Array.isArray）
            }
        })
    }

    /* ====================<share>==================== */
    const share = () => {
        // link类
        const linkMaker = (platform,url,title) => {
            const platform_map = {
                weibo: `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
                qq: `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
                tg: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
                }

            return platform_map[platform] || ''
        }
        // 二维码生成类
        const qrcodeMaker = async (el,url) => {
            if(!el) {
                console.error('[ERR]:目标元素不存在')
                return
            }
            try {
                await QRCode.toCanvas(el,url)
                console.log('[INFO]:二维码生成成功')
            }
            catch(e) {
                console.error('[ERR]:二维码生成失败',e)
            }
        }
        // 复制类
        const copyMaker = async (url) => {
            try {
                if(navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(url);
                }
                console.log('[INFO]:已成功将链接复制进剪贴板')
            }
            catch {
                console.error('[ERR]:链接写入剪贴板失败')
            }
        }

        return {
            linkMaker,
            qrcodeMaker,
            copyMaker
        }
    }
    /* ====================<toast>==================== */
    const toast = () => {
        // toast图标map
        const icon_level_map = {
            success:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24" role="img" aria-label="成功"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4 9.4 24.6 9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>',
            info:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24" role="img" aria-label="信息"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>',
            warning:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24" role="img" aria-label="警告"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>',
            error:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24" role="img" aria-label="错误"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4-9.4-24.6-9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>'
        }
        // 关闭图标
        const x_icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'

        let timer = null
        // 打开toast
        const toastOpen = (level, mes) => {
            try {
                const toast_on = document.querySelector('.toast-box') ?? undefined
                if(!toast_on) {
                    const body = document.querySelector('body')
                    const toast = document.createElement('div')
                    const icon = document.createElement('div')
                    const message = document.createElement('span')
                    const x = document.createElement('div')

                    // 给父级加样式
                    toast.className = 'toast-box'
                    // 给level图标的位置填充一下图标，加一下样式
                    icon.innerHTML = icon_level_map[level]
                    icon.className = 'toast-icon'
                    // 把toast消息填进去，加一下样式
                    message.innerText = mes
                    message.className = 'toast-mes'
                    // 把关闭图标加上，加一下样式
                    x.innerHTML = x_icon
                    x.className = 'toast-close'
                    x.addEventListener('click',() => toast_close())
                    // 先给子级挂上去，生成时，先生成父级，再挂载子级
                    toast.appendChild(icon)
                    toast.appendChild(message)
                    toast.appendChild(x)
                    // 挂父级
                    body.appendChild(toast)
                    // 按照level添加对应样式
                    toast.classList.add('toast-' + level)
                    if(toast_on) {
                        console.log('[INFO]:toast已成功挂载')
                    }

                    // timer = setTimeout(() => toast_close() ,3000)
                }
                else {
                    console.warn('[WARN]:请勿重复点击toast按钮')
                    return
                }
            }
            catch {
                console.error('[ERR]:toast挂载失败')
            }
        }
        // 关闭toast
        const toastClose = () => {
            const toast_on = document.querySelector('.toast-box')
            if(toast_on) {
                clearTimeout(timer)
                toast_on.remove()
                console.log('[INFO]:toast已成功移除')
            }
            else {
                console.error('[ERR]:toast移除失败')
            }
        }

        return {
            toastOpen,
            toastClose
        }
    }

    /* ====================<backToTop>==================== */
    // 返回顶部
    const scrollToTop = () => {
        const scroll_area = document.querySelector('.main-body')
        if (scroll_area) {
        scroll_area.scrollTo({ top: 0, 'behavior': 'smooth' })
        }
    }
    // 阅读进度
    const readingProgress = () => {
        const area = document.querySelector('.main-body')
        const progress_span = document.querySelector('.progress')

        area.addEventListener('scroll', () => {
        const undisplay_px = area.scrollHeight - area.clientHeight                            // 区域总px - div显示px = 未显示区域px，常数
        const _progress = undisplay_px > 0 ? Math.min(1, area.scrollTop / undisplay_px) : 0   // 用未显示px进行一层保护
        progress_span.style.setProperty('--progress', (_progress * 360) + 'deg')              // 设置样式
        })
    }

    /* ====================<mermaid>==================== */
    const mermaid = async () => {
        const body = document.body
        const mermaid_code = document.querySelectorAll('pre[data-lang="mermaid"] code')

        if(!body) return
        if(!mermaid_code) return
        // 导入mermaid库
        const {default:mermaid} = await import ('mermaid')
        // 配置mermaid.js
        mermaid.initialize({ startOnLoad: false })
        try {
            await mermaid.run({ nodes: Array.from(mermaid_code) })
        }
        catch {
            console.error('[ERR]:mermaid渲染错误')
        }
    }

    /* ====================<postNav>==================== */
    const postNav = async (post_key) => {
        const table = await data()
        const meta = table?.[post_key]
        if(!meta) return

        // 抽order对调kv建新表
        const _order_map = Object.create(null)
        Object.entries(table).forEach(([k,v]) => {
            _order_map[v.order] = k
        })

        // 根据新表查原来的key（首尾无相邻文章时为 null）
        const pre_post = _order_map[meta.order - 1] ?? null;
        const next_post = _order_map[meta.order + 1] ?? null;

        // 根据上下篇的key拿对应title
        const pre_title = pre_post  ? table[pre_post]?.title  : null
        const next_title = next_post ? table[next_post]?.title : null

        return {
            pre_post,pre_title,
            next_post,next_title
        }
    }

    /* ====================<postStatus>==================== */
    // 这个其实没什么必要，只说为了函数风格统一
    const postStatus = async (post_key) => {
        const table = await data()
        const meta = table?.[post_key]
        if(!meta) return

        const _word = meta.word_count;
        const _time = meta.reading_time;

        return {_word,_time}
    }

    const editHistory = async (post_key) => {
        const table = await data()
        const meta = table?.[post_key]
        if(!meta) return

        const _date = meta.date;
        const _update = meta.updated;
        const _history = meta.history;

        return {_date,_update,_history}
    }

    return {
        data, clean,
        scrollToTop, readingProgress,
        share, toast, mermaid,
        postNav, postStatus, editHistory,
    }
}

/* ====================<toc>==================== */
// [AI迁移] 原独立 composables/toc.js 并入 post.js：toc 保持单例（PostToc + MobileToc 共用），
//   headings/active 为全文唯一响应式源状态，扫描/高亮/跳转逻辑原样保留
export const toc = (() => {
    const headings = ref([])
    const active = ref('')

    let scroll_ctn = null       // 正文滚动容器（.main-body）
    let mobs = null             // 正文注入观察器（挂在 .main-area 上）
    let scan_timer = null
    let scroll_timer = null

    const scan = () => {
        const next_ctn = document.querySelector('.main-body')
        // 滚动容器随路由/注入变化时，监听跟到最新容器（先解旧再绑新）
        if (next_ctn !== scroll_ctn) {
            scroll_ctn?.removeEventListener('scroll', on_scroll)
            scroll_ctn = next_ctn
            scroll_ctn?.addEventListener('scroll', on_scroll, { passive: true })
        }
        const ct = document.querySelector('.content')
        // 不在文章页 / 正文未注入：清空遗留目录
        if (!ct) {
            if (headings.value.length) {
                active.value = ''
                headings.value = []
            }
            return
        }
        headings.value = [...ct.querySelectorAll('h1, h2, h3, h4, h5, h6')]
            .map((h) => ({ id: h.id, text: h.textContent.trim(), level: Number(h.tagName[1]) }))
            .filter((h) => h.id)
        active.value = ''
        updateActive()
    }

    const scan_scheduled = () => {
        clearTimeout(scan_timer)
        scan_timer = setTimeout(scan, 60)
    }

    /* scrollspy：滚动时自算当前章节，触底高亮末章 */
    const updateActive = () => {
        if (!scroll_ctn || !headings.value.length) return
        const { scrollTop, scrollHeight, clientHeight } = scroll_ctn
        if (scrollHeight > clientHeight && scrollTop + clientHeight >= scrollHeight - 2) {
            const last = headings.value[headings.value.length - 1].id
            if (active.value !== last) active.value = last
            return
        }
        const ctop = scroll_ctn.getBoundingClientRect().top
        const band = ctop + scroll_ctn.getBoundingClientRect().height * 0.10
        let cur = headings.value[0].id
        for (const h of headings.value) {
            const el = document.getElementById(h.id)
            if (!el) continue
            if (el.getBoundingClientRect().top > band) break
            cur = h.id
        }
        if (active.value !== cur) active.value = cur
    }

    const on_scroll = () => {
        clearTimeout(scroll_timer)
        scroll_timer = setTimeout(updateActive, 40)
    }

    /* 跳转：滚动容器可滚时走容器平滑滚动（-20px 呼吸），否则回退 scrollIntoView
     * （移动端 .main-body 已放开为整页滚动，容器不可滚 → 走页面级滚动） */
    const jump = (id) => {
        const el = document.getElementById(id)
        if (!el) return
        const can_inner = scroll_ctn && scroll_ctn.scrollHeight > scroll_ctn.clientHeight
        if (can_inner && scroll_ctn.contains(el)) {
            const top = el.getBoundingClientRect().top - scroll_ctn.getBoundingClientRect().top + scroll_ctn.scrollTop
            scroll_ctn.scrollTo({ top: top - 20, behavior: 'smooth' })
        } else {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    /* 挂载（PostToc 生命周期负责）：首扫 + 观察 .main-area 子树，异步注入/路由切换均触发重扫 */
    const mount = () => {
        scan()
        const area = document.querySelector('.main-area')
        if (area && !mobs) {
            mobs = new MutationObserver(scan_scheduled)
            mobs.observe(area, { childList: true, subtree: true })
        } else if (area) {
            scan_scheduled()
        }
    }

    const unmount = () => {
        clearTimeout(scan_timer)
        clearTimeout(scroll_timer)
        mobs?.disconnect()
        mobs = null
        scroll_ctn?.removeEventListener('scroll', on_scroll)
        scroll_ctn = null
        headings.value = []
        active.value = ''
    }

    return { headings, active, jump, mount, unmount }
})()