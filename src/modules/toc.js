import { ref } from 'vue'

/*
* toc.js —— 文章目录逻辑单例（桌面右侧栏 PostToc + 移动端工具条 MobileToc 共用）
* 职责：扫描正文标题生成 headings、scrollspy 滚动高亮、点击跳转
* 扫描源：正文滚动容器 .main-body（桌面卡片内部滚动）/ 正文 .content
* —— 2026-09：从 PostToc.vue 抽离，规避 Vue3.5 Teleport 在异步目标下的渲染异常 ——
*/
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