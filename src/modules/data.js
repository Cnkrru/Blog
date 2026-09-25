import axios from "axios";

/* [AI实现] 数据层：所有页面/store统一从这里拿原始数据，不掺业务加工
* [AI改造] IIFE 立即执行，模块加载时只建一次，data 全局单例（等效原 pinia 的 useDataStore 单例）
*/
export const data = (() => {

    /* ====================<IPAPI ipinfo>==================== */
    /*
    * id: IP数据获取函数
    * fn: 用axios从公共IP服务获取到IP地址
    */
    const ip_data_getter = async () => {
        try{
            const ip = await axios.get('https://ipinfo.io/json')
            const ip_data = ip.data
            console.log(`[INFO]:IP数据获取成功,状态码${ip.status}`)
            return ip_data
        }
        catch {
            console.error('[ERR]:IP数据获取失败')
        }
    }
    
    /* ====================<天气API open-meteo>==================== */
    /*
    * id: 天气获取函数 [AI迁移]（原api.js）
    * fn: 用公开的API获取，需要IPAPI获取的经纬度数据lat，lon
    */
    const weather_data_getter = async () => {
        const ip = await ip_data_getter();
        const ip_data = ip

        const lat = ip_data.loc.split(',')[0]
        const lon = ip_data.loc.split(',')[1]

        try {
            const weather = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`)
            const weather_data = weather.data
            console.log(`[INFO]:天气数据获取成功,状态码${weather.status}`)
            return weather_data
        }
        catch {
            console.error('[ERROR]:天气数据获取失败')
        }
    }

    /* ====================<post_json>==================== */
    let meta_cache_flag = null   // post.json缓存

    /*
    * id: 整表getter
    * fn: 拉取/缓存post.json全表，返回整张表(原始数据raw)
    */
    const post_raw_getter = async () => {
        try{
            const meta = await axios.get('/config/post.json')
            meta_cache_flag = meta.data
            if(meta_cache_flag) {
                console.log('[INFO]:已经获取到post.json的数据')
            }
        }
        catch {
            console.error('[ERR]:未获取到post.json全表')
        }
        return meta_cache_flag ?? {}
    }

    /*
    * id: 单篇字段getter
    * fn: 复用整表getter拿缓存，按key取该篇并拆解析字段返回值
    */
    const post_data_getter = async (post_key) => {
        await post_raw_getter()   // 复用整表getter确保已拿全表，不重复发请求
        const post_meta = meta_cache_flag?.[post_key]
        if(!post_meta) {
            console.error('[ERR]:未获取到数据')
            return null
        }

        // 文章排序和标题
        const post_order = post_meta.order
        const post_title = post_meta.title
        // 文章的三种日期
        const post_date = post_meta.date
        const post_update = post_meta.updated
        const post_history = post_meta.history
        // 文章分类与标签
        const post_category = post_meta.category
        const post_tag = post_meta.tags
        // 文章SEO相关
        const post_des = post_meta.description
        const post_keywords = post_meta.keywords
        // 文章字数统计以及阅读时间估计
        const post_word = post_meta.word_count
        const post_reading_time = post_meta.reading_time

        return {
            post_order,post_title,
            post_date,post_update,post_history,
            post_category,post_tag,
            post_des,post_keywords,
            post_word,post_reading_time,
        }
    }

    /* ====================<link_json>==================== */
    let link_cache_flag = null   // links.json缓存

    /*
    * id: 友链原始数据getter
    * fn: 拉取/缓存link.json，返回原始一维数组；分桶清洗交给page.js的link cleaner
    */
    const link_data_get = async () => {
        try{
            const link = (await axios.get('/config/links.json')).data // [AI修复] link已是数据本体(剥掉axios壳)，不能再.data
            link_cache_flag = link
            return link_cache_flag
        }
        catch {
            console.error('[ERR]:未获取到link.json')
            return []
        }
    }

    return {
        ip_data_getter,
        weather_data_getter,

        post_raw_getter,
        post_data_getter,
        
        link_data_get,
    }
})()
