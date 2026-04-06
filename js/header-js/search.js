/*==============================搜索功能==============================*/
/* 根据标题、分类、标签、编号搜索文章 */
/* 根据当前页面位置动态调整路径 */

class SearchSystem {
    constructor() {
        this.searchData = [];
        this.searchInput = document.querySelector('.search-card input');
        this.searchButton = document.querySelector('.search-card button');
        this.searchCard = document.querySelector('.search-card');
        this.pathPrefix = this.getPathPrefix();
        this.init();
    }

    /*==========获取路径前缀（根据当前页面位置）==========*/
    getPathPrefix() {
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(p => p && !p.includes('.'));
        const depth = pathParts.length;
        
        /* 计算向上的路径前缀 */
        let prefix = '';
        for (let i = 0; i < depth; i++) {
            prefix += '../';
        }
        
        return prefix || './';
    }

    /*==========初始化搜索系统==========*/
    async init() {
        await this.loadSearchData();
        this.bindEvents();
        this.createResultsContainer();
    }

    /*==========加载搜索数据==========*/
    async loadSearchData() {
        try {
            const searchJsonPath = `${this.pathPrefix}config/search.json`;
            // 使用原生fetch API加载数据
            const response = await fetch(searchJsonPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.searchData = await response.json();
        } catch (error) {
            console.error('加载搜索数据失败:', error);
            this.searchData = [];
        }
    }

    /*==========绑定事件==========*/
    bindEvents() {
        /* 点击搜索按钮 */
        if (this.searchButton) {
            this.searchButton.addEventListener('click', () => {
                this.performSearch();
            });
        }

        /* 输入框回车 */
        if (this.searchInput) {
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });

            /* 输入时实时搜索（可选） */
            this.searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length >= 2) {
                    this.performSearch(query);
                } else if (query.length === 0) {
                    this.hideResults();
                }
            });

            /* 点击输入框外部隐藏结果 */
            document.addEventListener('click', (e) => {
                if (!this.searchCard.contains(e.target)) {
                    this.hideResults();
                }
            });
        }
    }

    /*==========创建搜索结果容器==========*/
    createResultsContainer() {
        this.resultsContainer = document.createElement('div');
        this.resultsContainer.className = 'search-results';
        this.resultsContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            margin-top: 8px;
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            box-shadow: 0 4px 12px var(--shadow-color);
            max-height: 400px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        `;
        
        if (this.searchCard) {
            this.searchCard.style.position = 'relative';
            this.searchCard.appendChild(this.resultsContainer);
        }
    }

    /*==========执行搜索==========*/
    performSearch(query = null) {
        const searchQuery = query || (this.searchInput ? this.searchInput.value.trim() : '');
        
        if (!searchQuery) {
            this.hideResults();
            return;
        }

        const results = this.search(searchQuery);
        this.displayResults(results, searchQuery);
    }

    /*==========搜索逻辑==========*/
    search(query) {
        const lowerQuery = query.toLowerCase();
        
        return this.searchData.filter(item => {
            /* 搜索标题 */
            if (item.title && item.title.toLowerCase().includes(lowerQuery)) {
                return true;
            }
            
            /* 搜索分类 */
            if (item.category && item.category.toLowerCase().includes(lowerQuery)) {
                return true;
            }
            
            /* 搜索标签 */
            if (item.tags && Array.isArray(item.tags)) {
                const hasMatchingTag = item.tags.some(tag => 
                    tag && tag.toLowerCase().includes(lowerQuery)
                );
                if (hasMatchingTag) {
                    return true;
                }
            }
            
            /* 搜索编号 */
            if (item.id && item.id.toLowerCase().includes(lowerQuery)) {
                return true;
            }
            
            return false;
        });
    }

    /*==========调整文章路径==========*/
    adjustPath(itemPath) {
        if (!itemPath) return '#';
        
        /* 如果是绝对路径，直接返回 */
        if (itemPath.startsWith('http://') || itemPath.startsWith('https://')) {
            return itemPath;
        }
        
        /* 清理路径（去掉开头的 ./） */
        let cleanPath = itemPath;
        if (cleanPath.startsWith('./')) {
            cleanPath = cleanPath.substring(2);
        }
        
        /* 添加路径前缀 */
        return `${this.pathPrefix}${cleanPath}`;
    }

    /*==========显示搜索结果==========*/
    displayResults(results, query) {
        if (!this.resultsContainer) return;

        if (results.length === 0) {
            this.resultsContainer.innerHTML = `
                <div style="padding: 16px; text-align: center; color: var(--text-muted);">
                    未找到包含 "${this.escapeHtml(query)}" 的文章
                </div>
            `;
        } else {
            const resultsHtml = results.map(item => {
                const adjustedPath = this.adjustPath(item.path);
                const tagsHtml = item.tags && item.tags.length > 0 
                    ? item.tags.map(tag => `<span style="background-color: var(--accent-subtle); color: var(--accent-fg); padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-right: 4px;">${this.escapeHtml(tag)}</span>`).join('')
                    : '';
                
                return `
                    <a href="${adjustedPath}" class="search-result-item" style="
                        display: block;
                        padding: 12px 16px;
                        border-bottom: 1px solid var(--border-color);
                        text-decoration: none;
                        color: var(--text-color);
                        transition: background-color 0.2s ease;
                    " onmouseover="this.style.backgroundColor='var(--hover-bg)'" 
                       onmouseout="this.style.backgroundColor='transparent'">
                        <div style="font-weight: bold; margin-bottom: 4px;">
                            ${this.highlightMatch(this.escapeHtml(item.title), query)}
                        </div>
                        <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 4px;">
                            分类: ${this.highlightMatch(this.escapeHtml(item.category), query)} | 
                            编号: ${this.highlightMatch(this.escapeHtml(item.id), query)}
                        </div>
                        <div style="font-size: 12px; margin-top: 4px;">
                            ${tagsHtml}
                        </div>
                    </a>
                `;
            }).join('');

            this.resultsContainer.innerHTML = `
                <div style="padding: 8px 16px; border-bottom: 1px solid var(--border-color); 
                            font-size: 12px; color: var(--text-muted);">
                    找到 ${results.length} 个结果
                </div>
                ${resultsHtml}
            `;
        }

        this.resultsContainer.style.display = 'block';
    }

    /*==========隐藏搜索结果==========*/
    hideResults() {
        if (this.resultsContainer) {
            this.resultsContainer.style.display = 'none';
        }
    }

    /*==========高亮匹配文本==========*/
    highlightMatch(text, query) {
        if (!text) return '';
        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark style="background-color: var(--accent-subtle); color: var(--accent-fg); padding: 0 2px; border-radius: 2px;">$1</mark>');
    }

    /*==========转义 HTML==========*/
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /*==========转义正则表达式特殊字符==========*/
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

/*==========页面加载完成后初始化搜索系统==========*/
document.addEventListener('DOMContentLoaded', () => {
    new SearchSystem();
});
