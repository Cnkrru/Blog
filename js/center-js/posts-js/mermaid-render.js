// Mermaid流程图渲染功能实现
// 使用Mermaid的自动渲染功能

(function() {
    'use strict';

    // 页面加载完成后初始化
    function init() {
        console.log('Mermaid: Initializing...');
        
        // 查找所有Mermaid代码块并转换为mermaid类
        const blocks = prepareMermaidBlocks();
        console.log('Mermaid: Found', blocks.length, 'blocks');
        
        if (blocks.length === 0) {
            return;
        }
        
        // 加载Mermaid库
        loadMermaidLibrary(function() {
            console.log('Mermaid: Library ready, running...');
            // 使用Mermaid的自动渲染
            window.mermaid.init(undefined, document.querySelectorAll('.mermaid'));
        });
    }
    
    // 准备Mermaid代码块
    function prepareMermaidBlocks() {
        const blocks = [];
        const preElements = document.querySelectorAll('pre');
        
        preElements.forEach(function(pre, index) {
            const code = pre.querySelector('code');
            if (code && code.className) {
                const className = code.className.toString();
                if (className.indexOf('language-mermaid') !== -1 || className.indexOf('mermaid') !== -1) {
                    // 获取原始文本内容
                    let content = code.textContent || code.innerText || '';
                    
                    // 解码HTML实体
                    const textarea = document.createElement('textarea');
                    textarea.innerHTML = content;
                    content = textarea.value;
                    
                    // 创建mermaid容器
                    const container = document.createElement('div');
                    container.className = 'mermaid';
                    container.textContent = content;
                    
                    // 替换pre元素
                    pre.parentNode.replaceChild(container, pre);
                    
                    blocks.push(container);
                }
            }
        });
        
        return blocks;
    }
    
    // 加载Mermaid库
    function loadMermaidLibrary(callback) {
        if (window.mermaid) {
            console.log('Mermaid: Already loaded');
            callback();
            return;
        }
        
        console.log('Mermaid: Loading library...');
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid@8.14.0/dist/mermaid.min.js';
        
        script.onload = function() {
            console.log('Mermaid: Library loaded');
            
            // 初始化配置
            window.mermaid.initialize({
                startOnLoad: false,
                securityLevel: 'loose',
                theme: 'default'
            });
            
            callback();
        };
        
        script.onerror = function(e) {
            console.error('Mermaid: Failed to load', e);
        };
        
        document.head.appendChild(script);
    }
    
    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // 延迟执行，确保DOM完全就绪
        setTimeout(init, 500);
    }
    
})();
