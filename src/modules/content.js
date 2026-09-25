import QRCode from 'qrcode'
import { data } from "./data"; // [AI实现] 数据层抽离到data.js，content统一从这里拿

/* [AI改造] IIFE 立即执行，模块加载时只建一次，content 全局单例（等效原 pinia 的 useContentStore 单例） */
export const content = (() => {

    /* ====================<sharebtn>==================== */
    /*
    * id: 分享工厂
    * fn: 三个建造者：link，qrcode。copy
    */
    const share_maker = (url,title) => {

        /*
        * id: 链接生成函数
        * fn: 根据平台返回对应链接
        */        
        const link_maker = (platform) =>  {
            const platform_map = {
                weibo: `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
                qq: `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
                tg: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
                }

                return platform_map[platform] || ''
            }

        /*
        * id: 二维码生成函数
        * fn:  给微信用的
        */
        const qrcode_maker = async (html_el) => {
            if(!html_el) {
                console.error('[ERR]:目标元素不存在')
                return
            }
            try {
                await QRCode.toCanvas(html_el,url)
                console.log('[INFO]:二维码生成成功')
            }
            catch(e) {
                console.error('[ERR]:二维码生成失败',e)
            }
        }

        /*
        * id: 复制函数
        * fn: 给复制按钮用
        */        
        const copy_maker = async () => {
            try {
                await navigator.clipboard.writeText(url)
                console.log('[INFO]:已成功将链接复制进剪贴板')
            }
            catch(e) {
                console.error('[ERR]:链接写入剪贴板失败',e)
            }
        }    

        return {
            link_maker,
            qrcode_maker,
            copy_maker,
        }
    }

    /* ====================<toast>==================== */
    const icon_level_map = {
        success:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24" role="img" aria-label="成功"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>',
        info:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24" role="img" aria-label="信息"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>',
        warning:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24" role="img" aria-label="警告"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>',
        error:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24" role="img" aria-label="错误"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>'
    }

    const x_icon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'

    /*
    * id: toast生产者
    * fn: 只提供操作函数，状态在顶层共享
    */
    const toast_maker = () => {
        let timer = null

        /*
        * id: 打开toast
        * fn: 传参设置状态 → 加等级类 → 显示 → 定时自动关闭
        * attr: 
        */
        const toast_open = (level, mes) => {
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

        /*
        * id: 关闭toast(由于toast由open函数生成，纯JS实现，关闭要和关闭按钮绑定，所以close现在是作为open的子函数存在)
        * fn: 隐藏并清理定时器
        */
        const toast_close = () => {
            const toast_on = document.querySelector('.toast-box')
            if(toast_on) {
                // clearTimeout(timer)
                toast_on.remove()
                console.log('[INFO]:toast已成功移除')
            }
            else {
                console.error('[ERR]:toast移除失败')
            }

        }

        return {
            toast_open,
        }
    }


    /* ====================<[AI迁移] scroll 返回顶部/进度>==================== */
    /*
    * id: 内容区域返回顶部(也用于路由切换)
    * fn: 让中心内容卡片返回顶部
    */
    const scroll_to_top = () => {
        const scroll_area = document.querySelector('.main-body')
        if (scroll_area) {
          scroll_area.scrollTo({ top: 0, 'behavior': 'smooth' })
        }
      }

    /*
    * id: 阅读进度条
    * fn: 根据main-body的阅读进度，更新返回顶部按钮的下层容器的css属性
    */
    const reading_progress = () => {
        const area = document.querySelector('.main-body')
        const progress_span = document.querySelector('.progress')

        area.addEventListener('scroll', () => {
          const undisplay_px = area.scrollHeight - area.clientHeight                            // 区域总px - div显示px = 未显示区域px，常数
          const _progress = undisplay_px > 0 ? Math.min(1, area.scrollTop / undisplay_px) : 0   // 用未显示px进行一层保护
          progress_span.style.setProperty('--progress', (_progress * 360) + 'deg')              // 设置样式
        })
    }

    /* ====================<useful>==================== */
    // 没写完
    const is_useful = localStorage.getItem('useful')

    /*
    * id: 有用工厂
    * fn: 接收postId，整表存单key(key=文章id, 值=yes/no)，一次改动只动当前项
    */
    const useful_maker = (post_id) => {

        /*
        * id: 读投票表
        * fn: 拿整表 Json，损坏时兜底空对象
        */
        const read_map = () => {
            try { 
                const useful_map = JSON.parse(localStorage.getItem('useful')) ?? {}
                console.log('[INFO]:获取usefulMap成功')
                return useful_map
            }
            catch {
                console.error('[ERR]:获取usefulMap失败')
            }
        }

        /*
        * id: 写投票表
        * fn: 读整表→只改当前项→写回
        */
        const write_map = (is_useful) => {
            try {
                const map = read_map()
                map[post_id] = is_useful
                localStorage.setItem('useful', JSON.stringify(map))
                console.log(`[INFO]:${post_id}对应useful设置为${is_useful}`)
            }
            catch {
                console.error(`[ERR]:${post_id}对应useful设置失败`)
                return {}
            }
        }

        /*
        * id: 有用
        * fn: 加自己类+清兄弟类+写表
        */
        const use_btn_yes = () => {
            try {
                document.querySelector('.use-btn-yes')?.classList.add('use-yes')
                document.querySelector('.use-btn-no')?.classList.remove('use-no')
                write_map('yes')
                console.log('[INFO]:yes类添加成功')
            }
            catch {
                console.error('[ERR]:yes类添加失败')
            }
        }

        /*
        * id: 没用
        * fn: 对称逻辑
        */
        const use_btn_no = () => {
            try {
                document.querySelector('.use-btn-no')?.classList.add('use-no')
                document.querySelector('.use-btn-yes')?.classList.remove('use-yes')
                write_map('no')
                console.log('[INFO]:no类添加成功')
            }
            catch {
                console.log('[ERR]:no类添加失败')
            }
        }

        /*
        * id: 初始化
        * fn: 从整表里只取当前文章的值恢复高亮
        */
        const use_btn_init = () => {
            const post_useful = read_map()[post_id]
            if(post_useful === 'yes') {
                use_btn_yes()
            }
            else if(post_useful === 'no') {
                 use_btn_no()
            }
        }

        return { 
            use_btn_yes,
            use_btn_no,
            use_btn_init 
        }
    }
    
    /* ====================<mermaid>==================== */
    const mermaid_maker = async () => {
        const root = document.body      // [AI重构] 壳已移除，.root恒null会使mermaid永远跳过，改body
        const mermaid_code = document.querySelectorAll('pre[data-lang="mermaid"] code')

        if(!root) {
            return
        }
        else {
            if(!mermaid_code) {
                return
            }
            else {
                const {default:mermaid} = await import ('mermaid')
                mermaid.initialize({ startOnLoad: false })
                try {
                    await mermaid.run({ nodes: Array.from(mermaid_code) })
                }
                catch {
                    console.error('[ERR]:mermaid渲染错误')
                }
            }
        }
    }
    
    /* ====================<frontmatter_parser>==================== */
    /*
    * [AI实现] 元数据取数统一走data.js的 post_json_get（全表+单篇一个函数）
    */
    const frontmatter_parser = () => {
        // [AI改造] data 已顶层 import，移除原 useDataStore() 局部实例（避免遮蔽）

        /* ====================<post_nav_maker>==================== */
        const post_nav_maker = async(post_key) => {
            // 1. 取该篇解析字段
            const meta = await data.post_data_getter(post_key)
            if(!meta) {
                return
            }

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

        /* ====================<article_status_maker>==================== */
        // 这个其实没什么必要，只说为了函数风格统一
        const article_status_maker = async (post_key) => {
            const meta = await data.post_data_getter(post_key)
            if(!meta) {
                return
            }
            
            const _word = meta.post_word;
            const _time = meta.post_reading_time;

            return {_word,_time}
        }

        /* ====================<edit_history_maker>==================== */
        const edit_history_maker = async (post_key) => {
            const meta = await data.post_data_getter(post_key)
            if(!meta) {
                return
            }
            
            const _date = meta.post_date;
            const _update = meta.post_update;

            return {_date,_update}            
        }

        /* ====================<related_post_maker>==================== */
        // [AI修改] 相关文章改为运行期懒加载：进文章页时异步算，不占构建期
        // 建索引只做一次(按post.json的标题/分类/标签)，结果按文章缓存；MiniSearch动态引入避免进主包
        let related_index = null
        const related_cache = new Map()

        // MiniSearch 中文分词器：英文/数字整体保留，中文拆单字+相邻两字拼bigram
        const tokenize_cn = (text) => {
            const spaced = String(text)
                .replace(/[a-zA-Z0-9]+/g, ' $& ')
                .replace(/[\u4e00-\u9fff]/g, ' $& ')
                .toLowerCase()
            const words = spaced.split(/\s+/).filter(Boolean)
            const bigrams = []
            for (let i = 0; i < words.length - 1; i++) {
                const p = words[i] + words[i + 1]
                if (/^[\u4e00-\u9fff]{2}$/.test(p)) bigrams.push(p)
            }
            return [...words, ...bigrams]
        }

        const compute_related = async (post_key, title) => {
            const title_lower = String(title).toLowerCase()
            if(!related_index) {
                const MiniSearch = (await import('minisearch')).default        // 懒加载，首用才引入
                const table = await data.post_raw_getter()               // 复用全表缓存，不重复请求
                const index = new MiniSearch({
                    fields: ['title', 'category', 'tags'],
                    storeFields: ['title', 'date'],
                    tokenize: tokenize_cn,
                })
                index.addAll(Object.entries(table).map(([id, m]) => ({
                    id,
                    title: m.title || id,
                    category: m.category || '',
                    tags: (m.tags || []).join(' '),
                    date: m.date || '',
                })))
                related_index = index
            }
            return related_index
                .search(title_lower, { boost: { title: 3 } })
                .filter((r) => r.id !== post_key)                              // 排除自身
                .slice(0, 3)
                .map((r) => r.id)
        }

        const related_post_maker = async (post_key) => {
            const meta = await data.post_data_getter(post_key)
            if(!meta) {
                return
            }

            let ids = related_cache.get(post_key)                              // 命中缓存直接返回
            if(!ids) {
                ids = await compute_related(post_key, meta.post_title ?? '')
                related_cache.set(post_key, ids)                               // [AI优化] 打缓存，重进不再算
            }

            return {_related: ids}
        }

        return {
            // [AI修改] 撤掉getter转发：全表+getter都在data层parser的返回值里，RelatedPosts改走data层
            post_nav_maker,
            article_status_maker,
            edit_history_maker,
            related_post_maker,
        }
    }
    return {
        share_maker,
        toast_maker,
        useful_maker,
        mermaid_maker,
        frontmatter_parser,
        scroll_to_top,
        reading_progress,
    }
})()
