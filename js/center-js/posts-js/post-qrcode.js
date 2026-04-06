// 文章页面二维码功能实现

// 初始化文章页面二维码
function initPostQrCode() {
    const qrContainer = document.getElementById('post-qrcode-container');
    
    if (!qrContainer) {
        return;
    }
    
    const currentUrl = window.location.href;
    
    qrContainer.innerHTML = '';
    
    new QRCode(qrContainer, {
        text: currentUrl,
        width: 128,
        height: 128,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
    });
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPostQrCode);
} else {
    initPostQrCode();
}
