import { ref } from 'vue'
import axios from 'axios'          // 补 axios import，fix: link 工厂 data() 里 new axios 直接 ReferenceError

let cache = null   // links.json缓存
let links = [];
export const link_page_names = ref([])
export const link_now_page = ref(1)
export const link_page_items = ref([])
export const link_page_num = ref(0)

/* =====<数据清洗与统计>===== */
// 拉取/缓存 links.json
export const data = async () => {
    if(cache) return cache
    try{
        const res = await axios.get('/config/links.json')
        cache = res.data
        return cache
    }
    catch {
        console.error('[ERR]:未获取到link.json')
        return []
    }
}

// 清洗数据
export const clean = (raw) => {
    if(!links) return

    const link_map = new Map();                     // 创建link数据中间字典
    raw.forEach(link => {                           // 遍历原始数据，如果没有category桶，创建一个
        if(!link_map.has(link.category)) {
            link_map.set(link.category,[])
        }
        link_map.get(link.category).push(link)      // 把遇到的类别压入这个类别桶里
    })

    // 转换数据容器格式
    links = Array.from(link_map,([name,links]) => ({name,links}))
    link_page_items.value = links[link_now_page.value - 1];
    link_page_names.value = links.map(category => category.name);
    link_page_num.value = link_page_names.value.length;
}

/* =====<UI 交互与渲染派生>===== */
// UI更新
export const render = (page) => {
    if(page >= 1 && page <= link_page_num.value) {
        link_now_page.value = page;
        link_page_items.value = links[link_now_page.value - 1];
    }
}