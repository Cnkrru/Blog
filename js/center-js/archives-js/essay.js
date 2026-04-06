// essay.js - 用于处理随笔分类的文章列表

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 加载search.json文件
    fetch('../../config/search.json')
        .then(response => response.json())
        .then(data => {
            // 筛选随笔分类的文章
            const essayArticles = data.filter(article => article.category === '随笔');
            // 渲染文章列表
            renderArticleList(essayArticles);
        })
        .catch(error => {
            console.error('加载search.json失败:', error);
            // 加载失败时使用空数组
            renderArticleList([]);
        });

    // 渲染文章列表函数
    function renderArticleList(articles) {
        // 获取文章列表容器
        const articleListContainer = document.querySelector('.center-card-content');
        if (!articleListContainer) {
            console.error('未找到文章列表容器');
            return;
        }

        // 清空容器
        articleListContainer.innerHTML = '';

        // 按id降序排序
        articles.sort((a, b) => {
            return parseInt(b.id) - parseInt(a.id);
        });

        // 遍历文章数据
        articles.forEach(article => {
            // 创建链接容器
            const linkElement = document.createElement('a');
            // 调整路径，因为archives-member页面位于/html/archives/目录下
            if (article.path !== '#') {
                linkElement.href = '../../' + article.path.replace('./', '');
            } else {
                linkElement.href = article.path;
            }

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
    }
});
