// 网站运行数据统计功能
// 统计文章字数、代码行数、图片数量等数据

(function() {
    'use strict';

    // 统计数据对象
    const stats = {
        articles: 0,        // 文章数量
        totalWords: 0,      // 总字数
        totalCodeLines: 0,  // 代码总行数
        totalImages: 0,     // 图片数量
        totalLinks: 0,      // 链接数量
        totalVideos: 0,     // 视频数量
        totalMusic: 0,      // 音乐数量
        toolsCount: 0       // 工具数量
    };

    // 统计文章数据
    function countArticles() {
        // 从search.json获取文章数据
        fetch('../../config/search.json')
            .then(response => response.json())
            .then(data => {
                stats.articles = data.length || 0;
                updateStatsDisplay();
            })
            .catch(error => {
                console.log('Failed to load search.json:', error);
                // 尝试从页面统计
                const articles = document.querySelectorAll('.article-item, .post-item, [data-article]');
                stats.articles = articles.length;
                updateStatsDisplay();
            });
    }

    // 统计当前页面内容
    function countPageContent() {
        // 获取主要内容区域
        const content = document.querySelector('.text-style') || 
                       document.querySelector('.center-card-content') ||
                       document.body;

        if (!content) return;

        // 克隆内容以避免修改原页面
        const clone = content.cloneNode(true);

        // 统计字数（中文+英文）
        const text = clone.textContent || '';
        const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
        const englishWords = text.match(/[a-zA-Z]+/g) || [];
        stats.totalWords = chineseChars.length + englishWords.length;

        // 统计代码行数
        const codeBlocks = clone.querySelectorAll('pre code, .code-block');
        let codeLines = 0;
        codeBlocks.forEach(block => {
            const code = block.textContent || '';
            codeLines += code.split('\n').length;
        });
        stats.totalCodeLines = codeLines;

        // 统计图片数量
        const images = clone.querySelectorAll('img');
        stats.totalImages = images.length;

        // 统计链接数量
        const links = clone.querySelectorAll('a[href]');
        stats.totalLinks = links.length;

        // 统计视频数量
        const videos = document.querySelectorAll('video, [data-video]');
        stats.totalVideos = videos.length;

        // 统计音乐数量（从music.json）
        fetch('../../config/music.json')
            .then(response => response.json())
            .then(data => {
                stats.totalMusic = data.length || 0;
                updateStatsDisplay();
            })
            .catch(() => {
                stats.totalMusic = 0;
            });

        // 统计工具数量
        const tools = document.querySelectorAll('.tool-card, [data-tool]');
        stats.toolsCount = tools.length || 7; // 默认7个工具

        updateStatsDisplay();
    }

    // 创建统计面板
    function createStatsPanel() {
        // 检查是否已存在
        if (document.getElementById('site-stats-panel')) {
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'site-stats-panel';
        panel.className = 'site-stats-panel';
        panel.innerHTML = `
            <div class="stats-header">
                <h3>📊 网站数据</h3>
            </div>
            <div class="stats-grid">
                <div class="stat-item" data-stat="articles">
                    <span class="stat-icon">📝</span>
                    <span class="stat-value">0</span>
                    <span class="stat-label">文章</span>
                </div>
                <div class="stat-item" data-stat="words">
                    <span class="stat-icon">📖</span>
                    <span class="stat-value">0</span>
                    <span class="stat-label">字数</span>
                </div>
                <div class="stat-item" data-stat="code">
                    <span class="stat-icon">💻</span>
                    <span class="stat-value">0</span>
                    <span class="stat-label">代码行</span>
                </div>
                <div class="stat-item" data-stat="images">
                    <span class="stat-icon">🖼️</span>
                    <span class="stat-value">0</span>
                    <span class="stat-label">图片</span>
                </div>
                <div class="stat-item" data-stat="links">
                    <span class="stat-icon">🔗</span>
                    <span class="stat-value">0</span>
                    <span class="stat-label">链接</span>
                </div>
                <div class="stat-item" data-stat="tools">
                    <span class="stat-icon">🛠️</span>
                    <span class="stat-value">0</span>
                    <span class="stat-label">工具</span>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .site-stats-panel {
                background: var(--card-bg, #fff);
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .stats-header h3 {
                margin: 0 0 15px 0;
                font-size: 16px;
                color: var(--text-color, #333);
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
            }
            .stat-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 10px;
                background: var(--bg-color, #f5f5f5);
                border-radius: 8px;
                transition: transform 0.2s;
            }
            .stat-item:hover {
                transform: translateY(-2px);
            }
            .stat-icon {
                font-size: 24px;
                margin-bottom: 5px;
            }
            .stat-value {
                font-size: 20px;
                font-weight: bold;
                color: var(--primary-color, #FF69B4);
            }
            .stat-label {
                font-size: 12px;
                color: var(--text-secondary, #666);
                margin-top: 2px;
            }
            @media (max-width: 768px) {
                .stats-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        `;
        document.head.appendChild(style);

        return panel;
    }

    // 格式化数字
    function formatNumber(num) {
        if (num >= 10000) {
            return (num / 10000).toFixed(1) + 'w';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    // 更新统计显示
    function updateStatsDisplay() {
        const panel = document.getElementById('site-stats-panel');
        if (!panel) return;

        // 更新各统计数据
        const articlesEl = panel.querySelector('[data-stat="articles"] .stat-value');
        const wordsEl = panel.querySelector('[data-stat="words"] .stat-value');
        const codeEl = panel.querySelector('[data-stat="code"] .stat-value');
        const imagesEl = panel.querySelector('[data-stat="images"] .stat-value');
        const linksEl = panel.querySelector('[data-stat="links"] .stat-value');
        const toolsEl = panel.querySelector('[data-stat="tools"] .stat-value');

        if (articlesEl) articlesEl.textContent = formatNumber(stats.articles);
        if (wordsEl) wordsEl.textContent = formatNumber(stats.totalWords);
        if (codeEl) codeEl.textContent = formatNumber(stats.totalCodeLines);
        if (imagesEl) imagesEl.textContent = formatNumber(stats.totalImages);
        if (linksEl) linksEl.textContent = formatNumber(stats.totalLinks);
        if (toolsEl) toolsEl.textContent = formatNumber(stats.toolsCount);

        console.log('Site stats updated:', stats);
    }

    // 插入统计面板到页面
    function insertStatsPanel() {
        const panel = createStatsPanel();
        if (!panel) return;

        // 查找插入位置（关于页面或首页）
        const targets = [
            document.querySelector('.about-content'),
            document.querySelector('.center-card-content'),
            document.querySelector('.left-asider-card'),
            document.querySelector('main')
        ];

        for (const target of targets) {
            if (target) {
                target.appendChild(panel);
                console.log('Site stats panel inserted');
                return true;
            }
        }

        // 如果没找到合适位置，插入到body末尾
        document.body.appendChild(panel);
        return true;
    }

    // 初始化
    function init() {
        console.log('Site stats: Initializing...');

        // 插入统计面板
        insertStatsPanel();

        // 统计数据
        countArticles();
        countPageContent();

        console.log('Site stats: Initialized');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }

    // 导出API
    window.siteStats = {
        stats: stats,
        update: updateStatsDisplay,
        refresh: countPageContent
    };

})();
