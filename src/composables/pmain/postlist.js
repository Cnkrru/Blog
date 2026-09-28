import { ref } from 'vue'

// [AI迁移] 去内层 computer/render 壳：工厂保留（posts 为每页专属实例，避免路由残留），函数平铺在工厂返回里
export const postList = (posts) => {

    const post_page_num = ref(0);
    const post_now_page = ref(1);
    const post_list = ref([])  
    // [AI编写] 分页按钮窗口：只存"当前页上下各两页"的页码，避免全量渲染按钮
    const post_page_list = ref([])  

    // 流水线导出的全局变量
    const post_nums = 6;

    /* =====<数据清洗与统计>===== */
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

    /* =====<UI 交互与渲染派生>===== */
    // post管线UI更新
    const render = (n) => {
        post_list.value = posts.slice(post_nums*(n-1),post_nums*n)
        if(n >=1 && n <= post_page_num.value) {
            post_now_page.value = n
            page_window(n)      // [AI编写] 切页时同步刷新按钮窗口
        }
    }

    return {
        computer,
        render,
        post_page_num,
        post_now_page,
        post_list,
        post_page_list,
    }
}