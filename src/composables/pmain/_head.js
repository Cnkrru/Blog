// [AI写作] 头部标题状态模块：路由名→标题映射 + 文章页动态标题
// 模块级单例，MainHeader 读、Post 写，保证跨组件共享同一份状态

import { ref } from "vue";

// 静态页面标题映射：route.js 不再配 meta.title，标题统一在本模块定义（MainHeader 按 route.name 读取）
export const page_titles = {
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

// 页面顶部标题栏(代码标题)状态：Post页fetch到文章标题后写入，MainHeader读取展示
export const head_title = ref('');

// [AI写作] 写入文章标题
export const set_head_title = (t) => { head_title.value = t };