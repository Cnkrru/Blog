/*==============================Base64解码工具功能==============================*/

/*==========DOM元素==========*/

// 操作选择按钮
const operationBtns = document.querySelectorAll('.operation-btn');

// 模式选择按钮
const modeBtns = document.querySelectorAll('.mode-btn');

// 输入输出元素
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');

// 文件上传元素
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileUploadSection = document.querySelector('.file-upload-section');

// 控制按钮
const actionButton = document.getElementById('actionButton');
const clearButton = document.getElementById('clearButton');
const copyButton = document.getElementById('copyButton');

// 结果状态
const resultStatus = document.getElementById('resultStatus');

// 媒体预览
let mediaPreview = null;

/*==========全局变量==========*/

let currentOperation = 'decode'; // 当前操作：'decode' 或 'encode'
let currentMode = 'text'; // 当前模式：'text' 或 'media'

/*==========初始化==========*/
function init() {
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化模式状态
    setMode('text');
}

/*==========绑定事件监听器==========*/
function bindEventListeners() {
    // 操作选择按钮事件
    operationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const operation = this.getAttribute('data-operation');
            setOperation(operation);
        });
    });
    
    // 模式选择按钮事件
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode');
            setMode(mode);
        });
    });
    
    // 动作按钮事件
    if (actionButton) {
        actionButton.addEventListener('click', performAction);
    }
    
    // 清空按钮事件
    if (clearButton) {
        clearButton.addEventListener('click', clearAll);
    }
    
    // 复制按钮事件
    if (copyButton) {
        copyButton.addEventListener('click', copyResult);
    }
    
    // 输入文本变化事件
    if (inputText) {
        inputText.addEventListener('input', function() {
            // 当输入变化时，清除状态信息
            clearStatus();
        });
    }
    
    // 文件上传事件
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
}

