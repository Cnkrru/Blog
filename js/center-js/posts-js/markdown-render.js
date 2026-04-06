// Markdown渲染功能实现
// 使用marked.js库

// 动态加载marked.js
function loadMarked() {
    console.log('Loading marked.js...');
    
    // 检查marked.js是否已加载
    if (window.marked) {
        console.log('marked.js already loaded');
        initMarked();
        return;
    }
    
    // 加载marked.js主文件（使用3.x版本，API最稳定）
    const markedScript = document.createElement('script');
    markedScript.src = 'https://cdn.jsdelivr.net/npm/marked@3.0.8/marked.min.js';
    markedScript.async = false;
    document.head.appendChild(markedScript);

    // 当marked.js加载完成后初始化
    markedScript.onload = function() {
        console.log('marked.js loaded successfully');
        console.log('window.marked:', typeof window.marked);
        initMarked();
    };
    
    // 处理加载错误
    markedScript.onerror = function() {
        console.error('Failed to load marked.js');
    };
}

// 初始化marked.js
function initMarked() {
    if (!window.marked) {
        console.error('marked.js is not loaded');
        return;
    }
    
    // 配置marked.js
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        highlight: function(code, lang) {
            // 利用已加载的Prism.js进行代码高亮
            if (window.Prism && Prism.highlight) {
                const language = Prism.languages[lang] ? lang : 'plaintext';
                return Prism.highlight(code, Prism.languages[language], language);
            }
            return code;
        }
    });

    // 渲染页面中的Markdown内容
    renderMarkdown();
}

// 渲染Markdown内容
function renderMarkdown() {
    console.log('Starting renderMarkdown...');
    console.log('window.marked:', typeof window.marked);
    
    if (!window.marked) {
        console.error('Cannot render markdown: marked.js is not loaded');
        return;
    }
    
    // 查找所有带有markdown类的元素
    const markdownElements = document.querySelectorAll('.markdown');
    console.log('Found', markdownElements.length, 'markdown elements');
    
    if (markdownElements.length === 0) {
        return;
    }
    
    markdownElements.forEach((element, index) => {
        console.log('Rendering element', index);
        try {
            // 保存原始内容
            const originalContent = element.textContent;
            console.log('Original content length:', originalContent.length);
            
            // 清理内容，确保格式正确
            const cleanedContent = originalContent
                .replace(/\r\n/g, '\n') // 统一换行符
                .replace(/^\s+|\s+$/g, ''); // 去除首尾空白
            
            if (!cleanedContent) {
                console.warn('Empty markdown content');
                return;
            }
            
            console.log('Cleaned content:', cleanedContent.substring(0, 100) + '...');
            
            // 渲染Markdown
            let htmlContent;
            if (typeof window.marked.parse === 'function') {
                htmlContent = window.marked.parse(cleanedContent);
            } else if (typeof window.marked === 'function') {
                htmlContent = window.marked(cleanedContent);
            } else {
                throw new Error('marked is not a function or does not have parse method');
            }
            
            console.log('Rendered HTML length:', htmlContent.length);
            
            // 替换内容
            element.innerHTML = htmlContent;
            
            // 为代码块添加行号和复制功能
            const codeBlocks = element.querySelectorAll('pre code');
            console.log('Found', codeBlocks.length, 'code blocks');
            codeBlocks.forEach(codeBlock => {
                codeBlock.parentElement.classList.add('line-numbers');
            });
            
            console.log('Element', index, 'rendered successfully');
            
        } catch (error) {
            console.error('Error rendering markdown element', index, ':', error);
            console.error('Error stack:', error.stack);
            // 显示错误信息，而不是空白
            element.innerHTML = `<div style="color: red; padding: 10px; border: 1px solid red; border-radius: 4px;">
                <strong>Markdown渲染错误:</strong> ${error.message}
            </div>`;
        }
    });
}

// 检查Prism.js并高亮代码
function checkPrismAndHighlight() {
    const maxChecks = 100; // 最多检查100次，约20秒
    let checkCount = 0;
    
    const checkPrism = setInterval(function() {
        checkCount++;
        
        if (window.Prism) {
            clearInterval(checkPrism);
            try {
                Prism.highlightAll();
            } catch (error) {
                console.error('Error highlighting code:', error);
            }
        } else if (checkCount >= maxChecks) {
            clearInterval(checkPrism);
            console.warn('Prism.js did not load within timeout, skipping code highlighting');
        }
    }, 200);
}

// 页面加载完成后初始化Markdown渲染
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // 直接加载marked.js，不依赖Prism.js
        loadMarked();
        
        // 当Prism.js加载完成后，重新高亮代码
        checkPrismAndHighlight();
    });
} else {
    // 直接加载marked.js，不依赖Prism.js
    loadMarked();
    
    // 当Prism.js加载完成后，重新高亮代码
    checkPrismAndHighlight();
}
