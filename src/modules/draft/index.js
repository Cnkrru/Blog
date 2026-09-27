export const index = () => {
    const typeWrite = () => {
        // 工厂参数
        let texts = [];
        let string_index = 0;
        let char_index = 0;
        let is_increasing = true;
        let timer = null;
        let type_speed = 100;
        let delete_speed = 40;
        let loop_speed =3000;
        const tw_string = ref('');

          
        const manager = (fn,delay) => {
            if(timer) {clearTimeout(timer)}
            timer = setTimeout(fn,delay)
        }        

        const worker = () => {
            const _ = texts[string_index]

            if(is_increasing) {
                char_index++;
                tw_string.value = _.slice(0,char_index);
                // 反转打印方向，延时loop_speed后重新执行tw
                if(char_index === _.length) {
                    is_increasing = false;
                    manager(worker,loop_speed)
                    return
                }
                // 正向打字+type_speed延时
                manager(worker,type_speed)
            }
            else {
                char_index--;
                tw_string.value = _.slice(0,char_index);
                // 反转打印方向，延时loop_speed后重新执行tw
                if(char_index === 0) {
                    is_increasing = true;
                    string_index = (string_index + 1) % texts.length                // 学到了，很精妙
                    manager(worker,loop_speed)
                    return
                }
                // 反向打字+delete_speed延时
                manager(worker,delete_speed)
            }
        }

        const init = (sentence_arr, typeSpeed, deleteSpeed, pauseMs) => {
            texts = sentence_arr
            type_speed = typeSpeed
            delete_speed = deleteSpeed
            loop_speed = pauseMs
            string_index = 0
            char_index = 0
            tw_string.value = ''
            is_increasing = true
            timer = setTimeout(worker, 100)
        }

        return {tw_string,init}
    }

    const particles = () => {
        let canvas = null           // canvasHTML
        let width = 0               // 画布宽
        let height = 0              // 画布高
        let ctx = null              // context，canvas上下文，画笔
        
        let particles = []          // 粒子数组
        let current_color = null    // 粒子颜色

        let mouse =null             // 鼠标对象
        let link_distance = 180     // 连接长度阈值
        
        let raf = null              // requestAnimationFrame动画帧

        const color = () => getComputedStyle(canvas).getPropertyValue('--g-color').trim() 
        
        const toRgba = (hex,opacity) => {
            const _hex = hex.replace('#','');
            const r = parseInt(_hex.slice(0,2),16)
            const g = parseInt(_hex.slice(2,4),16)
            const b = parseInt(_hex.slice(4,6),16)
            return `rgba(${r},${g},${b},${opacity})`
        }

        // 粒子配置      
        const pConfiger = (canvas_width,canvas_height) => {
            return {
                x:      Math.random()*canvas_width,
                y:      Math.random()*canvas_height,
                v_x:    (Math.random() - 0.5) * 1.5,
                v_y:    (Math.random() - 0.5) * 1.5,
                radius: Math.random () * 2 + 1,
            }
        }

        // 单粒子运行
        const runner = (particle) => {                 
            particle.x += particle.v_x;                         // 粒子水平方向不断移动v_x
            particle.y += particle.v_y;                         // 粒子竖直方向不断移动v_y
            if(particle.x < 0 || particle.x > width) {          // 水平方向触边反弹
                particle.v_x = - particle.v_x                   
            }   
            if(particle.y < 0 || particle.y > height) {         // 竖直方向触边反弹
                particle.v_y = - particle.v_y
            }            

            ctx.beginPath()                                                 // 开始画
            ctx.arc(particle.x,particle.y,particle.radius,0,Math.PI*2)      // 确定点的大小
            ctx.fillStyle = toRgba(current_color, 0.8)                     // 给点填充颜色
            ctx.fill()
        }

        // 粒子间连线
        const pCp = () => {                 
            for(let i=0 ; i < particles.length ; i++) {
                const particle_1 = particles[i];                    // 粒子1
                for(let j = i + 1 ; j < particles.length ; j++) {
                    const particle_2 = particles[j];                // 粒子2
                    const dx = particle_1.x - particle_2.x          // 算粒子间水平距离
                    const dy = particle_1.y - particle_2.y          // 算粒子间竖直距离
                    const _distance = Math.hypot(dx,dy)             // 算两个粒子间的距离

                    if(_distance < link_distance) {                 // 如果粒子间距小于link距离，则画线
                        ctx.beginPath();                                                            // 开始画连线
                        ctx.strokeStyle = toRgba(current_color, 1 - _distance / link_distance)     // 连线颜色随着两点间距变大，透明度增加
                        ctx.lineWidth = 1;                                                          // 线宽
                        ctx.moveTo(particle_1.x,particle_1.y)                                       // 路径起点
                        ctx.lineTo(particle_2.x,particle_2.y)                                       // 路径终点
                        ctx.stroke()                                                                // 填充
                    }
                }
            }
        }

        // 鼠标连线
        const pCm = () => {              
            // 检查鼠标是否在画布上
            if(!mouse) {
                return
            }
            // 从所有粒子中筛选出与鼠标距离小于link距离的粒子,步骤和粒子间连接一样，只不过所有粒子都算一遍
            const near_particles = particles
                .map((particle,index) => ({index,distance:Math.hypot(particle.x - mouse.x,particle.y-mouse.y)}))
                .filter(particle_obj => particle_obj.distance < link_distance)
                .sort((particle_obj_1,particle_obj_2) => particle_obj_1.distance - particle_obj_2.distance)
                .slice(0,8)
            
            // 每个符合要求的粒子都与鼠标连线
            ctx.lineWidth = 1.5
            for(const _particle_obj of near_particles) {
                const particle = particles[_particle_obj.index]
                ctx.strokeStyle = toRgba(current_color, 1 - _particle_obj.distance / link_distance)
                ctx.beginPath()
                ctx.moveTo(particle.x,particle.y)
                ctx.lineTo(mouse.x , mouse.y)
                ctx.stroke()
            }    
        }

        // 画布配置
        const cConfiger = () => {
            const DPR = Math.min(devicePixelRatio, 2);
            const vw = document.documentElement.clientWidth;
            const vh = document.documentElement.clientHeight;
            
            canvas.width = vw*DPR
            canvas.height = vh*DPR
            ctx.setTransform(DPR,0,0,DPR,0,0)
            width = vw;
            height = vh;

            particles = Array.from({length:80},() => pConfiger(width,height))
        }
        
        /* ====================<鼠标/触摸事件>==================== */
        // 鼠标移动参数
        const mouseMove = (_) => {
            mouse = {
                x:_.clientX,
                y:_.clientY,
            }
        }
        // 鼠标停止参数
        const mouseLeave = () => {
            mouse = null
        }
        // 触摸参数
        const touchMove = (_) => {
            if(_.touches.length > 0) {
                mouse = {
                    x:_.touches[0].clientX,
                    y:_.touches[0].clientY
                }
            }
        }
        // 触摸结束
        const touchLeave = () => {
            mouse = null;
        }

        // 清理器
        const stop = () => {
            if(raf) {
                cancelAnimationFrame(raf);
                raf = null;
            }
            window.removeEventListener('resize', cConfiger) 
            window.removeEventListener('mousemove', mouseMove)
            window.removeEventListener('mouseleave', mouseLeave)
            window.removeEventListener('touchmove', touchMove)
            window.removeEventListener('touchend', touchLeave)

            particles = [];
            mouse = null;
        }

        // 帧循环
        const tick = () => {
            current_color = color();
            ctx.clearRect(0,0,width,height);
            particles.forEach((particle) => {runner(particle) })
            pCp()
            pCm()
            raf = requestAnimationFrame(tick)
        }

        // 启动函数
        const start = (el) => {                     
            canvas = el;
            ctx    = canvas.getContext('2d');
            cConfiger()

            window.addEventListener('resize', cConfiger)
            window.addEventListener('mousemove', mouseMove)
            window.addEventListener('mouseleave', mouseLeave)
            window.addEventListener('touchmove', touchMove, { passive: true })
            window.addEventListener('touchend', touchLeave)                
            tick()
        }

        return {
            start,
            stop,
        }        
    }

    const hitmap = () => {
    const years = ref([]);
    const year_data = ref([]);
    const months_data = ref([])
    const selected_month = ref(null);
    const selected_year = ref(null);
    const open_year = ref(false);
    const open_month = ref(false);
    const days_data = ref(0)
    const months = ['一月', '二月', '三月', '四月', '五月', '六月','七月', '八月', '九月', '十月', '十一月', '十二月']    

    let date_map = new Map();
        
    const computer = () => {
        // 清洗数据
        const cleaner = (raw) => {
            // 日期检查者
            const checker = (raw_data) => {
                const date = String(raw_data).trim().slice(0,10);
                return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null
            }
            // 日期分类者
            const category = (data,category) => {
                const date = checker(data)
                if(!date) return
                if (!date_map.has(date)) {
                    date_map.set(date,{publish:0,updated:0,history:0,})
                } 
                date_map.get(date)[category]++
            }

            date_map.clear()                                // 清一次上次运行时算好的缓存                               
            Object.values(raw).forEach(meta => {
                category(meta.date, 'publish');        
                category(meta.updated, 'updated')
                ;(meta.history ?? []).forEach(items => date_category(items,'history'))   
            })
        }

        // 年份计算，切数据年份，统计数据有哪几年
        const year = () => {
            const year_set = new Set()               
            date_map.forEach((_,date) => year_set.add(Number(date.slice(0,4))))
            years.value = Array.from(year_set).sort((a,b) => b - a)
        } 

        // 算每一天的数据，打入days数组，days数组数据按照月份打入months数组
        const month = (year) => {
            months_data.value = []                          
            for(let m = 1; m <= 12; ++m) {             
                const days_in_month = new Date(year, m, 0).getDate();
                const days = [];
                for(let day = 1; day <= days_in_month; ++day) {  
                    const date = `${year}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                    const date_data = date_map.get(date) ?? { publish:0, updated:0, history:0 } 
                    days.push({
                        date:date,
                        activity:date_data.publish + date_data.updated + date_data.history,
                        publish:date_data.publish,
                    })
                }
                months_data.value.push({ year, month: m, days })   
            }
        }

        return {cleaner,year,month}
    }

    const render = () => {
        const level = (day) => (day.activity >= 4 ? 4 : day.activity)

        const toggleYear = () => {
            open_year.value = !open_year.value 
            open_month.value = false
        }

        const toggleMonth = () => {
            open_month.value = !open_month.value
            open_year.value = false
        }
        
        
        const setYear = (year) => {
            computer().month(year);                          
            selected_year.value = year;
            open_year.value = false;
            const _month = months_data.value?.findLast(m => m.days.some(d => d.activity > 0)) ?? months_data.value?.[0]
            setMonth(_month?.month ?? null)
        }

        const setMonth = (month) => {
            selected_month.value = month;
            open_month.value = false;
            days_data.value = months_data.value.find(m => m.month === selected_month.value)
        }

        const init = (data) => {
            computer().cleaner(data)
            computer().year()
            setYear(years.value[0])
        }

        return {
            level,
            toggleYear,
            toggleMonth,
            setYear,
            setMonth,
            init,
        }
    }

    return {computer,render}        
    }

    return {typeWrite,particles,hitmap}
}
