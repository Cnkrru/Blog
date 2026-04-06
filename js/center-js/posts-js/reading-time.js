// 预计阅读时间功能实现
// 自动计算并显示文章阅读时间

(function() {
    'use strict';

    // 配置选项
    const config = {
        wordsPerMinute: 300,    // 中文阅读速度（字/分钟）
        codeWordsPerMinute: 100, // 代码阅读速度（字符/分钟）
        minTime: 1,             // 最小阅读时间（分钟）
        containerClass: 'reading-time', // 容器类名
        format: '预计阅读时间: {time}'    // 显示格式
    };

    // 计算阅读时间
    function calculateReadingTime() {
        // 获取文章内容区域
        const articleContent = document.querySelector('.text-style') || 
                              document.querySelector('.center-card-content') ||
                              document.querySelector('article');
        
        if (!articleContent) {
            console.log('Reading time: No article content found');
            return null;
        }

        // 克隆元素以避免修改原内容
        const clone = articleContent.cloneNode(true);
        
        // 移除代码块（代码阅读速度较慢）
        const codeBlocks = clone.querySelectorAll('pre, code');
        let codeText = '';
        codeBlocks.forEach(block => {
            codeText += block.textContent + ' ';
            block.remove();
        });
        
        // 获取纯文本内容
        const text = clone.textContent || clone.innerText || '';
        
        // 统计中文字符数
        const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
        const chineseCount = chineseChars.length;
        
        // 统计英文单词数
        const englishWords = text.match(/[a-zA-Z]+/g) || [];
        const englishCount = englishWords.length;
        
        // 统计代码字符数
        const codeCount = codeText.length;
        
        // 计算阅读时间（分钟）
        const textTime = (chineseCount + englishCount) / config.wordsPerMinute;
        const codeTime = codeCount / config.codeWordsPerMinute;
        const totalTime = textTime + codeTime;
        
        // 确保最小阅读时间
        const readingTime = Math.max(config.minTime, Math.ceil(totalTime));
        
        console.log('Reading time calculated:', {
            chinese: chineseCount,
            english: englishCount,
            code: codeCount,
            minutes: readingTime
        });
        
        return {
            minutes: readingTime,
            chineseCount: chineseCount,
            englishCount: englishCount,
            codeCount: codeCount,
            totalWords: chineseCount + englishCount + codeCount
        };
    }

    // 格式化时间显示
    function formatTime(timeData) {
        if (!timeData) return '';
        
        const minutes = timeData.minutes;
        
        if (minutes < 1) {
            return '小于 1 分钟';
        } else if (minutes === 1) {
            return '1 分钟';
        } else if (minutes < 60) {
            return minutes + ' 分钟';
        } else {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            if (remainingMinutes === 0) {
                return hours + ' 小时';
            } else {
                return hours + ' 小时 ' + remainingMinutes + ' 分钟';
            }
        }
    }

    // 创建阅读时间显示元素
    function createReadingTimeElement(timeData) {
        if (!timeData) return null;
        
        const container = document.createElement('div');
        container.className = config.containerClass;
        container.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 5px 12px;
            background: rgba(255, 105, 180, 0.1);
            border: 1px solid rgba(255, 105, 180, 0.3);
            border-radius: 20px;
            font-size: 13px;
            color: #FF69B4;
            margin: 10px 0;
        `;
        
        // 添加时钟图标
        const icon = document.createElement('span');
        icon.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
        `;
        
        // 添加时间文本
        const text = document.createElement('span');
        text.textContent = config.format.replace('{time}', formatTime(timeData));
        
        container.appendChild(icon);
        container.appendChild(text);
        
        return container;
    }

    // 插入阅读时间到页面
    function insertReadingTime() {
        const timeData = calculateReadingTime();
        if (!timeData) return;
        
        const element = createReadingTimeElement(timeData);
        if (!element) return;
        
        // 查找插入位置（文章标题后面或文章开头）
        const insertTargets = [
            document.querySelector('.center-head-card'),  // 标题区域
            document.querySelector('.text-style'),         // 文章内容开头
            document.querySelector('.center-card-content') // 内容区域
        ];
        
        let inserted = false;
        for (const target of insertTargets) {
            if (target) {
                // 如果是标题区域，插入到后面
                if (target.classList.contains('center-head-card')) {
                    target.parentNode.insertBefore(element, target.nextSibling);
                    inserted = true;
                    break;
                } else {
                    // 否则插入到内容开头
                    target.insertBefore(element, target.firstChild);
                    inserted = true;
                    break;
                }
            }
        }
        
        if (inserted) {
            console.log('Reading time element inserted');
        } else {
            console.log('Reading time: No suitable insertion point found');
        }
    }

    // 初始化
    function init() {
        console.log('Reading time: Initializing...');
        
        // 延迟执行，确保文章内容已加载
        setTimeout(insertReadingTime, 100);
        
        console.log('Reading time: Initialized');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 导出API
    window.readingTime = {
        calculate: calculateReadingTime,
        format: formatTime,
        config: config
    };

})();
