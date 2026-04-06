/*==============================主题切换功能==============================*/
/* 纯CSS变量方式 */

/*==========全局变量声明==========*/
const themeToggleBtn = document.querySelector('.theme-toggle-btn');
const body = document.body;

/*==========初始化主题==========*/
function initTheme() {
    /* 从localStorage获取主题设置，如果没有则默认为亮色主题 */
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    }
}

/*==========切换主题==========*/
function toggleTheme() {
    /* 切换body元素的dark-theme类 */
    body.classList.toggle('dark-theme');
    
    /* 保存主题设置到localStorage */
    const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    
    /* 可选：添加切换动画效果 */
    body.style.transition = 'all 0.3s ease';
    
    /* 同步切换 Giscus 评论系统主题 */
    /* 使用 comment.js 中定义的 updateGiscusTheme 函数 */
    if (typeof updateGiscusTheme === 'function') {
        updateGiscusTheme();
    }
}

/*==========事件监听==========*/
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}

/*==========页面加载时初始化主题==========*/
window.addEventListener('DOMContentLoaded', initTheme);
