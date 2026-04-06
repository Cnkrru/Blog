// 代码高亮功能实现
// 使用Prism.js库

// 动态加载Prism.js和相关CSS
function loadPrism() {
    // 加载Prism.js主文件
    const prismScript = document.createElement('script');
    prismScript.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js';
    prismScript.async = true;
    document.head.appendChild(prismScript);

    // 加载Prism.js核心CSS
    const prismCss = document.createElement('link');
    prismCss.rel = 'stylesheet';
    prismCss.href = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css';
    document.head.appendChild(prismCss);

    // 加载常用语言支持
    const languages = ['javascript', 'typescript', 'css', 'scss', 'less', 'html', 'xml', 'json', 'yaml', 'python', 'java', 'csharp', 'cpp', 'c', 'php', 'ruby', 'go', 'swift', 'kotlin', 'rust', 'r', 'matlab', 'scala', 'dart', 'jsx', 'vue', 'bash', 'sql', 'markdown'];
    languages.forEach(lang => {
        const langScript = document.createElement('script');
        langScript.src = `https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-${lang}.min.js`;
        langScript.async = true;
        document.head.appendChild(langScript);
    });

    // 加载行号插件
    const lineNumbersScript = document.createElement('script');
    lineNumbersScript.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.min.js';
    lineNumbersScript.async = true;
    document.head.appendChild(lineNumbersScript);

    // 加载行号插件CSS
    const lineNumbersCss = document.createElement('link');
    lineNumbersCss.rel = 'stylesheet';
    lineNumbersCss.href = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.min.css';
    document.head.appendChild(lineNumbersCss);

    // 加载复制到剪贴板插件
    const copyToClipboardScript = document.createElement('script');
    copyToClipboardScript.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js';
    copyToClipboardScript.async = true;
    document.head.appendChild(copyToClipboardScript);

    // 加载复制到剪贴板插件CSS
    const copyToClipboardCss = document.createElement('link');
    copyToClipboardCss.rel = 'stylesheet';
    copyToClipboardCss.href = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.css';
    document.head.appendChild(copyToClipboardCss);

    // 当Prism加载完成后初始化
    prismScript.onload = function() {
        // 等待所有语言文件加载完成
        setTimeout(function() {
            Prism.highlightAll();
            // 为代码块添加行号和复制功能
            document.querySelectorAll('pre code').forEach(function(codeBlock) {
                codeBlock.parentElement.classList.add('line-numbers');
            });
        }, 500);
    };
}

// 页面加载完成后初始化代码高亮
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPrism);
} else {
    loadPrism();
}
