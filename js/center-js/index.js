// index.js - 用于处理首页文章列表

// 全局变量
let currentPage = 1;
const pageSize = 10;
let totalArticles = [];

// 渲染文章列表函数
function renderArticleList(articles, page) {
    // 获取文章列表容器
    const articleListContainer = document.querySelector('.center-card-content');
    if (!articleListContainer) {
        console.error('未找到文章列表容器');
        return;
    }

    // 清空容器
    articleListContainer.innerHTML = '';

    // 定义欢迎文章（post-0），始终显示在第一位置
    const welcomeArticle = {
        id: '0',
        title: '欢迎来到我的博客',
        category: '公告',
        tags: ['欢迎'],
        date: '2026-03-29',
        path: './html/posts/post-0.html'
    };

    // 过滤掉欢迎文章（避免重复），然后按id降序排序
    const otherArticles = articles.filter(article => article.id !== '0').sort((a, b) => {
        return parseInt(b.id) - parseInt(a.id);
    });

    // 计算分页
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    let paginatedArticles = [];

    if (page === 1) {
        // 第一页包含欢迎文章
        const remainingSlots = pageSize - 1;
        paginatedArticles = [welcomeArticle, ...otherArticles.slice(0, remainingSlots)];
    } else {
        // 其他页只显示普通文章
        paginatedArticles = otherArticles.slice(startIndex - 1, endIndex - 1);
    }

    // 遍历文章数据
    paginatedArticles.forEach((article, index) => {
        // 如果是第一页且不是第一篇文章（欢迎文章），在前面添加分隔线
        if (page === 1 && index === 1) {
            const separatorHr = document.createElement('hr');
            separatorHr.style.margin = '10px 0';
            articleListContainer.appendChild(separatorHr);
        }

        // 创建链接容器
        const linkElement = document.createElement('a');
        linkElement.href = article.path;

        // 创建文章卡片
        const articleCard = document.createElement('div');
        articleCard.className = 'index-center-list-card';

        // 创建文章头部
        const headerDiv = document.createElement('div');
        headerDiv.className = 'index-center-list-card-header';
        headerDiv.textContent = article.title;

        // 创建分隔线
        const hr = document.createElement('hr');

        // 创建文章内容区域
        const contentDiv = document.createElement('div');
        contentDiv.className = 'index-center-list-card-content';

        // 创建元信息
        const metaInfo = document.createElement('div');
        metaInfo.className = 'article-meta-info';

        // 添加编号
        const idElement = document.createElement('span');
        idElement.textContent = `编号: ${article.id}`;
        metaInfo.appendChild(idElement);

        // 添加分类
        const categoryElement = document.createElement('span');
        categoryElement.textContent = `分类: ${article.category}`;
        metaInfo.appendChild(categoryElement);

        // 添加标签
        if (article.tags && article.tags.length > 0) {
            const tagsElement = document.createElement('span');
            tagsElement.textContent = `标签: ${article.tags.join(', ')}`;
            metaInfo.appendChild(tagsElement);
        }

        // 添加日期
        const dateElement = document.createElement('span');
        dateElement.textContent = `日期: ${article.date}`;
        metaInfo.appendChild(dateElement);

        // 组装内容
        contentDiv.appendChild(metaInfo);

        // 组装卡片
        articleCard.appendChild(headerDiv);
        articleCard.appendChild(hr);
        articleCard.appendChild(contentDiv);

        // 组装链接
        linkElement.appendChild(articleCard);

        // 添加到容器
        articleListContainer.appendChild(linkElement);
    });

    // 渲染分页控件
    renderPagination(articles, page);
}

// 渲染分页控件
function renderPagination(articles, currentPage) {
    // 计算总页数
    const otherArticles = articles.filter(article => article.id !== '0');
    const totalPages = Math.ceil((otherArticles.length + 1) / pageSize);

    // 获取分页容器
    let paginationContainer = document.querySelector('.pagination-container');
    if (!paginationContainer) {
        // 如果不存在，创建分页容器
        paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-container';
        
        // 检查是否已加载分页CSS
        if (!document.getElementById('pagination-css')) {
            const link = document.createElement('link');
            link.id = 'pagination-css';
            link.rel = 'stylesheet';
            link.href = './css/center-css/pagination.css';
            document.head.appendChild(link);
        }
        
        // 添加到页面
        const centerCard = document.querySelector('.center-card');
        if (centerCard) {
            centerCard.appendChild(paginationContainer);
        }
    }

    // 清空分页容器
    paginationContainer.innerHTML = '';

    // 创建分页列表
    const paginationList = document.createElement('ul');
    paginationList.className = 'pagination';

    // 上一页按钮
    const prevLi = document.createElement('li');
    prevLi.className = currentPage === 1 ? 'disabled' : '';
    const prevLink = document.createElement('a');
    prevLink.href = '#';
    prevLink.textContent = '上一页';
    if (currentPage > 1) {
        prevLink.addEventListener('click', function(e) {
            e.preventDefault();
            currentPage--;
            renderArticleList(totalArticles, currentPage);
        });
    }
    prevLi.appendChild(prevLink);
    paginationList.appendChild(prevLi);

    // 页码按钮
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = i === currentPage ? 'active' : '';
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = i;
        link.addEventListener('click', function(e) {
            e.preventDefault();
            currentPage = i;
            renderArticleList(totalArticles, currentPage);
        });
        li.appendChild(link);
        paginationList.appendChild(li);
    }

    // 下一页按钮
    const nextLi = document.createElement('li');
    nextLi.className = currentPage === totalPages ? 'disabled' : '';
    const nextLink = document.createElement('a');
    nextLink.href = '#';
    nextLink.textContent = '下一页';
    if (currentPage < totalPages) {
        nextLink.addEventListener('click', function(e) {
            e.preventDefault();
            currentPage++;
            renderArticleList(totalArticles, currentPage);
        });
    }
    nextLi.appendChild(nextLink);
    paginationList.appendChild(nextLi);

    // 添加到容器
    paginationContainer.appendChild(paginationList);
}

// 加载文章数据并渲染
function loadAndRenderArticles() {
    // 加载search.json文件
    fetch('./config/search.json')
        .then(response => response.json())
        .then(data => {
            // 保存文章数据
            totalArticles = data;
            // 渲染文章列表（第一页）
            renderArticleList(data, currentPage);
        })
        .catch(error => {
            console.error('加载search.json失败:', error);
            // 加载失败时使用空数组
            totalArticles = [];
            renderArticleList([], currentPage);
        });
}

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', loadAndRenderArticles);

// 监听pjax:complete事件，在页面切换后重新执行
document.addEventListener('pjax:complete', function() {
    // 检查当前是否在首页
    if (window.location.href.includes('index.html') || window.location.href === window.location.origin || window.location.href === window.location.origin + '/') {
        currentPage = 1; // 重置到第一页
        loadAndRenderArticles();
    }
});
