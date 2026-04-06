// 代码复制功能实现
// 为所有代码块添加复制按钮和复制功能

// 为单个代码块添加复制按钮
function addCopyButtonToCodeBlock(codeBlock) {
    const preElement = codeBlock.parentElement;
    
    if (!preElement || preElement.querySelector('.code-copy-btn')) {
        return;
    }
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
    copyBtn.title = '复制代码';
    
    preElement.appendChild(copyBtn);
    
    copyBtn.addEventListener('click', function() {
        copyCode(codeBlock, copyBtn);
    });
}

// 初始化代码复制功能
function initCodeCopy() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(addCopyButtonToCodeBlock);
}

// 轮询检查并添加复制按钮（支持动态加载的代码块）
function pollCodeBlocksAndAddButtons() {
    const maxChecks = 100; // 最多检查100次，约20秒
    let checkCount = 0;
    let processedBlocks = new WeakSet(); // 用于跟踪已处理的代码块
    
    const pollInterval = setInterval(function() {
        checkCount++;
        
        const codeBlocks = document.querySelectorAll('pre code');
        let hasNewBlocks = false;
        
        codeBlocks.forEach(codeBlock => {
            if (!processedBlocks.has(codeBlock)) {
                processedBlocks.add(codeBlock);
                addCopyButtonToCodeBlock(codeBlock);
                hasNewBlocks = true;
            }
        });
        
        // 检查是否超时
        if (checkCount >= maxChecks) {
            clearInterval(pollInterval);
            if (!hasNewBlocks) {
                console.warn('No new code blocks found after polling timeout');
            }
        }
    }, 200);
}

// 复制代码到剪贴板
function copyCode(codeBlock, copyBtn) {
    // 获取代码内容
    const code = codeBlock.textContent;
    
    // 优先使用 Clipboard.js (如果已加载)
    if (window.ClipboardJS) {
        // 创建一个临时元素用于 Clipboard.js
        const tempElement = document.createElement('div');
        tempElement.setAttribute('data-clipboard-text', code);
        tempElement.style.display = 'none';
        document.body.appendChild(tempElement);
        
        const clipboard = new ClipboardJS(tempElement);
        
        clipboard.on('success', function(e) {
            showCopySuccess(copyBtn);
            e.clearSelection();
            document.body.removeChild(tempElement);
        });
        
        clipboard.on('error', function(e) {
            console.error('Clipboard.js 复制失败:', e);
            // 降级到原生 Clipboard API
            useNativeClipboard(code, copyBtn);
            document.body.removeChild(tempElement);
        });
        
        // 触发复制
        tempElement.click();
    } else {
        // 使用原生 Clipboard API
        useNativeClipboard(code, copyBtn);
    }
}

// 使用原生 Clipboard API 复制
function useNativeClipboard(text, copyBtn) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showCopySuccess(copyBtn);
            })
            .catch(err => {
                console.error('Clipboard API 复制失败:', err);
                // 降级方案：使用传统方法复制
                fallbackCopyTextToClipboard(text, copyBtn);
            });
    } else {
        // 降级方案：使用传统方法复制
        fallbackCopyTextToClipboard(text, copyBtn);
    }
}

// 降级方案：使用传统方法复制
function fallbackCopyTextToClipboard(text, copyBtn) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // 设置样式以避免影响页面
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess(copyBtn);
        } else {
            console.error('复制命令执行失败');
            showCopyError(copyBtn);
        }
    } catch (err) {
        console.error('复制失败:', err);
        showCopyError(copyBtn);
    }
    
    document.body.removeChild(textArea);
}

// 显示复制成功状态
function showCopySuccess(copyBtn) {
    // 保存原始内容
    const originalContent = copyBtn.innerHTML;
    
    // 显示成功图标
    copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    copyBtn.title = '复制成功！';
    
    // 添加成功类
    copyBtn.classList.add('copy-success');
    
    // 使用Notyf显示成功通知（如果可用）
    if (window.showSuccess) {
        window.showSuccess('代码已复制到剪贴板！');
    }
    
    // 2秒后恢复
    setTimeout(() => {
        copyBtn.innerHTML = originalContent;
        copyBtn.title = '复制代码';
        copyBtn.classList.remove('copy-success');
    }, 2000);
}

// 显示复制失败状态
function showCopyError(copyBtn) {
    // 保存原始内容
    const originalContent = copyBtn.innerHTML;
    
    // 显示错误图标
    copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    copyBtn.title = '复制失败';
    
    // 添加错误类
    copyBtn.classList.add('copy-error');
    
    // 使用Notyf显示错误通知（如果可用）
    if (window.showError) {
        window.showError('复制失败，请手动复制');
    }
    
    // 2秒后恢复
    setTimeout(() => {
        copyBtn.innerHTML = originalContent;
        copyBtn.title = '复制代码';
        copyBtn.classList.remove('copy-error');
    }, 2000);
}

// 添加样式
function addCodeCopyStyles() {
    // 检查是否已经添加了样式
    if (!document.getElementById('code-copy-styles')) {
        const style = document.createElement('style');
        style.id = 'code-copy-styles';
        style.textContent = `
            /* 代码复制按钮样式 */
            pre {
                position: relative;
            }
            
            .code-copy-btn {
                position: absolute;
                top: 8px;
                right: 8px;
                background: rgba(255, 255, 255, 0.8);
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 4px 8px;
                cursor: pointer;
                opacity: 0.7;
                transition: all 0.3s ease;
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .code-copy-btn:hover {
                opacity: 1;
                background: rgba(255, 255, 255, 0.9);
            }
            
            .code-copy-btn.copy-success {
                background: #4CAF50;
                color: white;
                border-color: #4CAF50;
                opacity: 1;
            }
            
            .code-copy-btn.copy-error {
                background: #F44336;
                color: white;
                border-color: #F44336;
                opacity: 1;
            }
            
            /* 深色模式适配 */
            @media (prefers-color-scheme: dark) {
                .code-copy-btn {
                    background: rgba(50, 50, 50, 0.8);
                    border-color: #666;
                    color: #ccc;
                }
                
                .code-copy-btn:hover {
                    background: rgba(60, 60, 60, 0.9);
                }
                
                .code-copy-btn.copy-success {
                    background: #4CAF50;
                    color: white;
                    border-color: #4CAF50;
                }
                
                .code-copy-btn.copy-error {
                    background: #F44336;
                    color: white;
                    border-color: #F44336;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        addCodeCopyStyles();
        initCodeCopy();
        pollCodeBlocksAndAddButtons();
    });
} else {
    addCodeCopyStyles();
    initCodeCopy();
    pollCodeBlocksAndAddButtons();
}

// 导出函数（如果需要）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initCodeCopy,
        copyCode,
        useNativeClipboard,
        fallbackCopyTextToClipboard
    };
}
