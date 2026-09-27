import { ref, reactive } from "vue";

/* [AI改造] IIFE 立即执行，模块加载时只建一次，page 全局单例（等效原 pinia 的 usePageStore 单例）
*   reactive 包裹 return：让返回对象的 ref 点访问时自动解包（等效原 pinia 行为）
*/
export const page = (() => {
    
    /* ====================<post数据工厂>==================== */
    let posts = []          // 清洗完的数据，全局缓存一份

    const post_page_num = ref(0);
    const post_now_page = ref(1);
    const post_list = ref([])  
    // [AI编写] 分页按钮窗口：只存"当前页上下各两页"的页码，避免全量渲染按钮
    const post_page_list = ref([])  
    
    // [AI新增] 页面顶部标题栏(代码标题)状态：Post页fetch到文章标题后写入，MainHeader读取展示
    const head_title = ref('');
    const set_head_title = (t) => { head_title.value = t };

    // [AI新增] 移动端侧边栏抽屉开合状态：p-header 汉堡按钮开关，Sidebar 据此划出/收起
    const sidebar_open = ref(false);

    // [AI新增] 静态页面标题映射：route.js 不再配 meta.title，标题统一在本模块定义（MainHeader 按 route.name 读取）
    const page_titles = {
        Index: '首页',
        Posts: '文章',
        Post: '文章',
        About: '关于',
        Archives: '归档',
        Tag: '标签',
        Link: '友链',
        LinkApply: '友链申请',
        Setting: '设置',
        NotFound: '404',
    };  
    
    const category_mode_groups = ref([])
    const category_expand_group = ref(null);

    const tag_now_item = ref(null);
    const tag_set = ref(new Set());
    const tag_posts_list = ref([]);
    
    const post_factory = () => {
        
        /*
        * id: 数据清洗者
        * fn: 把链接按照category字段分组压入新的数据容器里
        */  
        const cleaner = (raw) => {
            // 缓存检查，如果缓存非空，直接读缓存
            if(!posts) return
            // 步骤1：将数据kv反转存入中间对象
            const order_map = Object.create(null);                              // 创建空对象
            Object.entries(raw).forEach(([k,v]) => {order_map[v.order] = k});   // 遍历原始数据，将value的order字段与key交换
            // 步骤2：遍历中间对象，将values取出来压入数组里
            const keys = Object.values(order_map).filter(Boolean);              // 把order_map的values取出来存到keys中间值，过滤掉空值
            posts = [];                                                         // 清空缓存
            keys.forEach(key => {                                               // 遍历keys
                const meta = raw[key]                                           // 把keys每个子项的数据取出来，存在meta
                posts.push({                                                    // 把meta的数据压入数组，一组数据为一个子{}
                    key,
                    title: meta.title,
                    date: meta.date,            // [AI修复] 字段名应为 date（原data）
                    category: meta.category,
                    tags: meta.tags             // [AI修复] 原数组丢失，改为整传标签数组（原错写 Array.isArray）
                })
            })
        }

        /* ====================<post数据管线>==================== */
        const post_line = () => {
            // 流水线导出的全局变量
            const post_nums = 6;

            // post管线计算
            const computer = () => {post_page_num.value = Math.max(1, Math.ceil(posts.length / post_nums))};

            /*
            * [AI编写] 分页窗口计算（行业标配：首尾页固定 + 当前页上下各2页 + 省略号占位）
            * fn: 给定当前页 n 与总页数 total，生成页码序列；相邻页码间空档用 '···' 占位
            * 例: total=20, n=1  -> [1,2,3,'···',20]
            *     total=20, n=10 -> [1,'···',8,9,10,11,12,'···',20]
            * 越界页码自动裁剪；首尾页永远在，保证任何位置都能跳回第一/最后一页
            */
            const page_window = (n) => {
                const total = post_page_num.value
                const set = new Set([1, total])                 // 首尾页固定
                for(let p = n - 2; p <= n + 2; p++) {           // 当前页窗口
                    if(p >= 1 && p <= total) set.add(p)
                }
                const sorted = [...set].sort((a,b) => a - b)    // 升序
                const list = []
                for(let i = 0; i < sorted.length; i++) {
                    if(i > 0 && sorted[i] - sorted[i-1] > 1) list.push('···')   // 空档插省略号
                    list.push(sorted[i])
                }
                post_page_list.value = list
            }

            // post管线UI更新
            const updater = (n) => {
                post_list.value = posts.slice(post_nums*(n-1),post_nums*n)
                if(n >=1 && n <= post_page_num.value) {
                    post_now_page.value = n
                    page_window(n)      // [AI编写] 切页时同步刷新按钮窗口
                }
            }

            return {
                computer,
                updater
            }
        }

        /* ====================<category数据管线>==================== */
        const category_line = () => {
            
            // category管线数据计算
            const computer = (fn,sort_mode) => {
                    const map = new Map()               
                    posts.forEach(post => {                 // 遍历清洗后的数据
                        const _ = fn(post);                 // 按照指定的fn算桶的key
                        if(!map.has(_)) {                   
                            map.set(_,[])                   // 如果指定fn的桶不存在，按照新fn创建桶
                        }
                        map.get(_).push(post)               // 不管fn是什么，把这篇文章压入当前fn桶里        
                    })

                    const items = Array.from(map.keys()).sort()     // 把类别排序
                    if(sort_mode) {
                        items.reverse()
                    }

                    return items.map(k => ({name:k , items: map.get(k)}))
                }
           
            const updater = () => {
                // 分组视图切换函数
                const view_turner = (mode) => {
                    if(mode === 0) {                    
                        category_mode_groups.value = computer(a => a.category, false)
                    }
                    else if(mode === 1) {
                        category_mode_groups.value = computer(a => a.date.slice(0,4), true)
                    }
                    else if(mode === 2 ) {
                        category_mode_groups.value = computer(a => a.date.slice(0,7), true)
                    }
                }

                // 展开组别切换函数
                const group_turner = (group) => {
                    if(category_expand_group.value === group) {
                        category_expand_group.value = null;            // 如果已经展开，则收起来
                    }
                    else {
                        category_expand_group.value = group;           // 没展开，把这一组的打开
                    }
                }

                return {
                    view_turner,
                    group_turner,
                } 
            }

            return {
                updater,
            }
        }
        
        /* ====================<tag数据管线>==================== */
        const tag_line = () => {
          
            const computer = () => {posts.forEach(post => {post.tags.forEach(_ => tag_set.value.add(_));})}
            
            const updater = (tag) => {
                if(tag_now_item.value === tag) {
                    tag_now_item.value = null;
                    tag_posts_list.value = [];
                }
                else {
                    tag_now_item.value = tag;
                    tag_posts_list.value = posts
                        .filter(a => a.tags.includes(tag))
                        .slice()
                        .sort((a,b) => b.date.localeCompare(a.date))
                }
            }

            return {
                computer,
                updater,
            }
        }
    
        return {
            cleaner,
            post_line,
            category_line,
            tag_line,
        }
    }

    /* ====================<link数据工厂>==================== */
    let links = [];
    const link_page_names = ref([])
    const link_now_page = ref(1)
    const link_page_items = ref([])
    const link_page_num = ref(0)

    const link_factory = () => {

        // 清洗数据
        const cleaner = (raw) => {
            // 缓存检查
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
        }

        // 数据计算
        const computer = () => {
            link_page_items.value = links[link_now_page.value - 1];
            link_page_names.value = links.map(category => category.name);
            link_page_num.value = link_page_names.value.length;
        }

        // UI更新
        const updater = (page) => {
            if(page >= 1 && page <= link_page_num.value) {
                link_now_page.value = page;
            }
        }

        return {
            cleaner,
            computer,
            updater,
        }
    }

    /* ====================<date数据工厂>==================== */
    const years = ref([]);
    const year_data = ref([]);
    const months_data = ref([])
    const selected_month = ref(null);
    const selected_year = ref(null);
    const open_year = ref(false);
    const open_month = ref(false);
    const days_data = ref(0)


    const date_factory = () => {
        let date_map = new Map();
        
        // 
        const cleaner = (raw) => {
            // 日期检查者
            const date_checker = (raw_data) => {
                const date = String(raw_data).trim().slice(0,10);
                return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null
            }
            // 日期分类者
            const date_category = (data,category) => {
                const date = date_checker(data)
                if(!date) return
                if (!date_map.has(date)) {
                    date_map.set(date,{publish:0,updated:0,history:0,})
                } 
                date_map.get(date)[category]++
            }

            date_map.clear()                                // 清一次上次运行时算好的缓存                               
            Object.values(raw).forEach(meta => {
                date_category(meta.date, 'publish');        
                date_category(meta.updated, 'updated')
                ;(meta.history ?? []).forEach(items => date_category(items,'history'))   
            })
        }

        // 
        const computer = () => {
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

            return {
                year,month
            }
        }

        const updater = () => {
            const toggle_year = () => {
                open_year.value = !open_year.value 
                open_month.value = false
            }

            const toggle_month = () => {
                open_month.value = !open_month.value
                open_year.value = false
            }
            
            
            const set_year = (year) => {
                computer().month(year);                          
                selected_year.value = year;
                open_year.value = false;
                const _month = months_data.value?.findLast(m => m.days.some(d => d.activity > 0)) ?? months_data.value?.[0]
                set_month(_month?.month ?? null)
            }

            const set_month = (month) => {
                selected_month.value = month;
                open_month.value = false;
                days_data.value = months_data.value.find(m => m.month === selected_month.value)
            }

            const init = (data) => {
                cleaner(data)
                computer().year()
                set_year(years.value[0])
            }

            return {
                toggle_year,
                toggle_month,
                set_year,
                set_month,
                init,
            }
        }

        return {
            cleaner,
            computer,
            updater,
        }
    }

    return reactive({
        posts,
        head_title,
        set_head_title,
        sidebar_open,
        page_titles,
        post_page_num,
        post_now_page,
        post_list,
        post_page_list,
        category_mode_groups,
        category_expand_group,
        tag_now_item,
        tag_set,
        tag_posts_list,
        post_factory,

        links,
        link_page_names,
        link_now_page,
        link_page_items,
        link_page_num,        
        link_factory,

        years,
        year_data,
        months_data,
        days_data,
        selected_year,
        selected_month,
        open_year,
        open_month,
        date_factory,
    })
})()