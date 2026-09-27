export const data = () => {
    const ip = async () => {
        try{
            const _ip = await axios.get('https://ipinfo.io/json')
            const ip_data = _ip.data
            console.log(`[INFO]:IP数据获取成功,状态码${ip.status}`)
            return ip_data
        }
        catch {
            console.error('[ERR]:IP数据获取失败')
        }
    }
    
    const weather = async () => {
        const _ip = await ip();
        const ip_data = _ip

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

    const post = () => {
        let cache = null   // post.json缓存
    
        const raw = async () => {
            if(!cache) return

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

        const data = async (post_key) => {
            await raw()
            const post_meta = cache?.[post_key]
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
        
            return {raw,data}
        }
    }

    const link = () => {
        let cache = null

        const raw = async () => {
            if(!cache) return

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

        return {cache,raw}
    }   
    
    return {ip,weather,buSuanZi,post,link}
}