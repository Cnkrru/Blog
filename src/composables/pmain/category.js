import { ref } from 'vue'

export const category = (posts) => {

    const category_mode_groups = ref([])
    const category_expand_group = ref(null)

    /* =====<数据清洗与统计>===== */
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

    /* =====<UI 交互与渲染派生>===== */
    // 分组视图切换函数
    const viewTurner = (mode) => {
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
    const groupTurner = (group) => {
        if(category_expand_group.value === group) {
            category_expand_group.value = null;            // 如果已经展开，则收起来
        }
        else {
            category_expand_group.value = group;           // 没展开，把这一组的打开
        }
    }

    return {
        computer,
        viewTurner,
        groupTurner,
        category_mode_groups,
        category_expand_group,
    }
}