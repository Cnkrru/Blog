import { ref } from 'vue'

// [AI迁移] 去内层 computer/render 壳：工厂保留（posts 为每页专属实例，避免路由残留），函数平铺在工厂返回里
export const tag = (posts) => {
    const tag_now_item = ref(null);
    const tag_set = ref(new Set());
    const tag_posts_list = ref([]);

    /* =====<数据清洗与统计>===== */
    const computer = () => {posts.forEach(post => {post.tags.forEach(_ => tag_set.value.add(_));})}

    /* =====<UI 交互与渲染派生>===== */
    const render = (tag) => {
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
        render,
        tag_now_item,
        tag_set,
        tag_posts_list,
    }  
}