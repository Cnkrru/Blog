import { ref } from 'vue'

export const footer = () => {
    const ref_webAge = ref('') 
    const webAge = () => {
        let timer = null

        const tick = () => {
            const init_date = new Date('2023-01-01');
            const current_date = new Date();
            const diff_time = current_date - init_date;
            const year = Date.prototype.getFullYear.call(new Date(diff_time))-1970;
            const month = Date.prototype.getMonth.call(new Date(diff_time));
            const day = Date.prototype.getDate.call(new Date(diff_time)) - 1;
            const hours = Date.prototype.getHours.call(new Date(diff_time));
            const minutes = Date.prototype.getMinutes.call(new Date(diff_time));
            const seconds = Date.prototype.getSeconds.call(new Date(diff_time));

            ref_webAge.value = `${year} 年 ${month} 月 ${day} 天 ${hours} 时 ${minutes} 分 ${seconds}秒`  
        }
        
        const start = () => {
            if(timer) return
            tick()
            timer = setInterval(tick,1000)
        }

        const stop = () => {
            clearInterval(timer)
            timer = null
        }

        return {
            ref_webAge,
            start,
            stop
        }
    }

    const printPdf = () => {
        window.print()
    }

    return {
        ref_webAge,
        webAge,
    
        printPdf
    }
}