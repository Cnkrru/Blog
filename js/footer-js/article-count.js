/*==============================文章数量统计功能==============================*/
(function() {
    'use strict';

    /*==========获取页脚文章统计元素==========*/
    function getArticleCountElement() {
        return document.querySelector('.article-count');
    }

    /*==========获取文章数量==========*/
    function getArticleCount() {
        // 动态计算 search.json 的路径
        let searchJsonPath = './config/search.json';
        
        // 获取当前页面的路径
        const currentPath = window.location.pathname;
        
        // 根据路径深度调整相对路径
        if (currentPath.includes('/html/')) {
            if (currentPath.includes('/archives/') || currentPath.includes('/links/') || currentPath.includes('/posts/') || currentPath.includes('/projects/') || currentPath.includes('/tools/')) {
                // 三级目录深度
                searchJsonPath = '../../config/search.json';
            } else {
                // 二级目录深度
                searchJsonPath = '../config/search.json';
            }
        }
        
        return fetch(searchJsonPath)
            .then(response => response.json())
            .then(data => {
                return data.length;
            })
            .catch(error => {
                console.error('Error fetching search.json:', error);
                return 0;
            });
    }

    /*==========更新文章数量统计==========*/
    function updateArticleCount() {
        const articleCountElement = getArticleCountElement();
        if (!articleCountElement) return;

        getArticleCount().then(count => {
            articleCountElement.textContent = `共 ${count} 篇文章`;
        });
    }

    /*==========初始化文章数量统计==========*/
    function initArticleCount() {
        updateArticleCount();
    }

    /*==========页面加载完成后初始化==========*/
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initArticleCount);
    } else {
        initArticleCount();
    }
})();
