/*==============================Giscus 评论系统配置==============================*/
/* 直接渲染到 .comment-container 中 */
/* 支持自定义主题切换 */

/*==========获取当前主题对应的 CSS URL==========*/
function getGiscusThemeUrl() {
    const isDark = document.body.classList.contains('dark-theme');
    /* 使用 GitHub 仓库上的自定义主题 CSS */
    const baseUrl = 'https://github.com/Cnkrru/Blog/tree/main/css';
    return isDark 
        ? `${baseUrl}/comment-dark.css` 
        : `${baseUrl}/comment-light.css`;
}

/*==========初始化评论系统==========*/
function initCommentSystem() {
    const commentContainers = document.querySelectorAll('.comment-container');
    
    commentContainers.forEach(container => {
        const giscusScript = document.createElement('script');
        giscusScript.src = 'https://giscus.app/client.js';
        giscusScript.setAttribute('data-repo', 'Cnkrru/Blog');
        giscusScript.setAttribute('data-repo-id', 'R_kgDORzTTCQ');
        giscusScript.setAttribute('data-category', 'Announcements');
        giscusScript.setAttribute('data-category-id', 'DIC_kwDORzTTCc4C5e-m');
        giscusScript.setAttribute('data-mapping', 'pathname');
        giscusScript.setAttribute('data-strict', '0');
        giscusScript.setAttribute('data-reactions-enabled', '1');
        giscusScript.setAttribute('data-emit-metadata', '0');
        giscusScript.setAttribute('data-input-position', 'bottom');
        /* 使用自定义主题 URL */
        giscusScript.setAttribute('data-theme', getGiscusThemeUrl());
        giscusScript.setAttribute('data-lang', 'zh-CN');
        giscusScript.setAttribute('crossorigin', 'anonymous');
        giscusScript.setAttribute('async', '');
        
        container.appendChild(giscusScript);
    });
}

/*==========更新 Giscus 主题（供外部调用）==========*/
function updateGiscusTheme() {
    const iframe = document.querySelector('iframe.giscus-frame');
    if (iframe) {
        const newThemeUrl = getGiscusThemeUrl();
        /* 向 Giscus iframe 发送主题切换消息 */
        iframe.contentWindow.postMessage({
            giscus: {
                setConfig: {
                    theme: newThemeUrl
                }
            }
        }, 'https://giscus.app');
    }
}

/*==========页面加载完成后初始化评论系统==========*/
document.addEventListener('DOMContentLoaded', initCommentSystem);
