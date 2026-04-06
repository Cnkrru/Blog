// KaTeX数学公式渲染功能实现
// 支持行内公式和块级公式

(function() {
    'use strict';

    // 配置选项
    const config = {
        delimiters: [
            { left: '$$', right: '$$', display: true },   // 块级公式
            { left: '$', right: '$', display: false },   // 行内公式
            { left: '\\[', right: '\\]', display: true }, // LaTeX块级
            { left: '\\(', right: '\\)', display: false } // LaTeX行内
        ],
        throwOnError: false,
        errorColor: '#cc0000',
        macros: {},
        colorIsTextColor: false,
        maxSize: 500,
        maxExpand: 1000
    };

    // 检查KaTeX是否已加载
    function isKaTeXLoaded() {
        return typeof window.katex !== 'undefined';
    }

    // 动态加载KaTeX
    function loadKaTeX() {
        return new Promise((resolve, reject) => {
            if (isKaTeXLoaded()) {
                resolve();
                return;
            }

            // 加载CSS
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
            document.head.appendChild(cssLink);

            // 加载JS
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
            script.async = false;
            
            script.onload = () => {
                console.log('KaTeX loaded successfully');
                resolve();
            };
            
            script.onerror = () => {
                console.error('Failed to load KaTeX');
                reject(new Error('Failed to load KaTeX'));
            };

            document.head.appendChild(script);
        });
    }

    // 查找并渲染数学公式
    function renderMath() {
        if (!isKaTeXLoaded()) {
            console.error('KaTeX is not loaded');
            return;
        }

        // 获取所有包含数学公式的元素
        const mathElements = document.querySelectorAll('.math, [data-math]');
        
        mathElements.forEach(element => {
            const latex = element.textContent.trim();
            const isDisplay = element.classList.contains('math-display') || 
                             element.getAttribute('data-display') === 'true';

            try {
                const html = window.katex.renderToString(latex, {
                    throwOnError: config.throwOnError,
                    errorColor: config.errorColor,
                    displayMode: isDisplay,
                    macros: config.macros,
                    colorIsTextColor: config.colorIsTextColor,
                    maxSize: config.maxSize,
                    maxExpand: config.maxExpand
                });
                element.innerHTML = html;
                element.classList.add('katex-rendered');
            } catch (error) {
                console.error('KaTeX render error:', error);
                element.innerHTML = `<span style="color: ${config.errorColor};">Error: ${error.message}</span>`;
                element.classList.add('katex-error');
            }
        });

        // 自动扫描文本中的公式标记
        autoRenderMath();
    }

    // 自动渲染文本中的数学公式
    function autoRenderMath() {
        if (!isKaTeXLoaded()) return;

        // 查找所有文本节点
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const nodesToProcess = [];
        let node;

        while (node = walker.nextNode()) {
            // 检查是否包含公式标记
            if (containsMath(node.textContent)) {
                nodesToProcess.push(node);
            }
        }

        // 处理找到的节点
        nodesToProcess.forEach(node => {
            const parent = node.parentNode;
            if (parent && !parent.classList.contains('katex-rendered')) {
                renderMathInNode(node);
            }
        });
    }

    // 检查文本是否包含数学公式
    function containsMath(text) {
        return /\$\$?[\s\S]*?\$\$?|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)/.test(text);
    }

    // 在节点中渲染数学公式
    function renderMathInNode(textNode) {
        const text = textNode.textContent;
        const parent = textNode.parentNode;

        if (!parent) return;

        // 创建临时容器
        const container = document.createElement('span');
        let html = text;

        // 替换块级公式
        html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, latex) => {
            try {
                return window.katex.renderToString(latex.trim(), {
                    throwOnError: false,
                    displayMode: true
                });
            } catch (e) {
                return match;
            }
        });

        // 替换行内公式
        html = html.replace(/\$([\s\S]*?)\$/g, (match, latex) => {
            // 避免重复替换
            if (latex.includes('$')) return match;
            
            try {
                return window.katex.renderToString(latex.trim(), {
                    throwOnError: false,
                    displayMode: false
                });
            } catch (e) {
                return match;
            }
        });

        // 如果内容有变化，替换原节点
        if (html !== text) {
            container.innerHTML = html;
            parent.replaceChild(container, textNode);
            container.classList.add('katex-rendered');
        }
    }

    // 初始化KaTeX渲染
    function initKaTeX() {
        loadKaTeX()
            .then(() => {
                renderMath();
                console.log('KaTeX initialized');
            })
            .catch(error => {
                console.error('KaTeX initialization failed:', error);
            });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initKaTeX);
    } else {
        initKaTeX();
    }

    // 导出API
    window.katexRender = {
        render: renderMath,
        config: config,
        isLoaded: isKaTeXLoaded
    };

})();
