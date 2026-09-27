import QRCode from 'qrcode'
export const content = () => {
    const share = () => {

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

        const copyMaker = () => {

        }
    
        return {
            linkMaker,
            qrcodeMaker,
            copyMaker
        }
    }

    const toast = () => {

        const icon_level_map = {
            success:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24" role="img" aria-label="成功"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>',
            info:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24" role="img" aria-label="信息"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>',
            warning:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24" role="img" aria-label="警告"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>',
            error:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24" role="img" aria-label="错误"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>'
        }

        const x_icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'

        let timer = null

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

    const backToTop = () => {
        const scrollToTop = () => {
            const scroll_area = document.querySelector('.main-body')
            if (scroll_area) {
            scroll_area.scrollTo({ top: 0, 'behavior': 'smooth' })
            }
        }

        const readingProgress = () => {
            const area = document.querySelector('.main-body')
            const progress_span = document.querySelector('.progress')

            area.addEventListener('scroll', () => {
            const undisplay_px = area.scrollHeight - area.clientHeight                            // 区域总px - div显示px = 未显示区域px，常数
            const _progress = undisplay_px > 0 ? Math.min(1, area.scrollTop / undisplay_px) : 0   // 用未显示px进行一层保护
            progress_span.style.setProperty('--progress', (_progress * 360) + 'deg')              // 设置样式
            })
        }
        return {
            scrollToTop,
            readingProgress
        }        
    }

    const mermaid = async () => {
        const body = document.body
        const mermaid_code = document.querySelectorAll('pre[data-lang="mermaid"] code')

        if(!body) return
        if(!mermaid_code) return

        const {default:mermaid} = await import ('mermaid')
        mermaid.initialize({ startOnLoad: false })
        try {
            await mermaid.run({ nodes: Array.from(mermaid_code) })
        }
        catch {
            console.error('[ERR]:mermaid渲染错误')
        }
    }

    const postNav = async (post_key) => {
        // 1. 取该篇解析字段
        const meta = await data.post_data_getter(post_key)
        if(!meta) return

        // 2. 取整表，抽order对调kv建新表
        const table = await data.post_raw_getter()
        const _order_map = Object.create(null)
        Object.entries(table).forEach(([k,v]) => {
            _order_map[v.order] = k
        })

        // 3. 根据新表查原来的key
        const pre_post = _order_map[meta.post_order - 1] ?? null;
        const next_post = _order_map[meta.post_order + 1] ?? null;

        // 4. 根据上下篇的key，那对应的title（先 await 再取属性；首尾无相邻文章时跳过）
        const pre_title = pre_post  ? (await data.post_data_getter(pre_post)).post_title  : null
        const next_title = next_post ? (await data.post_data_getter(next_post)).post_title : null
        
        return { 
            pre_post,pre_title,
            next_post,next_title
        }
    }

    const postStatus = async (post_key) => {
        const meta = await data.post_data_getter(post_key)
        if(!meta) return
        
        const _word = meta.post_word;
        const _time = meta.post_reading_time;

        return {_word,_time}
    }

    const editHistory = async () => {
        const meta = await data.post_data_getter(post_key)
        if(!meta) return
        
        const _date = meta.post_date;
        const _update = meta.post_update;

        return {_date,_update}           
    }

    const relatedPost = () => {

    }

    return {
        share,
        toast,
        backToTop,
        mermaid,
        postNav,
        postStatus,
        editHistory,

    }
}