/*==========设置模式==========*/
function setMode(mode) {
    // 更新当前模式
    currentMode = mode;
    
    // 更新按钮状态
    modeBtns.forEach(btn => {
        if (btn.getAttribute('data-mode') === mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 显示或隐藏文件上传区域
    if (fileUploadSection) {
        if (mode === 'media') {
            fileUploadSection.style.display = 'block';
        } else {
            fileUploadSection.style.display = 'none';
        }
    }
    
    // 清除内容和状态
    clearAll();
}

/*==========处理文件上传==========*/
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // 显示文件信息
    if (fileInfo) {
        fileInfo.textContent = `文件名: ${file.name}, 大小: ${formatFileSize(file.size)}`;
    }
    
    // 读取文件并转换为Base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64String = e.target.result;
        // 提取Base64数据部分（去掉数据URL前缀）
        const base64Data = base64String.split(',')[1];
        if (inputText) {
            inputText.value = base64Data;
        }
        showStatus('文件已转换为Base64', 'success');
    };
    reader.onerror = function() {
        showStatus('文件读取失败', 'error');
    };
    reader.readAsDataURL(file);
}

/*==========格式化文件大小==========*/
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/*==========设置操作模式==========*/
function setOperation(operation) {
    // 更新当前操作
    currentOperation = operation;
    
    // 更新按钮状态
    operationBtns.forEach(btn => {
        if (btn.getAttribute('data-operation') === operation) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 更新按钮文本
    if (actionButton) {
        actionButton.textContent = operation === 'decode' ? '解码' : '编码';
    }
    
    // 更新输入占位符
    if (inputText) {
        inputText.placeholder = operation === 'decode' ? '请输入要解码的Base64字符串...' : '请输入要编码的文本...';
    }
    
    // 更新输出占位符
    if (outputText) {
        outputText.placeholder = operation === 'decode' ? '解码结果将显示在这里...' : '编码结果将显示在这里...';
    }
    
    // 清除内容和状态
    clearAll();
}

/*==========执行操作==========*/
function performAction() {
    if (!inputText || !outputText) return;
    
    const input = inputText.value.trim();
    
    if (!input) {
        showStatus('请输入内容', 'error');
        return;
    }
    
    try {
        if (currentMode === 'text') {
            // 文字模式
            if (currentOperation === 'decode') {
                // Base64解码为文本
                const textResult = base64Decode(input);
                outputText.value = textResult;
                showStatus('解码成功', 'success');
                // 清除媒体预览
                clearMediaPreview();
            } else {
                // Base64编码文本
                const result = base64Encode(input);
                outputText.value = result;
                showStatus('编码成功', 'success');
                // 清除媒体预览
                clearMediaPreview();
            }
        } else {
            // 媒体模式
            if (currentOperation === 'decode') {
                // Base64解码为媒体文件
                try {
                    // 尝试检测文件类型
                    const fileType = detectFileType(input);
                    const mediaUrl = `data:${fileType};base64,${input}`;
                    
                    // 显示媒体预览
                    showMediaPreview(mediaUrl, fileType);
                    outputText.value = mediaUrl;
                    showStatus('媒体文件解码成功', 'success');
                } catch (mediaError) {
                    throw new Error('无法解码媒体文件: ' + mediaError.message);
                }
            } else {
                // Base64编码（媒体模式下编码已通过文件上传完成）
                outputText.value = input;
                showStatus('编码成功', 'success');
                // 清除媒体预览
                clearMediaPreview();
            }
        }
    } catch (error) {
        // 显示错误信息
        showStatus('操作失败: ' + error.message, 'error');
        outputText.value = '';
        // 清除媒体预览
        clearMediaPreview();
    }
}

/*==========检测文件类型==========*/
function detectFileType(base64) {
    // 从Base64数据的前几个字节检测文件类型
    const header = base64.substring(0, 10);
    
    if (header.includes('/9j/')) return 'image/jpeg';
    if (header.includes('iVBORw0KGgo')) return 'image/png';
    if (header.includes('R0lGODlh')) return 'image/gif';
    if (header.includes('SUQz')) return 'video/mp4';
    if (header.includes('AAAAIGZ0eXBpc29t')) return 'video/mp4';
    if (header.includes('UklGR')) return 'audio/wav';
    
    // 默认返回二进制流
    return 'application/octet-stream';
}

/*==========显示媒体预览==========*/
function showMediaPreview(mediaUrl, fileType) {
    // 清除之前的预览
    clearMediaPreview();
    
    // 创建预览容器
    mediaPreview = document.createElement('div');
    mediaPreview.className = 'media-preview';
    
    // 根据文件类型创建相应的元素
    if (fileType.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = mediaUrl;
        img.alt = 'Preview';
        mediaPreview.appendChild(img);
    } else if (fileType.startsWith('video/')) {
        const video = document.createElement('video');
        video.src = mediaUrl;
        video.controls = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '300px';
        mediaPreview.appendChild(video);
    } else if (fileType.startsWith('audio/')) {
        const audio = document.createElement('audio');
        audio.src = mediaUrl;
        audio.controls = true;
        mediaPreview.appendChild(audio);
    } else {
        // 其他类型文件
        const p = document.createElement('p');
        p.textContent = '无法预览此文件类型';
        mediaPreview.appendChild(p);
    }
    
    // 添加到输出区域
    const outputSection = outputText.parentElement;
    outputSection.appendChild(mediaPreview);
}

/*==========清除媒体预览==========*/
function clearMediaPreview() {
    if (mediaPreview && mediaPreview.parentNode) {
        mediaPreview.parentNode.removeChild(mediaPreview);
        mediaPreview = null;
    }
}

/*==========Base64解码==========*/
function base64Decode(encoded) {
    try {
        // 处理URL安全的Base64
        encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
        
        // 填充缺失的字符
        while (encoded.length % 4) {
            encoded += '=';
        }
        
        // 解码
        const decoded = atob(encoded);
        
        // 处理UTF-8字符
        return decodeURIComponent(escape(decoded));
    } catch (error) {
        throw new Error('无效的Base64字符串');
    }
}

/*==========Base64编码==========*/
function base64Encode(text) {
    try {
        // 处理UTF-8字符
        const encoded = unescape(encodeURIComponent(text));
        
        // 编码
        return btoa(encoded);
    } catch (error) {
        throw new Error('编码失败');
    }
}

/*==========清空所有内容==========*/
function clearAll() {
    if (inputText) inputText.value = '';
    if (outputText) outputText.value = '';
    if (fileInput) fileInput.value = '';
    if (fileInfo) fileInfo.textContent = '';
    clearMediaPreview();
    clearStatus();
}

/*==========复制结果==========*/
function copyResult() {
    if (!outputText) return;
    
    const result = outputText.value;
    
    if (!result) {
        showStatus('没有可复制的内容', 'error');
        return;
    }
    
    navigator.clipboard.writeText(result).then(() => {
        // 显示复制成功状态
        if (copyButton) {
            const originalText = copyButton.textContent;
            copyButton.textContent = '已复制';
            copyButton.classList.add('copied');
            
            setTimeout(() => {
                copyButton.textContent = originalText;
                copyButton.classList.remove('copied');
            }, 1500);
        }
        
        showStatus('复制成功', 'success');
    }).catch(err => {
        showStatus('复制失败: ' + err.message, 'error');
    });
}

/*==========显示状态信息==========*/
function showStatus(message, type) {
    if (!resultStatus) return;
    
    resultStatus.textContent = message;
    resultStatus.className = `result-status ${type}`;
    
    // 3秒后自动清除状态
    setTimeout(clearStatus, 3000);
}

/*==========清除状态信息==========*/
function clearStatus() {
    if (resultStatus) {
        resultStatus.textContent = '';
        resultStatus.className = 'result-status';
    }
}

/*==========页面加载完成后初始化==========*/
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}