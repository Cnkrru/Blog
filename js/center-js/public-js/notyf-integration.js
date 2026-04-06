// Notyf通知集成

let notyfInstance = null;

// 初始化Notyf
function initNotyf() {
    if (notyfInstance) {
        return notyfInstance;
    }
    
    notyfInstance = new Notyf({
        duration: 3000,
        position: {
            x: 'right',
            y: 'top'
        },
        dismissible: true,
        ripple: true,
        types: [
            {
                type: 'success',
                background: '#4CAF50',
                icon: true
            },
            {
                type: 'error',
                background: '#F44336',
                icon: true
            },
            {
                type: 'warning',
                background: '#FF9800',
                icon: true
            },
            {
                type: 'info',
                background: '#2196F3',
                icon: true
            }
        ]
    });
    
    return notyfInstance;
}

// 成功通知
function showSuccess(message) {
    const notyf = initNotyf();
    notyf.success(message);
}

// 错误通知
function showError(message) {
    const notyf = initNotyf();
    notyf.error(message);
}

// 警告通知
function showWarning(message) {
    const notyf = initNotyf();
    notyf.open({
        type: 'warning',
        message: message
    });
}

// 信息通知
function showInfo(message) {
    const notyf = initNotyf();
    notyf.open({
        type: 'info',
        message: message
    });
}

// 自定义通知
function showCustom(options) {
    const notyf = initNotyf();
    notyf.open(options);
}

// 导出到全局
if (typeof window !== 'undefined') {
    window.showSuccess = showSuccess;
    window.showError = showError;
    window.showWarning = showWarning;
    window.showInfo = showInfo;
    window.showCustom = showCustom;
    window.initNotyf = initNotyf;
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotyf);
} else {
    initNotyf();
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNotyf,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showCustom
    };
}
