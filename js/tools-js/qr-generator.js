// 二维码生成器功能实现

let qrcode = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initQrGenerator();
});

function initQrGenerator() {
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const qrText = document.getElementById('qrText');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', generateQrCode);
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadQrCode);
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearQrCode);
    }
    
    if (qrText) {
        qrText.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                generateQrCode();
            }
        });
    }
}

function generateQrCode() {
    const qrText = document.getElementById('qrText');
    const qrSize = document.getElementById('qrSize');
    const qrColor = document.getElementById('qrColor');
    const qrBgColor = document.getElementById('qrBgColor');
    const qrCorrectLevel = document.getElementById('qrCorrectLevel');
    const qrContainer = document.getElementById('qrContainer');
    const qrActions = document.getElementById('qrActions');
    
    if (!qrText || !qrText.value.trim()) {
        alert('请输入要生成二维码的内容');
        return;
    }
    
    const text = qrText.value.trim();
    const size = parseInt(qrSize.value);
    const colorDark = qrColor.value;
    const colorLight = qrBgColor.value;
    
    let correctLevel;
    switch (qrCorrectLevel.value) {
        case 'L':
            correctLevel = QRCode.CorrectLevel.L;
            break;
        case 'M':
            correctLevel = QRCode.CorrectLevel.M;
            break;
        case 'Q':
            correctLevel = QRCode.CorrectLevel.Q;
            break;
        case 'H':
            correctLevel = QRCode.CorrectLevel.H;
            break;
        default:
            correctLevel = QRCode.CorrectLevel.M;
    }
    
    qrContainer.innerHTML = '';
    
    qrcode = new QRCode(qrContainer, {
        text: text,
        width: size,
        height: size,
        colorDark: colorDark,
        colorLight: colorLight,
        correctLevel: correctLevel
    });
    
    if (qrActions) {
        qrActions.style.display = 'flex';
    }
}

function downloadQrCode() {
    const qrContainer = document.getElementById('qrContainer');
    const canvas = qrContainer.querySelector('canvas');
    
    if (!canvas) {
        alert('请先生成二维码');
        return;
    }
    
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function clearQrCode() {
    const qrText = document.getElementById('qrText');
    const qrContainer = document.getElementById('qrContainer');
    const qrActions = document.getElementById('qrActions');
    
    if (qrText) {
        qrText.value = '';
    }
    
    if (qrContainer) {
        qrContainer.innerHTML = '<div class="qr-placeholder">请输入内容并点击生成</div>';
    }
    
    if (qrActions) {
        qrActions.style.display = 'none';
    }
    
    qrcode = null;
}
