import { ref, reactive } from "vue";   // [AI改造] reactive: typewriter 工厂返回对象被 i_Welcome 模板点访问，需解包 ref
// [修] 删除无效导入：vue-router 不导出 `_`，且与下方局部变量 `_` 重名，纯属干扰

/* [AI改造] IIFE 立即执行，模块加载时只建一次，effect 全局单例（等效原 pinia 的 useEffectStore 单例） */
export const effect = (() => {
    /* ====================<打字机特效>==================== */
    /*
    * id: 打字机工厂
    * fn: 工厂模式，这个本来不需要，这里当练手了，之后可以通用的功能都用工厂模式写
    */
    const effect_typewriter_marker = () => {
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

        /*
        * id: 任务调度器
        * fn: 任务控制，给setTimeoout封装一层清除残留定时器
        */        
        const manager = (fn,delay) => {
            if(timer) {clearTimeout(timer)}
            timer = setTimeout(fn,delay)
        }        

        /*
        * id: 打字机
        * fn: 实现特效的函数
        */
        const tw = () => {
            const _ = texts[string_index]

            if(is_increasing) {
                char_index++;
                tw_string.value = _.slice(0,char_index);
                // 反转打印方向，延时loop_speed后重新执行tw
                if(char_index === _.length) {
                    is_increasing = false;
                    manager(tw,loop_speed)
                    return
                }
                // 正向打字+type_speed延时
                manager(tw,type_speed)
            }
            else {
                char_index--;
                tw_string.value = _.slice(0,char_index);
                // 反转打印方向，延时loop_speed后重新执行tw
                if(char_index === 0) {
                    is_increasing = true;
                    string_index = (string_index + 1) % texts.length                // 学到了，很精妙
                    manager(tw,loop_speed)
                    return
                }
                // 反向打字+delete_speed延时
                manager(tw,delete_speed)
            }
        }

        /*
        * id: 生命周期结束
        * fn: 清除残留定时器，结束打字机生命周期
        */
        const stop = () => {
            if (timer) { clearTimeout(timer); timer = null }
        }

        /*
        * id: 初始化
        * fn: 初始化参数
        */
        const start = (sentence_arr, { typeSpeed = 100, deleteSpeed = 40, pauseMs = 3000 } = {}) => {  // [修] 解构默认值：原来不传参时会把默认值覆盖成 undefined，定时器延时失效
            stop()
            texts = [...sentence_arr]
            type_speed = typeSpeed
            delete_speed = deleteSpeed
            loop_speed = pauseMs
            string_index = 0
            char_index = 0
            tw_string.value = ''
            is_increasing = true
            timer = setTimeout(tw, 100)
        }

        return reactive({
            tw_string,
            start,
            stop,
        })
    }

    /* ====================<鼠标拖尾特效>==================== */
    /*
    * id: 鼠标拖尾
    * fn: 实现鼠标拖尾效果(这个不需要工厂，直接全局挂就行)
    */
    const effect_mouse_maker = () => {

    }

    /* ====================<首页粒子特效>==================== */
    /*
    * id: 粒子特效制造者
    * fn: 实现粒子特效的函数
    */
    const effect_particle_maker = () => {
        let canvas = null           // canvasHTML
        let width = 0               // 画布宽
        let height = 0              // 画布高
        let ctx = null              // context，canvas上下文，画笔
        
        let particles = []          // 粒子数组
        let current_color = null    // 粒子颜色

        let mouse =null             // 鼠标对象
        let link_distance = 180     // 连接长度阈值
        
        let raf = null              // requestAnimationFrame动画帧

        /*
        * id: 获取主题色
        * fn: 把canvas能接收到的CSS变量的对应CSS属性拿出来
        */
        const get_color = () => getComputedStyle(canvas).getPropertyValue('--g-color').trim() 
        
        /*
        * id: #aabbcc 转为 RGBA
        * fn: 给颜色增加一个透明度
        */        
        const to_rgba = (hex,opacity) => {
            const _hex = hex.replace('#','');
            const r = parseInt(_hex.slice(0,2),16)
            const g = parseInt(_hex.slice(2,4),16)
            const b = parseInt(_hex.slice(4,6),16)
            return `rgba(${r},${g},${b},${opacity})`
        }

        /*
        * id: 粒子配置者
        * fn: 粒子生成位置随机，速度随机
        */        
        const particle_configer = (canvas_width,canvas_height) => {
            return {
                x:      Math.random()*canvas_width,
                y:      Math.random()*canvas_height,
                v_x:    (Math.random() - 0.5) * 1.5,
                v_y:    (Math.random() - 0.5) * 1.5,
                radius: Math.random () * 2 + 1,
            }
        }

        /*
        * id: 单粒子运行器
        * fn: 负责单颗粒子的移动 + 绘制，每帧每粒子调用一次
        */
        const particle_runner = (particle) => {                 
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
            ctx.fillStyle = to_rgba(current_color, 0.8)                     // 给点填充颜色
            ctx.fill()
        }

        /*
        * id: 粒子间连线
        * fn: 全局扫一遍所有粒子对，距离够近就画线，每帧调用一次
        */
        const particle_connect_particle = () => {                 
            for(let i=0 ; i < particles.length ; i++) {
                const particle_1 = particles[i];                    // 粒子1
                for(let j = i + 1 ; j < particles.length ; j++) {
                    const particle_2 = particles[j];                // 粒子2
                    const dx = particle_1.x - particle_2.x          // 算粒子间水平距离
                    const dy = particle_1.y - particle_2.y          // 算粒子间竖直距离
                    const _distance = Math.hypot(dx,dy)             // 算两个粒子间的距离

                    if(_distance < link_distance) {                 // 如果粒子间距小于link距离，则画线
                        ctx.beginPath();                                                            // 开始画连线
                        ctx.strokeStyle = to_rgba(current_color, 1 - _distance / link_distance)     // 连线颜色随着两点间距变大，透明度增加
                        ctx.lineWidth = 1;                                                          // 线宽
                        ctx.moveTo(particle_1.x,particle_1.y)                                       // 路径起点
                        ctx.lineTo(particle_2.x,particle_2.y)                                       // 路径终点
                        ctx.stroke()                                                                // 填充
                    }
                }
            }
        }

        /*
        * id: 鼠标连线
        * fn: 离光标最近的 8 颗粒子朝鼠标拉线，每帧调用一次
        */
        const particle_connect_mouse = () => {              
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
                ctx.strokeStyle = to_rgba(current_color, 1 - _particle_obj.distance / link_distance)
                ctx.beginPath()
                ctx.moveTo(particle.x,particle.y)
                ctx.lineTo(mouse.x , mouse.y)
                ctx.stroke()
            }    
        }

        /* ====================<画布配置>==================== */
        const canvas_configer = () => {
            const DPR = Math.min(devicePixelRatio, 2);
            const vw = document.documentElement.clientWidth;
            const vh = document.documentElement.clientHeight;
            
            canvas.width = vw*DPR
            canvas.height = vh*DPR
            ctx.setTransform(DPR,0,0,DPR,0,0)
            width = vw;
            height = vh;

            particles = Array.from({length:80},() => particle_configer(width,height))
        }
        
        /* ====================<鼠标/触摸事件>==================== */
        // 鼠标移动参数
        const mouse_move = (_) => {
            mouse = {
                x:_.clientX,
                y:_.clientY,
            }
        }
        // 鼠标停止参数
        const mouse_leave = () => {
            mouse = null
        }
        // 触摸参数
        const touch_move = (_) => {
            if(_.touches.length > 0) {
                mouse = {
                    x:_.touches[0].clientX,
                    y:_.touches[0].clientY
                }
            }
        }
        // 触摸结束
        const touch_leave = () => {
            mouse = null;
        }

        /*
        * id: 清理器
        * fn: 停掉动画帧 + 解绑事件，清空粒子
        */
        const particle_cleaner = () => {
            if(raf) {
                cancelAnimationFrame(raf);
                raf = null;
            }
            window.removeEventListener('resize', canvas_configer) 
            window.removeEventListener('mousemove', mouse_move)
            window.removeEventListener('mouseleave', mouse_leave)
            window.removeEventListener('touchmove', touch_move)
            window.removeEventListener('touchend', touch_leave)

            particles = [];
            mouse = null;
        }

        /*
        * id: 主循环
        * fn: 每帧：取主题色 → 清屏 → 粒子移动绘制 → 粒子连线 → 鼠标连线
        */
        const tick = () => {
            current_color = get_color();
            ctx.clearRect(0,0,width,height);
            particles.forEach((particle) => { particle_runner(particle) })
            particle_connect_particle()
            particle_connect_mouse()
            raf = requestAnimationFrame(tick)
        }

        /*
        * id: 启动
        * fn: 初始化画布与事件，开始主循环
        */
        const effect_start = (html_el) => {                     
            canvas = html_el;
            ctx    = canvas.getContext('2d');
            canvas_configer()

            window.addEventListener('resize', canvas_configer)
            window.addEventListener('mousemove', mouse_move)
            window.addEventListener('mouseleave', mouse_leave)
            window.addEventListener('touchmove', touch_move, { passive: true })
            window.addEventListener('touchend', touch_leave)                
            tick()
        }

        return {
            particle_cleaner,
            effect_start,
        }
    }

    return {
        effect_typewriter_marker,
        effect_mouse_maker,
        effect_particle_maker,
    }
})()
