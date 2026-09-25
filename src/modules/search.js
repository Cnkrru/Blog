import { ref, reactive } from "vue";
import MiniSearch from "minisearch";
import { data } from "@/modules/data.js";

/* [AI改造] IIFE 立即执行，模块加载时只建一次，search 全局单例（等效原 pinia 的 useSearchStore 单例）
*   reactive 包裹 return：让返回对象的 ref 点访问时自动解包（等效原 pinia 行为）
*/
export const search = (() => {

    /* ====================<顶层响应式状态>==================== */
    const results = ref([])         // 搜索结果（数据层，UI显隐交给组件）
    const indexReady = ref(false)   // 索引是否建立完成
    const loading = ref(false)      // 是否正在构建索引

    /* ====================<运行时私有（闭包持有，非响应式）>==================== */
    let index = null                // MiniSearch 实例
    let docs_cache = []             // post.json 清洗后的可索引文档缓存
    let built = false               // 索引是否已构建（避免重复构建）

    /* ====================<工人：索引构建>==================== */
    // 清洗工：把 post.json 全表转成 minisearch 可索引的文档数组
    const cleaner = (table) => Object.entries(table).map(([key, m]) => ({
        id: key,
        title: m?.title || '',
        category: m?.category || '未分类',
        tags: Array.isArray(m?.tags) ? m.tags : [],
        date: m?.date || '',
    }))

    // 构建工：new 一个 MiniSearch 并灌入文档
    // [AI实现] 自定义分词器：默认按标点/空格分词外，把中文片段再切成 2-gram，
    //   使中文子串/中后段词也能命中（否则整段中文被当作一个 token，前缀匹配失败）
    const tokenize_cn = (text) => {
        const words = String(text ?? '').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean)
        const tokens = new Set(words)                      // 保留整词（英文/拼音/数字按词走）
        words.forEach(w => {
            if (/[\u4e00-\u9fff]/.test(w) && w.length > 1) {  // 含中文且不止一个字 → 补 2-gram
                for (let i = 0; i < w.length - 1; i++) tokens.add(w.slice(i, i + 2))
            }
        })
        return [...tokens]
    }

    const builder = () => {
        index = new MiniSearch({
            fields: ['title', 'category', 'tags', 'date'],      // 参与检索的字段
            storeFields: ['id', 'title', 'category', 'tags', 'date'],  // 检索结果里返回的字段
            tokenize: tokenize_cn,                            // [AI实现] 中文 2-gram 分词
            searchOptions: {
                boost: { title: 3, tags: 2, category: 1, date: 1 },  // 标题权重最高
                fuzzy: 0.2,        // 容错匹配
                prefix: true,      // 允许前缀匹配
                combineWith: 'OR', // 多个 token 命中任一即可，提升召回
            },
        })
        index.addAll(docs_cache)
        indexReady.value = true
        built = true
    }

    // 初始化工：取 data.js 的 post 全表 → 清洗 → 构建索引（只构建一次）
    const initIndex = async () => {
        if (built) return
        loading.value = true
        try {
            const table = await data.post_raw_getter()
            docs_cache = cleaner(table)
            builder()
        } finally {
            loading.value = false
        }
    }

    /* ====================<工人：检索>==================== */
    // 检索工：空词清空，非空则用 minisearch 查，最多取前 10 条
    const doSearch = (keyword) => {
        const q = (keyword || '').trim()
        if (!q) { results.value = []; return }
        if (!index) { results.value = []; return }
        results.value = index.search(q).slice(0, 10)
    }

    // 清理工：清空结果
    const clear = () => { results.value = [] }

    return reactive({ results, indexReady, loading, initIndex, doSearch, clear })
})()