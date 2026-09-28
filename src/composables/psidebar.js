import axios from "axios";
import { ref } from "vue";

/* ====================<抽屉开关>==================== */
export const sidebar_open = ref(false)
export const toggle_sidebar = () => { sidebar_open.value = !sidebar_open.value };

/* ====================<ip>==================== */
export const ip =  () => {
    const ref_city = ref('')

    const data = async () => {
        try{
            const _ip = await axios.get('https://ipinfo.io/json')
            const ip_data = _ip.data
            console.log(`[INFO]:IP数据获取成功,状态码${_ip.status}`)
            ref_city.value = ip_data.city;
            return ip_data
        }
        catch {
            console.error('[ERR]:IP数据获取失败')
            return null
        }
    }

    return {ref_city,data}
}

/* ====================<weather>==================== */    
export const weather = () => {
    const ref_weartherNum = ref(0)

    const data = async () => {
        const _ip = await ip().data();                         // 复用 ip 数据拿 loc，不重复请求
        if(!_ip?.loc) {                                 
            console.error('[ERR]:IP数据获取失败,天气请求取消')
            return
        }

        const lat = _ip.loc.split(',')[0]
        const lon = _ip.loc.split(',')[1]

        try {
            const weather = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`);
            const weather_data = weather.data;
            console.log(`[INFO]:天气数据获取成功,状态码${weather.status}`);
            ref_weartherNum.value = weather_data.current.temperature_2m;
        }
        catch {
            console.error('[ERROR]:天气数据获取失败')
        }
    }

    return {ref_weartherNum,data}
}

/* ====================<buSuanZi>==================== */     
export const script = () => {
    if (document.getElementById('bsz-script')) return
    const s = document.createElement('script')
    s.id = 'bsz-script'
    s.async = true
    s.defer = true
    s.src = 'https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js'
    document.body.appendChild(s)
}

export const open = () => {
    document.querySelector('.bsz-box').showModal()
}

export const close = () => {
    document.querySelector('.bsz-box').close()
}